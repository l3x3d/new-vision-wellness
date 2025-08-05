
import React from 'react';
import Testimonials from '../components/Testimonials';
import PageHeader from '../components/PageHeader';

interface TestimonialsPageProps {
  onOpenModal: () => void;
}

const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 bg-white">
      <header className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">
                Stories of Hope and Healing
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Read real stories from members of our community who have found a new beginning at NewVisionWellness.
            </p>
        </div>
      </header>
      <Testimonials />
      <div className="bg-white py-20">
        <div className="text-center bg-slate-100 p-10 rounded-2xl shadow-xl max-w-4xl mx-auto ring-1 ring-slate-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Story is Waiting to be Written</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Take the first step towards your own success story. Verifying your insurance is simple and confidential.
            </p>
            <button
                onClick={onOpenModal}
                className="bg-sky-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg"
            >
                Validate Insurance with Ai
            </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
