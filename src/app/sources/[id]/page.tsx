"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useReadwise } from "@/lib/context";
import { HighlightCard } from "@/components/HighlightCard";

const CATEGORY_LABELS: Record<string, string> = {
  books: "Book",
  articles: "Article",
  tweets: "Tweet",
  podcasts: "Podcast",
  supplementals: "Supplemental",
};

const getCategoryIcon = (category: string, size = "w-8 h-8") => {
  switch (category) {
    case "tweets":
      return (
        <svg className={size} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "books":
      return (
        <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "articles":
      return (
        <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "podcasts":
      return (
        <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      );
    default:
      return (
        <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
  }
};

export default function SourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { exports, isAuthenticated, isLoading } = useReadwise();
  const [imgError, setImgError] = useState(false);

  const sourceId = Number(params.id);

  const source = useMemo(() => {
    return exports.find((e) => e.user_book_id === sourceId);
  }, [exports, sourceId]);

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to sources
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Source not found</h1>
            <p className="text-gray-500 dark:text-gray-400">
              The source you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[source.category] || source.category;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to sources
        </Link>

        <header className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex gap-6">
            {source.cover_image_url && !imgError ? (
              <div className="flex-shrink-0 w-24 h-32 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={source.cover_image_url}
                  alt={source.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-24 h-32 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600">
                {getCategoryIcon(source.category)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  {source.title}
                </h1>
                <span className="flex-shrink-0 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {categoryLabel}
                </span>
              </div>
              {source.author && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                  {source.author}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  <strong className="text-black dark:text-white">
                    {source.highlights.length}
                  </strong>{" "}
                  highlights
                </span>
                {source.source && <span>via {source.source}</span>}
                {source.source_url && (
                  <a
                    href={source.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View original
                  </a>
                )}
                <a
                  href={source.readwise_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View in Readwise
                </a>
              </div>

              {source.book_tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {source.book_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {source.document_note && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {source.document_note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Highlights
          </h2>
          <div className="space-y-4">
            {source.highlights
              .sort((a, b) => {
                if (a.location && b.location) return a.location - b.location;
                return 0;
              })
              .map((highlight) => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
