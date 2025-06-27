# slack-rss-exporter

SlackワークスペースのすべてのチャンネルからRSSフィード情報をスキャンし、エクスポートするツールです。

## 機能

- Slackワークスペース内の全チャンネル（パブリック・プライベート）をスキャン
- 各チャンネルに設定されているRSSフィードのURLを検出
- JSON形式またはCSV形式でエクスポート

## 必要条件

- [Bun](https://bun.sh/) ランタイム
- Slack Bot Token (適切な権限を持つもの)

## セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/akihisa1210/slack-rss-exporter.git
cd slack-rss-exporter
```

2. 依存関係をインストール
```bash
bun install
```

3. 環境変数を設定
```bash
cp .env.example .env
```

`.env`ファイルを編集し、Slack Bot Tokenを設定します：
```
SLACK_BOT_TOKEN=xoxb-your-token-here
```

## Slack Bot Tokenの取得

1. [Slack API](https://api.slack.com/apps)にアクセス
2. 新しいアプリを作成するか、既存のアプリを使用
3. OAuth & Permissions セクションで以下のスコープを追加：
   - `channels:history` - パブリックチャンネルのメッセージ履歴を読む
   - `channels:read` - パブリックチャンネルの基本情報を表示
   - `groups:history` - プライベートチャンネルのメッセージ履歴を読む
   - `groups:read` - プライベートチャンネルの基本情報を表示
4. ワークスペースにアプリをインストール
5. Bot User OAuth Tokenをコピー

## Botをチャンネルに招待

**重要**: BotはRSS情報を取得したい各チャンネルに招待されている必要があります。

### 方法1: 個別に招待
1. Slackで各チャンネルに移動
2. `/invite @<bot-name>` コマンドを実行
3. または、チャンネル設定から「メンバーを追加」でBotを追加

### 方法2: 全チャンネルに一括招待（管理者のみ）
1. Slackワークスペースの管理者設定からBotを全チャンネルに追加
2. または、Slack APIで `conversations.invite` を使用してプログラマティックに招待

## 使い方

```bash
bun run start
```

実行すると、Botが参加しているすべてのチャンネルをスキャンし、RSS情報を`output`ディレクトリにエクスポートします。

**注意**: Botがチャンネルに参加していない場合、そのチャンネルはRSSスキャンがスキップされます。

## 設定

`.env`ファイルで以下の設定が可能です：

- `SLACK_BOT_TOKEN`: Slack Bot Token（必須）
- `OUTPUT_DIR`: 出力ディレクトリ（デフォルト: `./output`）
- `EXPORT_FORMAT`: エクスポート形式（`json`、`csv`、または `opml`、デフォルト: `json`）

### レートリミット対策設定（オプション）

- `SLACK_REQUEST_DELAY`: リクエスト間の初期遅延時間（ミリ秒、デフォルト: 1000）
- `SLACK_MAX_REQUEST_DELAY`: レートリミット時の最大遅延時間（ミリ秒、デフォルト: 60000）
- `SLACK_RATE_LIMIT_RETRIES`: レートリミット時のリトライ回数（デフォルト: 3）

レートリミットエラーが頻発する場合は、`SLACK_REQUEST_DELAY`を増やしてください（例: 2000-3000）。

## 出力形式

### JSON形式（拡張メタデータ付き）
```json
{
  "metadata": {
    "exportedAt": "2024-01-01T12:00:00.000Z",
    "exportVersion": "1.0.0",
    "totalChannels": 1,
    "totalFeeds": 1,
    "exportFormat": "json"
  },
  "channels": [
    {
      "channelId": "C1234567890",
      "channelName": "general",
      "rssFeeds": [
        {
          "url": "https://example.com/feed.rss"
        }
      ]
    }
  ]
}
```

### CSV形式
```csv
Channel ID,Channel Name,RSS URL
C1234567890,general,https://example.com/feed.rss
```

### OPML形式（RSSリーダーへの直接インポート対応）
```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
  <title>Slack RSS Export</title>
  <dateCreated>2024-01-01T12:00:00.000Z</dateCreated>
</head>
<body>
  <outline text="general" title="Slack Channel: general">
    <outline type="rss" text="https://example.com/feed.rss" xmlUrl="https://example.com/feed.rss" />
  </outline>
</body>
</opml>
```

## 開発

### ビルド
```bash
bun run build
```

### 型チェック
```bash
bun run typecheck
```

### フォーマット
```bash
bun run format
```

## ライセンス

MIT License