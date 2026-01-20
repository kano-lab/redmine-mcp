import axios, { AxiosInstance } from 'axios';
import {
  SearchResult,
  WikiPageResponse,
  WikiPagesIndexResponse
} from '../types/redmine';

/**
 * Redmine APIとの通信を担当するクライアントクラス
 */
export class RedmineClient {
  private client: AxiosInstance;
  private projectId: string;
  private baseURL: string;

  constructor(baseURL: string, apiKey: string, projectId: string) {
    this.baseURL = baseURL;
    this.projectId = projectId;
    this.client = axios.create({
      baseURL,
      headers: {
        'X-Redmine-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  getProjectId(): string {
    return this.projectId;
  }

  /**
   * キーワードでWikiページを検索する
   */
  async searchWikiPages(keyword: string): Promise<SearchResult> {
    try {
      const response = await this.client.get<SearchResult>(
        `/search.json?q=${encodeURIComponent(keyword)}&wiki_pages=1&project_id=${this.projectId}`
      );
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('検索エラー:', message);
      throw new Error(`検索エラー: ${message}`);
    }
  }

  /**
   * 特定のWikiページの全文を取得する
   */
  async getWikiPageContent(pageUrl: string): Promise<WikiPageResponse> {
    try {
      const response = await this.client.get<WikiPageResponse>(
        `${pageUrl}.json`
      );
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`"${pageUrl}"の取得エラー:`, message);
      throw new Error(`"${pageUrl}"の取得エラー: ${message}`);
    }
  }

  /**
   * プロジェクトのWikiページ一覧を取得する
   */
  async getWikiPagesIndex(): Promise<WikiPagesIndexResponse> {
    try {
      const response = await this.client.get<WikiPagesIndexResponse>(
        `/projects/${this.projectId}/wiki/index.json`
      );
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Wikiページ一覧取得エラー:', message);
      throw new Error(`Wikiページ一覧取得エラー: ${message}`);
    }
  }
}
