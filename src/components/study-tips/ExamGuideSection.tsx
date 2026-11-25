import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  BarChart3,
  BookOpenCheck,
  ChevronDown,
  ClipboardList,
  Clock,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Info,
  Layers,
  MonitorCheck,
} from 'lucide-react';
import {
  CREDIT_GROUPS,
  ImportantTerm,
  IMPORTANT_TERMS,
  MARK_DISTRIBUTION_ROWS,
} from '../../data/studyTips';

const TERM_ICONS: Record<ImportantTerm['id'], React.ElementType> = {
  isa: FileCheck2,
  esa: GraduationCap,
  assignment: ClipboardList,
  lab: FlaskConical,
};

export const ExamGuideSection: React.FC = () => {
  const [isaExpanded, setIsaExpanded] = useState<boolean>(true);
  const [esaExpanded, setEsaExpanded] = useState<boolean>(true);

  return (
    <section
      id="exam-guide"
      aria-labelledby="exam-guide-heading"
      className="scroll-mt-32 space-y-10"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          Section 01 · Assessment System
        </p>
        <h2
          id="exam-guide-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
        >
          All About Marks &amp; Exams
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
          Understand the assessment system before you start preparing.
        </p>
      </div>

      {/* A. Important Terms */}
      <div className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          A. Important Terms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IMPORTANT_TERMS.map((item) => {
            const Icon = TERM_ICONS[item.id] || BookOpenCheck;
            return (
              <div
                key={item.id}
                className="rounded-2xl a1-surface p-5 space-y-3 a1-glow-hover"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/20 dark:border-[#8DBBFF]/25 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[var(--accent-blue)]" />
                  </span>
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">
                    {item.fullName}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    {item.term}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* B. Know Your Credit Groups */}
      <div className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          B. Know Your Credit Groups
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_GROUPS.map((group) => {
            const accentStyles =
              group.accent === 'blue'
                ? 'bg-[#2563EB]/10 dark:bg-[#8DBBFF]/14 text-[#2563EB] dark:text-[#8DBBFF] border-[#2563EB]/25 dark:border-[#8DBBFF]/30'
                : group.accent === 'purple'
                  ? 'bg-[#6D28D9]/10 dark:bg-[#C4ACFF]/14 text-[#6D28D9] dark:text-[#C4ACFF] border-[#6D28D9]/25 dark:border-[#C4ACFF]/30'
                  : 'bg-[#0D9488]/10 dark:bg-[#5EEAD4]/12 text-[#0F766E] dark:text-[#5EEAD4] border-[#0D9488]/25 dark:border-[#5EEAD4]/30';

            return (
              <div
                key={group.id}
                className="rounded-2xl a1-surface p-5 sm:p-6 flex flex-col justify-between gap-4 a1-glow-hover"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold font-mono tabular-nums ${accentStyles}`}
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{group.credits} CREDITS</span>
                  </div>
                  <Layers className="w-4 h-4 text-[var(--text-secondary)] opacity-70" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    {group.label}
                  </h4>
                  <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                    {group.subjects}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. Mark Distribution */}
      <div className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          C. Mark Distribution
        </h3>

        <div className="rounded-2xl a1-surface p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Mark Distribution
            </h4>
            <span className="text-xs text-[var(--text-secondary)]">
              Standard marks breakdown &amp; reduced weightage
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="a1-surface-secondary border-b border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">
                    EXAM
                  </th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                    Maximum Marks
                  </th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                    Reduced Marks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {MARK_DISTRIBUTION_ROWS.map((row) => (
                  <tr
                    key={row.exam}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[var(--text-primary)]">
                      {row.exam}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono tabular-nums text-[var(--text-secondary)]">
                      {row.maximumMarks}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono tabular-nums font-semibold text-[var(--accent-blue)]">
                      {row.reducedMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Highlighted Assessment Formula */}
          <div className="rounded-xl bg-[#2563EB]/8 dark:bg-[#8DBBFF]/10 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 px-4 py-4 sm:px-6 text-center">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Final Assessment Formula
            </p>
            <p className="font-display text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)]">
              ISA (50%) + ESA (50%) + ASSIGNMENT + LAB
            </p>
          </div>

          {/* Important Notes */}
          <div className="rounded-xl a1-surface-secondary p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Info className="w-4 h-4 text-[var(--accent-purple)] shrink-0" />
              <span>Important Notes</span>
            </div>
            <div className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                <span className="font-semibold text-[var(--text-primary)]">
                  (a)
                </span>{' '}
                LAB is included only for 5-credit subjects.
              </p>
              <div>
                <p>
                  <span className="font-semibold text-[var(--text-primary)]">
                    (b)
                  </span>{' '}
                  For 2-credit subjects:
                </p>
                <ul className="mt-1.5 pl-6 list-disc space-y-1">
                  <li>ISA is in MCQ format and carries 30 marks.</li>
                  <li>ESA carries 50 marks.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D. Become Familiar With the Exam Pattern */}
      <div className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          D. Become Familiar With the Exam Pattern
        </h3>

        <div className="space-y-4">
          {/* ISA Expandable Card */}
          <div className="rounded-2xl a1-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setIsaExpanded((prev) => !prev)}
              aria-expanded={isaExpanded}
              className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#2563EB]/12 dark:bg-[#8DBBFF]/15 border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 flex items-center justify-center shrink-0">
                  <MonitorCheck className="w-5 h-5 text-[var(--accent-blue)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--accent-blue)]">
                    Hybrid Examination Format
                  </p>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate">
                    ISA – Internal Semester Assessment
                  </h4>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[var(--accent-blue)] shrink-0 transition-transform duration-200 ${
                  isaExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isaExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="px-5 sm:px-6 pb-6 pt-2 border-t border-[var(--border-subtle)] space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3">
                    {/* Pattern Details */}
                    <div className="lg:col-span-7 space-y-3">
                      <ul className="space-y-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span>
                            There are two ISAs. Each ISA covers the 2 units from
                            each subject.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span>Conducted in hybrid mode.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <div className="space-y-1.5">
                            <span>Includes:</span>
                            <ul className="pl-5 list-disc space-y-1 text-[var(--text-primary)] font-medium">
                              <li>1-mark MCQs</li>
                              <li>2-mark MCQs</li>
                              <li>4-mark theory/numerical questions</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span>
                            All MCQs are single-correct-answer-type questions.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span className="font-medium text-[var(--text-primary)]">
                            There is no negative marking for MCQs.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span>
                            It is mandatory to answer MCQ questions on the
                            system (computer) only.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] shrink-0" />
                          <span>
                            Answers to 4-mark questions can be written either on
                            the system itself or in the provided answer
                            booklets.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Results & Performance Subsection */}
                    <div className="lg:col-span-5 rounded-xl a1-surface-secondary p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[var(--accent-purple)] shrink-0" />
                        <h5 className="font-display text-base font-bold text-[var(--text-primary)]">
                          Results &amp; Performance
                        </h5>
                      </div>

                      <div className="space-y-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                        <p>
                          ISA results will be announced within a week of exam
                          completion. You can view your results in the PESU
                          Academy app.
                        </p>
                        <p>
                          You will also be able to compare your results with
                          others through graphs. You can see how many students
                          have scored better than you and how many have scored
                          less.
                        </p>
                      </div>

                      {/* Clean Illustrative Score Distribution Graph */}
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-secondary)]">
                          <span>Illustrative Score Distribution</span>
                          <span className="text-[var(--accent-blue)]">
                            PESU Academy View
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 280 96"
                          className="w-full h-24 overflow-visible"
                          role="img"
                          aria-label="Illustrative score comparison curve showing lower vs higher student counts"
                        >
                          <defs>
                            <linearGradient
                              id="isaDistGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#8DBBFF"
                                stopOpacity="0.38"
                              />
                              <stop
                                offset="100%"
                                stopColor="#8DBBFF"
                                stopOpacity="0.02"
                              />
                            </linearGradient>
                          </defs>
                          <line
                            x1="12"
                            y1="78"
                            x2="268"
                            y2="78"
                            stroke="currentColor"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                          />
                          <path
                            d="M 16 78 C 52 76, 74 60, 102 36 C 122 18, 146 14, 166 24 C 194 38, 224 72, 264 78 Z"
                            fill="url(#isaDistGrad)"
                          />
                          <path
                            d="M 16 78 C 52 76, 74 60, 102 36 C 122 18, 146 14, 166 24 C 194 38, 224 72, 264 78"
                            fill="none"
                            stroke="#8DBBFF"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="176"
                            y1="14"
                            x2="176"
                            y2="78"
                            stroke="#C4ACFF"
                            strokeWidth="1.75"
                            strokeDasharray="3 3"
                          />
                          <circle
                            cx="176"
                            cy="29"
                            r="4"
                            fill="#C4ACFF"
                          />
                          <text
                            x="92"
                            y="91"
                            textAnchor="middle"
                            fontSize="9"
                            fill="currentColor"
                            opacity="0.68"
                          >
                            Scored Less
                          </text>
                          <text
                            x="176"
                            y="10"
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="600"
                            fill="#C4ACFF"
                          >
                            Your Score
                          </text>
                          <text
                            x="226"
                            y="91"
                            textAnchor="middle"
                            fontSize="9"
                            fill="currentColor"
                            opacity="0.68"
                          >
                            Scored Higher
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ESA Expandable Card */}
          <div className="rounded-2xl a1-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setEsaExpanded((prev) => !prev)}
              aria-expanded={esaExpanded}
              className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#6D28D9]/12 dark:bg-[#C4ACFF]/15 border border-[#6D28D9]/25 dark:border-[#C4ACFF]/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-[var(--accent-purple)]" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-purple)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Coming Soon</span>
                    </span>
                  </div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate">
                    ESA – End Semester Assessment
                  </h4>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[var(--accent-purple)] shrink-0 transition-transform duration-200 ${
                  esaExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {esaExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="px-5 sm:px-6 pb-6 pt-4 border-t border-[var(--border-subtle)]"
                >
                  <div className="rounded-xl a1-surface-secondary p-4 sm:p-5 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[var(--accent-purple)] shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)]">
                      ESA exam pattern details will be updated soon.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
