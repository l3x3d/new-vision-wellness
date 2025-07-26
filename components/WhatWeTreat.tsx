
import React from 'react';
import { AlcoholIcon, DrugIcon, DualDiagnosisIcon, MentalHealthIcon } from './IconComponents';

const treatments = [
  {
    icon: <AlcoholIcon className="h-10 w-10 text-sky-600 dark:text-sky-400" />,
    title: 'Alcohol Addiction',
    description: 'Specialized programs to help you overcome alcohol dependency in a supportive setting.',
  },
  {
    icon: <DrugIcon className="h-10 w-10 text-sky-600 dark:text-sky-400" />,
    title: 'Drug & Substance Abuse',
    description: 'Comprehensive care for various substance use disorders, focusing on long-term recovery.',
  },
  {
    icon: <DualDiagnosisIcon className="h-10 w-10 text-sky-600 dark:text-sky-400" />,
    title: 'Dual Diagnosis',
    description: 'Integrated treatment for co-occurring addiction and mental health conditions like depression or anxiety.',
  },
  {
    icon: <MentalHealthIcon className="h-10 w-10 text-sky-600 dark:text-sky-400" />,
    title: 'Mental Health Support',
    description: 'Targeted support for mental health challenges, providing coping strategies and therapeutic care.',
  },
];

const WhatWeTreat: React.FC = () => {
  return (
    <section id="what-we-treat" className="py-20 md:py-28 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">What We Treat</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-2">
            Compassionate Care for a Range of Needs
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {treatments.map((item, index) => (
            <div key={index} className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl dark:hover:shadow-sky-900/30 hover:border-sky-500/30 dark:hover:border-sky-500/50 transition-all duration-300 text-center flex flex-col items-center">
              <div className="mb-5 flex-shrink-0">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeTreat;
