#!/usr/bin/env python3
"""Build local, source-audited repository covers and their manifest.

The input audit is produced by the repository-media review. The builder always
prefers an explicitly supplied local cover, then a browser-captured demo, and
finally a commit-pinned repository asset. Every published cover is normalized
to a local 16:9 WebP and receives a content hash in the generated manifest.
"""

from __future__ import annotations

import argparse
import hashlib
import http.client
import io
import json
import mimetypes
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont, ImageOps, UnidentifiedImageError


OUTPUT_SIZE = (960, 540)
LOCAL_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".gif")
ALLOWED_REMOTE_HOSTS = {"raw.githubusercontent.com", "opengraph.githubassets.com"}
PUBLISHED_SOURCE_TYPES = {"demo-screenshot", "repository-asset", "github-repository-preview"}
MAX_DOWNLOAD_BYTES = 30 * 1024 * 1024
MAX_IMAGE_PIXELS = 50_000_000
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--audit",
        default=Path("assets/img/repository-covers/SOURCE_AUDIT.json"),
        type=Path,
    )
    parser.add_argument("--catalog", default=Path("_data/repository_catalog.json"), type=Path)
    parser.add_argument("--local-dir", default=Path("assets/img/repository-cover-inputs"), type=Path)
    parser.add_argument("--demo-dir", default=Path("D:/Temp/repository-demo-covers"), type=Path)
    parser.add_argument("--readme-dir", default=Path("D:/Temp/repository-readme-covers"), type=Path)
    parser.add_argument(
        "--og-sources",
        default=Path("assets/img/repository-covers/GITHUB_OG_SOURCES.json"),
        type=Path,
    )
    parser.add_argument(
        "--curation-overrides",
        default=Path("assets/img/repository-covers/CURATION_OVERRIDES.json"),
        type=Path,
    )
    parser.add_argument("--output-dir", default=Path("assets/img/repository-covers"), type=Path)
    parser.add_argument("--manifest", default=Path("_data/repository_covers.json"), type=Path)
    parser.add_argument("--contact-dir", type=Path)
    parser.add_argument("--allow-missing", action="store_true")
    refresh_group = parser.add_mutually_exclusive_group()
    refresh_group.add_argument(
        "--refresh",
        action="store_true",
        help="Refetch and renormalize every source instead of reusing verified outputs",
    )
    refresh_group.add_argument(
        "--refresh-previews",
        action="store_true",
        help="Refetch GitHub repository previews while reusing verified demo and commit-pinned repository assets",
    )
    return parser.parse_args()


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def find_local_input(directory: Path, slug: str) -> Path | None:
    for extension in LOCAL_EXTENSIONS:
        candidate = directory / f"{slug}{extension}"
        if candidate.is_file():
            return candidate
    return None


def read_sidecar(image_path: Path) -> dict[str, Any]:
    sidecar = image_path.with_suffix(".json")
    if not sidecar.is_file():
        return {}
    return json.loads(sidecar.read_text(encoding="utf-8"))


def read_capture_manifest(directory: Path) -> dict[str, Any]:
    manifest = directory / "manifest.json"
    if not manifest.is_file():
        return {}
    payload = json.loads(manifest.read_text(encoding="utf-8"))
    if isinstance(payload, dict) and isinstance(payload.get("captures"), dict):
        return payload["captures"]
    if isinstance(payload, dict) and isinstance(payload.get("captures"), list):
        return {
            capture["slug"]: capture
            for capture in payload["captures"]
            if isinstance(capture, dict) and capture.get("slug")
        }
    return payload if isinstance(payload, dict) else {}


def git_blob_sha(data: bytes) -> str:
    prefix = f"blob {len(data)}\0".encode()
    return hashlib.sha1(prefix + data).hexdigest()  # noqa: S324 - Git object identity, not security.


