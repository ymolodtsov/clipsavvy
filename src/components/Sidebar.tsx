"use client";

import { useReadwise } from "@/lib/context";
import type { SourceCategory } from "@/types/readwise";

type ViewMode = "random" | "sources";

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const CATEGORIES: { value: SourceCategory; label: string; icon: string }[] = [
  { value: "all", label: "All Sources", icon: "M4 6h16M4 12h16M4 18h16" },
  {
    value: "books",
    label: "Books",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    value: "articles",
    label: "Articles",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
  {
    value: "tweets",
    label: "Tweets",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    value: "podcasts",
    label: "Podcasts",
    icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
  },
  {
    value: "supplementals",
    label: "Supplementals",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export function Sidebar({ viewMode, setViewMode }: SidebarProps) {
  const { selectedCategory, setSelectedCategory, exports } = useReadwise();

  const getCategoryCount = (category: SourceCategory) => {
    if (category === "all") return exports.length;
    return exports.filter((e) => e.category === category).length;
  };

  const getTotalHighlights = () => {
    return exports.reduce((sum, e) => sum + e.highlights.length, 0);
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4">
        <div className="mb-6 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-2xl font-bold text-black dark:text-white">
            {getTotalHighlights().toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Highlights
          </div>
          <div className="mt-2 text-lg font-semibold text-black dark:text-white">
            {exports.length.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Sources</div>
        </div>

        <nav className="space-y-1">
          {/* Random Highlights - Primary View */}
          <button
            onClick={() => setViewMode("random")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
              ${
                viewMode === "random"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
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
            <span className="flex-1 truncate">Random Highlights</span>
          </button>

          <div className="my-3 border-t border-gray-200 dark:border-gray-800" />

          {/* Source Categories */}
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
            Browse Sources
          </div>

          {CATEGORIES.map((category) => {
            const count = getCategoryCount(category.value);
            const isSelected = viewMode === "sources" && selectedCategory === category.value;

            return (
              <button
                key={category.value}
                onClick={() => {
                  setViewMode("sources");
                  setSelectedCategory(category.value);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={category.icon}
                  />
                </svg>
                <span className="flex-1 truncate">{category.label}</span>
                <span
                  className={`text-sm ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
