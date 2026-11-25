import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUp,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  HelpCircle,
} from 'lucide-react';
import { GUIDE_NAV_SECTIONS } from '../data/studyTips';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { ExamGuideSection } from '../components/study-tips/ExamGuideSection';
import { SubjectTipsSection } from '../components/study-tips/SubjectTipsSection';
import { FaqSection } from '../components/study-tips/FaqSection';
import { PlacementsSection } from '../components/study-tips/PlacementsSection';

const NAV_ICONS: Record<string, React.ElementType> = {
  'exam-guide': ClipboardCheck,
  'subject-tips': BookOpen,
  faqs: HelpCircle,
  placements: Briefcase,
};

const STICKY_SCROLL_OFFSET = 136;

export const StudyTipsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSectionId, setActiveSectionId] = useState<string>(
    GUIDE_NAV_SECTIONS[0].id,
  );
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    setActiveSectionId(sectionId);
    const y =
      target.getBoundingClientRect().top + window.scrollY - STICKY_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }, []);

  // Scroll to section if ?section= or ?subject= is supplied from search
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    const subjectParam = searchParams.get('subject');
    const targetId =
      sectionParam &&
      GUIDE_NAV_SECTIONS.some((sec) => sec.id === sectionParam)
        ? sectionParam
        : subjectParam
          ? 'subject-tips'
          : null;

    if (targetId) {
      const timer = window.setTimeout(() => {
        scrollToSection(targetId);
      }, 120);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams, scrollToSection]);

  // Track active section and floating scroll-to-top visibility
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 320);

      let current = GUIDE_NAV_SECTIONS[0].id;
      for (const sec of GUIDE_NAV_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= STICKY_SCROLL_OFFSET + 60) {
            current = sec.id;
          }
        }
      }
      setActiveSectionId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Study Tips' }]}
        />

        {/* Hero & Introduction */}
        <section className="rounded-2xl a1-surface p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold text-[var(--accent-blue)]">
                A1 ACADEMY · First-Year Student Guidance
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] text-balance">
                Your Engineering Survival Guide.
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                Everything I wish every first-year engineering student knew
                before their exams.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-[#080D1C] border border-[#8DBBFF]/25 shadow-lg">
                <SafeImage
                  src="/src/assets/images/engineering_survival_guide_3d_1795112510539.jpg"
                  alt="3D educational illustration with engineering textbooks, scientific calculator, compass, and glowing equations"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Top Section Navigation */}
      <div className="sticky top-16 z-20 mt-6 a1-glass border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav
            aria-label="Study guide section navigation"
            className="flex items-center gap-2 overflow-x-auto"
          >
            {GUIDE_NAV_SECTIONS.map((sec) => {
              const Icon = NAV_ICONS[sec.id] || BookOpen;
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] border-transparent shadow-sm'
                      : 'a1-surface-secondary text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16 sm:space-y-20">
        <ExamGuideSection />

        <div className="border-t border-[var(--border-subtle)]" />

        <SubjectTipsSection />

        <div className="border-t border-[var(--border-subtle)]" />

        <FaqSection />

        <div className="border-t border-[var(--border-subtle)]" />

        <PlacementsSection />
      </div>

      {/* Mandatory Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            title="Back to top"
            className="fixed bottom-5 right-5 z-30 w-11 h-11 rounded-full bg-[#111D36] dark:bg-[#142440] text-white border border-[#8DBBFF]/50 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.45)] dark:shadow-[0_8px_24px_-4px_rgba(141,187,255,0.35)] flex items-center justify-center hover:bg-[#2563EB] dark:hover:bg-[#1C3258] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)]"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
