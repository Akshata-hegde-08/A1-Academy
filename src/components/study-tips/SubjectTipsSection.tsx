import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookMarked,
  Calculator,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Flame,
  Layers,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { SUBJECT_GUIDES, SubjectGuidance } from '../../data/studyTips';

const STRATEGY_CARDS: {
  key: keyof Pick<
    SubjectGuidance,
    | 'numericalGuidance'
    | 'isaStrategy'
    | 'esaStrategy'
    | 'highGradeStrategy'
    | 'passStrategy'
    | 'timeManagementTip'
  >;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    key: 'numericalGuidance',
    label: 'Numerical & Problem Practice',
    icon: Calculator,
  },
  {
    key: 'isaStrategy',
    label: 'ISA Preparation Strategy',
    icon: Target,
  },
  {
    key: 'esaStrategy',
    label: 'ESA Preparation Strategy',
    icon: BookMarked,
  },
  {
    key: 'highGradeStrategy',
    label: 'How to Prepare for a High Grade',
    icon: Flame,
  },
  {
    key: 'passStrategy',
    label: 'If You Just Want to Pass',
    icon: CheckCircle2,
  },
  {
    key: 'timeManagementTip',
    label: 'Time Management & Revision',
    icon: Timer,
  },
];

export const SubjectTipsSection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject');

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (
      initialSubject &&
      SUBJECT_GUIDES.some((s) => s.id === initialSubject)
    ) {
      return initialSubject;
    }
    return SUBJECT_GUIDES[0].id;
  });

  useEffect(() => {
    if (
      initialSubject &&
      SUBJECT_GUIDES.some((s) => s.id === initialSubject)
    ) {
      setSelectedId(initialSubject);
    }
  }, [initialSubject]);

  const activeSubject =
    SUBJECT_GUIDES.find((s) => s.id === selectedId) || SUBJECT_GUIDES[0];

  return (
    <section
      id="subject-tips"
      aria-labelledby="subject-tips-heading"
      className="scroll-mt-32 space-y-8"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--accent-purple)]">
          Section 02 · Senior-to-Junior Playbook
        </p>
        <h2
          id="subject-tips-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
        >
          Let&apos;s Crack These Subjects.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
          Choose your subject to explore preparation strategies, important
          topics and exam tips.
        </p>
      </div>

      {/* Subject Selector */}
      <div
        role="tablist"
        aria-label="Select first-year engineering subject"
        className="flex flex-wrap gap-2"
      >
        {SUBJECT_GUIDES.map((subject) => {
          const isActive = subject.id === activeSubject.id;
          return (
            <button
              key={subject.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedId(subject.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] border-transparent shadow-sm'
                  : 'a1-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
              }`}
            >
              <span>{subject.name}</span>
              {!subject.hasFullGuide && (
                <span
                  className={`text-[10px] font-medium ${
                    isActive
                      ? 'text-white/85 dark:text-[#080D1C]/75'
                      : 'text-[var(--text-secondary)] opacity-75'
                  }`}
                >
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Subject Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl a1-surface p-5 sm:p-8 space-y-8"
        >
          {/* Subject Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--text-secondary)]">
                {activeSubject.creditBadge && (
                  <span className="text-[var(--accent-blue)] font-semibold">
                    {activeSubject.creditBadge}
                  </span>
                )}
                {activeSubject.creditBadge && <span aria-hidden="true">·</span>}
                <span>
                  {activeSubject.hasFullGuide
                    ? 'Complete Study Guide'
                    : 'Guide In Progress'}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                {activeSubject.name}
              </h3>
            </div>
          </div>

          {activeSubject.hasFullGuide ? (
            <div className="space-y-8">
              {/* Senior Introduction */}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                {activeSubject.overview}
              </p>

              {/* Numbered Core Tips (Chemistry & Mechanics) */}
              {activeSubject.numberedTips && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                    <Compass className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span>Core Preparation Advice</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSubject.numberedTips.map((tipBlock) => (
                      <div
                        key={tipBlock.title}
                        className={`rounded-xl a1-surface-secondary p-5 space-y-3 ${
                          tipBlock.miniCards ? 'md:col-span-2' : ''
                        }`}
                      >
                        <div className="flex items-baseline gap-2.5">
                          {tipBlock.number && (
                            <span className="font-mono text-xs font-bold text-[var(--accent-blue)] tabular-nums">
                              {tipBlock.number}.
                            </span>
                          )}
                          <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
                            {tipBlock.title}
                          </h4>
                        </div>

                        <div className="space-y-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                          {tipBlock.body.map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>

                        {tipBlock.miniCards && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                            {tipBlock.miniCards.map((idea, idx) => (
                              <div
                                key={idea}
                                className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 space-y-1"
                              >
                                <span className="font-mono text-[11px] font-semibold text-[var(--accent-purple)] tabular-nums">
                                  0{idx + 1}
                                </span>
                                <p className="font-display text-sm font-bold text-[var(--text-primary)]">
                                  {idea}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit-Wise Preparation Grid (EPD) */}
              {activeSubject.unitTips && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                    <Layers className="w-4 h-4 text-[var(--accent-purple)]" />
                    <span>Unit-Wise Preparation Guide</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSubject.unitTips.map((unit) => (
                      <div
                        key={unit.unitLabel}
                        className="rounded-xl a1-surface-secondary p-5 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                          <h4 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                            {unit.unitLabel} – {unit.title}
                          </h4>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {unit.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consistent Structured Strategy Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span>Exam &amp; Revision Breakdown</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STRATEGY_CARDS.map((card) => {
                    const value = activeSubject[card.key];
                    if (!value) return null;
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.key}
                        className="rounded-xl a1-surface-secondary p-5 space-y-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                          <h5 className="font-display text-sm font-bold text-[var(--text-primary)]">
                            {card.label}
                          </h5>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Polished Coming Soon Structure for Remaining 8 Subjects */
            <div className="space-y-6">
              <div className="rounded-xl a1-surface-secondary p-6 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-purple)]">
                  <Clock className="w-4 h-4" />
                  <span>Subject Guide Coming Soon</span>
                </div>
                <h4 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  {activeSubject.overview}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  I am putting together clear, practical tips for{' '}
                  {activeSubject.name} in this same format so you can jump right
                  into the important areas before exams.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  Planned sections for {activeSubject.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {(activeSubject.plannedCategories || []).map((cat, idx) => (
                    <div
                      key={cat}
                      className="rounded-xl a1-surface-secondary p-4 flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-bold text-[var(--accent-blue)] tabular-nums mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {cat}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                          Will be added soon
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
