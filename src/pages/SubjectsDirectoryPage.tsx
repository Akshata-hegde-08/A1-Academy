import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CYCLES, CycleSlug } from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SubjectVisual3D } from '../components/SubjectVisual3D';

export const SubjectsDirectoryPage: React.FC = () => {
  const [cycleFilter, setCycleFilter] = useState<'all' | CycleSlug>('all');
  const [query, setQuery] = useState('');

  const subjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = CYCLES.filter(
      (c) => cycleFilter === 'all' || c.slug === cycleFilter,
    ).flatMap((cycle) =>
      cycle.subjects.filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.coreTopics.some((t) => t.toLowerCase().includes(q)),
      ),
    );

    if (cycleFilter !== 'all') {
      return filtered.map((s) => ({
        ...s,
        displayCycleLabel:
          s.slug === 'python' || s.slug === 'mathematics'
            ? `${s.cycleName} · Common`
            : s.cycleName,
      }));
    }

    const seen = new Set<string>();
    const deduplicated: Array<
      (typeof filtered)[number] & { displayCycleLabel: string }
    > = [];

    for (const subject of filtered) {
      if (seen.has(subject.slug)) continue;
      seen.add(subject.slug);
      deduplicated.push({
        ...subject,
        displayCycleLabel:
          subject.slug === 'python' || subject.slug === 'mathematics'
            ? 'Common (Both Cycles)'
            : subject.cycleName,
      });
    }

    return deduplicated;
  }, [cycleFilter, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Subjects' },
        ]}
      />

      <header className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          First-Year Engineering Curriculum
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          All Subjects Directory
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Browse every Physics Cycle and Chemistry Cycle subject. Select any
          subject to access Handwritten Notes, Slides, Previous Year Questions,
          and Reference Materials.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Cycles (10)' },
            { id: 'physics-cycle', label: 'Physics Cycle (6)' },
            { id: 'chemistry-cycle', label: 'Chemistry Cycle (6)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCycleFilter(tab.id as 'all' | CycleSlug)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                cycleFilter === tab.id
                  ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C]'
                  : 'a1-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-blue)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter subjects..."
            aria-label="Filter all subjects"
            className="w-full rounded-xl a1-surface py-2 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={`${subject.cycleSlug}-${subject.slug}`}
              to={`/${subject.cycleSlug}/${subject.slug}`}
              className="group rounded-2xl a1-surface p-6 flex flex-col justify-between a1-glow-hover"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <SubjectVisual3D theme={subject.visualTheme} size="sm" />
                  <span className="text-xs font-medium text-[var(--accent-purple)] text-right">
                    {subject.displayCycleLabel}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                    {subject.name}
                  </h2>
                </div>
              </div>

              <div className="mt-6">
                <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/30 dark:border-[#8DBBFF]/35 text-xs font-semibold text-[var(--accent-blue)] group-hover:bg-[#2563EB] group-hover:text-white dark:group-hover:bg-[#8DBBFF] dark:group-hover:text-[#080D1C] group-hover:border-transparent shadow-[0_3px_0_0_rgba(37,99,235,0.22)] dark:shadow-[0_3px_0_0_rgba(141,187,255,0.22)] group-active:translate-y-0.5 group-active:shadow-none transition-all whitespace-nowrap">
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl a1-surface p-8 text-center text-sm text-[var(--text-secondary)]">
          No subjects matched &ldquo;{query}&rdquo;.
        </div>
      )}
    </div>
  );
};
