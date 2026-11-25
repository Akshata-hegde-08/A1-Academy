import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="space-y-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-[var(--text-primary)]"
          >
            <span className="w-9 h-9 rounded-lg bg-[#042C38] border border-[#F2B705]/40 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Screenshot_2026-11-18_174351_6e988c6c.png"
                alt="A1 Academy logo"
                className="w-full h-full object-cover"
              />
            </span>
            <span>A1 ACADEMY</span>
          </Link>
          <p className="text-sm text-[var(--text-secondary)]">
            Your First Engineering Hub – Everything You Need to Learn, Practice
            and Prepare.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
            <Link
              to="/about"
              className="hover:text-[var(--accent-blue)] transition-colors"
            >
              About Us
            </Link>
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            The first year of engineering is where curiosity meets new
            challenges and stronger foundations shape future possibilities. A1
            Academy is a student-focused learning platform designed to make this
            journey simpler, smarter, and more accessible. From understanding
            fundamental concepts to preparing for examinations, we bring
            together well-organized notes, lecture materials, previous year
            question papers, study resources, and practical learning
            guidance-all in one place.{' '}
            <Link
              to="/about"
              className="font-medium text-[var(--accent-blue)] hover:underline"
            >
              Learn more
            </Link>
          </p>
        </div>

        <div className="pt-5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <p>&copy; {new Date().getFullYear()} A1 ACADEMY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
