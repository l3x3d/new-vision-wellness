
import React, { useState } from 'react';
import { generateHopeStory } from '../services/geminiService';
import { SparklesIcon } from './IconComponents';

const HopeStoryGenerator: React.FC = () => {
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError('');
    setStory('');
    try {
      const generatedStory = await generateHopeStory();
      setStory(generatedStory);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-sky-900/20 p-8 md:p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <SparklesIcon className="mx-auto h-12 w-12 text-sky-500 dark:text-sky-400 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3">Find a Moment of Inspiration</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto">
            Sometimes, a story of hope is all we need to see the path forward. Click the button to read a fictional story of recovery and resilience.
          </p>
          
          <button
            onClick={handleGenerateStory}
            disabled={isLoading}
            className="bg-sky-600 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-all transform hover:scale-105 shadow-lg disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate a Hope Story'
            )}
          </button>

          {story && !isLoading && (
            <div className="mt-10 text-left p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg animate-fade-in">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-lora leading-relaxed">{story}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">Note: This story is fictional and generated for inspiration purposes only.</p>
            </div>
          )}
          {error && !isLoading && (
             <div className="mt-10 text-left p-6 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HopeStoryGenerator;