import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbCrumb {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbCrumb[] }> = ({
  items,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 opacity-60 shrink-0"
                  aria-hidden="true"
                />
              )}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-[var(--accent-blue)] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast
                      ? 'font-semibold text-[var(--text-primary)]'
                      : undefined
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
