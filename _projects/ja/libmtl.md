---
layout: page
locale: ja
lang: ja
translation_key: libmtl
title: LibMTL — review 中の上流貢献
description: LibMTL の CLI help 修正について、完全 fork の境界、上流の帰属、機能・構成、未マージの状態を明示します。
img: assets/img/repository-covers/libmtl.webp
importance: 8
category: research
related_publications: false
permalink: /ja/projects/libmtl/
---

## 貢献の状態と範囲

私の [LibMTL 公開 fork](https://github.com/appleweiping/LibMTL)の default branch は、[Median Research Group の upstream repository](https://github.com/median-research-group/LibMTL)と完全に同一です。私の変更は別 branch の [commit `7261aaa`](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05)に分離し、[upstream pull request #97](https://github.com/median-research-group/LibMTL/pull/97)として提出しました。

この patch は `LibMTL/config.py` にあった空白だけの `argparse` help placeholder を短い説明に置き換え、空白 help を拒否しながら `-h` が正常に表示されることを確認する回帰 test を追加します。2026-09-08 の監査時点で PR #97 は open、非 draft、review なし、未 merge でした。そのため、採用済みの上流成果ではなく、提出済みで review 中の貢献として記載します。

## 上流の帰属と指導関係の境界

[commit 固定の upstream README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md)は Baijiong Lin を LibMTL の developer・maintainer として示し、上流の著者・貢献者を記録しています。変更は `imanfs` が報告した [issue #90](https://github.com/median-research-group/LibMTL/issues/90)に対応しますが、監査時に PR #97 への maintainer review や comment はありませんでした。ここでは上流著者、採用済み貢献、maintainer の指導、学術的な指導関係のいずれも主張しません。

## LibMTL の機能

LibMTL はマルチタスク学習向けの PyTorch library です。共有／task-specific representation、loss・gradient weighting、data pipeline、metric、実験設定を共通 interface で組み合わせ、複数手法を同じ条件で学習・比較できます。例は vision、language、office domain、分子データの benchmark を扱います。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/libmtl.webp" title="LibMTL Overall Framework" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  監査済み upstream commit に固定した repository-native の Overall Framework 図で、合成画像は使用していません。
</div>

## 原理と構成

マルチタスク学習は、共有 model で関連する目的を同時に最適化しながら task 間の競合を制御します。LibMTL は、共有・task-specific representation を決める **architecture** と、task loss・gradient を組み合わせる **weighting strategy** を分離します。`Trainer` は data loading、forward／backward、optimizer、scheduler、validation、metric、checkpoint を統括します。task-specific encoder、decoder、loss、metric はこの orchestration layer に接続され、config と CLI が構成の組み合わせを再現可能に選択します。

## 証拠と帰属

- [私の公開 fork](https://github.com/appleweiping/LibMTL)
- [Median Research Group upstream repository](https://github.com/median-research-group/LibMTL)
- [review 中の upstream pull request #97](https://github.com/median-research-group/LibMTL/pull/97)
- [Issue #90](https://github.com/median-research-group/LibMTL/issues/90)
- [私の提出 branch commit](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05)
- [commit 固定の upstream README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md)
- [commit 固定の Overall Framework 画像](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/docs/docs/images/framework.png)
- [commit 固定の MIT license](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/LICENSE)
