"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mainEl = document.querySelector('main');

    const handleScroll = () => {
      const windowScroll = window.scrollY || document.documentElement.scrollTop;
      const mainScroll = mainEl ? mainEl.scrollTop : 0;
      setIsVisible(windowScroll > 250 || mainScroll > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-2xl border border-indigo-400/40 backdrop-blur-md transition-all duration-300 hover:scale-110 flex items-center gap-1.5 px-4 font-mono text-xs font-bold group"
    >
      <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
      <span>Top</span>
    </button>
  );
};
