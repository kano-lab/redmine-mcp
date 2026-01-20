import { z } from 'zod';
import { BaseTool, ToolResponse } from './BaseTool';

interface PageDetail {
  title: string;
  content: string;
  url: string;
  updated_on: string;
}

/**
 * 検索してページ内容を取得するツール
 */
export class SearchAndGetPageTool extends BaseTool {
  readonly name = "search_and_get_page";
  readonly description = "キーワードでWikiを検索し、関連するページの全文を取得します（最大5件）";
  readonly schema = {
    query: z.string().describe('検索クエリ（キーワードまたは質問）')
  };

  protected async execute(args: Record<string, unknown>): Promise<ToolResponse> {
    const query = args.query as string;
    const client = this.getClient();
    const config = this.configManager.getConfig();

    // 1. まず検索を実行
    const searchResults = await client.searchWikiPages(query);
    const wikiResults = searchResults.results.filter(result => result.type === 'wiki-page');

    if (wikiResults.length === 0) {
      return this.success(`「${query}」に関連する情報が見つかりませんでした。`);
    }

    // 2. 最大5件の関連ページの内容を取得
    const maxResults = Math.min(5, wikiResults.length);
    const detailedResults: PageDetail[] = [];

    for (let i = 0; i < maxResults; i++) {
      const pageUrl = wikiResults[i].url;
      try {
        const pageData = await client.getWikiPageContent(pageUrl);
        detailedResults.push({
          title: pageData.wiki_page.title,
          content: pageData.wiki_page.text,
          url: `${config.redmineUrl}${pageUrl}`,
          updated_on: pageData.wiki_page.updated_on
        });
      } catch (err) {
        console.error(`ページ「${pageUrl}」の取得に失敗しました:`, err);
      }
    }

    if (detailedResults.length === 0) {
      return this.error(`検索結果は見つかりましたが、ページ内容の取得に失敗しました。`);
    }

    const formattedContent = detailedResults.map(page =>
      `## ${page.title}\n\n${page.content}\n\n---\n最終更新: ${page.updated_on}\nURL: ${page.url}`
    ).join('\n\n---\n\n');

    return this.success(
      `# 検索結果: ${detailedResults.length}件のページを取得しました（検索ヒット: ${wikiResults.length}件中）\n\n${formattedContent}`
    );
  }
}
