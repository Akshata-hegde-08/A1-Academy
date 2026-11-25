import React, { useMemo, useState } from 'react';
import { Eye, Library, Search, X } from 'lucide-react';
import { CYCLES, ResourceItem } from '../data/curriculum';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';

interface SubjectReferenceGroup {
  subjectSlug: string;
  subjectName: string;
  cycleName: string;
  primaryCycleSlug: string;
  materials: ResourceItem[];
}

interface SelectedReferencePreview {
  item: ResourceItem;
  subjectName: string;
  cycleName: string;
  resourcePath: string;
}

export const ReferenceMaterialPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPreview, setSelectedPreview] =
    useState<SelectedReferencePreview | null>(null);

  const subjectGroups = useMemo<SubjectReferenceGroup[]>(() => {
    const groupMap = new Map<string, SubjectReferenceGroup>();
    const seenBySubject = new Map<string, Set<string>>();

    for (const cycle of CYCLES) {
      for (const subject of cycle.subjects) {
        let group = groupMap.get(subject.slug);
        if (!group) {
          group = {
            subjectSlug: subject.slug,
            subjectName: subject.name,
            cycleName: cycle.name,
            primaryCycleSlug: cycle.slug,
            materials: [],
          };
          groupMap.set(subject.slug, group);
          seenBySubject.set(subject.slug, new Set<string>());
        }

        const seen = seenBySubject.get(subject.slug)!;
        const refs = subject.resources['reference-materials'] ?? [];
        for (const item of refs) {
          if (seen.has(item.title)) continue;
          seen.add(item.title);
          group.materials.push(item);
        }
      }
    }

    return Array.from(groupMap.values()).filter(
      (g) => g.materials.length > 0,
    );
  }, []);

  const filteredGroups = useMemo<SubjectReferenceGroup[]>(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return subjectGroups;

    return subjectGroups
      .map((group) => {
        const subjectLower = group.subjectName.toLowerCase();
        const subjectMatchesAll = tokens.every((t) =>
          subjectLower.includes(t),
        );
        if (subjectMatchesAll) return group;

        const matchingMaterials = group.materials.filter((item) => {
          const hay =
            `${group.subjectName} ${item.title} ${item.description} ${item.previewSummary} ${item.unit}`.toLowerCase();
          return tokens.every((t) => hay.includes(t));
        });

        return { ...group, materials: matchingMaterials };
      })
      .filter((group) => group.materials.length > 0);
  }, [query, subjectGroups]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Reference Material' },
        ]}
      />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-blue)]">
            <Library className="w-4 h-4" />
            <span>Textbooks &amp; Standard Guides</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Reference Material Directory
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Recommended first-year engineering textbooks and foundational
            reference guides organized under each subject. Click any material
            box to open it directly here.
          </p>
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <Search
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-blue)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, books, or authors..."
            aria-label="Search reference materials"
            className="w-full rounded-xl a1-surface py-2.5 pl-10 pr-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {filteredGroups.length > 0 ? (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
          <section
            key={group.subjectSlug}
            aria-labelledby={`ref-subject-${group.subjectSlug}`}
            className="space-y-4"
          >
            <div className="pb-2 border-b border-[var(--border-subtle)]">
              <h2
                id={`ref-subject-${group.subjectSlug}`}
                className="font-display text-2xl font-bold text-[var(--text-primary)]"
              >
                {group.subjectName}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {group.materials.map((item) => (
                <article key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPreview({
                        item,
                        subjectName: group.subjectName,
                        cycleName: group.cycleName,
                        resourcePath: '/reference-material',
                      })
                    }
                    className="group w-full text-left rounded-2xl a1-surface p-6 a1-glow-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-2 max-w-4xl">
                      <p className="text-xs font-medium text-[var(--accent-blue)]">
                        {item.unit}
                      </p>
                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                      {item.previewSummary && (
                        <p className="text-xs text-[var(--text-secondary)]/85 leading-relaxed">
                          {item.previewSummary}
                        </p>
                      )}
                    </div>

                    <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--accent-blue)] group-hover:border-[var(--accent-blue)] whitespace-nowrap shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Material</span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}
        </div>
      ) : (
        <div className="rounded-2xl a1-surface p-10 text-center space-y-3">
          <Library className="w-9 h-9 mx-auto text-[var(--accent-blue)] opacity-80" />
          <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
            No reference materials matched &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Try searching by subject name (e.g., Python, Physics, Mathematics) or textbook author.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-1 px-4 py-2 rounded-xl a1-surface-secondary text-xs font-semibold text-[var(--accent-blue)] hover:border-[var(--accent-blue)]"
          >
            Clear Search
          </button>
        </div>
      )}

      <ResourcePreviewModal
        item={selectedPreview?.item ?? null}
        subjectName={selectedPreview?.subjectName ?? ''}
        cycleName={selectedPreview?.cycleName ?? ''}
        categoryTitle="Reference Materials"
        resourcePath={selectedPreview?.resourcePath ?? '/reference-material'}
        onClose={() => setSelectedPreview(null)}
      />
    </div>
  );
};
