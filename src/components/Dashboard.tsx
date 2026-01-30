"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
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

const PAGE_SIZE = 20;

export function Dashboard() {
  const { exports, selectedCategory, searchQuery, isLoading } = useReadwise();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredSources = useMemo(() => {
    let sources = exports;

    if (selectedCategory !== "all") {
      sources = sources.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sources = sources.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.author?.toLowerCase().includes(query) ||
          s.highlights.some(
            (h) =>
              h.text.toLowerCase().includes(query) ||
              h.note?.toLowerCase().includes(query)
          )
      );
    }

    return sources.sort((a, b) => {
      const aDate = a.highlights[0]?.highlighted_at || a.highlights[0]?.created_at;
      const bDate = b.highlights[0]?.highlighted_at || b.highlights[0]?.created_at;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }, [exports, selectedCategory, searchQuery]);

  const allHighlights = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const highlights: HighlightWithSource[] = [];

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

  // Reset visible count when search query or category changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory]);

  const visibleHighlights = useMemo(() => {
    return allHighlights.slice(0, visibleCount);
  }, [allHighlights, visibleCount]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const showHighlights = searchQuery.trim().length > 0;
  const showRandomHighlights = !isLoading && !showHighlights && exports.length > 0;
  const hasMore = visibleCount < allHighlights.length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading your highlights...</p>
              </div>
            </div>
          ) : showHighlights ? (
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
                {allHighlights.length} highlight{allHighlights.length !== 1 ? "s" : ""} found
              </h2>
              <div className="space-y-4">
                {visibleHighlights.map(({ highlight, source }) => (
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
                    Load more ({allHighlights.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              {allHighlights.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No highlights match your search.
                </p>
              )}
            </div>
          ) : (
            <div>
              {showRandomHighlights && <RandomHighlights exports={exports} />}

              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
                {filteredSources.length} source{filteredSources.length !== 1 ? "s" : ""}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSources.map((source) => (
                  <SourceCard key={source.user_book_id} source={source} />
                ))}
              </div>
              {filteredSources.length === 0 && (
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
