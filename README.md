# JAPAN/MARC パーサ

- JAPAN/MARC フォーマットの Node.js パーサ & クローラ
- [JAPAN/MARC データ（毎週更新）](https://www.ndl.go.jp/jp/data/data_service/jnb_product.html) から書誌情報をダウンロードして何らかの処理を行う

## 使い方

### 1. `src/submit/bulkUpsert.ts` に行いたい処理を追記する

### 2. クロール・パースを行う

```
TARGET_DATE=2023-01-06 yarn ts-node scripts/crawl/crawl.ts
```

上記により以下で 2023 年 1 月 6 日提供分（ZIP: 4.79MB） として公開されている書誌情報のダウンロードとパースがなされ、1 で行われた処理が実行される

https://www.ndl.go.jp/jp/data/data_service/jnb_product.html

## その他

- 対応されているフィールドはごく一部です
