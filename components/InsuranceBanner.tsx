
import React from 'react';

interface InsuranceBannerProps {
  onOpenModal: () => void;
}

const InsuranceBanner: React.FC<InsuranceBannerProps> = ({ onOpenModal }) => {
  return (
    <section className="bg-gradient-to-r from-sky-500 to-sky-600">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-12">
          <div className="lg:flex-grow max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              We Work With Major Insurance Providers
            </h2>
            <p className="text-sky-100 mt-4 text-xl md:text-2xl leading-relaxed">
              Your journey to recovery may be covered. Find out in minutes with our AI-powered verification system.
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">✓ Instant Verification</h3>
                <p className="text-sky-100 text-base">
                  Get immediate feedback on your insurance coverage for our intensive outpatient programs, individual therapy, and family counseling services.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">✓ Accepted Providers</h3>
                <p className="text-sky-100 text-base">
                  We work with Blue Cross, Aetna, Cigna, UnitedHealthcare, BCBS, and many other major insurance networks to make treatment accessible.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">✓ Confidential Process</h3>
                <p className="text-sky-100 text-base">
                  Your information is secure and protected. Our verification process follows strict privacy guidelines to keep your data safe.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">✓ No Commitment Required</h3>
                <p className="text-sky-100 text-base">
                  Checking your benefits is completely free with no obligation. Get the information you need to make informed decisions about your care.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <p className="text-white text-lg font-semibold mb-2">
                Don't let insurance questions delay your recovery
              </p>
              <p className="text-sky-100 text-base">
                Our AI assistant will help you understand your coverage details, deductibles, and co-pays in plain language. 
                Start your verification now and take the first step toward getting the help you deserve.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 lg:flex-shrink-0">
            <button
              onClick={onOpenModal}
              className="bg-white text-sky-600 font-bold px-10 py-4 rounded-full text-xl hover:bg-sky-50 transition-all transform hover:scale-105 shadow-xl w-full lg:w-auto min-w-[280px]"
            >
              Validate Insurance with AI
            </button>
            <p className="text-sky-100 text-sm italic">
              Takes less than 3 minutes • Completely confidential • No cost
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceBanner;