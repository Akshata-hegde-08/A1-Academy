import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  FlaskConical,
  Trash2,
  Upload,
} from 'lucide-react';
import { LAB_MODULES } from '../data/globalPagesData';
import { CHEM_LAB_FILES } from '../data/labFiles';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NotFoundPage } from './NotFoundPage';
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export const LabTopicPage: React.FC = () => {
  const { labSlug, topicSlug } = useParams<{
    labSlug: string;
    topicSlug: string;
  }>();

  const lab = LAB_MODULES.find((l) => l.slug === labSlug);
  const topic = lab?.topics.find((t) => t.slug === topicSlug);

  const itemIds = useMemo(
    () => (topic ? topic.items.map((item) => item.id) : []),
    [topic],
  );

  const [pdfEntries, setPdfEntries] = useState<Record<string, PdfDisplayEntry>>(
    {},
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadPdfs = async () => {
      const stored = await getAllStoredPdfsForKeys(itemIds);
      if (cancelled) return;

      // Revoke previous object URLs before allocating new ones
      for (const oldUrl of activeUrlsRef.current) {
        URL.revokeObjectURL(oldUrl);
      }
      const nextUrls: string[] = [];
      const nextMap: Record<string, PdfDisplayEntry> = {};

      for (const id of itemIds) {
        const rec = stored[id];
        if (rec) {
          const url = URL.createObjectURL(rec.blob);
          nextUrls.push(url);
          nextMap[id] = { record: rec, objectUrl: url };
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
  }, [itemIds]);

  if (!lab || !topic) {
    return <NotFoundPage />;
  }
  const experimentNumber =
  lab.topics.findIndex((t) => t.slug === topicSlug) + 1;

const hideGraphSections =
  lab.slug === 'chemistry' && [7, 8, 9].includes(Number(topic.number));

const visibleItems = hideGraphSections
  ? topic.items.filter(
      (item) => {const category = item.labCategory.trim().toLowerCase();
                return !category.startsWith('sci') && !category.startsWith('model');
      })
  : topic.items;

  const handleFileSelected = async (
    itemId: string,
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
    const saved = await saveStoredPdf(itemId, file);
    const nextUrl = URL.createObjectURL(saved.blob);
    activeUrlsRef.current.push(nextUrl);

    setPdfEntries((prev) => {
      const existing = prev[itemId];
      if (existing) {
        URL.revokeObjectURL(existing.objectUrl);
      }
      return {
        ...prev,
        [itemId]: { record: saved, objectUrl: nextUrl },
      };
    });
  };

  const handleRemovePdf = async (itemId: string) => {
    await deleteStoredPdf(itemId);
    setPdfEntries((prev) => {
      const existing = prev[itemId];
      if (existing) {
        URL.revokeObjectURL(existing.objectUrl);
      }
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const triggerUploadPicker = (itemId: string) => {
    setUploadError(null);
    fileInputRefs.current[itemId]?.click();
  };

  const backLabel =
    lab.slug === 'chemistry'
      ? 'Back to Chemistry Lab Experiments'
      : `Back to ${lab.subjectLabel} Lab Topics`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Labs', to: '/labs' },
          { label: `${lab.subjectLabel} Lab`, to: `/labs/${lab.slug}` },
          { label: topic.title },
        ]}
      />

      {/* Topic Header */}
      <section className="rounded-2xl a1-surface p-6 sm:p-8 flex flex-col space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
          <FlaskConical className="w-4 h-4" />
          <span>
            {lab.subjectLabel} Lab ·{' '}
            {lab.slug === 'chemistry' ? 'Experiment' : 'Topic'} {topic.number}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
          {topic.title}
        </h1>

        <div className="pt-1">
          <Link
            to={`/labs/${lab.slug}`}
            className="no-underline hover:no-underline px-4 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </section>

      {uploadError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300"
        >
          {uploadError}
        </div>
      )}

      {/* Topic Sections — Headings outside the box, single-line "Click to open PDF" box, 1 section per row */}
      <div className="flex flex-col space-y-8">
        {visibleItems.map((item) => {
          const entry = pdfEntries[item.id];
          const files = lab.slug === 'chemistry' ? CHEM_LAB_FILES[Number(topic.number)] : undefined;
          const category = item.labCategory.trim().toLowerCase();
          const builtInFiles = category.startsWith('sci') ? files?.scilab?? [] : category.startsWith('model')? files?.graphs ?? [] : category.startsWith('record') && files?.record? [{ label: 'Record ',url: files.record}] : [];
          return (
            <section
              key={item.id}
              aria-labelledby={`section-${item.id}`}
              className="flex flex-col space-y-3"
            >
              {/* Eye-catching Main Heading OUTSIDE the box */}
              <h2
                id={`section-${item.id}`}
                className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] dark:from-[#8DBBFF] dark:via-[#A5B4FC] dark:to-[#C4ACFF] bg-clip-text text-transparent"
              >
                {item.labCategory}
              </h2>

              {/* Hidden PDF input for this section */}
              <input
                ref={(el) => {
                  fileInputRefs.current[item.id] = el;
                }}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  void handleFileSelected(item.id, e);
                }}
                className="sr-only"
                aria-label={`Upload PDF for ${item.labCategory}`}
              />

              {/* Single-line Clickable Box */}
{builtInFiles.length > 0 ? (
  <div className="flex flex-col gap-3">
    {builtInFiles.map((file) => (
      <a
        key={file.url}
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline hover:no-underline group rounded-2xl a1-surface p-6 sm:p-7 border border-[var(--border-subtle)] hover:border-[var(--accent-blue)] transition-all flex items-center justify-between gap-4"
      >
        <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold text-[var(--text-primary)]">
          <FileText className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
          <span>Click to open {file.label}</span>
        </span>
        <ExternalLink className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
      </a>
    ))}
  </div>
) : entry ? (
                <a
                  href={entry.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:no-underline group rounded-2xl a1-surface p-6 sm:p-7 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 hover:border-[var(--accent-blue)] transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                    <FileText className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
                    <span>Click to open PDF</span>
                  </span>
                  <ExternalLink className="w-5 h-5 text-[var(--accent-blue)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerUploadPicker(item.id)}
                  className="text-left group rounded-2xl a1-surface p-6 sm:p-7 border border-[var(--border-subtle)] hover:border-[var(--accent-blue)] transition-all flex items-center justify-between gap-4 cursor-pointer w-full"
                >
                  <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                    <FileText className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
                    <span>Click to open</span>
                  </span>
                  <ExternalLink className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] shrink-0 transition-colors" />
                </button>
              )}

              {/* Direct access to add / replace / remove PDF for this section */}
              <div className={builtInFiles.length > 0? 'hidden' : 'flex flex-col items-start gap-2 pt-1'}>
                {entry ? (
                  <>
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      Uploaded: {entry.record.fileName} (
                      {formatFileSize(entry.record.size)})
                    </span>
                    <div className="flex flex-col items-start gap-2">
                      <button
                        type="button"
                        onClick={() => triggerUploadPicker(item.id)}
                        className="px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                        <span>Replace PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void handleRemovePdf(item.id);
                        }}
                        className="px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-red-600 dark:text-red-400 hover:border-red-500/40 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove PDF</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerUploadPicker(item.id)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add PDF</span>
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
