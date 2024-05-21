## 概要

RUM, X-Ray を利用して React の SPA アプリから APIGateway, Lambda の通信を X-Ray でトレースする実装です。

## デプロイ方法

- 諸事情により、以下の手順でデプロイする必要があります。
  - frontend ビルド
  - iac デプロイ
  - frontend にて環境変数の設定 `.env`
  - frontend ビルド
  - iac デプロイ

※ iac はフロントエンドの静的ビルドファイルを必要としており、frontend 側は iac デプロイで作られる CloudWatch RUM リソースや APIGateway を必要としているため。
