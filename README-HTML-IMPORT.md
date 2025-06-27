# Slack RSS HTML Parser

SlackのRSSアプリ設定画面のHTMLから、RSSフィード情報を抽出してOPML形式でエクスポートするツールです。

## 使用方法

### 1. Slack RSS設定画面のHTMLを取得

1. ブラウザでSlackにログインし、RSSアプリの設定画面に移動
   - Slack Workspace → Apps → RSS → Settings
   
2. ブラウザの開発者ツールを開く（F12キー）

3. 以下のいずれかの方法でHTMLを取得：

#### 方法A: ページソースから取得
1. ページを右クリック → 「ページのソースを表示」
2. `<div id="feeds">` セクションを見つける
3. そのセクション全体をコピーしてファイルに保存

#### 方法B: 開発者ツールから取得
1. Elements タブを開く
2. `<div id="feeds">` 要素を見つける
3. 右クリック → Copy → Copy outerHTML
4. テキストファイルに貼り付けて保存

### 2. HTMLファイルを処理

```bash
# HTMLファイルを指定して実行
bun run parse your-rss-feeds.html

# または
npm run parse your-rss-feeds.html
```

### 3. 出力結果

`output/` ディレクトリにOPMLファイルが生成されます。このファイルを他のRSSリーダーに直接インポートできます。

## 抽出される情報

各RSSフィードについて以下の情報が抽出されます：

- **Feed URL**: RSSフィードのURL
- **Feed Title**: フィードのタイトル
- **Channel Name**: Slackチャンネル名

## 出力例

### OPML形式
```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
  <title>Slack RSS Export</title>
</head>
<body>
  <outline text="rss-tech" title="Slack Channel: rss-tech">
    <outline type="rss" text="https://martinfowler.com/feed.atom" title="https://martinfowler.com/feed.atom" xmlUrl="https://martinfowler.com/feed.atom" />
  </outline>
</body>
</opml>
```

## 利点

- **高速**: APIレート制限なし、瞬時に処理完了
- **完全**: すべてのRSSフィードが確実に取得される
- **簡単**: HTMLをコピー&ペーストするだけ
- **移行対応**: OPML形式で他のRSSリーダーに直接インポート可能

## RSSリーダーへのインポート

### Feedly
1. Feedly → Add Content → Import OPML
2. 生成されたOPMLファイルをアップロード

### Inoreader
1. Settings → Import/Export → Import from OPML file
2. 生成されたOPMLファイルをアップロード

### その他のRSSリーダー
ほとんどのRSSリーダーがOPMLインポートに対応しています。

## トラブルシューティング

### Q: RSSフィードが見つからない
A: HTMLの取得範囲を確認してください。`<div id="feeds">` 全体が含まれている必要があります。

### Q: チャンネル名が正しく抽出されない
A: HTMLの構造が変わっている可能性があります。Issue報告をお願いします。

### Q: 文字化けが発生する
A: HTMLファイルの文字エンコーディングをUTF-8で保存してください。