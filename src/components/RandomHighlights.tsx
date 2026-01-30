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

  if (allHighlights.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No highlights yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Random Highlights
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Rediscover your highlights from across your library
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
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
          Shuffle
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
    </div>
  );
}
