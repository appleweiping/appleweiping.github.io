---
layout: page
locale: ja
lang: ja
translation_key: highwayvlm
title: HighwayVLM
description: CV ゲート、視覚言語解析、運用ダッシュボードを組み合わせた高速道路カメラ安全システムへの、出典監査済みオープンソース参加。
img: assets/img/repository-covers/highwayvlm.webp
importance: 6
category: research
related_publications: false
permalink: /ja/projects/highwayvlm/
---

## 私の参加形態と貢献範囲

私は[自分の公開フォーク](https://github.com/appleweiping/HighwayVLM)を通じ、[UMN Choi Lab の上流プロジェクト](https://github.com/UMN-Choi-Lab/HighwayVLM)というオープンソースの文脈で HighwayVLM に参加し、技術を検討しています。プロジェクト記録では、[Seongjin Choi 教授](https://choi-seongjin.github.io/)が指導教員、[Ismail Yusuf](https://github.com/90Ismail) が2026年春学期 UROP の学生研究者として記載されています。

帰属は意図的に厳密にしています。**2026年9月8日**の出典監査時点で、私のフォークのデフォルトブランチは上流と同一で、ahead 0、behind 0でした。別の [draft pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3) では、停止車両の検出時に VLM review を起動しつつ YOLO 単独では事故判定しない CV gate と CPU-only test を提案していますが、現在も open、未 review、未 merge です。そのため、このページは上流実装の著者性や採用済みコード貢献を主張しません。

## プロジェクトの機能

HighwayVLM は、交通安全運用のために公開高速道路カメラのスナップショットを監視します。設定済みカメラを一定間隔でポーリングしてフレームを保存し、まずローカルのコンピュータビジョンで追加解析の要否を判定します。必要な場合だけ OpenAI 互換の視覚言語モデルへ送り、構造化された交通観測を生成します。結果はライブダッシュボード、事故、時間別、夜間の各アーカイブ表示に使われます。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/highwayvlm.webp" title="HighwayVLM コリドー監視ダッシュボード" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上流の I-94 コリドー・ダッシュボード実画面。サイト用にローカルで規格化しただけで、合成画像は生成していません。
</div>

## 動作原理とデータフロー

1. カメラ定義は YAML 設定から読み込み、全カメラが単一のシステム・ポーリング間隔を共有します。
2. 各 tick で有効なカメラを並行処理し、最新スナップショットを取得してハッシュで未更新フレームを除外し、採用画像を保存します。
3. CV 優先ゲートとクールダウン／クォータ保護が、視覚言語推論を実行すべきか決定します。
4. VLM クライアントはカメラ文脈、時刻、base64 画像をまとめ、応答を Pydantic 検証済みの厳密なスキーマへ正規化します。
5. SQLite と JSONL が、ポーリング結果、交通状態、事故、信頼度、モデルの生出力を保持します。
6. 静的ダッシュボードが FastAPI の JSON エンドポイントをポーリングし、ライブ概要とアーカイブを描画します。

高コストなモデル呼び出しを決定論的なローカルゲートの後段に置きつつ、エスカレーション有無の双方を監査できる設計です。

## システム構成

現行実装は、プロセス内バックグラウンド worker を備えた単一プロセスの FastAPI アプリケーションです。

- **API と表示：** `highwayvlm/api.py` が JSON／HTML ルートを提供し、保存フレームと静的資産をマウントして worker を起動します。
- **オーケストレーション：** `highwayvlm/pipeline.py` がカメラごとの状態、並行ポーリング、重複排除、CV ゲート、保護策、モデル呼び出し、永続化を担います。
- **取り込み：** `highwayvlm/ingest/fetcher.py` が直接画像、JSON ペイロード、viewer HTML、フォールバック用メタデータ・エンドポイントを解決します。
- **モデル境界：** `highwayvlm/vlm/client.py` がリクエストを構成し、OpenAI 互換 chat-completions を呼び、緩い出力を解析して最終構造を検証します。
- **保存と UI：** `highwayvlm/storage.py` が SQLite のテーブルとログを管理し、静的 HTML、CSS、JavaScript が API を参照します。

API と worker を一つのプロセスに置くことでローカル運用は簡潔になりますが、カメラ取り込みとモデル解析が API の稼働状態に結合します。

## 証拠と上流への帰属

- [私の公開フォーク](https://github.com/appleweiping/HighwayVLM)
- [UMN Choi Lab の上流リポジトリ](https://github.com/UMN-Choi-Lab/HighwayVLM)
- [指導教員：Seongjin Choi 教授](https://choi-seongjin.github.io/)
- [当初の UROP 学生研究者：Ismail Yusuf](https://github.com/90Ismail)
- [私の未マージ draft pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3)
- [指導教員と学生研究者を記録した固定版 README](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/c3a7d30b8a2ed2dab2c4d0bb57aa1aac8e084279/README.md)
- [commit 固定のアーキテクチャ文書](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/ARCHITECTURE.md)
- [このページに使用した固定版ダッシュボード画像](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/screenshots/dashboard-corridor-watch.png)
- [上流の MIT ライセンス](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/LICENSE)
