import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SavedBookmark {
  id: string;
  title: string;
  subjectName: string;
  cycleName: string;
  categoryTitle: string;
  path: string;
}

interface AppContextValue {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  bookmarks: SavedBookmark[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (item: SavedBookmark) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'a1_academy_theme';
const BOOKMARKS_STORAGE_KEY = 'a1_academy_bookmarks';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore storage errors
    }
    return 'dark';
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage errors
    }
  }, [bookmarks]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isBookmarked = (id: string) => bookmarks.some((b) => b.id === id);

  const toggleBookmark = (item: SavedBookmark) => {
    setBookmarks((prev) =>
      prev.some((b) => b.id === item.id)
        ? prev.filter((b) => b.id !== item.id)
        : [item, ...prev],
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        drawerOpen,
        setDrawerOpen,
        bookmarks,
        isBookmarked,
        toggleBookmark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
