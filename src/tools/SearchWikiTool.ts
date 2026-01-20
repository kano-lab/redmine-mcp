import { z } from 'zod';
import { BaseTool, ToolResponse } from './BaseTool';

/**
 * Wiki検索ツール
 */
export class SearchWikiTool extends BaseTool {
  readonly name = "search_wiki";
  readonly description = "キーワードでRedmine Wiki内を検索し、関連するページを見つけます";
  readonly schema = {
    query: z.string().describe('検索クエリ（キーワード）')
  };

  protected async execute(args: Record<string, unknown>): Promise<ToolResponse> {
    const query = args.query as string;
    const client = this.getClient();
    const config = this.configManager.getConfig();

    const results = await client.searchWikiPages(query);
    const wikiResults = results.results.filter(result => result.type === 'wiki-page');

    if (wikiResults.length === 0) {
      return this.success(`「${query}」に関連するWikiページは見つかりませんでした。`);
    }

    const formattedResults = wikiResults.map(item =>
      `- **${item.title}**: ${item.description || '説明なし'}\n  URL: ${config.redmineUrl}${item.url}`
    ).join('\n');

    return this.success(
      `## 検索結果: ${wikiResults.length}件のWikiページが見つかりました\n\n${formattedResults}`
    );
  }
}
