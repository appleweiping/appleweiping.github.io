#!/usr/bin/env python3
"""Validate the committed repository-cover set and its provenance manifest."""

from __future__ import annotations

import hashlib
import json
import re
import sys
import urllib.parse
from collections import Counter
from pathlib import Path

from PIL import Image, UnidentifiedImageError


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "_data" / "repository_catalog.json"
MANIFEST_PATH = ROOT / "_data" / "repository_covers.json"
COVER_DIR = ROOT / "assets" / "img" / "repository-covers"
EXPECTED_SIZE = (960, 540)
ALLOWED_SOURCE_TYPES = {"demo-screenshot", "repository-asset", "github-repository-preview"}
SHA256_PATTERN = re.compile(r"^[0-9a-f]{64}$")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    repositories = catalog["repositories"]
    covers = manifest.get("covers", {})
    errors: list[str] = []

    expected_slugs = {repository["slug"] for repository in repositories}
    actual_slugs = set(covers)
    if expected_slugs != actual_slugs:
        for slug in sorted(expected_slugs - actual_slugs):
            errors.append(f"manifest is missing {slug}")
        for slug in sorted(actual_slugs - expected_slugs):
            errors.append(f"manifest contains unknown slug {slug}")

    if manifest.get("repository_count") != len(repositories):
        errors.append("repository_count does not match the catalog")
    if manifest.get("project_count") != catalog.get("project_count"):
        errors.append("project_count does not match the catalog")
    if manifest.get("cover_count") != len(repositories):
        errors.append("cover_count does not match the catalog")

    expected_files = {f"{slug}.webp" for slug in expected_slugs}
    actual_files = {path.name for path in COVER_DIR.glob("*.webp")}
    for filename in sorted(expected_files - actual_files):
        errors.append(f"cover file is missing: {filename}")
    for filename in sorted(actual_files - expected_files):
        errors.append(f"unexpected cover file: {filename}")

    source_types: Counter[str] = Counter()
    for slug, cover in covers.items():
        label = f"cover {slug}"
        expected_path = f"/assets/img/repository-covers/{slug}.webp"
        if cover.get("path") != expected_path:
            errors.append(f"{label}: path must be {expected_path}")
        if (cover.get("width"), cover.get("height")) != EXPECTED_SIZE:
            errors.append(f"{label}: manifest dimensions must be 960x540")

        source_type = cover.get("source_type")
        source_types[source_type] += 1
        if source_type not in ALLOWED_SOURCE_TYPES:
            errors.append(f"{label}: unsupported source_type {source_type!r}")

        source_url = cover.get("source_url")
        parsed = urllib.parse.urlparse(source_url or "")
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            errors.append(f"{label}: source_url must be a credential-free HTTPS URL")
        if source_type == "repository-asset" and parsed.hostname != "raw.githubusercontent.com":
            errors.append(f"{label}: repository assets must use commit-pinned raw.githubusercontent.com URLs")
        if source_type == "github-repository-preview" and parsed.hostname != "opengraph.githubassets.com":
            errors.append(f"{label}: GitHub previews must use opengraph.githubassets.com")
        if source_type == "repository-asset":
            if not isinstance(cover.get("source_commit"), str) or len(cover["source_commit"]) != 40:
                errors.append(f"{label}: repository asset is missing a 40-character source_commit")
            if not isinstance(cover.get("source_blob"), str) or len(cover["source_blob"]) != 40:
                errors.append(f"{label}: repository asset is missing a 40-character source_blob")
        elif cover.get("source_commit") or cover.get("source_blob"):
            errors.append(f"{label}: {source_type} must not claim a repository-asset commit or blob")
        if source_type == "demo-screenshot":
            if not cover.get("captured_at"):
                errors.append(f"{label}: demo screenshot is missing captured_at")
            if not cover.get("viewport"):
                errors.append(f"{label}: demo screenshot is missing viewport")

        source_sha256 = cover.get("source_sha256")
        output_sha256 = cover.get("output_sha256")
        if not isinstance(source_sha256, str) or not SHA256_PATTERN.fullmatch(source_sha256):
            errors.append(f"{label}: source_sha256 must be a lowercase SHA-256 digest")
        if not isinstance(output_sha256, str) or not SHA256_PATTERN.fullmatch(output_sha256):
            errors.append(f"{label}: output_sha256 must be a lowercase SHA-256 digest")
        if source_type == "github-repository-preview" and source_sha256 == output_sha256:
            errors.append(f"{label}: GitHub preview input hash unexpectedly matches the normalized output")

        if not cover.get("license_note") or not cover.get("license_risk"):
            errors.append(f"{label}: provenance boundary is incomplete")

        image_path = ROOT / expected_path.removeprefix("/")
        if not image_path.is_file():
            continue
        digest = sha256_file(image_path)
        if digest != output_sha256:
            errors.append(f"{label}: output SHA-256 does not match")
        try:
            with Image.open(image_path) as image:
                image.load()
                if image.format != "WEBP":
                    errors.append(f"{label}: expected WebP, found {image.format}")
                if image.size != EXPECTED_SIZE:
                    errors.append(f"{label}: file dimensions are {image.size}, expected {EXPECTED_SIZE}")
                if getattr(image, "is_animated", False):
                    errors.append(f"{label}: animated covers are not allowed")
        except (UnidentifiedImageError, OSError, SyntaxError) as error:
            errors.append(f"{label}: unreadable image ({error})")

    if errors:
        print(f"Repository cover validation failed with {len(errors)} error(s):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    distribution = ", ".join(f"{name}={count}" for name, count in sorted(source_types.items()))
    print(f"Repository covers are valid: {len(covers)} local 960x540 WebPs ({distribution}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
