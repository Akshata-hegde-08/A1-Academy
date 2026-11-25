import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <div className="w-14 h-14 mx-auto rounded-2xl a1-surface flex items-center justify-center">
        <Compass className="w-7 h-7 text-[var(--accent-blue)]" />
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs font-semibold text-[var(--accent-purple)]">
          404 · Page Not Found
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          We couldn&rsquo;t find that study route
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto">
          The page or subject link you entered does not exist. Search below or
          return to the Physics Cycle, Chemistry Cycle, or Homepage.
        </p>
      </div>

      <div className="max-w-xl mx-auto text-left">
        <SearchBar placeholder="Search subjects, notes, or tools..." />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] dark:bg-[#8DBBFF] text-white dark:text-[#080D1C] text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/physics-cycle"
          className="px-4 py-2.5 rounded-xl a1-surface text-xs font-semibold text-[var(--text-primary)]"
        >
          Physics Cycle
        </Link>
        <Link
          to="/chemistry-cycle"
          className="px-4 py-2.5 rounded-xl a1-surface text-xs font-semibold text-[var(--text-primary)]"
        >
          Chemistry Cycle
        </Link>
      </div>
    </div>
  );
};
