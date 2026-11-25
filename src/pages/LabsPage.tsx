import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { LAB_MODULES } from '../data/globalPagesData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';

export const LabsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Labs' },
        ]}
      />

      <header className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
          <FlaskConical className="w-4 h-4" />
          <span>Laboratory Preparation Hub</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          First-Year Engineering Labs Guide
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Select a laboratory course below to access lab records, codes, model
          graphs, slides, practice programs, and viva preparation.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LAB_MODULES.map((lab, idx) => (
          <Link
            key={lab.id}
            to={`/labs/${lab.slug}`}
            className="group rounded-2xl a1-surface p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-[0_8px_0_0_rgba(37,99,235,0.12),0_18px_36px_-16px_rgba(15,23,42,0.22)] dark:shadow-[0_8px_0_0_rgba(141,187,255,0.12),0_20px_40px_-14px_rgba(8,13,28,0.85)] hover:-translate-y-1 hover:border-[var(--accent-blue)] transition-all duration-200"
          >
            <div className="space-y-4">
              {/* Compact 3D Subject Image Frame */}
              <div className="relative h-40 sm:h-44 w-full rounded-xl overflow-hidden bg-[#080D1C] border border-[#8DBBFF]/25 shadow-inner">
                <SafeImage
                  src={lab.imagePath}
                  alt={`${lab.subjectLabel} 3D laboratory illustration`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D1C]/75 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#8DBBFF] tabular-nums">
                    0{idx + 1} · LAB SUBJECT
                  </span>
                </div>
              </div>

              {/* Subject Title & Special Pointers */}
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                  {lab.subjectLabel}
                </h2>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--accent-blue)]">
                    Includes:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                    {lab.includesPointers.map((pointer) => (
                      <li key={pointer} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                        <span>{pointer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--accent-blue)]">
              <span>Open {lab.subjectLabel} Lab</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl a1-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Looking for exam strategies and subject-by-subject study tips?
        </p>
        <Link
          to="/study-tips?section=subject-tips"
          className="px-4 py-2 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Open Study Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
