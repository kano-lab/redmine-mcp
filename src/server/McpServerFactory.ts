import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SearchWikiTool,
  ListWikiPagesTool,
  GetWikiPageTool,
  SearchAndGetPageTool
} from '../tools';

/**
 * MCPサーバーを作成するファクトリークラス
 */
export class McpServerFactory {
  private static readonly SERVER_NAME = 'kanolab-redmine-wiki';
  private static readonly SERVER_VERSION = '2.0.0';
  private static readonly SERVER_DESCRIPTION =
    '狩野研究室(Kanolab)のRedmine Wikiにアクセスするためのモデルコンテキストプロトコルサーバー';

  /**
   * 設定済みのMCPサーバーインスタンスを作成する
   */
  static create(): McpServer {
    const server = new McpServer({
      name: McpServerFactory.SERVER_NAME,
      version: McpServerFactory.SERVER_VERSION,
      description: McpServerFactory.SERVER_DESCRIPTION
    });

    // ツールを登録
    const tools = [
      new SearchWikiTool(),
      new ListWikiPagesTool(),
      new GetWikiPageTool(),
      new SearchAndGetPageTool()
    ];

    for (const tool of tools) {
      tool.register(server);
    }

    return server;
  }
}
