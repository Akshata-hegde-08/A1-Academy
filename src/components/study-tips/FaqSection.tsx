import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { STUDY_FAQS } from '../../data/studyTips';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-heading"
      className="scroll-mt-32 space-y-8"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          Section 03 · Quick Answers
        </p>
        <h2
          id="faqs-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
        >
          Clarifying some of your curious doubts.
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
          Quick answers to common first-year engineering questions.
        </p>
      </div>

      <div className="space-y-3">
        {STUDY_FAQS.map((faq, idx) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className="rounded-2xl a1-surface overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/20 dark:border-[#8DBBFF]/25 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <HelpCircle className="w-4 h-4 text-[var(--accent-blue)]" />
                  </span>
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-[var(--accent-blue)] tabular-nums shrink-0">
                      0{idx + 1}.
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                      {faq.question}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--accent-blue)] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="px-5 sm:px-6 pb-5 pt-3 border-t border-[var(--border-subtle)]"
                  >
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pl-0 sm:pl-11">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
