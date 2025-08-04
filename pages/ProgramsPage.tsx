
import React from 'react';
import ProgramCard from '../components/ProgramCard';
import type { Program } from '../types';
import { UsersIcon, HeartIcon, AcademicCapIcon } from '../components/IconComponents';

const programsData: Program[] = [
  {
    icon: <UsersIcon className="h-8 w-8" />,
    title: 'Intensive Outpatient (IOP)',
    description: 'Our core program offers structured group therapy, individual counseling, and skill-building workshops while allowing you to maintain your daily life.'
  },
  {
    icon: <HeartIcon className="h-8 w-8" />,
    title: 'Individual Therapy',
    description: 'One-on-one sessions with a dedicated therapist to explore underlying issues, set personal goals, and develop coping strategies.'
  },
  {
    icon: <AcademicCapIcon className="h-8 w-8" />,
    title: 'Family & Couple Counseling',
    description: 'Healing the family system is crucial. We provide sessions to rebuild trust, improve communication, and foster a supportive home environment.'
  }
];

interface ProgramsPageProps {
  onOpenModal: () => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenModal }) => {
  return (
    <section id="programs-page" className="bg-white py-24 md:py-32 pt-40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sky-600 font-semibold tracking-wider uppercase">Our Programs</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">
            Tailored Pathways to Recovery
          </h1>
          <p className="text-lg text-slate-600 mb-12">
            We offer a range of programs designed to meet you where you are. Each path is built on a foundation of evidence-based care, compassionate support, and a commitment to your long-term well-being.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {programsData.map((program, index) => (
            <ProgramCard key={index} program={program} onOpenModal={onOpenModal} />
          ))}
        </div>          <div className="text-center bg-slate-100 p-10 rounded-2xl shadow-xl max-w-4xl mx-auto ring-1 ring-slate-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Take the Next Step?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Verifying your insurance is a simple, confidential first step towards getting the help you deserve. Our team is ready to assist you.
            </p>
            <button
                onClick={onOpenModal}
                className="bg-sky-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg"
            >
                Validate Insurance with Ai
            </button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsPage;