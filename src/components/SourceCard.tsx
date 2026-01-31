"use client";

import { memo, useState } from "react";
import Link from "next/link";
import type { ExportResult } from "@/types/readwise";

interface SourceCardProps {
  source: ExportResult;
}

const CATEGORY_LABELS: Record<string, string> = {
  books: "Book",
  articles: "Article",
  tweets: "Tweet",
  podcasts: "Podcast",
  supplementals: "Supplemental",
};

const CATEGORY_COLORS: Record<string, string> = {
  books: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  articles: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  tweets: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  podcasts: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  supplementals: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export const SourceCard = memo(function SourceCard({ source }: SourceCardProps) {
  const [imgError, setImgError] = useState(false);
  const highlightCount = source.highlights.length;
  const categoryLabel = CATEGORY_LABELS[source.category] || source.category;
  const categoryColor = CATEGORY_COLORS[source.category] || CATEGORY_COLORS.supplementals;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tweets":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "books":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "articles":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case "podcasts":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
    }
  };

  return (
    <Link
      href={`/sources/${source.user_book_id}`}
      className="block p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800
                 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
    >
      <div className="flex gap-4">
        {source.cover_image_url && !imgError ? (
          <div className="flex-shrink-0 w-16 h-20 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.cover_image_url}
              alt={source.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-20 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600">
            {getCategoryIcon(source.category)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-black dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {source.title}
            </h3>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${categoryColor}`}>
              {categoryLabel}
            </span>
          </div>
          {source.author && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
              {source.author}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-black dark:text-white">{highlightCount}</span>{" "}
              highlight{highlightCount !== 1 ? "s" : ""}
            </span>
            {source.source && (
              <span className="text-gray-400 dark:text-gray-500 truncate">
                via {source.source}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
