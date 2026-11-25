import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Download,
  Eye,
  FileQuestion,
  FolderOpen,
  Layers,
  Library,
  PenTool,
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

const CATEGORY_ICONS: Record<ResourceCategorySlug, React.ElementType> = {
  'handwritten-notes': PenTool,
  slides: Layers,
  'previous-year-questions': FileQuestion,
  'reference-materials': Library,
};

function buildUnitResources(
  subjectName: string,
  subjectSlug: string,
  cycleSlug: string,
  unitNumber: number,
  unitTitle: string,
  categorySlug: ResourceCategorySlug,
  subjectResources: ResourceItem[],
): ResourceItem[] {
  if (categorySlug === 'reference-materials') {
    return subjectResources;
  }

  const unitLabel = `Unit ${unitNumber}`;
  const unitSpecificItem: ResourceItem =
    categorySlug === 'handwritten-notes'
      ? {
          id: `${cycleSlug}-${subjectSlug}-u${unitNumber}-hw`,
          title: `${unitLabel}: ${unitTitle} — Handwritten Notes`,
          unit: unitLabel,
          description: `Unit-wise handwritten summary notes, key definitions, and worked problem outlines for ${unitTitle} (${subjectName}).`,
          isSample: true,
          downloadable: true,
          fileFormat: 'HTML Study Sheet',
          authorNote:
            'Sample Unit Notes · Ready for custom handwritten PDF or image uploads',
          previewSummary: `Organized quick-revision notes covering ${unitTitle} concepts, formulas, and common exam checkpoints.`,
          previewPages: [
            {
              heading: `${unitLabel} — ${unitTitle}`,
              bullets: [
                `Core Concepts: Break down ${unitTitle} into key definitions, diagrams, and governing principles.`,
                'Problem Solving: Work through slide examples step-by-step before attempting textbook exercises.',
                'Exam Checklist: Highlight high-frequency 4-mark theory prompts and numerical units.',
              ],
            },
          ],
        }
      : categorySlug === 'slides'
        ? {
            id: `${cycleSlug}-${subjectSlug}-u${unitNumber}-sl`,
            title: `${unitLabel}: ${unitTitle} — Lecture Slides`,
            unit: unitLabel,
            description: `Structured classroom slide summary and concept breakdown for ${unitTitle} in ${subjectName}.`,
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote:
              'Sample Slide Deck · Attach official faculty slide decks per unit',
            previewSummary: `Slide-by-slide overview for ${unitTitle} highlighting key takeaways for ISAs and ESAs.`,
            previewPages: [
              {
                heading: `Slide Overview — ${unitTitle}`,
                bullets: [
                  `Topic Scope: Covers foundational concepts and worked examples from ${unitLabel}.`,
                  'Quick Revision: Use highlighted equations and summary tables right before assessments.',
                ],
              },
            ],
          }
        : {
            id: `${cycleSlug}-${subjectSlug}-u${unitNumber}-pyq`,
            title: `${unitLabel}: ${unitTitle} — Exam Practice Questions`,
            unit: unitLabel,
            description: `Practice question checklist and problem-solving framework focused on ${unitTitle}.`,
            isSample: true,
            downloadable: false,
            authorNote:
              'Sample Practice Template · Official university papers are not fabricated; add your institution PYQs here.',
            previewSummary: `Structured exam practice layout covering 1-mark, 2-mark MCQs, and 4-mark descriptive/numerical prompts for ${unitTitle}.`,
            previewPages: [
              {
                heading: `Exam Pattern Checklist — ${unitTitle}`,
                bullets: [
                  `1-Mark & 2-Mark Concepts: Test definitions and edge cases from ${unitTitle}.`,
                  '4-Mark Long Questions: Practice full derivations, circuits, code traces, or step-by-step numericals.',
                ],
              },
            ],
          };

  return [unitSpecificItem, ...subjectResources];
}

