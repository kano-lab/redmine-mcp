#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServerFactory } from "./server/McpServerFactory";

/**
 * MCPサーバーのエントリーポイント
 * stdioトランスポートを使用してクライアントと通信します
 */
async function main(): Promise<void> {
  const server = McpServerFactory.create();
  const transport = new StdioServerTransport();

  // プロセス終了時のクリーンアップ
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });

  try {
    await server.connect(transport);
    console.error("Kanolab Redmine MCP server started successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
