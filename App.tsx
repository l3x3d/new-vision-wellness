
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhatWeTreat from './components/WhatWeTreat';
import OurApproach from './components/OurApproach';
import WhyChooseUs from './components/WhyChooseUs';
import Programs from './components/Programs';
import Testimonials from './components/Testimonials';
import InsuranceBanner from './components/InsuranceBanner';
import HopeStoryGenerator from './components/HopeStoryGenerator';
import Footer from './components/Footer';
import InsuranceBotModal from './components/InsuranceBotModal';
// import SecureInsuranceBotModal from './components/SecureInsuranceBotModal';
import FloatingBotButton from './components/FloatingBotButton';
import ProgramsPage from './pages/ProgramsPage';
import LearnMorePage from './pages/LearnMorePage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import StaffDashboardPage from './pages/StaffDashboardPage';


function getPageIdentifier(hash = window.location.hash) {
  const page = hash.replace(/^#/, '');
  const validPages = ['programs-page', 'learn-more', 'testimonials-page', 'contact-page', 'staff-dashboard'];
  if (validPages.includes(page)) {
    return page;
  }
  return 'home'; // Default to home for any other hash
}


const App: React.FC = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(getPageIdentifier());

  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageIdentifier(window.location.hash);

      // Use a functional update for setting state to avoid stale closure issues.
      setCurrentPage(prevPage => {
        if (newPage !== prevPage) {
          // This is a page navigation, scroll to the top.
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (newPage === 'home') {
          // This is a same-page anchor link on the homepage.
          const id = window.location.hash.replace(/^#/, '');
          
          // Use a timeout to allow the DOM to be ready for scrolling
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              const headerOffset = 100; // Height of fixed header
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            } else if (!id) { // This handles href="#" to go to the top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 50); // Small delay to ensure render is complete
        }
        return newPage;
      });
    };

    // Handle initial page load, including scrolling to anchors on the homepage
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Run only once on mount. State updates are handled internally.

  const renderPage = () => {
    switch (currentPage) {
      case 'programs-page':
        return <ProgramsPage onOpenModal={() => setIsBotOpen(true)} />;
      case 'learn-more':
        return <LearnMorePage onOpenModal={() => setIsBotOpen(true)} />;
      case 'testimonials-page':
        return <TestimonialsPage onOpenModal={() => setIsBotOpen(true)} />;
      case 'contact-page':
        return <ContactPage onOpenModal={() => setIsBotOpen(true)} />;
      case 'staff-dashboard':
        return <StaffDashboardPage />;
      case 'home':
      default:
        return (
          <>
            <Hero onOpenModal={() => setIsBotOpen(true)} />
            <div id="what-we-treat"><WhatWeTreat /></div>
            <div id="approach"><OurApproach /></div>
            <div id="why-choose-us"><WhyChooseUs /></div>
            <div id="programs"><Programs onOpenModal={() => setIsBotOpen(true)} /></div>
            <div id="testimonials"><Testimonials /></div>
            <InsuranceBanner onOpenModal={() => setIsBotOpen(true)} />
            <HopeStoryGenerator />
          </>
        );
    }
  };


  return (
    <>
      <Header onOpenModal={() => setIsBotOpen(true)} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <FloatingBotButton onOpen={() => setIsBotOpen(true)} />
      <InsuranceBotModal isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
    </>
  );
};

export default App;
