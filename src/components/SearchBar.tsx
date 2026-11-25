import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { searchPlatform, SearchResultItem } from '../utils/search';

interface SearchBarProps {
  placeholder?: string;
  compact?: boolean;
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search subjects, handwritten notes, slides, PYQs, or reference materials...',
  compact = false,
  initialQuery = '',
  onQueryChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchPlatform(query, 8), [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    setOpen(val.trim().length > 0);
    onQueryChange?.(val);
  };

  const handleSelect = (item: SearchResultItem) => {
    setOpen(false);
    navigate(item.path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = results.exactMatches[0] || results.closeMatches[0];
    if (first) {
      handleSelect(first);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search
          className="w-5 h-5 absolute left-4 text-[var(--accent-blue)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Search A1 Academy resources"
          className={`w-full rounded-xl a1-surface text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/75 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-shadow ${
            compact ? 'py-2.5 text-sm' : 'py-3.5 text-sm sm:text-base'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              handleInput('');
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-20 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          Search
        </button>
      </form>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 z-40 rounded-xl a1-surface-secondary shadow-2xl overflow-hidden max-h-[380px] overflow-y-auto">
          {results.exactMatches.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                Matching results
              </p>
              {results.exactMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">
                      {item.kind} · {item.subtitle}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--accent-blue)] shrink-0" />
                </button>
              ))}
            </div>
          ) : results.closeMatches.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-[var(--accent-purple)]">
                No exact match for &ldquo;{query.trim()}&rdquo; — Close matches:
              </p>
              {results.closeMatches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">
                      Suggested {item.kind} · {item.subtitle}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--accent-purple)] shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-[var(--text-secondary)]">
              No matching engineering subjects or resources found. Try searching
              for &ldquo;Python&rdquo;, &ldquo;Mathematics&rdquo;,
              &ldquo;Physics&rdquo;, &ldquo;Chemistry&rdquo;, or &ldquo;CGPA&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
