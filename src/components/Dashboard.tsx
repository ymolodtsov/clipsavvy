"use client";

import { useMemo, useState, useCallback } from "react";
import { useReadwise } from "@/lib/context";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { SourceCard } from "./SourceCard";
import { HighlightCard } from "./HighlightCard";
import { RandomHighlights } from "./RandomHighlights";
import type { ExportResult, HighlightExport } from "@/types/readwise";

interface HighlightWithSource {
  highlight: HighlightExport;
  source: ExportResult;
}

type ViewMode = "random" | "sources";

const PAGE_SIZE = 20;

export function Dashboard() {
  const { exports, selectedCategory, searchQuery, isLoading } = useReadwise();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>("random");

  // Filter sources by category
  const filteredSources = useMemo(() => {
    let sources = exports;

    if (selectedCategory !== "all") {
      sources = sources.filter((s) => s.category === selectedCategory);
    }

    return sources.sort((a, b) => {
      const aDate = a.highlights[0]?.highlighted_at || a.highlights[0]?.created_at;
      const bDate = b.highlights[0]?.highlighted_at || b.highlights[0]?.created_at;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [exports, selectedCategory]);

  // Search highlights when there's a query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const highlights: HighlightWithSource[] = [];

    // Search within filtered sources only
    filteredSources.forEach((source) => {
      source.highlights.forEach((h) => {
        if (
          h.text.toLowerCase().includes(query) ||
          h.note?.toLowerCase().includes(query)
        ) {
          highlights.push({ highlight: h, source });
        }
      });
    });

    return highlights.sort((a, b) => {
      const aDate = a.highlight.highlighted_at || a.highlight.created_at;
      const bDate = b.highlight.highlighted_at || b.highlight.created_at;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [filteredSources, searchQuery]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  // Reset pagination when search changes
  const visibleResults = searchResults.slice(0, visibleCount);
  const hasMore = visibleCount < searchResults.length;

  // Determine what to show
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Header />
      <div className="flex">
        <Sidebar viewMode={viewMode} setViewMode={setViewMode} />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading your highlights...</p>
              </div>
            </div>
          ) : isSearching ? (
            // Search results view
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
                {searchResults.length} highlight{searchResults.length !== 1 ? "s" : ""} found
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </h2>
              {searchResults.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {visibleResults.map(({ highlight, source }) => (
                      <HighlightCard
                        key={highlight.id}
                        highlight={highlight}
                        sourceTitle={source.title}
                        sourceAuthor={source.author}
                        showSource
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Load more ({searchResults.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No highlights match your search.
                </p>
              )}
            </div>
          ) : viewMode === "random" ? (
            // Random highlights view
            <RandomHighlights exports={exports} />
          ) : (
            // Sources grid view
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
                {filteredSources.length} source{filteredSources.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </h2>

              {filteredSources.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSources.map((source) => (
                    <SourceCard key={source.user_book_id} source={source} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No sources found in this category.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
