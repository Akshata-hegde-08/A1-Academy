import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CycleSlug, getCycleBySlug } from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { SubjectVisual3D } from '../components/SubjectVisual3D';
import { NotFoundPage } from './NotFoundPage';

interface CyclePageProps {
  cycleSlug: CycleSlug;
}

export const CyclePage: React.FC<CyclePageProps> = ({ cycleSlug }) => {
  const cycle = getCycleBySlug(cycleSlug);
  const [subjectQuery, setSubjectQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!cycle) return [];
    const q = subjectQuery.trim().toLowerCase();
    if (!q) return cycle.subjects;
    return cycle.subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.coreTopics.some((t) => t.toLowerCase().includes(q)),
    );
  }, [cycle, subjectQuery]);

  if (!cycle) {
    return <NotFoundPage />;
  }

  const otherCycleSlug =
    cycle.slug === 'physics-cycle' ? 'chemistry-cycle' : 'physics-cycle';
  const otherCycleName =
    cycle.slug === 'physics-cycle' ? 'Chemistry Cycle' : 'Physics Cycle';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: cycle.name },
        ]}
      />

      {/* Cycle Hero */}
      <section className="rounded-2xl a1-surface overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
          <p className="text-xs font-semibold text-[var(--accent-blue)]">
            First-Year Engineering Curriculum · {cycle.subjects.length} Subjects
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-balance">
            {cycle.name}
          </h1>
          {cycle.slug === 'chemistry-cycle' ? (
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                Includes six subjects.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 list-disc pl-5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <li>Engineering Chemistry</li>
                <li>Engineering Mathematics</li>
                <li>Engineering Mechanics</li>
                <li>Python for computational problem solving</li>
                <li>Electronic principles and devices</li>
                <li>Constitutional Law, Ip Law, And professional Ethics</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                Includes six subjects.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 list-disc pl-5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <li>Engineering Physics</li>
                <li>Engineering Mathematics</li>
                <li>Engineering Mechanical</li>
                <li>Python for computational problem solving</li>
                <li>Electronic principles and devices</li>
                <li>Environmental Science</li>
              </ul>
            </div>
          )}
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={`/${otherCycleSlug}`}
              className="px-4 py-2 rounded-xl a1-surface text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-purple)] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Switch to {otherCycleName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#080D1C] min-h-[240px]">
          <SafeImage
            src={cycle.imagePath}
            alt={`${cycle.name} engineering illustration`}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Search Subjects Bar */}
      <section aria-label={`Search subjects in ${cycle.name}`} className="max-w-xl">
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 absolute left-4 text-[var(--accent-blue)] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={subjectQuery}
            onChange={(e) => setSubjectQuery(e.target.value)}
            placeholder={`Filter subjects or topics in ${cycle.name}...`}
            aria-label={`Filter subjects in ${cycle.name}`}
            className="w-full rounded-xl a1-surface py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>
      </section>

      {/* Six Subject Cards */}
      <section aria-label={`${cycle.name} subjects`}>
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.slug}
                className="rounded-2xl a1-surface p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <SubjectVisual3D theme={subject.visualTheme} size="sm" />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      4 Resource Categories
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                      {subject.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    to={`/${cycle.slug}/${subject.slug}`}
                    className="w-full px-4 py-2.5 rounded-xl bg-transparent border border-[#2563EB]/45 dark:border-[#8DBBFF]/45 text-xs font-semibold text-[var(--accent-blue)] flex items-center justify-between shadow-[0_4px_0_0_rgba(37,99,235,0.22),0_8px_16px_-6px_rgba(37,99,235,0.22)] dark:shadow-[0_4px_0_0_rgba(141,187,255,0.28),0_10px_20px_-6px_rgba(141,187,255,0.22)] hover:-translate-y-0.5 hover:bg-[#2563EB]/5 dark:hover:bg-[#8DBBFF]/8 hover:shadow-[0_6px_0_0_rgba(37,99,235,0.28),0_12px_20px_-6px_rgba(37,99,235,0.28)] dark:hover:shadow-[0_6px_0_0_rgba(141,187,255,0.34),0_12px_24px_-6px_rgba(141,187,255,0.28)] active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(37,99,235,0.22)] dark:active:shadow-[0_1px_0_0_rgba(141,187,255,0.28)] transition-all duration-150"
                  >
                    <span>Explore Subject</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl a1-surface p-8 text-center space-y-3">
            <p className="text-base font-semibold text-[var(--text-primary)]">
              No subjects matched &ldquo;{subjectQuery}&rdquo; in {cycle.name}.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try clearing your filter or check {otherCycleName} if you are
              looking for a cycle-specific course.
            </p>
            <button
              type="button"
              onClick={() => setSubjectQuery('')}
              className="px-4 py-2 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold"
            >
              Show All {cycle.subjects.length} Subjects
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
