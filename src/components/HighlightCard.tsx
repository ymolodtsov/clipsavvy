"use client";

import { useState } from "react";
import type { HighlightExport, Tag } from "@/types/readwise";

interface HighlightCardProps {
  highlight: HighlightExport;
  sourceTitle?: string;
  sourceAuthor?: string | null;
  showSource?: boolean;
}

export function HighlightCard({
  highlight,
  sourceTitle,
  sourceAuthor,
  showSource = false,
}: HighlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLongText = highlight.text.length > 300;
  const displayText =
    isLongText && !expanded ? highlight.text.slice(0, 300) + "..." : highlight.text;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <blockquote className="text-black dark:text-white leading-relaxed">
        {displayText}
        {isLongText && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </blockquote>

      {highlight.note && (
        <div className="mt-3 pl-3 border-l-2 border-blue-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            {highlight.note}
          </p>
        </div>
      )}

      {highlight.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {highlight.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800
                         text-gray-600 dark:text-gray-400 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {showSource && sourceTitle && (
            <span className="truncate max-w-[200px]">
              {sourceTitle}
              {sourceAuthor && ` — ${sourceAuthor}`}
            </span>
          )}
          {highlight.location && (
            <span>
              {highlight.location_type === "page" ? "Page" : "Location"}{" "}
              {highlight.location}
            </span>
          )}
        </div>
        {highlight.highlighted_at && (
          <time dateTime={highlight.highlighted_at}>
            {formatDate(highlight.highlighted_at)}
          </time>
        )}
      </div>

      {highlight.color && highlight.color !== "yellow" && (
        <div className="mt-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: highlight.color }}
            title={`Highlight color: ${highlight.color}`}
          />
        </div>
      )}
    </article>
  );
}
