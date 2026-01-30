"use client";

import { useState, useMemo, useCallback } from "react";
import type { ExportResult, HighlightExport } from "@/types/readwise";
import { HighlightCard } from "./HighlightCard";

interface RandomHighlightsProps {
  exports: ExportResult[];
}

interface HighlightWithSource {
  highlight: HighlightExport;
  source: ExportResult;
}

export function RandomHighlights({ exports }: RandomHighlightsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const allHighlights = useMemo(() => {
    const highlights: HighlightWithSource[] = [];
    exports.forEach((source) => {
      source.highlights.forEach((h) => {
        highlights.push({ highlight: h, source });
      });
    });
    return highlights;
  }, [exports]);

  const randomHighlights = useMemo(() => {
    if (allHighlights.length === 0) return [];

    // Shuffle and take 5
    const shuffled = [...allHighlights].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHighlights, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  if (allHighlights.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Random Highlights
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400
                     hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
      <div className="space-y-4">
        {randomHighlights.map(({ highlight, source }) => (
          <HighlightCard
            key={`${highlight.id}-${refreshKey}`}
            highlight={highlight}
            sourceTitle={source.title}
            sourceAuthor={source.author}
            showSource
          />
        ))}
      </div>
    </section>
  );
}
