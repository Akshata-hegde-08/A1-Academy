import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Download,
  Eye,
  FolderOpen,
  Search,
} from 'lucide-react';
import {
  RESOURCE_CATEGORIES,
  ResourceCategorySlug,
  ResourceItem,
  getCategoryMeta,
  getCycleBySlug,
  getSubjectBySlugs,
} from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';
import { useApp } from '../context/AppContext';
import { downloadResourceFile } from '../utils/download';
import { NotFoundPage } from './NotFoundPage';

const CATEGORY_ALIASES: Record<string, ResourceCategorySlug> = {
  'short-notes': 'slides',
  'cheat-sheets': 'slides',
};

export const ResourceCategoryPage: React.FC = () => {
  const { cycleSlug, subjectSlug, categorySlug } = useParams<{
    cycleSlug: string;
    subjectSlug: string;
    categorySlug: string;
  }>();

  const resolvedCategorySlug =
    (categorySlug && CATEGORY_ALIASES[categorySlug]) || categorySlug;

  const cycle = getCycleBySlug(cycleSlug);
  const subject = getSubjectBySlugs(cycleSlug, subjectSlug);
  const category = getCategoryMeta(resolvedCategorySlug);

  const [unitFilter, setUnitFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  const { isBookmarked, toggleBookmark } = useApp();

  const items = useMemo(() => {
    if (!subject || !category) return [];
    return subject.resources[category.slug] ?? [];
  }, [subject, category]);

  const units = useMemo(() => {
    const set = new Set(items.map((i) => i.unit));
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesUnit = unitFilter === 'All' || item.unit === unitFilter;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q);
      return matchesUnit && matchesSearch;
    });
  }, [items, unitFilter, searchTerm]);

  if (!cycle || !subject || !category) {
    return <NotFoundPage />;
  }

  const currentPath = `/${cycle.slug}/${subject.slug}/${category.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: cycle.name, to: `/${cycle.slug}` },
          { label: subject.name, to: `/${cycle.slug}/${subject.slug}` },
          { label: category.title },
        ]}
      />

      {/* Category Header */}
      <header className="rounded-2xl a1-surface p-6 sm:p-8 space-y-3">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          {cycle.name} · {subject.name}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {subject.name} — {category.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          {category.shortDescription}
        </p>

        {/* Quick switch between the 4 allowed subject categories */}
        <div className="pt-3 flex flex-wrap gap-2">
          {RESOURCE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cycle.slug}/${subject.slug}/${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                cat.slug === category.slug
                  ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C]'
                  : 'a1-surface-secondary text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {units.map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => setUnitFilter(unit)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                unitFilter === unit
                  ? 'bg-[#6D28D9] dark:bg-[#C4ACFF] text-white dark:text-[#080D1C]'
                  : 'a1-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {unit}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter resources..."
            aria-label="Filter category resources"
            className="w-full rounded-xl a1-surface py-2 pl-10 pr-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
        </div>
      </div>

      {/* Resource List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const saved = isBookmarked(item.id);
            return (
              <article
                key={item.id}
                className="rounded-2xl a1-surface p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--accent-blue)]">
                      {item.unit}
                    </span>
                    {item.isSample && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[var(--accent-purple)]">
                          Sample Content
                        </span>
                      </>
                    )}
                    {item.fileFormat && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{item.fileFormat}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h2>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>

                  {item.authorNote && (
                    <p className="text-xs text-[var(--text-secondary)]/85">
                      {item.authorNote}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="px-3.5 py-2 rounded-lg a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                      <span>Preview</span>
                    </button>

                    {item.downloadable && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadResourceFile(
                            item,
                            subject.name,
                            cycle.name,
                            category.title,
                          )
                        }
                        className="px-3.5 py-2 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        id: item.id,
                        title: item.title,
                        subjectName: subject.name,
                        cycleName: cycle.name,
                        categoryTitle: category.title,
                        path: currentPath,
                      })
                    }
                    aria-label={saved ? 'Remove bookmark' : 'Save resource'}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      saved
                        ? 'text-[var(--accent-purple)] bg-[#C4ACFF]/15'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl a1-surface p-10 text-center space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-[var(--accent-blue)] opacity-80" />
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Resources coming soon
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            No files matched your current filter. Real PDFs, handwritten unit
            notes, or question papers added to this module will appear here
            automatically.
          </p>
        </div>
      )}

      {/* Back Link */}
      <div className="pt-4">
        <Link
          to={`/${cycle.slug}/${subject.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {subject.name} Categories</span>
        </Link>
      </div>

      <ResourcePreviewModal
        item={previewItem}
        subjectName={subject.name}
        cycleName={cycle.name}
        categoryTitle={category.title}
        resourcePath={currentPath}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};
