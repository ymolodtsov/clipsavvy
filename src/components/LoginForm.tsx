"use client";

import { useState } from "react";
import { useReadwise } from "@/lib/context";

export function LoginForm() {
  const { login, isLoading, error } = useReadwise();
  const [token, setToken] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!token.trim()) {
      setLocalError("Please enter your API token");
      return;
    }

    const success = await login(token.trim());
    if (!success) {
      setLocalError("Invalid API token. Please check and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            ClipSavvy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A modern viewer for your Readwise highlights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Readwise API Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-600"
              disabled={isLoading}
            />
          </div>

          {(localError || error) && (
            <p className="text-red-500 text-sm">{localError || error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium
                       rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting..." : "Connect to Readwise"}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Get your token from{" "}
            <a
              href="https://readwise.io/access_token"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              readwise.io/access_token
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
