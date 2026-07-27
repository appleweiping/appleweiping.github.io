---
layout: page
locale: ja
lang: ja
translation_key: venus-basestation
title: Venus ベースステーション
description: 複数ロボット探査システム向けに授業課題として開発した、ベースステーションソフトウェアとライブ可視化。
img: assets/img/projects/venus-basestation-dashboard.svg
importance: 1
category: coursework
related_publications: false
permalink: /ja/projects/venus-basestation/
---

## チームプロジェクトの背景

Venus Basestation は、複数ロボットによる惑星探査システムの**授業課題およびチームプロジェクトの記録**です。このページでは、公開されているベースステーションとユーザーインターフェースのモジュールに焦点を当てています。ロボットシステム全体や、ミラーされたチームのコードベースを単独で制作したと主張するものではありません。

## ベースステーションモジュール

このソフトウェアは MQTT テレメトリを検証し、Tk イベントループ向けにネットワークイベントをキューへ登録し、ライブマップ状態を維持します。また、模擬入力、JSONL リプレイ、ライブブローカー接続、コマンドアップリンク、SVG／PNG エクスポートに対応します。リポジトリには、自動テスト、ヘッドレスのスモークテストコマンド、再生可能なミッション例が含まれています。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/venus-basestation-dashboard.svg" title="Venus Basestation ミッションダッシュボード" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  リポジトリ付属の 3 台ロボットによるリプレイから生成したミッションコントロールのスナップショットです。地形、ロボット状態、検出結果、イベントログを表示しています。
</div>

## 帰属と境界

公開 GitHub リポジトリはポートフォリオ用ミラーであり、授業課題での共同作業についてはチームの GitLab が正式な記録です。モジュールと貢献者の帰属表示は、リポジトリ文書と `team-project/PROVENANCE.md` に従う必要があります。`user-interface-module/` 内のオリジナルコードは MIT ライセンスですが、ミラーされたチームスナップショットには元のチームライセンスが引き続き適用されます。ダッシュボードが確認するのはコマンドの送信であり、実際のロボット状態は返信テレメトリによって確認されます。

## 成果物と出典

- [公開ポートフォリオミラー](https://github.com/appleweiping/venus-basestation)
- [責任範囲](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/verification-and-responsibility-boundary.md)
- [チームスナップショットの出典](https://github.com/appleweiping/venus-basestation/blob/main/team-project/PROVENANCE.md)
- [掲載ダッシュボードの出典](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/assets/mission-dashboard.svg)
