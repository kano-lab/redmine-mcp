import { BaseTool, ToolResponse } from './BaseTool';

/**
 * Wikiページ一覧取得ツール
 */
export class ListWikiPagesTool extends BaseTool {
  readonly name = "list_wiki_pages";
  readonly description = "プロジェクト内のすべてのWikiページの一覧を取得します";
  readonly schema = {};

  protected async execute(): Promise<ToolResponse> {
    const client = this.getClient();
    const pagesData = await client.getWikiPagesIndex();

    if (pagesData.wiki_pages.length === 0) {
      return this.success("Wikiページが見つかりませんでした。");
    }

    const formattedPages = pagesData.wiki_pages.map(page =>
      `- **${page.title}** (v${page.version}) - 最終更新: ${page.updated_on}`
    ).join('\n');

    return this.success(
      `## Wikiページ一覧: ${pagesData.total_count}件\n\n${formattedPages}`
    );
  }
}
