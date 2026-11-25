import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Download,
  Eye,
  FolderOpen,
} from 'lucide-react';
import {
  CYCLES,
  RESOURCE_CATEGORIES,
  ResourceCategorySlug,
  ResourceItem,
} from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';
import { useApp } from '../context/AppContext';
import { downloadResourceFile } from '../utils/download';

interface FlatResourceEntry {
  item: ResourceItem;
  cycleSlug: string;
  cycleName: string;
  subjectSlug: string;
  subjectName: string;
  categorySlug: ResourceCategorySlug;
  categoryTitle: string;
}

interface SubjectResourceGroup {
  subjectSlug: string;
  subjectName: string;
  cycleLabel: string;
  primaryCycleSlug: string;
  entries: FlatResourceEntry[];
}

export const ResourcesHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') as ResourceCategorySlug | null;
  const initialSaved = searchParams.get('saved') === 'true';

  const [previewEntry, setPreviewEntry] = useState<FlatResourceEntry | null>(
    null,
  );

  const { bookmarks, isBookmarked, toggleBookmark } = useApp();

  const subjectGroups = useMemo<SubjectResourceGroup[]>(() => {
    const groupMap = new Map<string, SubjectResourceGroup>();
    const seenTitlesBySubject = new Map<string, Set<string>>();

    for (const cycle of CYCLES) {
      for (const subject of cycle.subjects) {
        const isCommon =
          subject.slug === 'python' || subject.slug === 'mathematics';
        let group = groupMap.get(subject.slug);
        if (!group) {
          group = {
            subjectSlug: subject.slug,
            subjectName: subject.name,
            cycleLabel: isCommon ? 'Common (Both Cycles)' : cycle.name,
            primaryCycleSlug: cycle.slug,
            entries: [],
          };
          groupMap.set(subject.slug, group);
          seenTitlesBySubject.set(subject.slug, new Set<string>());
        }

        const seenTitles = seenTitlesBySubject.get(subject.slug)!;

        for (const cat of RESOURCE_CATEGORIES) {
          const list = subject.resources[cat.slug] ?? [];
          for (const item of list) {
            const dedupeKey = `${cat.slug}:${item.title}`;
            if (seenTitles.has(dedupeKey)) continue;
            seenTitles.add(dedupeKey);

            group.entries.push({
              item,
              cycleSlug: cycle.slug,
              cycleName: cycle.name,
              subjectSlug: subject.slug,
              subjectName: subject.name,
              categorySlug: cat.slug,
              categoryTitle: cat.title,
            });
          }
        }
      }
    }

    const activeCatFilter =
      initialCat && RESOURCE_CATEGORIES.some((c) => c.slug === initialCat)
        ? initialCat
        : null;

    return Array.from(groupMap.values())
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) => {
          if (initialSaved) {
            return bookmarks.some((b) => b.id === entry.item.id);
          }
          if (activeCatFilter) {
            return entry.categorySlug === activeCatFilter;
          }
          return true;
        }),
      }))
      .filter((group) => group.entries.length > 0);
  }, [bookmarks, initialCat, initialSaved]);

  const activeCategoryTitle = initialCat
    ? RESOURCE_CATEGORIES.find((c) => c.slug === initialCat)?.title
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Resources' },
        ]}
      />

      <header className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold text-[var(--accent-blue)]">
          Central Study Repository
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Engineering Study Resources
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Browse handwritten-style sample study sheets, lecture slides &amp;
          short notes, previous-year practice templates, and reference guides
          organized by subject.
        </p>

        {(initialSaved || activeCategoryTitle) && (
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-[var(--accent-purple)]">
              {initialSaved
                ? `Showing Saved Bookmarks (${bookmarks.length})`
                : `Filtered by: ${activeCategoryTitle}`}
            </span>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="font-semibold text-[var(--accent-blue)] hover:underline"
            >
              Show all subject materials
            </button>
          </div>
        )}
      </header>

      {/* Subject-Grouped Materials */}
      {subjectGroups.length > 0 ? (
        <div className="space-y-12">
          {subjectGroups.map((group) => (
            <section
              key={group.subjectSlug}
              aria-labelledby={`subject-heading-${group.subjectSlug}`}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2
                    id={`subject-heading-${group.subjectSlug}`}
                    className="font-display text-2xl font-bold text-[var(--text-primary)]"
                  >
                    {group.subjectName}
                  </h2>
                  <span className="text-xs font-medium text-[var(--accent-purple)]">
                    {group.cycleLabel}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[var(--text-secondary)] tabular-nums">
                    {group.entries.length}{' '}
                    {group.entries.length === 1 ? 'material' : 'materials'}
                  </span>
                  <Link
                    to={`/${group.primaryCycleSlug}/${group.subjectSlug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[var(--accent-blue)] hover:underline"
                  >
                    <span>Open Subject</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.entries.map((entry) => {
                  const path = `/${entry.cycleSlug}/${entry.subjectSlug}/${entry.categorySlug}`;
                  const saved = isBookmarked(entry.item.id);
                  return (
                    <article
                      key={entry.item.id}
                      className="rounded-2xl a1-surface p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <span className="font-semibold text-[var(--accent-blue)]">
                            {entry.categoryTitle}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{entry.item.unit}</span>
                          {entry.item.isSample && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-[var(--accent-purple)]">
                                Sample Content
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                          {entry.item.title}
                        </h3>

                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {entry.item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewEntry(entry)}
                            className="px-3.5 py-2 rounded-lg a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                            <span>Preview</span>
                          </button>

                          {entry.item.downloadable && (
                            <button
                              type="button"
                              onClick={() =>
                                downloadResourceFile(
                                  entry.item,
                                  entry.subjectName,
                                  entry.cycleName,
                                  entry.categoryTitle,
                                )
                              }
                              className="px-3.5 py-2 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              toggleBookmark({
                                id: entry.item.id,
                                title: entry.item.title,
                                subjectName: entry.subjectName,
                                cycleName: entry.cycleName,
                                categoryTitle: entry.categoryTitle,
                                path,
                              })
                            }
                            className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 ${
                              saved
                                ? 'text-[var(--accent-purple)] bg-[#C4ACFF]/15'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{saved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>

                        <Link
                          to={path}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-blue)] hover:underline"
                        >
                          <span>Category View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl a1-surface p-10 text-center space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-[var(--accent-blue)] opacity-80" />
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            {initialSaved
              ? 'No saved resources yet'
              : 'No matching resources found'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {initialSaved
              ? 'Click Save on any study sheet or slide deck to bookmark it here for quick revision.'
              : 'No resources matched the requested filter.'}
          </p>
        </div>
      )}

      <ResourcePreviewModal
        item={previewEntry?.item ?? null}
        subjectName={previewEntry?.subjectName ?? ''}
        cycleName={previewEntry?.cycleName ?? ''}
        categoryTitle={previewEntry?.categoryTitle ?? ''}
        resourcePath={
          previewEntry
            ? `/${previewEntry.cycleSlug}/${previewEntry.subjectSlug}/${previewEntry.categorySlug}`
            : '/'
        }
        onClose={() => setPreviewEntry(null)}
      />
    </div>
  );
};
