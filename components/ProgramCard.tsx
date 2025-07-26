
import React from 'react';
import type { Program } from '../types';

interface ProgramCardProps {
  program: Program;
  onOpenModal: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onOpenModal }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl dark:hover:shadow-sky-900/30 hover:border-sky-500/30 dark:hover:border-sky-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col group">
      <div className="text-sky-500 dark:text-sky-400 mb-5">
        {React.cloneElement(program.icon, { className: 'h-10 w-10' })}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{program.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 flex-grow mb-6">{program.description}</p>
      <button
        onClick={onOpenModal}
        className="mt-auto text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center"
      >
        Learn More <span className="arrow-animate inline-block transition-transform duration-200 ml-1">&rarr;</span>
      </button>
    </div>
  );
};

export default ProgramCard;