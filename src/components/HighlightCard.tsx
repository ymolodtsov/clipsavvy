"use client";

import { useState, useCallback, memo } from "react";
import type { HighlightExport } from "@/types/readwise";
import { useReadwise } from "@/lib/context";

interface HighlightCardProps {
  highlight: HighlightExport;
  sourceTitle?: string;
  sourceAuthor?: string | null;
  showSource?: boolean;
}

export const HighlightCard = memo(function HighlightCard({
  highlight,
  sourceTitle,
  sourceAuthor,
  showSource = false,
}: HighlightCardProps) {
  const { updateHighlight, deleteHighlight } = useReadwise();
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(highlight.note || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const handleSaveNote = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateHighlight(highlight.id, { note: editedNote || undefined });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setIsSaving(false);
    }
  }, [highlight.id, editedNote, updateHighlight]);

  const handleDelete = useCallback(async () => {
    setIsSaving(true);
    try {
      await deleteHighlight(highlight.id);
    } catch (err) {
      console.error("Failed to delete highlight:", err);
      setIsDeleting(false);
      setIsSaving(false);
    }
  }, [highlight.id, deleteHighlight]);

  const handleCancelEdit = useCallback(() => {
    setEditedNote(highlight.note || "");
    setIsEditing(false);
  }, [highlight.note]);

  return (
    <article className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 relative">
      {/* Menu button - always visible */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="More options"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Edit note
              </button>
              <button
                onClick={() => {
                  setIsDeleting(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 rounded-lg flex items-center justify-center z-30">
          <div className="text-center p-4">
            <p className="text-black dark:text-white mb-4">Delete this highlight?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleting(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <blockquote className="text-black dark:text-white leading-relaxed pr-8">
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

      {/* Note section */}
      {isEditing ? (
        <div className="mt-3">
          <textarea
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       rounded-lg text-black dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveNote}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : highlight.note ? (
        <div className="mt-3 pl-3 border-l-2 border-blue-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            {highlight.note}
          </p>
        </div>
      ) : null}

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
});
