import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home,
  BookOpen,
  FlaskConical,
  FileQuestion,
  Library,
  Calculator,
  Info,
  X,
  Atom,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const MAIN_MENU_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Subjects', to: '/subjects', icon: BookOpen },
  { label: 'Labs', to: '/labs', icon: FlaskConical },
  { label: 'Previous Year Papers', to: '/question-bank', icon: FileQuestion },
  { label: 'Reference Material', to: '/reference-material', icon: Library },
  { label: 'CGPA Calculation', to: '/cgpa-calculator', icon: Calculator },
  { label: 'About Us', to: '/about', icon: Info },
];

const CYCLE_SHORTCUTS = [
  { label: 'Physics Cycle', to: '/physics-cycle', icon: Atom },
  { label: 'Chemistry Cycle', to: '/chemistry-cycle', icon: Sparkles },
  { label: 'Study Tips', to: '/study-tips', icon: Lightbulb },
];

export const NavigationDrawer: React.FC = () => {
  const { drawerOpen, setDrawerOpen, bookmarks } = useApp();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    if (drawerOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#2563EB]/12 dark:bg-[#8DBBFF]/15 text-[var(--accent-blue)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            aria-label="Site navigation drawer"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs sm:max-w-sm a1-surface-secondary border-l border-[var(--border-subtle)] shadow-2xl flex flex-col"
          >
            <div className="px-5 h-16 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span className="font-display font-bold text-base text-[var(--text-primary)]">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 rounded-lg a1-surface flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <nav aria-label="Main menu" className="space-y-1">
                <p className="px-3.5 pb-1 text-xs font-semibold text-[var(--text-secondary)]">
                  Explore Platform
                </p>
                {MAIN_MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setDrawerOpen(false)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-[var(--border-subtle)] pt-4 space-y-1">
                <p className="px-3.5 pb-1 text-xs font-semibold text-[var(--text-secondary)]">
                  First-Year Cycles &amp; Guides
                </p>
                {CYCLE_SHORTCUTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      className={linkClass}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4 px-3.5">
                <p className="text-xs text-[var(--text-secondary)]">
                  Saved Resources:{' '}
                  <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                    {bookmarks.length}
                  </span>
                </p>
                <NavLink
                  to="/resources?saved=true"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-1.5 inline-block text-xs font-medium text-[var(--accent-blue)] hover:underline"
                >
                  View saved bookmarks
                </NavLink>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
