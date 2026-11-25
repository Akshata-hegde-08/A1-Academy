import React, { useState } from 'react';
import {
  Check,
  ExternalLink,
  FileSpreadsheet,
  Link2,
} from 'lucide-react';
import { PLACEMENT_SHEETS } from '../../data/studyTips';

const SHEET_STORAGE_KEY = 'a1_academy_placement_sheets_v1';

function isValidHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const PlacementsSection: React.FC = () => {
  const [customSheetUrls, setCustomSheetUrls] = useState<
    Record<string, string>
  >(() => {
    try {
      const raw = localStorage.getItem(SHEET_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return {};
  });

  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');

  const handleOpenEditor = (sheetId: string, currentUrl: string) => {
    setEditingSheetId(sheetId);
    setDraftUrl(currentUrl);
    setUrlError('');
  };

  const handleSaveSheetUrl = (sheetId: string, e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftUrl.trim();
    if (!isValidHttpUrl(trimmed)) {
      setUrlError('Please paste a valid https:// Google Sheets URL.');
      return;
    }
    const next = { ...customSheetUrls, [sheetId]: trimmed };
    setCustomSheetUrls(next);
    try {
      localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
    setEditingSheetId(null);
    setDraftUrl('');
    setUrlError('');
  };

  return (
    <section
      id="placements"
      aria-labelledby="placements-heading"
      className="scroll-mt-32 space-y-10"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--accent-purple)]">
          Section 04 · Career &amp; Compensation Overview
        </p>
        <h2
          id="placements-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
        >
          Let&apos;s Talk Placements.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
          Explore placement data, compare opportunities and understand the
          placement scenario.
        </p>
      </div>

      {/* A. Google Sheets Links */}
      <div className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          A. Placement Data Sheets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLACEMENT_SHEETS.map((sheet) => {
            const effectiveUrl = (
              sheet.url ||
              customSheetUrls[sheet.id] ||
              ''
            ).trim();
            const hasUrl = isValidHttpUrl(effectiveUrl);
            const isEditing = editingSheetId === sheet.id;

            if (hasUrl && !isEditing) {
              return (
                <div
                  key={sheet.id}
                  className="rounded-2xl a1-surface p-5 sm:p-6 flex flex-col justify-between gap-4 a1-glow-hover"
                >
                  <a
                    href={effectiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span className="w-11 h-11 rounded-xl bg-[#0D9488]/12 dark:bg-[#5EEAD4]/14 border border-[#0D9488]/25 dark:border-[#5EEAD4]/30 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                          {sheet.title}
                        </h4>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                          Open original Google Sheet in a new tab
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-[var(--accent-blue)] shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {!sheet.url && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span className="truncate max-w-[70%]">
                        {effectiveUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditor(sheet.id, effectiveUrl)}
                        className="font-semibold text-[var(--accent-blue)] hover:underline shrink-0"
                      >
                        Edit Link
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={sheet.id}
                className="rounded-2xl a1-surface p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-[#0D9488]/12 dark:bg-[#5EEAD4]/14 border border-[#0D9488]/25 dark:border-[#5EEAD4]/30 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
                        {sheet.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {sheet.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={(e) => handleSaveSheetUrl(sheet.id, e)}
                    className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]"
                  >
                    <label
                      htmlFor={`sheet-input-${sheet.id}`}
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Paste Original Google Sheets URL
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id={`sheet-input-${sheet.id}`}
                        type="url"
                        value={draftUrl}
                        onChange={(e) => setDraftUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="flex-1 px-3 py-2 rounded-lg a1-surface-secondary text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--accent-blue)]"
                        required
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSheetId(null);
                            setUrlError('');
                          }}
                          className="px-3 py-2 rounded-lg a1-surface-secondary text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {urlError && (
                      <p className="text-xs text-red-500">{urlError}</p>
                    )}
                  </form>
                ) : (
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[var(--text-secondary)]">
                      Google Sheets link not attached yet
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditor(sheet.id, '')}
                      className="px-3.5 py-2 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/15 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 text-xs font-semibold text-[var(--accent-blue)] hover:bg-[#2563EB]/16 dark:hover:bg-[#8DBBFF]/22 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Attach Google Sheet URL</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
