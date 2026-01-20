import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodRawShape } from 'zod';
import { ConfigManager } from '../config/ConfigManager';
import { RedmineClient } from '../services/RedmineClient';

/**
 * MCPツールのレスポンス型
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/**
 * MCPツールの基底クラス
 * 共通のエラーハンドリングと設定チェックを提供
 */
export abstract class BaseTool {
  protected configManager: ConfigManager;
  private client: RedmineClient | null = null;

  constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  abstract get name(): string;
  abstract get description(): string;
  abstract get schema(): ZodRawShape;

  protected getClient(): RedmineClient {
    if (!this.client) {
      const config = this.configManager.getConfig();
      this.client = new RedmineClient(config.redmineUrl, config.apiKey, config.projectId);
    }
    return this.client;
  }

  protected checkConfig(): string | null {
    if (!this.configManager.isValid()) {
      return this.configManager.getConfigErrorMessage();
    }
    return null;
  }

  protected success(text: string): ToolResponse {
    return {
      content: [{ type: "text", text }]
    };
  }

  protected error(text: string): ToolResponse {
    return {
      content: [{ type: "text", text }],
      isError: true
    };
  }

  protected abstract execute(args: Record<string, unknown>): Promise<ToolResponse>;

  /**
   * ツールをMCPサーバーに登録する
   */
  register(server: McpServer): void {
    server.tool(
      this.name,
      this.description,
      this.schema,
      async (args) => {
        const configError = this.checkConfig();
        if (configError) {
          return this.error(configError);
        }

        try {
          return await this.execute(args);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error occurred';
          return this.error(`エラーが発生しました: ${message}`);
        }
      }
    );
  }
}