def download(url: str, expected_blob: str | None) -> tuple[bytes, str | None]:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_REMOTE_HOSTS:
        raise ValueError(f"remote source is not an allowlisted HTTPS URL: {url}")

    if parsed.hostname == "opengraph.githubassets.com":
        curl = shutil.which("curl")
        if not curl:
            raise ValueError("curl is required to fetch GitHub repository previews")
        result: subprocess.CompletedProcess[bytes] | None = None
        for attempt in range(5):
            time.sleep(0.5 if attempt == 0 else 2**attempt)
            result = subprocess.run(
                [
                    curl,
                    "--fail",
                    "--location",
                    "--silent",
                    "--show-error",
                    "--connect-timeout",
                    "15",
                    "--max-time",
                    "45",
                    url,
                ],
                check=False,
                capture_output=True,
            )
            if result.returncode == 0:
                break
        assert result is not None
        if result.returncode != 0:
            raise ValueError(f"GitHub repository preview download failed after 5 attempts: {result.stderr.decode(errors='replace').strip()}")
        if len(result.stdout) > MAX_DOWNLOAD_BYTES:
            raise ValueError(f"remote source exceeds {MAX_DOWNLOAD_BYTES} bytes")
        return result.stdout, "image/png"

    for attempt in range(5):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "appleweiping-portfolio-cover-builder/1.0"},
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                content_type = response.headers.get_content_type()
                if not content_type.startswith("image/") and content_type != "application/octet-stream":
                    raise ValueError(f"remote source returned an unexpected content type: {content_type}")
                declared_length = response.headers.get("Content-Length")
                if declared_length and int(declared_length) > MAX_DOWNLOAD_BYTES:
                    raise ValueError(f"remote source exceeds {MAX_DOWNLOAD_BYTES} bytes")
                payload = response.read(MAX_DOWNLOAD_BYTES + 1)
            if len(payload) > MAX_DOWNLOAD_BYTES:
                raise ValueError(f"remote source exceeds {MAX_DOWNLOAD_BYTES} bytes")
            if expected_blob and git_blob_sha(payload).lower() != expected_blob.lower():
                if attempt == 4:
                    raise ValueError("remote source does not match the audited Git blob SHA")
                time.sleep(2 ** (attempt + 1))
                continue
            return payload, content_type
        except urllib.error.HTTPError as error:
            if error.code not in {429, 500, 502, 503, 504} or attempt == 4:
                raise
            retry_after = error.headers.get("Retry-After")
            time.sleep(float(retry_after) if retry_after else 2 ** (attempt + 1))
        except (http.client.HTTPException, urllib.error.URLError, TimeoutError, ConnectionResetError):
            if attempt == 4:
                raise
            time.sleep(2 ** (attempt + 1))

    raise RuntimeError("unreachable remote download retry state")


