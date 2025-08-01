
import React, { useState, useEffect } from 'react';
import { SparklesIcon, MenuIcon, XIcon, SunIcon, MoonIcon } from './IconComponents';

interface HeaderProps {
  onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize theme from localStorage or system preference synchronously
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isMenuOpen) {
        setIsScrolled(window.scrollY > 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { // Cleanup on unmount
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'About Us', href: '#learn-more' },
    { name: 'Programs', href: '#programs-page' },
    { name: 'Testimonials', href: '#testimonials-page' },
    { name: 'Contact', href: '#contact-page' },
  ];

  const ThemeToggleButton = ({ isMobile = false }) => (
     <button
        onClick={toggleTheme}
        className={`p-2 rounded-full transition-colors duration-300 ${isMobile ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
    </button>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-900/5' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center space-x-2 transition-opacity hover:opacity-80" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
              <SparklesIcon className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                NewVision<span className="font-semibold text-sky-500">Wellness</span>
              </span>
            </a>
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-slate-600 dark:text-slate-300 font-medium hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggleButton />
              <button
                onClick={onOpenModal}
                className="bg-sky-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-sky-700 transition-all transform hover:scale-105"
              >
                Get Help Now
              </button>
            </div>
            <div className="lg:hidden flex items-center space-x-2">
               <ThemeToggleButton isMobile />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 -mr-2 text-slate-700 dark:text-slate-300 rounded-md focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg pt-24 transition-opacity duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="container mx-auto px-6 h-full flex flex-col items-center text-center">
            <nav className="flex flex-col items-center space-y-8 mt-16">
                {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href} 
                        className="text-2xl font-bold text-slate-800 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>
            <button
                onClick={() => {
                    setIsMenuOpen(false);
                    onOpenModal();
                }}
                className="mt-12 bg-sky-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105"
            >
                Get Help Now
            </button>
        </div>
      </div>
    </>
  );
};

export default Header;
