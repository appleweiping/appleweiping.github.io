---
layout: page
locale: ja
lang: ja
translation_key: art-history-museum
title: 美術史博物館
description: 出典を明記した一人称視点の 3D ギャラリーにつながる、ズーム可能な美術史年表。
img: assets/img/projects/art-history-museum-live.webp
importance: 1
category: creative-computing
related_publications: false
permalink: /ja/projects/art-history-museum/
---

## 体験

このブラウザベースの博物館は、美術史を空間的な旅として表現します。セマンティックズーム対応の年表では、時代と芸術家を実際の日付に沿って配置しています。芸術家を選ぶと React Three Fiber による一人称視点のギャラリーが開き、各作品を個別に鑑賞できます。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/art-history-museum-live.webp" title="公開中の美術史年表" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  2026 年 7 月 19 日に検証した、公開中のセマンティックズーム年表の実ブラウザ画面です。生成されたモックアップではありません。
</div>

## データと帰属表示

人物略歴、日付、画像、逸話、関連記録には、英語版 Wikipedia、Wikidata、Wikimedia Commons のデータを初期情報として用いています。インポーターが受け入れるのは、Commons 上にあり、対応する自由ライセンスまたはパブリックドメインで提供されている資料だけです。公開中の詳細画面では、各作品のライセンス、作者の帰属表示、Commons の出典ページを保持しています。ギャラリーの壁と床のテクスチャ、および HDRI は、CC0 の [Poly Haven](https://polyhaven.com/) から取得しています。

## 境界

自由ライセンスを必須の掲載条件としているため、関連作品が現在も著作権で保護されている芸術家については、意図的に展示室を設けていません。外部デプロイとそのデータベースは独立したサービスです。このポートフォリオのスクリーンショットは、アプリケーション内で作品ごとに示される帰属表示とライセンスの追跡情報に代わるものではありません。

## 成果物と出典

- [公開中の博物館](https://art-history-museum-nine.vercel.app)
- [ソースコード](https://github.com/appleweiping/art-history-museum)
- [Wikipedia 投稿者向け著作権情報](https://en.wikipedia.org/wiki/Wikipedia:Copyrights)
- [Wikimedia Commons 再利用ガイド](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- スクリーンショットは公開中のデプロイから取得しました。作品の権利は、各作品に記録されたライセンスに従います。
