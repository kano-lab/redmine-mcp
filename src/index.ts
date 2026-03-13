#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { McpServerFactory } from "./server/McpServerFactory";

/**
 * MCPサーバーのエントリーポイント
 * --http引数でHTTPモード、なければstdioトランスポートを使用してクライアントと通信します
 */
async function main(): Promise<void> {
  const server = McpServerFactory.create();

  const useHttp = process.argv.includes("--http");

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
    if (useHttp) {
      const app = express();
      app.use(express.json());

      app.post("/mcp", async (req, res) => {
        const reqServer = McpServerFactory.create();
        try {
          const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
          await reqServer.connect(transport);
          await transport.handleRequest(req, res, req.body);
          res.on('close', () => {
            transport.close();
            reqServer.close();
          });
        } catch (error) {
          if (!res.headersSent) {
            res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
          }
        }
      });

      const port = parseInt(process.env.PORT ?? "3000");
      app.listen(port, () => {
        console.error(`Kanolab Redmine MCP server started on http://0.0.0.0:${port}/mcp`);
      });
    } else {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("Kanolab Redmine MCP server started successfully");
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
