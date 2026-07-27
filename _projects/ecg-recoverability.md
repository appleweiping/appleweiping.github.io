---
layout: page
locale: en
lang: en
translation_key: ecg-recoverability
title: ECG Recoverability
description: Feature-level recoverability and uncertainty calibration for reduced-lead ECG reconstruction.
img: assets/img/projects/ecg-recoverability-neural-perception.png
importance: 3
category: research
related_publications: false
permalink: /projects/ecg-recoverability/
---

## Research question

Reduced-lead ECG reconstruction is an ill-posed inverse problem. A low average waveform error does not by itself identify which P, QRS, ST, or T features remain trustworthy on a particular lead. This project studies feature-level recoverability rather than treating reconstruction quality as a single scalar.

## Approach

The research code combines an ECG dipole model, a conditioning measure for lead configurations, and distribution-free calibration. It separates model-supported components from statistically estimated and unrecoverable components, then evaluates those distinctions using public PTB-XL data, synthetic checks, and a conditional-diffusion illustration.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/ecg-recoverability-neural-perception.png" title="Repository experiment on perceptual reconstruction and recoverability" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Repository-reported experiment comparing perceptual reconstruction behavior with a held-out recoverability analysis.
</div>

## Evidence and boundaries

The repository includes theorem-linked tests and experiments on a public research dataset. It is a research artifact and preprint in preparation, **not a clinically validated device, diagnostic system, treatment recommendation, or published medical result**. Dipolarity varies by feature and pathology; calibration is tied to the stated data and grouping assumptions. Nothing on this page is medical advice.

## Artifacts and provenance

- [Source code](https://github.com/appleweiping/ecg-recoverability)
- [Repository manuscript](https://github.com/appleweiping/ecg-recoverability/blob/main/paper/main.pdf) — research manuscript; no publication claim
- [Displayed figure source](https://github.com/appleweiping/ecg-recoverability/blob/main/results/neural_perception_distortion.png)
- [PTB-XL dataset record](https://physionet.org/content/ptb-xl/)
- Project code and generated figures use the repository's MIT license; PTB-XL remains under its own data license and citation requirements.
