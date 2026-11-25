import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme, drawerOpen, setDrawerOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 a1-glass border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: A1 Academy Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)] rounded-lg"
        >
          <span className="w-10 h-10 rounded-lg bg-[#042C38] border border-[#F2B705]/40 overflow-hidden flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/Screenshot_2026-11-18_174351_6e988c6c.png"
              alt="A1 Academy logo"
              className="w-full h-full object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
            A1 ACADEMY
          </span>
        </Link>

        {/* Far Right: Theme toggle & Menu icon on same row */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="w-10 h-10 rounded-lg a1-surface flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#8DBBFF]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2563EB]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="h-10 px-3 rounded-lg a1-surface flex items-center gap-2 text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-colors whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline text-xs font-semibold">Menu</span>
            <Menu className="w-5 h-5 text-[var(--accent-blue)]" />
          </button>
        </div>
      </div>
    </header>
  );
};
