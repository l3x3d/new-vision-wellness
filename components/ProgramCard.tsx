
import React from 'react';
import type { Program } from '../types';
import { ClockIcon, CheckIcon } from './IconComponents';

interface ProgramCardProps {
  program: Program;
  onOpenModal: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onOpenModal }) => {
  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Intensive': return 'text-red-600 bg-red-100';
      default: return 'text-sky-600 bg-sky-100';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl hover:border-sky-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col group">
      {/* Header with icon and intensity badge */}
      <div className="flex items-start justify-between mb-5">
        <div className="text-sky-500">
          {React.cloneElement(program.icon, { className: 'h-10 w-10' })}
        </div>
        {program.intensity && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getIntensityColor(program.intensity)}`}>
            {program.intensity}
          </span>
        )}
      </div>

      {/* Title and Duration */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{program.title}</h3>
        {program.duration && (
          <div className="flex items-center text-slate-500 text-sm">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{program.duration}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-600 mb-6 flex-grow">{program.description}</p>

      {/* Features List */}
      {program.features && program.features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
            Key Features
          </h4>
          <ul className="space-y-2">
            {program.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-slate-600">
                <CheckIcon className="h-4 w-4 text-sky-500 mr-2 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {program.features.length > 3 && (
              <li className="text-sm text-slate-500 italic">
                +{program.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Learn More Button */}
      <button
        onClick={onOpenModal}
        className="mt-auto text-sky-600 font-semibold hover:text-sky-700 transition-colors flex items-center group-hover:translate-x-1 transition-transform"
      >
        Learn More <span className="arrow-animate inline-block transition-transform duration-200 ml-1">&rarr;</span>
      </button>
    </div>
  );
};

export default ProgramCard;