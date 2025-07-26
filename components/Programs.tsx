
import React from 'react';
import ProgramCard from './ProgramCard';
import type { Program } from '../types';
import { UsersIcon, HeartIcon, AcademicCapIcon } from './IconComponents';

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

interface ProgramsProps {
  onOpenModal: () => void;
}

const Programs: React.FC<ProgramsProps> = ({ onOpenModal }) => {
  return (
    <section id="programs" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 text-center">
        <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">Our Programs</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-2 mb-16">
          Tailored Pathways to Recovery
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {programsData.map((program, index) => (
            <ProgramCard key={index} program={program} onOpenModal={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;