import {
  CYCLES,
  RESOURCE_CATEGORIES,
  ResourceCategorySlug,
} from '../data/curriculum';
import { STUDY_TIPS } from '../data/studyTips';
import { LAB_MODULES, GLOBAL_REFERENCE_BOOKS } from '../data/globalPagesData';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  kind: 'Cycle' | 'Subject' | 'Resource' | 'Category' | 'Study Tip' | 'Lab' | 'Tool';
  path: string;
  keywords: string;
}

const SEARCH_INDEX: SearchResultItem[] = (() => {
  const items: SearchResultItem[] = [];

  for (const cycle of CYCLES) {
    items.push({
      id: `cycle-${cycle.slug}`,
      title: cycle.name,
      subtitle: cycle.shortDescription,
      kind: 'Cycle',
      path: `/${cycle.slug}`,
      keywords: `${cycle.name} ${cycle.subjects.map((s) => s.name).join(' ')}`,
    });

    for (const subject of cycle.subjects) {
      items.push({
        id: `subject-${cycle.slug}-${subject.slug}`,
        title: `${subject.name} (${cycle.name})`,
        subtitle: subject.tagline,
        kind: 'Subject',
        path: `/${cycle.slug}/${subject.slug}`,
        keywords: `${subject.name} ${subject.shortName} ${cycle.name} ${subject.coreTopics.join(' ')}`,
      });

      for (const cat of RESOURCE_CATEGORIES) {
        items.push({
          id: `cat-${cycle.slug}-${subject.slug}-${cat.slug}`,
          title: `${subject.name} — ${cat.title}`,
          subtitle: `${cycle.name} · ${cat.shortDescription}`,
          kind: 'Category',
          path: `/${cycle.slug}/${subject.slug}/${cat.slug}`,
          keywords: `${subject.name} ${cat.title} ${cycle.name} notes slides pyq reference`,
        });

        const list = subject.resources[cat.slug as ResourceCategorySlug] || [];
        for (const res of list) {
          items.push({
            id: `res-${cycle.slug}-${subject.slug}-${res.id}`,
            title: res.title,
            subtitle: `${subject.name} (${cycle.name}) · ${cat.title}`,
            kind: 'Resource',
            path: `/${cycle.slug}/${subject.slug}/${cat.slug}`,
            keywords: `${res.title} ${res.unit} ${res.description} ${subject.name} ${cat.title}`,
          });
        }
      }
    }
  }

  for (const tip of STUDY_TIPS) {
    const query = tip.subjectId
      ? `section=${encodeURIComponent(tip.sectionId)}&subject=${encodeURIComponent(tip.subjectId)}`
      : `section=${encodeURIComponent(tip.sectionId)}`;
    items.push({
      id: `tip-${tip.id}`,
      title: tip.title,
      subtitle: `Study Tips · ${tip.category}`,
      kind: 'Study Tip',
      path: `/study-tips?${query}`,
      keywords: `${tip.title} ${tip.category} ${tip.summary} study tips`,
    });
  }

  for (const lab of LAB_MODULES) {
    items.push({
      id: `lab-${lab.id}`,
      title: lab.name,
      subtitle: `Labs · ${lab.cycle}`,
      kind: 'Lab',
      path: `/labs/${lab.slug}`,
      keywords: `${lab.name} ${lab.subjectLabel} ${lab.includesPointers.join(' ')} ${lab.focus} ${lab.vivaTopics.join(' ')} lab`,
    });

    for (const topic of lab.topics) {
      items.push({
        id: `lab-topic-${lab.slug}-${topic.slug}`,
        title: topic.title,
        subtitle: `${lab.name} · Topic ${topic.number}`,
        kind: 'Lab',
        path: `/labs/${lab.slug}/${topic.slug}`,
        keywords: `${lab.name} ${topic.title} ${lab.includesPointers.join(' ')}`,
      });
    }
  }

  for (const book of GLOBAL_REFERENCE_BOOKS) {
    items.push({
      id: `book-${book.id}`,
      title: book.title,
      subtitle: `Reference Book · ${book.authors} (${book.subject})`,
      kind: 'Resource',
      path: '/reference-material',
      keywords: `${book.title} ${book.authors} ${book.subject} textbook reference`,
    });
  }

  items.push(
    {
      id: 'tool-cgpa',
      title: 'CGPA & SGPA Calculator',
      subtitle: 'Calculate semester SGPA and cumulative CGPA',
      kind: 'Tool',
      path: '/cgpa-calculator',
      keywords: 'cgpa sgpa calculator grades credits semester gpa',
    },
    {
      id: 'page-question-bank',
      title: 'Question Bank & Exam Prep',
      subtitle: 'Previous year question structures across subjects',
      kind: 'Tool',
      path: '/question-bank',
      keywords: 'question bank pyq previous year questions exam papers',
    },
    {
      id: 'page-short-notes',
      title: 'Slides & Short Notes Hub',
      subtitle: 'Browse concise lecture slides and quick-revision sheets',
      kind: 'Resource',
      path: '/resources?category=slides',
      keywords: 'short notes slides cheat sheets quick revision',
    },
  );

  return items;
})();

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[n];
}

export interface SearchOutput {
  exactMatches: SearchResultItem[];
  closeMatches: SearchResultItem[];
}

export function searchPlatform(rawQuery: string, limit = 8): SearchOutput {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return { exactMatches: [], closeMatches: [] };
  }

  const tokens = q.split(/\s+/).filter(Boolean);

  const scoredExact: { item: SearchResultItem; score: number }[] = [];

  for (const item of SEARCH_INDEX) {
    const titleLower = item.title.toLowerCase();
    const hay = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();

    const allTokensMatch = tokens.every((t) => hay.includes(t));
    if (allTokensMatch) {
      let score = 0;
      if (titleLower === q) score += 120;
      else if (titleLower.startsWith(q)) score += 90;
      else if (titleLower.includes(q)) score += 70;
      else score += 40;

      if (item.kind === 'Subject') score += 20;
      if (item.kind === 'Cycle' || item.kind === 'Tool') score += 15;
      scoredExact.push({ item, score });
    }
  }

  scoredExact.sort((a, b) => b.score - a.score);
  const exactMatches = scoredExact.slice(0, limit).map((s) => s.item);

  if (exactMatches.length > 0) {
    return { exactMatches, closeMatches: [] };
  }

  // Fuzzy close-match suggestions when exact search item is not found
  const fuzzyScored: { item: SearchResultItem; similarity: number }[] = [];

  for (const item of SEARCH_INDEX) {
    const words = `${item.title} ${item.keywords}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 2);

    let bestWordSim = 0;
    for (const qToken of tokens) {
      for (const word of words) {
        if (word.includes(qToken) || qToken.includes(word)) {
          bestWordSim = Math.max(bestWordSim, 0.85);
          continue;
        }
        const dist = levenshtein(qToken, word);
        const maxLen = Math.max(qToken.length, word.length);
        const sim = 1 - dist / maxLen;
        if (sim > bestWordSim) {
          bestWordSim = sim;
        }
      }
    }

    if (bestWordSim >= 0.45) {
      const priorityBonus =
        item.kind === 'Subject' ? 0.08 : item.kind === 'Cycle' ? 0.06 : 0;
      fuzzyScored.push({ item, similarity: bestWordSim + priorityBonus });
    }
  }

  fuzzyScored.sort((a, b) => b.similarity - a.similarity);
  const closeMatches = fuzzyScored.slice(0, 5).map((f) => f.item);

  return { exactMatches: [], closeMatches };
}
