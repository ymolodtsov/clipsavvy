export interface Highlight {
  id: number;
  text: string;
  note: string | null;
  location: number | null;
  location_type: "page" | "order" | "time_offset" | null;
  highlighted_at: string | null;
  created_at: string;
  updated_at: string;
  url: string | null;
  color: string | null;
  book_id: number;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string | null;
  category: "books" | "articles" | "tweets" | "supplementals" | "podcasts";
  source: string | null;
  num_highlights: number;
  last_highlight_at: string | null;
  updated: string;
  cover_image_url: string | null;
  highlights_url: string;
  source_url: string | null;
  asin: string | null;
  tags: Tag[];
  document_note: string | null;
}

export interface ExportResult {
  user_book_id: number;
  title: string;
  author: string | null;
  readable_title: string;
  source: string;
  cover_image_url: string | null;
  unique_url: string | null;
  book_tags: Tag[];
  category: "books" | "articles" | "tweets" | "supplementals" | "podcasts";
  document_note: string | null;
  readwise_url: string;
  source_url: string | null;
  asin: string | null;
  highlights: HighlightExport[];
}

export interface HighlightExport {
  id: number;
  text: string;
  note: string | null;
  location: number | null;
  location_type: "page" | "order" | "time_offset" | null;
  highlighted_at: string | null;
  created_at: string;
  updated_at: string;
  url: string | null;
  color: string | null;
  is_favorite: boolean;
  is_discard: boolean;
  tags: Tag[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExportResponse {
  count: number;
  nextPageCursor: string | null;
  results: ExportResult[];
}

export type SourceCategory = Book["category"] | "all";

export interface HighlightFilters {
  category?: SourceCategory;
  bookId?: number;
  search?: string;
}
