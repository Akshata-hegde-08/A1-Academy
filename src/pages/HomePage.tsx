import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  FileQuestion,
  FlaskConical,
  Library,
  PenTool,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { HeroEngineering3D } from '../components/HeroEngineering3D';
import { SafeImage } from '../components/SafeImage';
import { CYCLES } from '../data/curriculum';
import { LAB_MODULES } from '../data/globalPagesData';

const FIND_HERE_CARDS = [
  {
    title: 'Handwritten Notes',
    description:
      'Clean, unit-wise annotated study summaries and derivation sheets built for clear understanding.',
    icon: PenTool,
    to: '/resources?category=handwritten-notes',
  },
  {
    title: 'Previous Year Questions',
    description:
      'Structured exam-pattern checklists and question preparation templates across first-year subjects.',
    icon: FileQuestion,
    to: '/question-bank',
  },
  {
    title: 'Lab Resources',
    description:
      'Find all your records, graphs, programs, viva-questions in one place.',
    icon: FlaskConical,
    to: '/labs',
  },
  {
    title: 'Reference Materials',
    description:
      'Curated engineering textbooks, standard formula references, and foundational reading guides.',
    icon: Library,
    to: '/reference-material',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 space-y-16">
      {/* Section 2: Prominent Search Bar */}
      <section aria-label="Search resources" className="max-w-3xl mx-auto">
        <SearchBar />
      </section>

      {/* Section 3: Hero Description + 3D Engineering Illustration */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[var(--accent-blue)]">
            Everything you need to ace your first year
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-[var(--text-primary)]">
            Your First Engineering Hub – Everything You Need to Learn, Practice
            and Prepare.
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            From handwritten notes to laboratory solutions, previous year
            questions to numerical practice — discover all your first-year
            engineering resources in one place.
          </p>
        </div>

        <div className="lg:col-span-6">
          <HeroEngineering3D />
        </div>
      </section>

      {/* Section 4: What Can You Find Here? */}
      <section aria-labelledby="find-here-heading" className="space-y-6">
        <div className="max-w-2xl">
          <h2
            id="find-here-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
          >
            What Can You Find Here?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Jump directly into the study format you need right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FIND_HERE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl a1-surface p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/20 dark:border-[#8DBBFF]/25 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[var(--accent-blue)]" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Choose Your Cycle */}
      <section
        id="choose-cycle"
        aria-labelledby="choose-cycle-heading"
        className="space-y-6"
      >
        <div className="max-w-2xl">
          <h2
            id="choose-cycle-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
          >
            Choose Your Cycle
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">
            Select your current first-year engineering semester cycle to access
            dedicated subject pages and unit-wise resources.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {CYCLES.map((cycle) => (
            <div
              key={cycle.slug}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/${cycle.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/${cycle.slug}`);
                }
              }}
              className="group cursor-pointer rounded-2xl a1-surface overflow-hidden flex flex-col justify-between a1-glow-hover focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)]"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#080D1C]">
                  <SafeImage
                    src={cycle.imagePath}
                    alt={`${cycle.name} 3D educational illustration`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                      {cycle.name}
                    </h3>
                    <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">
                      {cycle.subjects.length} Subjects
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                    Subjects:{' '}
                    <span className="text-[var(--text-primary)] font-medium">
                      {cycle.subjects.map((s) => s.name).join(' · ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-7 pt-2">
                <Link
                  to={`/${cycle.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>Explore Cycle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Lab Resources Showcase */}
      <section aria-labelledby="lab-resources-heading">
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate('/labs')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/labs');
            }
          }}
          className="group cursor-pointer rounded-2xl relative overflow-hidden border border-[#2563EB]/25 dark:border-[#8DBBFF]/30 bg-gradient-to-br from-[#EEF4FF] via-[#F7F9FF] to-[#F3EEFF] dark:from-[#0E1933] dark:via-[#142440] dark:to-[#1B1F42] p-6 sm:p-8 lg:p-10 a1-glow-hover focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-[#8DBBFF]">
                <FlaskConical className="w-4 h-4" />
                <span>Chemistry · Physics · Python · Matlab</span>
              </div>

              <div className="space-y-2.5">
                <h2
                  id="lab-resources-heading"
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors"
                >
                  LAB RESOURCES
                </h2>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  Find all your records, graphs, programs, viva-questions in one
                  place.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/labs"
                  onClick={(e) => e.stopPropagation()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] dark:from-[#8DBBFF] dark:to-[#C4ACFF] text-white dark:text-[#080D1C] text-sm font-semibold inline-flex items-center gap-2 shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
                >
                  <span>Explore Lab Resource</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
              {LAB_MODULES.map((lab) => (
                <div
                  key={lab.id}
                  className="rounded-xl overflow-hidden bg-[#080D1C] border border-[#8DBBFF]/25 shadow-md"
                >
                  <div className="relative h-24 sm:h-28 w-full overflow-hidden">
                    <SafeImage
                      src={lab.imagePath}
                      alt={`${lab.subjectLabel} 3D laboratory illustration`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D1C]/85 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2.5 font-display text-xs sm:text-sm font-bold text-[#F1F5FF]">
                      {lab.subjectLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Study Tips Section */}
      <section aria-labelledby="study-tips-heading">
        <div className="rounded-2xl a1-surface p-6 sm:p-8 lg:p-10 md:min-h-[326px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 text-center sm:text-left w-full lg:w-auto">
            <div className="w-full sm:w-52 md:w-64 lg:w-72 h-48 sm:h-56 lg:h-60 rounded-xl overflow-hidden bg-[#080D1C] shrink-0 border border-[#8DBBFF]/20">
              <SafeImage
                src="/src/assets/images/study_tips_compact_1794997638147.jpg"
                alt="Minimalist study notebook and hourglass 3D illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 max-w-xl">
              <h2
                id="study-tips-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"
              >
                Study Tips
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Confused about exams or what to study? Find helpful tips, exam
                guides, FAQs and placement insights — all in one place!
              </p>
            </div>
          </div>

          <Link
            to="/study-tips"
            className="px-5 py-3 rounded-xl bg-[#6D28D9] dark:bg-[#C4ACFF] text-white dark:text-[#080D1C] text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <span>Explore Study Tips</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Section 7: Calculate Your CGPA */}
      <section aria-labelledby="cgpa-heading">
        <div className="rounded-2xl a1-surface overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
              <Calculator className="w-4 h-4" />
              <span>Academic Planning Tool</span>
            </div>
            <h2
              id="cgpa-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance"
            >
              Calculate Your CGPA
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Compute your current semester SGPA and cumulative CGPA using
              credit-weighted grade points. Add or remove subjects, validate
              inputs, and copy your result cleanly.
            </p>
            <div className="pt-2">
              <Link
                to="/cgpa-calculator"
                className="px-5 py-3 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <span>Open CGPA Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#080D1C] min-h-[220px]">
            <SafeImage
              src="/src/assets/images/cgpa_calc_3d_1794997640101.jpg"
              alt="3D calculator and academic progress columns illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
