# Slack RSS HTML Parser

SlackのRSSアプリ設定画面のHTMLから、RSSフィード情報を抽出してOPML形式でエクスポートするツールです。

## 使用方法

### 1. インストール

```bash
git clone <repository-url>
cd slack-rss-exporter
bun install
```

### 2. Slack RSS設定画面のHTMLを取得

1. Slack Workspace → Apps → RSS → Settings
2. ブラウザの開発者ツール（F12）でElements タブを開く
3. `<div id="feeds">` 要素を右クリック → Copy → Copy outerHTML
4. テキストファイルに貼り付けて保存

### 3. HTMLファイルを処理

```bash
bun run parse your-rss-feeds.html
```

### 4. OPML出力

`output/` ディレクトリにOPMLファイルが生成されます。

## RSSリーダーへのインポート

### Feedly
Feedly → Add Content → Import OPML

### Inoreader  
Settings → Import/Export → Import from OPML file