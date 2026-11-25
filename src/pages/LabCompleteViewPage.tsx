import React, { useEffect, useRef, useState } from 'react';
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
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NotFoundPage } from './NotFoundPage';
import {
  deleteStoredPdf,
  getAllStoredPdfsForKeys,
  saveStoredPdf,
  StoredPdfRecord,
} from '../utils/pdfStorage';

interface LabCompleteViewPageProps {
  mode: 'complete-record' | 'viva-questions';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export const LabCompleteViewPage: React.FC<LabCompleteViewPageProps> = ({
  mode,
}) => {
  const { labSlug } = useParams<{ labSlug: string }>();
  const lab = LAB_MODULES.find((l) => l.slug === labSlug);

  const storageKey = lab ? `lab-${lab.slug}-${mode}` : '';

  const [pdfEntry, setPdfEntry] = useState<{
    record: StoredPdfRecord;
    objectUrl: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!storageKey) return;
    let cancelled = false;

    const load = async () => {
      const stored = await getAllStoredPdfsForKeys([storageKey]);
      if (cancelled) return;

      if (activeUrlRef.current) {
        URL.revokeObjectURL(activeUrlRef.current);
        activeUrlRef.current = null;
      }

      const rec = stored[storageKey];
      if (rec) {
        const url = URL.createObjectURL(rec.blob);
        activeUrlRef.current = url;
        setPdfEntry({ record: rec, objectUrl: url });
      } else {
        setPdfEntry(null);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (activeUrlRef.current) {
        URL.revokeObjectURL(activeUrlRef.current);
        activeUrlRef.current = null;
      }
    };
  }, [storageKey]);

  if (!lab) {
    return <NotFoundPage />;
  }

  const isRecordMode = mode === 'complete-record';
  const pageTitle = isRecordMode
    ? 'Complete Lab Record'
    : 'All Viva Questions';

  const handleFileChange = async (
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
    const saved = await saveStoredPdf(storageKey, file);
    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current);
    }
    const nextUrl = URL.createObjectURL(saved.blob);
    activeUrlRef.current = nextUrl;
    setPdfEntry({ record: saved, objectUrl: nextUrl });
  };

  const handleRemove = async () => {
    await deleteStoredPdf(storageKey);
    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current);
      activeUrlRef.current = null;
    }
    setPdfEntry(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Labs', to: '/labs' },
          { label: `${lab.subjectLabel} Lab`, to: `/labs/${lab.slug}` },
          { label: pageTitle },
        ]}
      />

      {/* Header */}
      <section className="rounded-2xl a1-surface p-6 sm:p-8 flex flex-col space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
          <FlaskConical className="w-4 h-4" />
          <span>{lab.subjectLabel} Lab</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {lab.subjectLabel} Lab — {pageTitle}
        </h1>

        <div className="pt-1">
          <Link
            to={`/labs/${lab.slug}`}
            className="no-underline hover:no-underline px-4 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {lab.subjectLabel} Lab</span>
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

      {/* Full PDF Upload / Open Box */}
      <section className="flex flex-col space-y-3">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] dark:from-[#8DBBFF] dark:via-[#A5B4FC] dark:to-[#C4ACFF] bg-clip-text text-transparent">
          {isRecordMode ? 'Complete Record PDF' : 'All Viva Questions PDF'}
        </h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => {
            void handleFileChange(e);
          }}
          className="sr-only"
          aria-label={`Upload ${pageTitle} PDF`}
        />

        {pdfEntry ? (
          <a
            href={pdfEntry.objectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline group rounded-2xl a1-surface p-6 sm:p-7 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 hover:border-[var(--accent-blue)] transition-all flex items-center justify-between gap-4 cursor-pointer"
          >
            <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
              <FileText className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
              <span>Click to open PDF</span>
            </span>
            <ExternalLink className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              fileInputRef.current?.click();
            }}
            className="text-left group rounded-2xl a1-surface p-6 sm:p-7 border border-[var(--border-subtle)] hover:border-[var(--accent-blue)] transition-all flex items-center justify-between gap-4 cursor-pointer w-full"
          >
            <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
              <FileText className="w-5 h-5 text-[var(--accent-blue)] shrink-0" />
              <span>Click to open PDF</span>
            </span>
            <ExternalLink className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] shrink-0" />
          </button>
        )}

        <div className="flex flex-col items-start gap-2 pt-1">
          {pdfEntry ? (
            <>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Uploaded: {pdfEntry.record.fileName} (
                {formatFileSize(pdfEntry.record.size)})
              </span>
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  fileInputRef.current?.click();
                }}
                className="px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                <span>Replace PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleRemove();
                }}
                className="px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-red-600 dark:text-red-400 hover:border-red-500/40 inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove PDF</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUploadError(null);
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add PDF</span>
            </button>
          )}
        </div>
      </section>

      {/* Topic-by-topic compiled content stacked vertically one below the other */}
      <div className="flex flex-col space-y-6">
        {lab.topics.map((topic) => {
          const matchedItem = isRecordMode
            ? topic.items.find((i) =>
                ['Record', 'Programs', 'Slides'].includes(i.labCategory),
              ) || topic.items[0]
            : topic.items.find((i) =>
                [
                  'Viva questions',
                  'Important lab questions',
                  'HackerRank challenge questions',
                ].includes(i.labCategory),
              ) || topic.items[topic.items.length - 1];

          return (
            <article
              key={topic.id}
              className="rounded-2xl a1-surface p-6 sm:p-7 flex flex-col space-y-4"
            >
              <span className="font-mono text-xs font-semibold text-[var(--accent-blue)]">
                {lab.slug === 'chemistry' ? 'EXPERIMENT' : 'TOPIC'} {topic.number}
              </span>

              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {topic.title}
              </h3>

              {matchedItem && (
                <>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {matchedItem.description}
                  </p>

                  {matchedItem.previewPages?.map((page, idx) => (
                    <div
                      key={`${topic.id}-p-${idx}`}
                      className="rounded-xl a1-surface-secondary p-4 flex flex-col space-y-3"
                    >
                      <ul className="flex flex-col space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5 m-0">
                        {page.bullets.map((b, bIdx) => (
                          <li key={`${topic.id}-b-${bIdx}`} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>

                      {page.formulaOrCode && (
                        <pre className="w-full overflow-x-auto rounded-lg bg-[#080D1C] text-[#F1F5FF] border border-[#8DBBFF]/25 p-3.5 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                          <code>{page.formulaOrCode}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </>
              )}
            </article>
          );
        })}

        {!isRecordMode && lab.vivaTopics.length > 0 && (
          <article className="rounded-2xl a1-surface p-6 sm:p-7 flex flex-col space-y-3">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              General {lab.subjectLabel} Lab Viva Concepts
            </h3>
            <ul className="flex flex-col space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5 m-0">
              {lab.vivaTopics.map((viva, idx) => (
                <li key={idx} className="leading-relaxed">
                  {viva}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </div>
  );
};
