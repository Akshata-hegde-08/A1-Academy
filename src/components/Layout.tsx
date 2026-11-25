import React from 'react';
import { motion } from 'motion/react';
import { Header } from './Header';
import { NavigationDrawer } from './NavigationDrawer';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] relative overflow-x-clip">
      {/* Subtle ambient glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="hidden dark:block absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-[#8DBBFF]/8 blur-[120px]" />
        <div className="hidden dark:block absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full bg-[#C4ACFF]/7 blur-[120px]" />
      </div>

      <Header />
      <NavigationDrawer />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative z-10"
      >
        {children}
      </motion.main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
