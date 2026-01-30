"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useReadwise } from "@/lib/context";
import { HighlightCard } from "@/components/HighlightCard";

const CATEGORY_LABELS: Record<string, string> = {
  books: "Book",
  articles: "Article",
  tweets: "Tweet",
  podcasts: "Podcast",
  supplementals: "Supplemental",
};

export default function SourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { exports, isAuthenticated, isLoading } = useReadwise();

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
            {source.cover_image_url && (
              <div className="flex-shrink-0 w-24 h-32 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={source.cover_image_url}
                  alt={source.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
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
