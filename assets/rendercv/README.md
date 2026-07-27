# RenderCV source

The three CVs share the same verified facts and section order:

- `_data/cv.yml` renders the English CV with `Source Sans 3`.
- `_data/cv_zh_cn.yml` renders the Simplified Chinese CV with the
  `mandarin_chinese` locale and `Noto Sans SC`.
- `_data/cv_ja.yml` renders the Japanese CV with the `japanese` locale and
  `Noto Sans JP`.

`NotoSansSC-VF.ttf` and `NotoSansJP-VF.ttf` are distributed under the SIL Open
Font License 1.1. Their license is stored at `_data/fonts/OFL-Noto.txt`.

Render with the same explicit design and locale inputs used in CI:

```bash
rendercv render _data/cv.yml \
  --settings assets/rendercv/settings.yaml \
  --design assets/rendercv/design.yaml \
  --locale-catalog assets/rendercv/locale.yaml
rendercv render _data/cv_zh_cn.yml \
  --settings assets/rendercv/settings_zh_cn.yaml \
  --design assets/rendercv/design_zh_cn.yaml \
  --locale-catalog assets/rendercv/locale_zh_cn.yaml
rendercv render _data/cv_ja.yml \
  --settings assets/rendercv/settings_ja.yaml \
  --design assets/rendercv/design_ja.yaml \
  --locale-catalog assets/rendercv/locale_ja.yaml
```
