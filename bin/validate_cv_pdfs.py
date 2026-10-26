#!/usr/bin/env python3
"""Validate the three localized two-page CV PDFs and rasterize every page."""

from __future__ import annotations

import argparse
import hashlib
import shutil
import struct
import subprocess
import tempfile
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF_DIRECTORY = ROOT / "assets" / "pdf"
CANONICAL_PDFS = {
    "en": PDF_DIRECTORY / "Weiping_Yan_CV_en.pdf",
    "zh-CN": PDF_DIRECTORY / "Weiping_Yan_CV_zh-CN.pdf",
    "ja": PDF_DIRECTORY / "Weiping_Yan_CV_ja.pdf",
}
COMPATIBILITY_PDF = PDF_DIRECTORY / "Weiping_Yan_CV.pdf"

EXPECTED_TEXT = {
    "en": [
        "Weiping Yan",
        "Electrical Engineering and Computer Science",
        "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
        "Submitted to DAI 2026, under review",
        "20 pull requests merged into 12 projects maintained by others",
        "Power Grid Model",
        "LensKit",
        "PISA",
        "OpenRAM",
        "synthetic data",
        "TU/e Honors Academy",
        "TU Delft Honours Programme Bachelor (HPB)",
    ],
    "zh-CN": [
        "闫维平",
        "电气工程与计算机科学",
        "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
        "已投稿 DAI 2026，评审中",
        "向 12 个由他人维护的开源项目合并了 20 个 pull request",
        "Power Grid Model",
        "LensKit",
        "PISA",
        "OpenRAM",
        "合成数据",
        "TU/e Honors Academy",
        "TU Delft 荣誉学士项目（HPB）",
    ],
    "ja": [
        "Weiping Yan",
        "電気工学・コンピュータサイエンス",
        "OAM-GA: Reliability-Guided Motion Completion for Occlusion-RobustGaussian Avatars",
        "DAI 2026 に投稿、査読中",
        "他の方が保守する 12 のプロジェクトに 20 件の pull request がマージ",
        "Power Grid Model",
        "LensKit",
        "PISA",
        "OpenRAM",
        "合成データ",
        "TU/e Honors Academy",
        "TU Delft Honours Programme Bachelor（HPB）",
    ],
}
FORBIDDEN_TEXT = {
    "en": ["No specific major", "completed degree is claimed"],
    "zh-CN": ["不宣称尚未确定的具体专业", "不注明尚未确认的具体专业"],
    "ja": ["未確定の専攻", "特定の専攻が確定したとは記載せず"],
}
EXPECTED_FONT = {
    "en": "TeXGyreTermes",
    "zh-CN": "NotoSansSC",
    "ja": "NotoSansJP",
}
# English uses US Letter (the Jake's Resume default); Chinese and Japanese use A4.
EXPECTED_PAGE_SIZE = {
    "en": (612.0, 792.0),
    "zh-CN": (595.28, 841.89),
    "ja": (595.28, 841.89),
}
EXPECTED_PAGES = 2
COMMON_URIS = {
    "mailto:yan00944@umn.edu",
    "mailto:vipinapple986@gmail.com",
    "https://github.com/appleweiping",
    "https://www.linkedin.com/in/weiping-yan-b62567383",
    "https://scholar.google.com/citations?user=gK6JtzsAAAAJ",
    "https://doi.org/10.54254/2753-8818/8/20240361",
    "https://www.kaggle.com/certification/competitions/weipingyan/santa-2025",
    "https://openreview.net/forum?id=UV2UJ4VHf7",
    "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:artificial_intelligence",
    "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:natural_language_processing",
    "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:microelectronics",
    "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors=label:electronic_design_automation",
    "https://educationguide.tue.nl/programs/honors-academy",
    "https://www.tudelft.nl/en/student/eemcs-student-portal/education/honours-programme",
}
EXPECTED_WEBSITE = {
    "en": "https://appleweiping.github.io/",
    "zh-CN": "https://appleweiping.github.io/zh/",
    "ja": "https://appleweiping.github.io/ja/",
}


class ValidationError(RuntimeError):
    """Raised when a CV artifact violates the publication contract."""


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def indirect_object(value):
    return value.get_object() if hasattr(value, "get_object") else value


def font_records(reader: PdfReader) -> list[tuple[str, bool, bool]]:
    records: dict[str, tuple[str, bool, bool]] = {}
    for page in reader.pages:
        resources = indirect_object(page.get("/Resources") or {})
        fonts = indirect_object(resources.get("/Font") or {})
        for font_reference in fonts.values():
            font = indirect_object(font_reference)
            base_font = str(font.get("/BaseFont") or "(unnamed)")
            has_unicode_map = "/ToUnicode" in font
            descendants = font.get("/DescendantFonts") or [font]
            embedded = False
            for descendant_reference in descendants:
                descendant = indirect_object(descendant_reference)
                descriptor = indirect_object(descendant.get("/FontDescriptor") or {})
                if any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3")):
                    embedded = True
            records[base_font] = (base_font, embedded, has_unicode_map)
    return sorted(records.values())


def uri_annotations(reader: PdfReader) -> set[str]:
    uris: set[str] = set()
    for page in reader.pages:
        for annotation_reference in page.get("/Annots") or []:
            annotation = indirect_object(annotation_reference)
            action = indirect_object(annotation.get("/A") or {})
            uri = action.get("/URI")
            if uri:
                uris.add(str(uri))
    return uris


