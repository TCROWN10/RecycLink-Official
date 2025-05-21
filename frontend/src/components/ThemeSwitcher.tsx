// 'use client'; // uncomment this line if you're using Next.js App Directory Setup

// components/ThemeSwitcher.tsx
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';
import { useWasteWiseContext } from '../context';

export const ThemeSwitcher = () => {
  const { darkMode } = useWasteWiseContext();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    darkMode.toggle();
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle hover:bg-primary/10"
      aria-label="Toggle theme"
    >
      {darkMode.value ? (
        <FaSun className="h-5 w-5 text-yellow-500" />
      ) : (
        <FaMoon className="h-5 w-5 text-slate-800" />
      )}
    </button>
  );
};
