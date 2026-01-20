import { z } from 'zod';
import { BaseTool, ToolResponse } from './BaseTool';

/**
 * 特定のWikiページ取得ツール
 */
export class GetWikiPageTool extends BaseTool {
  readonly name = "get_wiki_page";
  readonly description = "指定したタイトルのWikiページの全文を取得します";
  readonly schema = {
    title: z.string().describe('取得したいWikiページのタイトル')
  };

  protected async execute(args: Record<string, unknown>): Promise<ToolResponse> {
    const title = args.title as string;
    const client = this.getClient();
    const config = this.configManager.getConfig();

    const pageUrl = `/projects/${config.projectId}/wiki/${encodeURIComponent(title)}`;
    const pageData = await client.getWikiPageContent(pageUrl);
    const page = pageData.wiki_page;

    return this.success(
      `# ${page.title}\n\n${page.text}\n\n---\n` +
      `最終更新: ${page.updated_on}\n作成者: ${page.author.name}\nバージョン: ${page.version}`
    );
  }
}
