import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ExternalLink,
  FileQuestion,
  FileText,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { CYCLES, CycleSlug } from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  deleteStoredPdf,
  getAllStoredPdfsForKeys,
  saveStoredPdf,
  StoredPdfRecord,
} from '../utils/pdfStorage';

interface PdfDisplayEntry {
  record: StoredPdfRecord;
  objectUrl: string;
}

const DEFAULT_PAPER_COUNT = 4;
const PAPER_COUNT_STORAGE_KEY = 'a1_academy_pyp_counts_v1';

function loadExtraPaperCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PAPER_COUNT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return {};
}

export const QuestionBankPage: React.FC = () => {
  const [selectedCycle, setSelectedCycle] =
    useState<CycleSlug>('physics-cycle');
  const [paperCounts, setPaperCounts] = useState<Record<string, number>>(() =>
    loadExtraPaperCounts(),
  );
  const [pdfEntries, setPdfEntries] = useState<Record<string, PdfDisplayEntry>>(
    {},
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeUrlsRef = useRef<string[]>([]);

  const activeCycle =
    CYCLES.find((c) => c.slug === selectedCycle) ?? CYCLES[0];

  const storageKeys = useMemo(() => {
    const keys: string[] = [];
    for (const subject of activeCycle.subjects) {
      const subjectKey = `${activeCycle.slug}-${subject.slug}`;
      const count = paperCounts[subjectKey] ?? DEFAULT_PAPER_COUNT;
      for (let i = 1; i <= count; i++) {
        keys.push(`pyp-${subjectKey}-paper-${i}`);
      }
    }
    return keys;
  }, [activeCycle, paperCounts]);

  useEffect(() => {
    let cancelled = false;

    const loadPdfs = async () => {
      const stored = await getAllStoredPdfsForKeys(storageKeys);
      if (cancelled) return;

      for (const oldUrl of activeUrlsRef.current) {
        URL.revokeObjectURL(oldUrl);
      }
      const nextUrls: string[] = [];
      const nextMap: Record<string, PdfDisplayEntry> = {};

      for (const key of storageKeys) {
        const rec = stored[key];
        if (rec) {
          const url = URL.createObjectURL(rec.blob);
          nextUrls.push(url);
          nextMap[key] = { record: rec, objectUrl: url };
        }
      }

      activeUrlsRef.current = nextUrls;
      setPdfEntries(nextMap);
    };

    void loadPdfs();

    return () => {
      cancelled = true;
      for (const url of activeUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
      activeUrlsRef.current = [];
    };
  }, [storageKeys]);

  const handleFileSelected = async (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setUploadError('Please select a valid PDF (.pdf) file.');
      return;
    }

    setUploadError(null);
    const saved = await saveStoredPdf(key, file);
    const nextUrl = URL.createObjectURL(saved.blob);
    activeUrlsRef.current.push(nextUrl);

    setPdfEntries((prev) => {
      const existing = prev[key];
      if (existing) {
        URL.revokeObjectURL(existing.objectUrl);
      }
      return {
        ...prev,
        [key]: { record: saved, objectUrl: nextUrl },
      };
    });
  };

  const handleRemovePdf = async (key: string) => {
    await deleteStoredPdf(key);
    setPdfEntries((prev) => {
      const existing = prev[key];
      if (existing) {
        URL.revokeObjectURL(existing.objectUrl);
      }
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleAddPaperSlot = (subjectKey: string) => {
    setPaperCounts((prev) => {
      const current = prev[subjectKey] ?? DEFAULT_PAPER_COUNT;
      const next = { ...prev, [subjectKey]: current + 1 };
      try {
        localStorage.setItem(PAPER_COUNT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const triggerUploadPicker = (key: string) => {
    setUploadError(null);
    fileInputRefs.current[key]?.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Previous Year Papers' },
        ]}
      />

      <header className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
          <FileQuestion className="w-4 h-4" />
          <span>Previous Year Question Archive</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          PREVIOUS YEAR PAPERS
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Select Chemistry Cycle or Physics Cycle below to access and upload
          previous year question paper PDFs organized by subject.
        </p>
      </header>

      {/* Only Physics Cycle & Chemistry Cycle buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'physics-cycle', label: 'Physics Cycle' },
          { id: 'chemistry-cycle', label: 'Chemistry Cycle' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCycle(tab.id as CycleSlug)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedCycle === tab.id
                ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C]'
                : 'a1-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {uploadError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300"
        >
          {uploadError}
        </div>
      )}

      {/* 6 Related Subjects for the Selected Cycle — Subject names as main headings, paper boxes stacked 1 below the other */}
      <div className="space-y-10">
        {activeCycle.subjects.map((subject) => {
          const subjectKey = `${activeCycle.slug}-${subject.slug}`;
          const count = paperCounts[subjectKey] ?? DEFAULT_PAPER_COUNT;

          return (
            <section key={subjectKey} className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                {subject.name}
              </h2>

              <div className="flex flex-col space-y-2.5 max-w-2xl">
                {Array.from({ length: count }, (_, idx) => {
                  const paperNum = idx + 1;
                  const paperKey = `pyp-${subjectKey}-paper-${paperNum}`;
                  const entry = pdfEntries[paperKey];

                  return (
                    <div
                      key={paperKey}
                      className="flex items-center gap-2.5"
                    >
                      <input
                        ref={(el) => {
                          fileInputRefs.current[paperKey] = el;
                        }}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                          void handleFileSelected(paperKey, e);
                        }}
                        className="sr-only"
                        aria-label={`Upload PDF for ${subject.name} Paper ${paperNum}`}
                      />

                      {entry ? (
                        <a
                          href={entry.objectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline hover:no-underline flex-1 group rounded-xl a1-surface px-4 py-3 flex items-center justify-between gap-3 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 hover:border-[var(--accent-blue)] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                            <span className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                              Paper {paperNum}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] truncate">
                              · {entry.record.fileName}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerUploadPicker(paperKey)}
                          className="text-left flex-1 group rounded-xl a1-surface px-4 py-3 flex items-center justify-between gap-3 hover:border-[var(--accent-blue)] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                            <span className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                              Paper {paperNum}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors">
                            Add / Open PDF
                          </span>
                        </button>
                      )}

                      {entry ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => triggerUploadPicker(paperKey)}
                            title={`Replace PDF for Paper ${paperNum}`}
                            aria-label={`Replace PDF for ${subject.name} Paper ${paperNum}`}
                            className="p-2.5 rounded-xl a1-surface-secondary text-[var(--accent-blue)] hover:border-[var(--accent-blue)] transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void handleRemovePdf(paperKey);
                            }}
                            title={`Remove PDF for Paper ${paperNum}`}
                            aria-label={`Remove PDF for ${subject.name} Paper ${paperNum}`}
                            className="p-2.5 rounded-xl a1-surface-secondary text-red-600 dark:text-red-400 hover:border-red-500/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddPaperSlot(subjectKey)}
                    className="px-3 py-1.5 rounded-lg a1-surface-secondary text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paper {count + 1}</span>
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
