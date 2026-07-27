---
layout: page
locale: ja
lang: ja
translation_key: weiping-whale
title: WEIPING_WHALE
description: CodeWhale のアイデアに基づく、コンパクトでターミナルネイティブな TypeScript コーディングエージェント。
img: assets/img/projects/weiping-whale-banner.webp
importance: 4
category: ai-systems
related_publications: false
permalink: /ja/projects/weiping-whale/
---

## 目的

WEIPING_WHALE は、side-git チェックポイント、セッションの分岐とバックトラッキング、モデルルーティング、スキル、上限付きサブエージェント、診断、コスト追跡、MCP 連携、任意のローカル HTTP／SSE インターフェースを備えた、ターミナルネイティブのコーディングエージェント CLI です。

## 実装

この TypeScript プロジェクトは、より小さく検証しやすいターミナルワークフローに重点を置いています。ファイル操作と shell ツールは承認ルールの下で動作し、編集内容はパッチとして事前確認でき、各ターンには個別のスナップショットが付与されます。また、実行時診断によってモデルとプロバイダーの状態を確認できます。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-whale-banner.webp" title="WEIPING_WHALE プロジェクトバナー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  WEIPING_WHALE の公開リポジトリに収録されたプロジェクトバナーです。
</div>

## 成り立ちと境界

これは、**[CodeWhale](https://github.com/Hmbown/CodeWhale)（MIT）を基にした派生実装**です。CodeWhale のアイデアを、より小さな規模で TypeScript により独自に再実装しています。上流の Rust 実装ではなく、その作者であるとも主張しません。WEIPING_WHALE は DeepSeek Inc. とも関係ありません。承認ゲートとスナップショットは運用リスクを軽減しますが、OS レベルのサンドボックスでも、生成コードの正しさを保証するものでもありません。

## 成果物と出典

- [WEIPING_WHALE ソースコード](https://github.com/appleweiping/WEIPING_WHALE)
- [上流の着想元：CodeWhale](https://github.com/Hmbown/CodeWhale)
- [掲載バナーの出典](https://github.com/appleweiping/WEIPING_WHALE/blob/master/assets/banner.png)
- WEIPING_WHALE は MIT で公開しています。CodeWhale の MIT 著作権と帰属表示は同プロジェクトに留保されます。
