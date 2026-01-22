# Redmine Wiki MCP Server

Redmine WikiのAPIを使用したModel Context Protocol (MCP) サーバーです。Claude DesktopやClaude Code等のMCPクライアントからRedmine Wiki情報にアクセスできます。

## MCPとは

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) は、LLM（大規模言語モデル）と外部データソース・ツールを接続するためのオープンプロトコルです。MCPを使用することで、AIアシスタントが外部システムの情報を取得し、より的確な回答を提供できるようになります。

## 機能

このMCPサーバーは以下のツールを提供します：

| ツール名 | 説明 |
|---------|------|
| `search_wiki` | キーワードでWikiページを検索 |
| `list_wiki_pages` | プロジェクト内のWikiページ一覧を取得 |
| `get_wiki_page` | 特定のWikiページの全文を取得 |
| `search_and_get_page` | キーワードで検索し、関連ページの全文を取得（最大5件） |

## 動作要件

- Node.js 18.0.0 以上
- Redmine APIキー
- プロジェクトへのアクセス権限

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`ファイルを`.env`にコピーして、必要な情報を設定します：

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```
REDMINE_URL=https://your-redmine-domain.com
API_KEY=your_redmine_api_key
PROJECT_ID=your_project_id
```

### 3. ビルド

```bash
npm run build
```

## Claude Desktop での使用方法

Claude Desktopの設定ファイルにMCPサーバーを追加します。

### 設定ファイルの場所

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### 設定例

```json
{
  "mcpServers": {
    "redmine-wiki": {
      "command": "node",
      "args": ["/path/to/redmine-mcp/dist/index.js"],
      "env": {
        "REDMINE_URL": "https://your-redmine-domain.com",
        "API_KEY": "your_redmine_api_key",
        "PROJECT_ID": "your_project_id"
      }
    }
  }
}
```

または、`.env`ファイルを使用する場合：

```json
{
  "mcpServers": {
    "redmine-wiki": {
      "command": "node",
      "args": ["/path/to/redmine-mcp/dist/index.js"]
    }
  }
}
```

設定後、Claude Desktopを再起動してください。

## Claude Code での使用方法

Claude Codeの設定ファイル（`~/.claude/settings.json`）にMCPサーバーを追加します：

```json
{
  "mcpServers": {
    "redmine-wiki": {
      "command": "node",
      "args": ["/path/to/redmine-mcp/dist/index.js"],
      "env": {
        "REDMINE_URL": "https://your-redmine-domain.com",
        "API_KEY": "your_redmine_api_key",
        "PROJECT_ID": "your_project_id"
      }
    }
  }
}
```

## 開発

### 開発モードで実行

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## 提供ツールの詳細

### search_wiki

キーワードでRedmine Wiki内を検索します。

**パラメータ:**
- `query` (string, required): 検索キーワード

**戻り値:** 検索にヒットしたWikiページの一覧（タイトル、説明、URL）

### list_wiki_pages

プロジェクト内のすべてのWikiページの一覧を取得します。

**パラメータ:** なし

**戻り値:** Wikiページの一覧（タイトル、バージョン、更新日時）

### get_wiki_page

指定したタイトルのWikiページの全文を取得します。

**パラメータ:**
- `title` (string, required): Wikiページのタイトル

**戻り値:** ページの全文、更新日時、作成者、バージョン

### search_and_get_page

キーワードでWikiを検索し、関連するページの全文を取得します。

**パラメータ:**
- `query` (string, required): 検索キーワードまたは質問

**戻り値:** 関連するWikiページの全文（最大5件）

## トラブルシューティング

### サーバーが起動しない

1. 環境変数が正しく設定されているか確認してください
2. Node.js 18以上がインストールされているか確認してください
3. `npm run build`でビルドが成功しているか確認してください

### Redmine APIにアクセスできない

1. `REDMINE_URL`が正しいか確認してください
2. `API_KEY`が有効か確認してください
3. `PROJECT_ID`が正しいか確認してください
4. Redmineの設定でREST APIが有効になっているか確認してください

## 技術情報

- **MCP SDK**: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) v1.25.x
- **トランスポート**: stdio (標準入出力)
- **プロトコルバージョン**: 2024-11-05

## 参考リンク

- [Model Context Protocol 公式サイト](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP仕様書](https://modelcontextprotocol.io/specification/2025-06-18)
- [Redmine REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)

## ライセンス

MIT
