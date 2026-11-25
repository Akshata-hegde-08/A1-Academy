import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  FlaskConical,
  HelpCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import { LAB_MODULES } from '../data/globalPagesData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { NotFoundPage } from './NotFoundPage';
import {
  deleteStoredPdf,
  getAllStoredPdfsForKeys,
  saveStoredPdf,
  StoredPdfRecord,
} from '../utils/pdfStorage';

interface QuickPdfOption {
  keySuffix: 'complete-record' | 'viva-questions';
  label: string;
  accent: 'blue' | 'purple';
  icon: typeof BookOpen;
}

const QUICK_PDF_OPTIONS: QuickPdfOption[] = [
  {
    keySuffix: 'complete-record',
    label: 'View complete record',
    accent: 'blue',
    icon: BookOpen,
  },
  {
    keySuffix: 'viva-questions',
    label: 'View all viva questions together',
    accent: 'purple',
    icon: HelpCircle,
  },
];

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

export const LabDetailPage: React.FC = () => {
  const { labSlug } = useParams<{ labSlug: string }>();
  const lab = LAB_MODULES.find((l) => l.slug === labSlug);

  const storageKeys = useMemo(
    () =>
      lab
        ? QUICK_PDF_OPTIONS.map((opt) => `lab-${lab.slug}-${opt.keySuffix}`)
        : [],
    [lab],
  );

  const [pdfEntries, setPdfEntries] = useState<Record<string, PdfDisplayEntry>>(
    {},
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (storageKeys.length === 0) return;
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

  if (!lab) {
    return <NotFoundPage />;
  }

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

  const triggerUploadPicker = (key: string) => {
    setUploadError(null);
    fileInputRefs.current[key]?.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Labs', to: '/labs' },
          { label: `${lab.subjectLabel} Lab` },
        ]}
      />

      {/* Lab Subject Hero */}
      <section className="rounded-2xl a1-surface p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
            <FlaskConical className="w-4 h-4" />
            <span>{lab.cycle} · Laboratory Resources</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {lab.subjectLabel} Lab
          </h1>

          {/* Clickable Experiments / Topics List (No Underline) */}
          <div className="space-y-3 pt-1">
            <h2 className="font-display text-sm sm:text-base font-bold tracking-wider uppercase text-[var(--accent-blue)]">
              {lab.slug === 'chemistry' ? 'EXPERIMENTS :' : 'TOPICS :'}
            </h2>
            <ol className="space-y-2 list-none m-0 p-0">
              {lab.topics.map((topic) => (
                <li key={topic.id}>
                  <Link
                    to={`/labs/${lab.slug}/${topic.slug}`}
                    className="group no-underline hover:no-underline flex items-start justify-between gap-3 rounded-xl px-3.5 py-2.5 a1-surface-secondary border border-transparent hover:border-[var(--accent-blue)]/40 transition-colors"
                  >
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] leading-snug no-underline">
                      <span className="font-mono text-xs font-semibold text-[var(--accent-blue)] mr-2 tabular-nums">
                        {topic.number}.
                      </span>
                      {topic.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-1 flex flex-wrap gap-2">
            <Link
              to="/labs"
              className="no-underline hover:no-underline px-4 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Labs</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-52 sm:h-64 w-full rounded-xl overflow-hidden bg-[#080D1C] border border-[#8DBBFF]/25">
            <SafeImage
              src={lab.imagePath}
              alt={`${lab.subjectLabel} 3D laboratory illustration`}
              className="w-full h-full object-cover"
            />
          </div>
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

      {/* Only 2 Direct PDF Options: View complete record & View all viva questions together */}
      <section aria-label="Lab Quick Views" className="grid grid-cols-1 gap-5">
        {QUICK_PDF_OPTIONS.map((opt) => {
          const key = `lab-${lab.slug}-${opt.keySuffix}`;
          const entry = pdfEntries[key];
          const Icon = opt.icon;
          const isBlue = opt.accent === 'blue';

          const iconWrapClass = isBlue
            ? 'w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/15 border border-[#2563EB]/25 dark:border-[#8DBBFF]/25 flex items-center justify-center shrink-0'
            : 'w-11 h-11 rounded-xl bg-[#6D28D9]/10 dark:bg-[#C4ACFF]/15 border border-[#6D28D9]/25 dark:border-[#C4ACFF]/25 flex items-center justify-center shrink-0';

          const iconColorClass = isBlue
            ? 'w-5 h-5 text-[var(--accent-blue)]'
            : 'w-5 h-5 text-[var(--accent-purple)]';

          const hoverTextClass = isBlue
            ? 'group-hover:text-[var(--accent-blue)]'
            : 'group-hover:text-[var(--accent-purple)]';

          const hoverBorderClass = isBlue
            ? 'hover:border-[var(--accent-blue)]'
            : 'hover:border-[var(--accent-purple)]';

          return (
            <div key={key} className="flex flex-col space-y-2.5">
              <input
                ref={(el) => {
                  fileInputRefs.current[key] = el;
                }}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  void handleFileSelected(key, e);
                }}
                className="sr-only"
                aria-label={`Upload PDF for ${opt.label}`}
              />

              {entry ? (
                <a
                  href={entry.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`no-underline hover:no-underline group rounded-2xl a1-surface p-6 sm:p-7 flex items-center justify-between gap-4 border border-transparent ${hoverBorderClass} a1-glow-hover transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className={iconWrapClass}>
                      <Icon className={iconColorClass} />
                    </div>
                    <span
                      className={`font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] ${hoverTextClass} transition-colors`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <ExternalLink
                    className={`w-5 h-5 text-[var(--text-secondary)] ${hoverTextClass} shrink-0`}
                  />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerUploadPicker(key)}
                  className={`text-left w-full group rounded-2xl a1-surface p-6 sm:p-7 flex items-center justify-between gap-4 border border-transparent ${hoverBorderClass} a1-glow-hover transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className={iconWrapClass}>
                      <Icon className={iconColorClass} />
                    </div>
                    <span
                      className={`font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] ${hoverTextClass} transition-colors`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <ExternalLink
                    className={`w-5 h-5 text-[var(--text-secondary)] ${hoverTextClass} shrink-0`}
                  />
                </button>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pl-1">
                {entry ? (
                  <>
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      PDF ready: {entry.record.fileName} (
                      {formatFileSize(entry.record.size)})
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerUploadPicker(key)}
                      className="px-3 py-1.5 rounded-lg a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                      <span>Replace PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleRemovePdf(key);
                      }}
                      className="px-3 py-1.5 rounded-lg a1-surface-secondary text-xs font-semibold text-red-600 dark:text-red-400 hover:border-red-500/40 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove PDF</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerUploadPicker(key)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add PDF</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
