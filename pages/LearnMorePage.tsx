
import React from 'react';
import WhatWeTreat from '../components/WhatWeTreat';
import OurApproach from '../components/OurApproach';
import WhyChooseUs from '../components/WhyChooseUs';
import InsuranceBanner from '../components/InsuranceBanner';

interface LearnMorePageProps {
  onOpenModal: () => void;
}

const LearnMorePage: React.FC<LearnMorePageProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 bg-white">
      <header className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">
                Our Philosophy of Care
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Discover our comprehensive approach to healing, the conditions we treat, and why our community is the right place to start your journey to recovery.
            </p>
        </div>
      </header>
      <WhatWeTreat />
      <OurApproach />
      <WhyChooseUs />
      <InsuranceBanner onOpenModal={onOpenModal} />
    </div>
  );
};

export default LearnMorePage;
