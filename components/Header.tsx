
import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';
import { SparklesIcon, MenuIconSVG, XIconSVG } from './IconComponents';

interface HeaderProps {
  onOpenModal: () => void;
  onOpenHIPAAChat?: () => void;
  onOpenEnhancedChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, onOpenHIPAAChat, onOpenEnhancedChat }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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



  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center space-x-2 transition-opacity hover:opacity-80" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
              <SparklesIcon className="h-6 w-6 text-sky-500" />
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                NewVision<span className="font-semibold text-sky-500">Wellness</span>
              </span>
            </a>
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-slate-600 font-medium hover:text-sky-600 transition-colors">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative group">
                <button
                  onClick={() => {
                    track('get_help_now_clicked', {
                      location: 'header',
                      button_text: 'Get Help Now'
                    });
                    onOpenModal();
                  }}
                  className="bg-sky-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-sky-700 transition-all transform hover:scale-105"
                >
                  Get Help Now
                </button>
                {onOpenHIPAAChat && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3">
                      <button
                        onClick={() => {
                          track('insurance_verification_dropdown_clicked', {
                            location: 'header_dropdown',
                            button_text: 'Insurance Verification'
                          });
                          onOpenModal();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mb-1"
                      >
                        📋 Insurance Verification
                      </button>
                      <button
                        onClick={() => {
                          track('hipaa_chat_clicked', {
                            location: 'header_dropdown',
                            button_text: 'HIPAA-Compliant AI Chat'
                          });
                          onOpenHIPAAChat();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mb-1"
                      >
                        🔒 HIPAA-Compliant AI Chat
                      </button>
                      {onOpenEnhancedChat && (
                        <button
                          onClick={() => {
                            track('enhanced_ai_chat_clicked', {
                              location: 'header_dropdown',
                              button_text: 'Enhanced AI Companion'
                            });
                            onOpenEnhancedChat();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          ✨ Enhanced AI Companion (Gemini 2.5)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:hidden flex items-center space-x-2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 -mr-2 text-slate-700 rounded-md focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <XIconSVG className="h-6 w-6" /> : <MenuIconSVG className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg pt-24 transition-opacity duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="container mx-auto px-6 h-full flex flex-col items-center text-center">
            <nav className="flex flex-col items-center space-y-8 mt-16">
                {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href} 
                        className="text-2xl font-bold text-slate-800 hover:text-sky-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>
            <div className="flex flex-col items-center space-y-4 mt-12">
              <button
                  onClick={() => {
                      track('insurance_verification_mobile_clicked', {
                        location: 'mobile_menu',
                        button_text: 'Insurance Verification'
                      });
                      setIsMenuOpen(false);
                      onOpenModal();
                  }}
                  className="bg-sky-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105"
              >
                  📋 Insurance Verification
              </button>
              {onOpenHIPAAChat && (
                <button
                    onClick={() => {
                        track('hipaa_chat_mobile_clicked', {
                          location: 'mobile_menu',
                          button_text: 'HIPAA AI Chat'
                        });
                        setIsMenuOpen(false);
                        onOpenHIPAAChat();
                    }}
                    className="bg-green-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-green-700 transition-all transform hover:scale-105"
                >
                    🔒 HIPAA AI Chat
                </button>
              )}
              {onOpenEnhancedChat && (
                <button
                    onClick={() => {
                        track('enhanced_ai_chat_mobile_clicked', {
                          location: 'mobile_menu',
                          button_text: 'Enhanced AI Companion'
                        });
                        setIsMenuOpen(false);
                        onOpenEnhancedChat();
                    }}
                    className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                    ✨ Enhanced AI Companion
                </button>
              )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
