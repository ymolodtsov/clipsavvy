"use client";

import Link from "next/link";
import { useReadwise } from "@/lib/context";

function formatLastSynced(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function Header() {
  const { logout, refreshData, isLoading, isSyncing, lastSyncedAt, searchQuery, setSearchQuery, setSelectedCategory } = useReadwise();

  const isRefreshing = isLoading || isSyncing;

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={() => setSelectedCategory("all")}
            className="text-xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ClipSavvy
          </Link>
          {isSyncing && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Syncing...
            </span>
          )}
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search highlights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-900 text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSyncedAt && !isSyncing && (
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              Synced {formatLastSynced(lastSyncedAt)}
            </span>
          )}
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors
                       disabled:opacity-50"
            title={lastSyncedAt ? `Last synced: ${formatLastSynced(lastSyncedAt)}` : "Refresh data"}
          >
            <svg
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
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
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
