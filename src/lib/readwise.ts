import type {
  Book,
  Highlight,
  PaginatedResponse,
  ExportResponse,
  ExportResult,
  Tag,
} from "@/types/readwise";

const API_BASE = "https://readwise.io/api/v2";

class ReadwiseClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Token ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API token");
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(
          `Rate limited. Retry after ${retryAfter || "60"} seconds`
        );
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/`, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      });
      return response.status === 204;
    } catch {
      return false;
    }
  }

  async getBooks(page = 1, pageSize = 100): Promise<PaginatedResponse<Book>> {
    return this.fetch<PaginatedResponse<Book>>(
      `/books/?page=${page}&page_size=${pageSize}`
    );
  }

  async getAllBooks(): Promise<Book[]> {
    const allBooks: Book[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getBooks(page);
      allBooks.push(...response.results);
      hasMore = response.next !== null;
      page++;
    }

    return allBooks;
  }

  async getBook(id: number): Promise<Book> {
    return this.fetch<Book>(`/books/${id}/`);
  }

  async getHighlights(
    page = 1,
    pageSize = 100,
    bookId?: number
  ): Promise<PaginatedResponse<Highlight>> {
    let url = `/highlights/?page=${page}&page_size=${pageSize}`;
    if (bookId) {
      url += `&book_id=${bookId}`;
    }
    return this.fetch<PaginatedResponse<Highlight>>(url);
  }

  async getHighlight(id: number): Promise<Highlight> {
    return this.fetch<Highlight>(`/highlights/${id}/`);
  }

  async updateHighlight(
    id: number,
    updates: { note?: string; text?: string }
  ): Promise<Highlight> {
    return this.fetch<Highlight>(`/highlights/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteHighlight(id: number): Promise<void> {
    await this.fetch(`/highlights/${id}/`, {
      method: "DELETE",
    });
  }

  async exportHighlights(
    updatedAfter?: string,
    pageCursor?: string
  ): Promise<ExportResponse> {
    let url = "/export/";
    const params = new URLSearchParams();
    if (updatedAfter) params.set("updatedAfter", updatedAfter);
    if (pageCursor) params.set("pageCursor", pageCursor);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return this.fetch<ExportResponse>(url);
  }

  async getAllExports(updatedAfter?: string): Promise<ExportResult[]> {
    const allExports: ExportResult[] = [];
    let pageCursor: string | null = null;

    do {
      const response = await this.exportHighlights(
        updatedAfter,
        pageCursor || undefined
      );
      allExports.push(...response.results);
      pageCursor = response.nextPageCursor;
    } while (pageCursor);

    return allExports;
  }

  async createHighlight(highlight: {
    text: string;
    title?: string;
    author?: string;
    source_url?: string;
    category?: "books" | "articles" | "tweets" | "podcasts" | "supplementals";
    note?: string;
    highlighted_at?: string;
  }): Promise<{ id: number; modified_highlights: number[] }> {
    return this.fetch("/highlights/", {
      method: "POST",
      body: JSON.stringify({ highlights: [highlight] }),
    });
  }

  async addTagToHighlight(highlightId: number, tagName: string): Promise<void> {
    await this.fetch(`/highlights/${highlightId}/tags/`, {
      method: "POST",
      body: JSON.stringify({ name: tagName }),
    });
  }

  async removeTagFromHighlight(
    highlightId: number,
    tagId: number
  ): Promise<void> {
    await this.fetch(`/highlights/${highlightId}/tags/${tagId}/`, {
      method: "DELETE",
    });
  }
}

export function createReadwiseClient(token: string): ReadwiseClient {
  return new ReadwiseClient(token);
}

export type { ReadwiseClient };
