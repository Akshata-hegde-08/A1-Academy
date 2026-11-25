import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getCycleBySlug, getSubjectBySlugs } from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SubjectVisual3D } from '../components/SubjectVisual3D';
import { NotFoundPage } from './NotFoundPage';

export const SubjectPage: React.FC = () => {
  const { cycleSlug, subjectSlug } = useParams<{
    cycleSlug: string;
    subjectSlug: string;
  }>();

  const cycle = getCycleBySlug(cycleSlug);
  const subject = getSubjectBySlugs(cycleSlug, subjectSlug);

  if (!cycle || !subject) {
    return <NotFoundPage />;
  }

  const siblingSubjects = cycle.subjects.filter(
    (s) => s.slug !== subject.slug,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: cycle.name, to: `/${cycle.slug}` },
          { label: subject.name },
        ]}
      />

      {/* Subject Hero */}
      <section className="rounded-2xl a1-surface p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs font-semibold text-[var(--accent-blue)]">
            {cycle.name} · Subject Hub
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {subject.name}
          </h1>
          <div className="space-y-2 pt-1">
            <h2 className="font-display text-sm sm:text-base font-semibold text-[var(--accent-blue)]">
              Unit Names
            </h2>
            <ol className="space-y-1.5 list-decimal pl-5 text-sm sm:text-base text-[var(--text-secondary)]">
              {subject.coreTopics.map((unit, idx) => (
                <li key={unit}>
                  <Link
                    to={`/${cycle.slug}/${subject.slug}/unit/${idx + 1}`}
                    className="hover:text-[var(--accent-blue)] hover:underline transition-colors"
                  >
                    {unit}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <SubjectVisual3D theme={subject.visualTheme} size="lg" />
      </section>

      {/* Individual Chapters / Units Cards */}
      <section aria-labelledby="chapters-heading" className="space-y-5">
        <div>
          <h2
            id="chapters-heading"
            className="font-display text-2xl font-bold text-[var(--text-primary)]"
          >
            Chapters &amp; Units
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Click any unit below to choose Handwritten Notes, Slides, Question
            Bank, and Reference Materials for {subject.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subject.coreTopics.map((unitTitle, idx) => (
            <Link
              key={unitTitle}
              to={`/${cycle.slug}/${subject.slug}/unit/${idx + 1}`}
              className="group rounded-2xl a1-surface p-6 flex flex-col justify-between a1-glow-hover"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12 border border-[#2563EB]/20 dark:border-[#8DBBFF]/25 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--accent-blue)]" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[var(--accent-purple)] tabular-nums">
                    Unit 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                  {unitTitle}
                </h3>

                <p className="text-xs text-[var(--text-secondary)]">
                  Handwritten Notes · Slides · Question Bank · Reference
                  Materials
                </p>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-blue)]">
                  <span>Open Unit {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Subject Page Navigation */}
      <section className="pt-6 border-t border-[var(--border-subtle)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/${cycle.slug}`}
              className="px-4 py-2 rounded-xl a1-surface text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {cycle.name}</span>
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl a1-surface text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Homepage
            </Link>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            Other Subjects in {cycle.name}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {siblingSubjects.map((sib) => (
              <Link
                key={sib.slug}
                to={`/${cycle.slug}/${sib.slug}`}
                className="px-3.5 py-2 rounded-lg a1-surface text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-colors"
              >
                {sib.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
