import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Info,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface SubjectRow {
  id: string;
  name: string;
  credits: string;
  gradePoint: string;
}

const STORAGE_KEY = 'a1_academy_cgpa_state';

const DEFAULT_ROWS: SubjectRow[] = [
  { id: 'row-1', name: 'Engineering Mathematics', credits: '4', gradePoint: '9' },
  { id: 'row-2', name: 'Engineering Physics / Chemistry', credits: '4', gradePoint: '8' },
  { id: 'row-3', name: 'Python Programming', credits: '3', gradePoint: '9' },
  { id: 'row-4', name: 'Core Engineering Elective', credits: '3', gradePoint: '8' },
];

export const CgpaCalculatorPage: React.FC = () => {
  const [semester, setSemester] = useState<string>('Semester 1');
  const [rows, setRows] = useState<SubjectRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.rows) && parsed.rows.length > 0) {
          return parsed.rows;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_ROWS;
  });

  const [prevCgpa, setPrevCgpa] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).prevCgpa ?? '';
    } catch {
      // Ignore
    }
    return '';
  });

  const [prevCredits, setPrevCredits] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).prevCredits ?? '';
    } catch {
      // Ignore
    }
    return '';
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ semester, rows, prevCgpa, prevCredits }),
      );
    } catch {
      // Ignore storage errors
    }
  }, [semester, rows, prevCgpa, prevCredits]);

  const addSubject = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        name: `Subject ${prev.length + 1}`,
        credits: '3',
        gradePoint: '8',
      },
    ]);
  };

  const removeSubject = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (
    id: string,
    field: 'name' | 'credits' | 'gradePoint',
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleReset = () => {
    setSemester('Semester 1');
    setRows(DEFAULT_ROWS);
    setPrevCgpa('');
    setPrevCredits('');
  };

  const calculation = useMemo(() => {
    const errors: string[] = [];
    let currentCredits = 0;
    let currentWeighted = 0;

    rows.forEach((row, index) => {
      const c = Number(row.credits);
      const gp = Number(row.gradePoint);

      if (row.credits.trim() === '' || Number.isNaN(c) || c <= 0 || c > 20) {
        errors.push(
          `Row ${index + 1} (${row.name || 'Subject'}): enter valid credits between 0.5 and 20.`,
        );
      }
      if (
        row.gradePoint.trim() === '' ||
        Number.isNaN(gp) ||
        gp < 0 ||
        gp > 10
      ) {
        errors.push(
          `Row ${index + 1} (${row.name || 'Subject'}): enter a grade point between 0 and 10.`,
        );
      }

      if (
        !Number.isNaN(c) &&
        c > 0 &&
        c <= 20 &&
        !Number.isNaN(gp) &&
        gp >= 0 &&
        gp <= 10
      ) {
        currentCredits += c;
        currentWeighted += c * gp;
      }
    });

    const sgpa = currentCredits > 0 ? currentWeighted / currentCredits : null;

    let cumulativeCgpa: number | null = sgpa;
    let totalCombinedCredits = currentCredits;

    const hasPrevCgpa = prevCgpa.trim() !== '';
    const hasPrevCredits = prevCredits.trim() !== '';

    if (hasPrevCgpa !== hasPrevCredits) {
      errors.push(
        'Enter both Previous CGPA and Previous Completed Credits, or leave both blank.',
      );
    } else if (hasPrevCgpa && hasPrevCredits) {
      const pc = Number(prevCgpa);
      const pcr = Number(prevCredits);
      if (Number.isNaN(pc) || pc < 0 || pc > 10) {
        errors.push('Previous CGPA must be between 0 and 10.');
      }
      if (Number.isNaN(pcr) || pcr <= 0) {
        errors.push('Previous completed credits must be greater than 0.');
      }
      if (
        !Number.isNaN(pc) &&
        pc >= 0 &&
        pc <= 10 &&
        !Number.isNaN(pcr) &&
        pcr > 0 &&
        currentCredits > 0
      ) {
        totalCombinedCredits = pcr + currentCredits;
        cumulativeCgpa =
          (pc * pcr + currentWeighted) / totalCombinedCredits;
      }
    }

    return {
      errors,
      currentCredits,
      currentWeighted,
      sgpa,
      cumulativeCgpa,
      totalCombinedCredits,
    };
  }, [rows, prevCgpa, prevCredits]);

  const handleCopyResult = async () => {
    if (calculation.sgpa === null) return;
    const summary = [
      `A1 ACADEMY — ${semester} Result Summary`,
      `Semester Credits: ${calculation.currentCredits}`,
      `SGPA: ${calculation.sgpa.toFixed(2)}`,
      calculation.cumulativeCgpa !== null
        ? `Cumulative CGPA: ${calculation.cumulativeCgpa.toFixed(2)} (Total Credits: ${calculation.totalCombinedCredits})`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'CGPA Calculator' },
        ]}
      />

      <header className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          Academic Planning Utility
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          SGPA &amp; CGPA Calculator
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Calculate your semester SGPA and cumulative CGPA using credit-weighted
          grade points.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Input Form */}
        <div className="lg:col-span-8 rounded-2xl a1-surface p-6 sm:p-8 space-y-6">
          {/* Semester & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label
                htmlFor="semester-select"
                className="block text-xs font-semibold text-[var(--text-secondary)]"
              >
                Select Semester
              </label>
              <select
                id="semester-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
              >
                {Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`).map(
                  (sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Subject Rows */}
          <div className="space-y-3">
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-1 text-xs font-semibold text-[var(--text-secondary)]">
              <span className="sm:col-span-6">Subject Name</span>
              <span className="sm:col-span-2">Credits</span>
              <span className="sm:col-span-3">Grade Point (0–10)</span>
              <span className="sm:col-span-1 text-right">Remove</span>
            </div>

            {rows.map((row, index) => (
              <div
                key={row.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-0 rounded-xl a1-surface-secondary sm:bg-transparent sm:border-0"
              >
                <div className="sm:col-span-6">
                  <label className="sm:hidden block text-xs text-[var(--text-secondary)] mb-1">
                    Subject {index + 1}
                  </label>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    aria-label={`Subject ${index + 1} name`}
                    className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="sm:hidden block text-xs text-[var(--text-secondary)] mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={row.credits}
                    onChange={(e) =>
                      updateRow(row.id, 'credits', e.target.value)
                    }
                    aria-label={`Subject ${index + 1} credits`}
                    className="w-full rounded-xl a1-surface-secondary px-3 py-2.5 text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="sm:hidden block text-xs text-[var(--text-secondary)] mb-1">
                    Grade Point (0–10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={row.gradePoint}
                    onChange={(e) =>
                      updateRow(row.id, 'gradePoint', e.target.value)
                    }
                    aria-label={`Subject ${index + 1} grade point`}
                    className="w-full rounded-xl a1-surface-secondary px-3 py-2.5 text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    disabled={rows.length <= 1}
                    onClick={() => removeSubject(row.id)}
                    aria-label={`Remove ${row.name || 'subject'}`}
                    className="w-9 h-9 rounded-lg a1-surface-secondary flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 disabled:opacity-35 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Previous Cumulative Inputs */}
          <div className="pt-5 border-t border-[var(--border-subtle)] space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--text-primary)]">
                Previous Semesters (Optional for Cumulative CGPA)
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Leave blank if calculating only Semester 1 SGPA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="prev-cgpa"
                  className="block text-xs font-medium text-[var(--text-secondary)]"
                >
                  Previous CGPA (0–10)
                </label>
                <input
                  id="prev-cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={prevCgpa}
                  onChange={(e) => setPrevCgpa(e.target.value)}
                  placeholder="e.g. 8.45"
                  className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="prev-credits"
                  className="block text-xs font-medium text-[var(--text-secondary)]"
                >
                  Previous Completed Credits
                </label>
                <input
                  id="prev-credits"
                  type="number"
                  min="1"
                  step="0.5"
                  value={prevCredits}
                  onChange={(e) => setPrevCredits(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full rounded-xl a1-surface-secondary px-3.5 py-2.5 text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                />
              </div>
            </div>
          </div>

          {/* Validation Alerts */}
          {calculation.errors.length > 0 && (
            <div
              role="alert"
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please check your inputs:</span>
              </div>
              <ul className="text-xs text-amber-700 dark:text-amber-200 list-disc pl-5 space-y-1">
                {calculation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Live Result Panel */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl a1-surface p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                Calculated Results
              </h2>
              <span className="text-xs font-medium text-[var(--accent-blue)]">
                {semester}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl a1-surface-secondary p-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  Current SGPA
                </p>
                <p className="mt-1 font-display text-3xl font-bold font-mono tabular-nums text-[var(--accent-blue)]">
                  {calculation.errors.length === 0 && calculation.sgpa !== null
                    ? calculation.sgpa.toFixed(2)
                    : '—'}
                </p>
              </div>

              <div className="rounded-xl a1-surface-secondary p-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  Cumulative CGPA
                </p>
                <p className="mt-1 font-display text-3xl font-bold font-mono tabular-nums text-[var(--accent-purple)]">
                  {calculation.errors.length === 0 &&
                  calculation.cumulativeCgpa !== null
                    ? calculation.cumulativeCgpa.toFixed(2)
                    : '—'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
              <div className="flex justify-between">
                <span>Semester Credits</span>
                <span className="font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                  {calculation.currentCredits}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Weighted Grade Points</span>
                <span className="font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                  {calculation.currentWeighted.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Cumulative Credits</span>
                <span className="font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                  {calculation.totalCombinedCredits}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={
                calculation.errors.length > 0 || calculation.sgpa === null
              }
              onClick={handleCopyResult}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied Result</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Result Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Formula & Regulation Disclaimer */}
          <div className="rounded-2xl a1-surface p-5 space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
              <Info className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
              <span>Formula &amp; University Regulations</span>
            </div>
            <p className="font-mono text-[11px] text-[var(--text-primary)] bg-black/5 dark:bg-white/5 p-2.5 rounded-lg">
              SGPA = Σ(Credits × Grade Points) / Total Semester Credits
            </p>
            <p className="font-mono text-[11px] text-[var(--text-primary)] bg-black/5 dark:bg-white/5 p-2.5 rounded-lg">
              CGPA = (Prev CGPA × Prev Credits + Curr Weighted) / Total Credits
            </p>
            <p>
              NOTE : Grade-point mappings (S = 10, A = 9, B = 8, C = 7, D = 6,
              E = 5, F = 0)
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
