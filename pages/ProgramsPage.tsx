
import React, { useState } from 'react';
import ProgramCard from '../components/ProgramCard';
import PageHeader from '../components/PageHeader';
import type { Program } from '../types';
import { UsersIcon, HeartIcon, AcademicCapIcon } from '../components/IconComponents';

const programsData: Program[] = [
  {
    icon: <UsersIcon className="h-4 w-4" />,
    title: 'Intensive Outpatient (IOP)',
    description: 'Our core program offers structured group therapy, individual counseling, and skill-building workshops while allowing you to maintain your daily life.'
  },
  {
    icon: <HeartIcon className="h-4 w-4" />,
    title: 'Individual Therapy',
    description: 'One-on-one sessions with a dedicated therapist to explore underlying issues, set personal goals, and develop coping strategies.'
  },
  {
    icon: <AcademicCapIcon className="h-4 w-4" />,
    title: 'Family & Couple Counseling',
    description: 'Healing the family system is crucial. We provide sessions to rebuild trust, improve communication, and foster a supportive home environment.'
  }
];

interface ProgramsPageProps {
  // No props needed currently
}

const ProgramsPage: React.FC<ProgramsPageProps> = () => {
  const [showComingSoonCTA, setShowComingSoonCTA] = useState<boolean>(false);
  return (
    <div className="bg-white">
      <PageHeader
        title="Tailored Pathways to Recovery"
        subtitle="We offer a range of programs designed to meet you where you are. Each path is built on a foundation of evidence-based care, compassionate support, and a commitment to your long-term well-being."
        backgroundImage="/images/hero/hero-2.png"
      />
      
      <section id="programs-page" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-sky-600 font-semibold tracking-wider uppercase">Our Programs</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {programsData.map((program, index) => (
            <ProgramCard key={index} program={program} />
          ))}
        </div>          <div className="text-center bg-slate-100 p-10 rounded-2xl shadow-xl max-w-4xl mx-auto ring-1 ring-slate-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Take the Next Step?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Verifying your insurance is a simple, confidential first step towards getting the help you deserve. Our team is ready to assist you.
            </p>
            <button
                onClick={() => setShowComingSoonCTA(true)}
                className="bg-sky-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg"
            >
                Validate Insurance with Ai
            </button>
            {showComingSoonCTA && (
              <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200 max-w-md mx-auto">
                <p className="text-sky-700 font-semibold text-center">
                  Coming Soon
                </p>
                <p className="text-sky-600 text-sm text-center mt-1">
                  AI insurance validation will be available soon!
                </p>
                <button
                  onClick={() => setShowComingSoonCTA(false)}
                  className="text-sky-500 text-xs underline block mx-auto mt-2 hover:text-sky-700"
                >
                  Go back
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
    </div>
  );
};

export default ProgramsPage;