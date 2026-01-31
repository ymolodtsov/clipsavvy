"use client";

import { useState, useCallback } from "react";
import { useReadwise } from "@/lib/context";

const CATEGORIES = [
  { value: "books", label: "Book" },
  { value: "articles", label: "Article" },
  { value: "podcasts", label: "Podcast" },
  { value: "tweets", label: "Tweet" },
  { value: "supplementals", label: "Supplemental" },
] as const;

export function AddHighlight() {
  const { createHighlight } = useReadwise();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]["value"]>("supplementals");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setMessage({ type: "error", text: "Highlight text is required" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const success = await createHighlight({
      text: text.trim(),
      title: title.trim() || undefined,
      author: author.trim() || undefined,
      source_url: sourceUrl.trim() || undefined,
      category,
      note: note.trim() || undefined,
    });

    setIsSubmitting(false);

    if (success) {
      setMessage({ type: "success", text: "Highlight added successfully!" });
      // Clear form
      setText("");
      setTitle("");
      setAuthor("");
      setSourceUrl("");
      setNote("");
      setCategory("supplementals");
    } else {
      setMessage({ type: "error", text: "Failed to add highlight. Please try again." });
    }
  }, [text, title, author, sourceUrl, category, note, createHighlight]);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Add Highlight
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manually add a highlight to your Readwise library
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Highlight Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the highlight text..."
            rows={4}
            className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                       rounded-lg text-black dark:text-white resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Book title, Article name"
              className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                         rounded-lg text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                         rounded-lg text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                         rounded-lg text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source URL
            </label>
            <input
              type="url"
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                         rounded-lg text-black dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note..."
            rows={2}
            className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                       rounded-lg text-black dark:text-white resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add Highlight"}
        </button>
      </form>
    </div>
  );
}
