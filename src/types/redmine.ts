/**
 * Redmine API関連の型定義
 */

// 検索結果
export interface SearchResult {
  results: SearchResultItem[];
  total_count: number;
  offset: number;
  limit: number;
}

export interface SearchResultItem {
  id: number;
  title: string;
  type: string;
  url: string;
  description: string;
  project: {
    id: number;
    name: string;
  };
}

// Wikiページ
export interface WikiPageResponse {
  wiki_page: WikiPage;
}

export interface WikiPage {
  id: number;
  title: string;
  version: number;
  created_on: string;
  updated_on: string;
  text: string;
  author: {
    id: number;
    name: string;
  };
  comments: string;
}

// Wikiページ一覧
export interface WikiPagesIndexResponse {
  wiki_pages: WikiPageIndex[];
  total_count: number;
}

export interface WikiPageIndex {
  title: string;
  version: number;
  created_on: string;
  updated_on: string;
}

// 設定
export interface RedmineConfig {
  redmineUrl: string;
  apiKey: string;
  projectId: string;
}