def png_dimensions(path: Path) -> tuple[int, int]:
    header = path.read_bytes()[:24]
    if len(header) != 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValidationError(f"{path} is not a valid PNG screenshot")
    return struct.unpack(">II", header[16:24])


def rasterize(locale: str, path: Path, directory: Path) -> int:
    executable = shutil.which("pdftoppm")
    if not executable:
        raise ValidationError("pdftoppm is required to rasterize and verify every CV page")

    prefix = directory / locale
    process = subprocess.run(
        [executable, "-png", "-r", "110", str(path), str(prefix)],
        check=False,
        capture_output=True,
        text=True,
    )
    if process.returncode != 0:
        raise ValidationError(f"pdftoppm failed for {path.name}: {process.stderr.strip()}")

    screenshots = sorted(directory.glob(f"{locale}-*.png"))
    if len(screenshots) != EXPECTED_PAGES:
        raise ValidationError(f"{path.name} should rasterize to {EXPECTED_PAGES} page(s), found {len(screenshots)}")
    for screenshot in screenshots:
        width, height = png_dimensions(screenshot)
        if width < 800 or height < 1000:
            raise ValidationError(f"{screenshot.name} is unexpectedly small: {width}x{height}")
    return len(screenshots)


def validate_pdf(locale: str, path: Path) -> tuple[int, int, list[str]]:
    if not path.is_file() or path.stat().st_size == 0:
        raise ValidationError(f"missing or empty PDF: {path}")
    if path.read_bytes()[:5] != b"%PDF-":
        raise ValidationError(f"{path.name} does not have a PDF signature")

    reader = PdfReader(str(path))
    if reader.is_encrypted:
        raise ValidationError(f"{path.name} must not be encrypted")
    if len(reader.pages) != EXPECTED_PAGES:
        raise ValidationError(f"{path.name} should contain {EXPECTED_PAGES} page(s), found {len(reader.pages)}")

    first_page = reader.pages[0]
    width = float(first_page.mediabox.width)
    height = float(first_page.mediabox.height)
    expected_width, expected_height = EXPECTED_PAGE_SIZE[locale]
    if abs(width - expected_width) > 1.0 or abs(height - expected_height) > 1.0:
        raise ValidationError(f"{path.name} has page size {width:.2f}x{height:.2f} pt, expected {expected_width}x{expected_height}")

    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    if len(text.strip()) < 1_500:
        raise ValidationError(f"{path.name} has too little selectable text: {len(text.strip())} characters")
    compact_text = "".join(text.split())
    for phrase in EXPECTED_TEXT[locale]:
        if "".join(phrase.split()) not in compact_text:
            raise ValidationError(f"{path.name} is missing selectable text {phrase!r}")
    for phrase in FORBIDDEN_TEXT[locale]:
        if "".join(phrase.split()) in compact_text:
            raise ValidationError(f"{path.name} contains unwanted defensive wording {phrase!r}")

    fonts = font_records(reader)
    if not fonts or not any(EXPECTED_FONT[locale] in name for name, _embedded, _unicode in fonts):
        raise ValidationError(f"{path.name} does not use the expected {EXPECTED_FONT[locale]} font")
    invalid_fonts = [name for name, embedded, unicode_map in fonts if not embedded or not unicode_map]
    if invalid_fonts:
        raise ValidationError(f"{path.name} has fonts without embedding or Unicode maps: {invalid_fonts}")

    uris = uri_annotations(reader)
    expected_uris = COMMON_URIS | {EXPECTED_WEBSITE[locale]}
    missing_uris = expected_uris - uris
    if missing_uris:
        raise ValidationError(f"{path.name} is missing URI annotations: {sorted(missing_uris)}")

    return len(text.strip()), len(uris), [name for name, _embedded, _unicode in fonts]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--skip-render",
        action="store_true",
        help="Skip the pdftoppm rasterization step (for environments without Poppler).",
    )
    arguments = parser.parse_args()

    results = {}
    for locale, path in CANONICAL_PDFS.items():
        results[locale] = validate_pdf(locale, path)

    if not COMPATIBILITY_PDF.is_file():
        raise ValidationError(f"missing English compatibility PDF: {COMPATIBILITY_PDF}")
    if sha256(COMPATIBILITY_PDF) != sha256(CANONICAL_PDFS["en"]):
        raise ValidationError("Weiping_Yan_CV.pdf is not an exact copy of Weiping_Yan_CV_en.pdf")

    screenshot_count = 0
    if not arguments.skip_render:
        with tempfile.TemporaryDirectory(prefix="weiping-cv-pages-") as temporary_directory:
            temporary = Path(temporary_directory)
            for locale, path in CANONICAL_PDFS.items():
                screenshot_count += rasterize(locale, path, temporary)

    details = ", ".join(
        f"{locale}: {text_length} text chars, {uri_count} unique URI links"
        for locale, (text_length, uri_count, _fonts) in results.items()
    )
    render_detail = "render skipped" if arguments.skip_render else f"{screenshot_count} page screenshots verified"
    print(f"CV PDFs are valid ({details}; {render_detail}).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValidationError as error:
        raise SystemExit(f"CV PDF validation failed: {error}")
