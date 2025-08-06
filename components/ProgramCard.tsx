
import React, { useState } from 'react';
import type { Program } from '../types';
import { ClockIconSVG, CheckIconSVG } from './IconComponents';

interface ProgramCardProps {
  program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

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
            <ClockIconSVG className="h-4 w-4 mr-2 flex-shrink-0" />
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
                <CheckIconSVG className="h-4 w-4 text-sky-500 mr-2 mt-1 flex-shrink-0" />
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

      {/* Learn More Button / Coming Soon Message */}
      {showComingSoon ? (
        <div className="mt-auto p-3 bg-sky-50 rounded-lg border border-sky-200">
          <p className="text-sky-700 font-semibold text-center">
            Coming Soon
          </p>
          <p className="text-sky-600 text-sm text-center mt-1">
            More details will be available soon!
          </p>
          <button
            onClick={() => setShowComingSoon(false)}
            className="text-sky-500 text-xs underline block mx-auto mt-2 hover:text-sky-700"
          >
            Go back
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowComingSoon(true)}
          className="mt-auto text-sky-600 font-semibold hover:text-sky-700 transition-colors flex items-center group-hover:translate-x-1 transition-transform"
        >
          Learn More <span className="arrow-animate inline-block transition-transform duration-200 ml-1">&rarr;</span>
        </button>
      )}
    </div>
  );
};

export default ProgramCard;