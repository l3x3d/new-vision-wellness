
import React from 'react';

interface InsuranceBannerProps {
  onOpenModal: () => void;
}

const InsuranceBanner: React.FC<InsuranceBannerProps> = ({ onOpenModal }) => {
  return (
    <section className="bg-gradient-to-r from-sky-500 to-sky-600">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div className="md:flex-grow">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">We Work With Major Insurance Providers</h2>
            <p className="text-sky-100 mt-2 text-lg">Your journey to recovery may be covered. Find out in minutes.</p>
          </div>
          <button
            onClick={onOpenModal}
            className="bg-white text-sky-600 font-bold px-8 py-3 rounded-full text-lg hover:bg-sky-50 transition-all transform hover:scale-105 shadow-lg flex-shrink-0 w-full sm:w-auto"
          >
            Validate Insurance with Ai
          </button>
        </div>
      </div>
    </section>
  );
};

export default InsuranceBanner;