import dotenv from 'dotenv';
import path from 'path';
import { RedmineConfig } from '../types/redmine';

/**
 * 環境変数を管理するシングルトンクラス
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: RedmineConfig;
  private missingVars: string[] = [];

  private constructor() {
    this.loadEnvFiles();
    this.config = this.parseConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadEnvFiles(): void {
    const envPaths = [
      path.resolve(__dirname, '..', '..', '.env'),
      path.resolve(process.cwd(), '.env')
    ];

    for (const envPath of envPaths) {
      dotenv.config({ path: envPath });
    }
  }

  private parseConfig(): RedmineConfig {
    const redmineUrl = process.env.REDMINE_URL || '';
    const apiKey = process.env.API_KEY || '';
    const projectId = process.env.PROJECT_ID || '';

    this.missingVars = [];
    if (!redmineUrl) this.missingVars.push('REDMINE_URL');
    if (!apiKey) this.missingVars.push('API_KEY');
    if (!projectId) this.missingVars.push('PROJECT_ID');

    if (this.missingVars.length > 0) {
      console.error(`Missing required environment variables: ${this.missingVars.join(', ')}`);
    }

    return { redmineUrl, apiKey, projectId };
  }

  getConfig(): RedmineConfig {
    return this.config;
  }

  isValid(): boolean {
    return this.missingVars.length === 0;
  }

  getConfigErrorMessage(): string {
    return `環境変数が設定されていません: ${this.missingVars.join(', ')}\n\n` +
      `Claude Desktopの設定ファイルで以下のように設定してください:\n` +
      `{\n  "mcpServers": {\n    "kanolab-redmine": {\n      "command": "node",\n` +
      `      "args": ["/path/to/dist/index.js"],\n      "env": {\n` +
      `        "REDMINE_URL": "https://your-redmine.com",\n` +
      `        "API_KEY": "your-api-key",\n` +
      `        "PROJECT_ID": "your-project-id"\n      }\n    }\n  }\n}`;
  }
}
