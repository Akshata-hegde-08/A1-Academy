import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Download,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ResourceItem } from '../data/curriculum';
import { useApp } from '../context/AppContext';
import { downloadResourceFile } from '../utils/download';

interface ResourcePreviewModalProps {
  item: ResourceItem | null;
  subjectName: string;
  cycleName: string;
  categoryTitle: string;
  resourcePath: string;
  onClose: () => void;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  item,
  subjectName,
  cycleName,
  categoryTitle,
  resourcePath,
  onClose,
}) => {
  const [pageIdx, setPageIdx] = useState(0);
  const { isBookmarked, toggleBookmark } = useApp();

  useEffect(() => {
    setPageIdx(0);
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  const pages = item?.previewPages ?? [];
  const activePage = pages[pageIdx];
  const saved = item ? isBookmarked(item.id) : false;

  return (
    <AnimatePresence>
      {item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${item.title}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl a1-surface-secondary shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Eye className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                  <span>Preview Mode (Read-Only)</span>
                  <span aria-hidden="true">·</span>
                  <span>{subjectName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{categoryTitle}</span>
                  {item.isSample && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[var(--accent-purple)]">
                        Sample Content
                      </span>
                    </>
                  )}
                </div>
                <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  {item.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="w-9 h-9 rounded-lg a1-surface flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Read-only viewing surface) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 select-none">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.previewSummary}
              </p>

              {activePage ? (
                <div className="rounded-xl a1-surface p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                      {activePage.heading}
                    </h3>
                    <span className="text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
                      Page {pageIdx + 1} of {pages.length}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-sm text-[var(--text-primary)] leading-relaxed list-disc pl-5">
                    {activePage.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>

                  {activePage.formulaOrCode && (
                    <pre className="p-4 rounded-xl bg-[#080D1C] text-[#F1F5FF] border border-[#8DBBFF]/20 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                      {activePage.formulaOrCode}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="rounded-xl a1-surface p-5 text-sm text-[var(--text-secondary)]">
                  {item.description}
                </div>
              )}

              {item.authorNote && (
                <p className="text-xs text-[var(--text-secondary)]">
                  Note: {item.authorNote}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {pages.length > 1 && (
                  <>
                    <button
                      type="button"
                      disabled={pageIdx === 0}
                      onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
                      className="px-3 py-1.5 rounded-lg a1-surface text-xs font-medium text-[var(--text-primary)] disabled:opacity-40 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={pageIdx === pages.length - 1}
                      onClick={() =>
                        setPageIdx((p) => Math.min(pages.length - 1, p + 1))
                      }
                      className="px-3 py-1.5 rounded-lg a1-surface text-xs font-medium text-[var(--text-primary)] disabled:opacity-40 flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    toggleBookmark({
                      id: item.id,
                      title: item.title,
                      subjectName,
                      cycleName,
                      categoryTitle,
                      path: resourcePath,
                    })
                  }
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    saved
                      ? 'bg-[#C4ACFF]/20 text-[var(--accent-purple)] border border-[#C4ACFF]/40'
                      : 'a1-surface text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>

                {item.downloadable && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadResourceFile(
                        item,
                        subjectName,
                        cycleName,
                        categoryTitle,
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {item.fileFormat || 'File'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