export const UnitResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cycleSlug, subjectSlug, unitNumber, categorySlug } = useParams<{
    cycleSlug: string;
    subjectSlug: string;
    unitNumber: string;
    categorySlug?: string;
  }>();

  const cycle = getCycleBySlug(cycleSlug);
  const subject = getSubjectBySlugs(cycleSlug, subjectSlug);
  const unitIdx = unitNumber ? Number.parseInt(unitNumber, 10) - 1 : -1;
  const unitTitle =
    subject && unitIdx >= 0 && unitIdx < subject.coreTopics.length
      ? subject.coreTopics[unitIdx]
      : undefined;

  const category = categorySlug ? getCategoryMeta(categorySlug) : undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);
  const { isBookmarked, toggleBookmark } = useApp();

  const items = useMemo(() => {
    if (!cycle || !subject || !unitTitle || !category) return [];
    const base = subject.resources[category.slug] ?? [];
    return buildUnitResources(
      subject.name,
      subject.slug,
      cycle.slug,
      unitIdx + 1,
      unitTitle,
      category.slug,
      base,
    );
  }, [cycle, subject, unitTitle, category, unitIdx]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q),
    );
  }, [items, searchTerm]);

  if (!cycle || !subject || !unitTitle || (categorySlug && !category)) {
    return <NotFoundPage />;
  }

  const unitPathBase = `/${cycle.slug}/${subject.slug}/unit/${unitIdx + 1}`;
  const currentPath = category
    ? `${unitPathBase}/${category.slug}`
    : unitPathBase;

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: cycle.name, to: `/${cycle.slug}` },
    { label: subject.name, to: `/${cycle.slug}/${subject.slug}` },
    ...(category
      ? [
          {
            label: `Unit ${unitIdx + 1}: ${unitTitle}`,
            to: unitPathBase,
          },
          { label: category.title },
        ]
      : [{ label: `Unit ${unitIdx + 1}: ${unitTitle}` }]),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Top Unit Header + Subcategory Selector */}
      <header className="rounded-2xl a1-surface p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-blue)]">
              {cycle.name} · {subject.name} · Unit {unitIdx + 1}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-balance">
              {unitTitle}
            </h1>
          </div>

          <Link
            to={`/${cycle.slug}/${subject.slug}`}
            className="self-start md:self-auto px-4 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-blue)] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All {subject.name} Units</span>
          </Link>
        </div>

        {/* Subcategories to Choose at the Top */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            Choose a Subcategory for Unit {unitIdx + 1}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RESOURCE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug];
              const isSelected = category?.slug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => navigate(`${unitPathBase}/${cat.slug}`)}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] border-transparent shadow-sm'
                      : 'a1-surface-secondary text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-blue)]'
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/20 dark:bg-[#080D1C]/15'
                        : 'bg-[#2563EB]/10 dark:bg-[#8DBBFF]/12'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected
                          ? 'text-white dark:text-[#080D1C]'
                          : 'text-[var(--accent-blue)]'
                      }`}
                    />
                  </span>
                  <span className="font-display text-sm font-bold leading-snug">
                    {cat.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Unit Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-medium text-[var(--text-secondary)] mr-1">
            Switch Unit:
          </span>
          {subject.coreTopics.map((topic, idx) => {
            const num = idx + 1;
            const target = category
              ? `/${cycle.slug}/${subject.slug}/unit/${num}/${category.slug}`
              : `/${cycle.slug}/${subject.slug}/unit/${num}`;
            const active = idx === unitIdx;
            return (
              <Link
                key={topic}
                to={target}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#6D28D9] dark:bg-[#C4ACFF] text-white dark:text-[#080D1C]'
                    : 'a1-surface-secondary text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Unit {num}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Content Area Based on Chosen Subcategory */}
      {!category ? (
        <div className="rounded-2xl a1-surface p-8 sm:p-10 text-center space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-[var(--accent-blue)] opacity-85" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Select a subcategory above to open resources
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Click <strong>Handwritten Notes</strong>, <strong>Slides</strong>,{' '}
            <strong>Question Bank</strong>, or{' '}
            <strong>Reference Materials</strong> at the top to view the study
            materials for <strong>{unitTitle}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                {category.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {category.shortDescription}
              </p>
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
                placeholder={`Filter ${category.title.toLowerCase()}...`}
                aria-label={`Filter ${category.title}`}
                className="w-full rounded-xl a1-surface py-2 pl-10 pr-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
              />
            </div>
          </div>

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

                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                        {item.title}
                      </h3>

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
            <div className="rounded-2xl a1-surface p-10 text-center space-y-2">
              <p className="font-display text-base font-semibold text-[var(--text-primary)]">
                No {category.title.toLowerCase()} matched &ldquo;{searchTerm}&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}

      <ResourcePreviewModal
        item={previewItem}
        subjectName={subject.name}
        cycleName={cycle.name}
        categoryTitle={category?.title || 'Unit Resources'}
        resourcePath={currentPath}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};
