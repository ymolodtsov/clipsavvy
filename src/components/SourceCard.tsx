"use client";

import Link from "next/link";
import Image from "next/image";
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

export function SourceCard({ source }: SourceCardProps) {
  const highlightCount = source.highlights.length;
  const categoryLabel = CATEGORY_LABELS[source.category] || source.category;
  const categoryColor = CATEGORY_COLORS[source.category] || CATEGORY_COLORS.supplementals;

  return (
    <Link
      href={`/sources/${source.user_book_id}`}
      className="block p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800
                 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
    >
      <div className="flex gap-4">
        {source.cover_image_url && (
          <div className="flex-shrink-0 w-16 h-20 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={source.cover_image_url}
              alt={source.title}
              fill
              className="object-cover"
              sizes="64px"
            />
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
}