def edge_background(image: Image.Image) -> tuple[int, int, int, int]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    points = [
        (0, 0),
        (max(width - 1, 0), 0),
        (0, max(height - 1, 0)),
        (max(width - 1, 0), max(height - 1, 0)),
        (width // 2, 0),
        (width // 2, max(height - 1, 0)),
    ]
    opaque = [rgba.getpixel(point) for point in points if rgba.getpixel(point)[3] > 64]
    if not opaque:
        return (20, 23, 27, 255)
    channels = list(zip(*opaque))
    return tuple(int(sum(channel) / len(channel)) for channel in channels[:3]) + (255,)


def normalize_image(source: bytes) -> bytes:
    try:
        with Image.open(io.BytesIO(source)) as opened:
            opened.seek(0)
            if opened.width * opened.height > MAX_IMAGE_PIXELS:
                raise ValueError(f"image exceeds the {MAX_IMAGE_PIXELS}-pixel safety limit")
            image = ImageOps.exif_transpose(opened).convert("RGBA")
    except (UnidentifiedImageError, OSError, SyntaxError) as error:
        raise ValueError(f"unsupported or corrupt raster image: {error}") from error

    canvas = Image.new("RGBA", OUTPUT_SIZE, edge_background(image))
    contained = ImageOps.contain(image, OUTPUT_SIZE, Image.Resampling.LANCZOS)
    offset = ((OUTPUT_SIZE[0] - contained.width) // 2, (OUTPUT_SIZE[1] - contained.height) // 2)
    canvas.alpha_composite(contained, offset)

    output = io.BytesIO()
    canvas.convert("RGB").save(output, format="WEBP", quality=88, method=6)
    return output.getvalue()


def build_contact_sheets(covers: list[dict[str, Any]], output_dir: Path, contact_dir: Path) -> None:
    contact_dir.mkdir(parents=True, exist_ok=True)
    columns, rows = 4, 4
    thumb_size = (240, 135)
    label_height = 26
    sheet_size = (columns * thumb_size[0], rows * (thumb_size[1] + label_height))
    font = ImageFont.load_default()

    for page_index in range(0, len(covers), columns * rows):
        page = covers[page_index : page_index + columns * rows]
        sheet = Image.new("RGB", sheet_size, (18, 20, 23))
        draw = ImageDraw.Draw(sheet)
        for index, cover in enumerate(page):
            row, column = divmod(index, columns)
            x = column * thumb_size[0]
            y = row * (thumb_size[1] + label_height)
            with Image.open(output_dir / Path(cover["path"]).name) as image:
                sheet.paste(image.convert("RGB").resize(thumb_size, Image.Resampling.LANCZOS), (x, y))
            label = f"{page_index + index + 1:03d} {cover['slug']}"[:38]
            draw.text((x + 6, y + thumb_size[1] + 6), label, fill=(235, 235, 235), font=font)
        sheet.save(contact_dir / f"repository-covers-{page_index // (columns * rows) + 1:02d}.jpg", quality=90)


def main() -> int:
    args = parse_args()
    audit = json.loads(args.audit.read_text(encoding="utf-8"))
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    audited_by_slug = {item["slug"]: item for item in audit["items"]}
    repositories = catalog["repositories"]
    project_count = sum(1 for repository in repositories if repository.get("portfolio_project"))
    demo_captures = read_capture_manifest(args.demo_dir)
    readme_captures = read_capture_manifest(args.readme_dir)
    og_payload = json.loads(args.og_sources.read_text(encoding="utf-8"))
    og_by_slug = og_payload.get("repositories", og_payload)
    curation_overrides = json.loads(args.curation_overrides.read_text(encoding="utf-8"))
    force_github_preview = curation_overrides.get("force_github_preview", {})
    previous_covers: dict[str, Any] = {}
    if not args.refresh and args.manifest.is_file():
        previous_payload = json.loads(args.manifest.read_text(encoding="utf-8"))
        previous_covers = previous_payload.get("covers", {})

    args.output_dir.mkdir(parents=True, exist_ok=True)
    covers: list[dict[str, Any]] = []
    missing: list[str] = []

    for repository in repositories:
        slug = repository["slug"]
        audited = audited_by_slug.get(slug, {})
        output_path = args.output_dir / f"{slug}.webp"
        previous_cover = previous_covers.get(slug)

        if args.refresh_previews:
            if not output_path.is_file() or not isinstance(previous_cover, dict):
                raise ValueError(f"{slug}: --refresh-previews requires a complete existing cover set and manifest")
            previous_output_sha = previous_cover.get("output_sha256")
            if not previous_output_sha or sha256_bytes(output_path.read_bytes()) != previous_output_sha:
                raise ValueError(f"{slug}: existing cover does not match the manifest; run a full rebuild first")

            refreshed_cover = dict(previous_cover)
            if previous_cover.get("source_type") == "github-repository-preview":
                og_source = og_by_slug.get(slug, {})
                og_url = og_source.get("open_graph_image_url") if isinstance(og_source, dict) else og_source
                if not og_url:
                    raise ValueError(f"{slug}: no current GitHub repository preview is available")
                print(f"Refreshing GitHub preview: {slug}", flush=True)
                source_bytes, _source_mime = download(og_url, None)
                normalized = normalize_image(source_bytes)
                output_path.write_bytes(normalized)
                refreshed_cover.update(
                    {
                        "source_url": og_url,
                        "source_path": repository.get("source_url"),
                        "source_sha256": sha256_bytes(source_bytes),
                        "output_sha256": sha256_bytes(normalized),
                    }
                )

            if refreshed_cover.get("source_type") != "repository-asset":
                refreshed_cover.pop("source_commit", None)
                refreshed_cover.pop("source_blob", None)
            covers.append({"slug": slug, **refreshed_cover})
            continue

        if output_path.is_file() and isinstance(previous_cover, dict):
            expected_sha = previous_cover.get("output_sha256")
            previous_source_type = previous_cover.get("source_type")
            curation_still_satisfied = slug not in force_github_preview or previous_source_type == "github-repository-preview"
            if expected_sha and curation_still_satisfied and sha256_bytes(output_path.read_bytes()) == expected_sha:
                covers.append({"slug": slug, **previous_cover})
                continue

        local_input = find_local_input(args.local_dir, slug)
        demo_input = find_local_input(args.demo_dir, slug)
        source_bytes: bytes | None = None
        source_type: str | None = None
        source_url: str | None = None
        source_path: str | None = None
        source_mime: str | None = None
        source_commit: str | None = None
        source_blob: str | None = None
        provenance: dict[str, Any] = {}

        if slug in force_github_preview:
            og_source = og_by_slug.get(slug, {})
            og_url = og_source.get("open_graph_image_url") if isinstance(og_source, dict) else og_source
            if not og_url:
                missing.append(f"{slug}: curation override requires a GitHub repository preview")
                continue
            source_bytes, source_mime = download(og_url, None)
            source_type = "github-repository-preview"
            source_url = og_url
            source_path = repository.get("source_url")
            provenance = {
                "license_risk": "low",
                "license_note": force_github_preview[slug],
            }
        elif local_input:
            source_bytes = local_input.read_bytes()
            provenance = read_sidecar(local_input)
            source_type = provenance.get("source_type", "generated")
            source_url = provenance.get("source_url")
            source_path = local_input.as_posix()
            source_mime = mimetypes.guess_type(local_input.name)[0]
            source_commit = provenance.get("source_commit")
            source_blob = provenance.get("source_blob")
        elif demo_input:
            source_bytes = demo_input.read_bytes()
            provenance = read_sidecar(demo_input) or demo_captures.get(slug, {})
            source_type = provenance.get("source_type", "demo-screenshot")
            source_url = provenance.get("source_url", provenance.get("finalURL", repository.get("demo_url")))
            source_path = provenance.get("file", demo_input.name)
            source_mime = mimetypes.guess_type(demo_input.name)[0]
            source_commit = provenance.get("source_commit")
            source_blob = provenance.get("source_blob")
        elif audited.get("candidate_url") and Path(audited.get("candidate_path", "")).suffix.lower() != ".svg":
            source_bytes, source_mime = download(audited["candidate_url"], audited.get("blob_sha"))
            source_type = "repository-asset"
            source_url = audited["candidate_url"]
            source_path = audited.get("candidate_path")
            source_commit = audited.get("commit_sha")
            source_blob = audited.get("blob_sha")
        elif (readme_input := find_local_input(args.readme_dir, slug)):
            source_bytes = readme_input.read_bytes()
            provenance = read_sidecar(readme_input) or readme_captures.get(slug, {})
            source_type = provenance.get("source_type", "repository-page-screenshot")
            source_url = provenance.get("source_url", provenance.get("finalURL", repository.get("source_url")))
            source_path = provenance.get("file", readme_input.name)
            source_mime = mimetypes.guess_type(readme_input.name)[0]
            source_commit = provenance.get("source_commit")
            source_blob = provenance.get("source_blob")
        else:
            og_source = og_by_slug.get(slug, {})
            og_url = og_source.get("open_graph_image_url") if isinstance(og_source, dict) else og_source
            if not og_url:
                missing.append(f"{slug}: no audited asset, capture, or GitHub repository preview")
                continue
            source_bytes, source_mime = download(og_url, None)
            source_type = "github-repository-preview"
            source_url = og_url
            source_path = repository.get("source_url")
            provenance = {
                "license_risk": "low",
                "license_note": "GitHub-generated social preview for this public repository, downloaded and locally pinned; no synthetic project artwork.",
            }

        assert source_type is not None and source_bytes is not None
        if source_type not in PUBLISHED_SOURCE_TYPES:
            raise ValueError(f"{slug}: unsupported published source_type {source_type!r}")
        try:
            normalized = normalize_image(source_bytes)
        except ValueError:
            og_source = og_by_slug.get(slug, {})
            og_url = og_source.get("open_graph_image_url") if isinstance(og_source, dict) else og_source
            if not og_url:
                raise
            source_bytes, source_mime = download(og_url, None)
            normalized = normalize_image(source_bytes)
            source_type = "github-repository-preview"
            source_url = og_url
            source_path = repository.get("source_url")
            source_commit = None
            source_blob = None
            provenance = {
                "license_risk": "low",
                "license_note": "GitHub-generated social preview used after the audited image source failed raster validation; no synthetic project artwork.",
            }
        output_path.write_bytes(normalized)

        cover = {
            "slug": slug,
            "path": f"/assets/img/repository-covers/{slug}.webp",
            "source_type": source_type,
            "source_url": source_url,
            "source_path": source_path,
            "source_commit": source_commit,
            "source_blob": source_blob,
            "source_sha256": sha256_bytes(source_bytes),
            "output_sha256": sha256_bytes(normalized),
            "width": OUTPUT_SIZE[0],
            "height": OUTPUT_SIZE[1],
            "license_risk": provenance.get("license_risk", audited.get("license_risk", "low-medium")),
            "license_note": provenance.get(
                "license_note",
                audited.get(
                    "license_reason",
                    "Screenshot of the repository's public GitHub page; repository attribution remains visible in the linked catalog entry.",
                ),
            ),
            "prompt": provenance.get("prompt"),
            "captured_at": provenance.get("captured_at"),
            "viewport": provenance.get("viewport"),
            "device_pixel_ratio": provenance.get("device_pixel_ratio", provenance.get("DPR")),
        }
        covers.append({key: value for key, value in cover.items() if value is not None})

    manifest = {
        "schema_version": 1,
        "owner": catalog["owner"],
        "repository_count": len(repositories),
        "project_count": project_count,
        "cover_count": len(covers),
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "covers": {cover["slug"]: {key: value for key, value in cover.items() if key != "slug"} for cover in covers},
    }
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if args.contact_dir:
        build_contact_sheets(covers, args.output_dir, args.contact_dir)

    print(f"Built {len(covers)} of {len(repositories)} repository covers ({project_count} portfolio projects).")
    if missing:
        print("Missing covers:", file=sys.stderr)
        for item in missing:
            print(f"- {item}", file=sys.stderr)
        return 0 if args.allow_missing else 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
