import React from 'react';

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
             <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="A diverse group of people smiling and connecting, representing a strong community." 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div>
            <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">Our Commitment</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-2 mb-6">
              Why Choose NewVisionWellness?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              We are dedicated to providing a path to recovery that is as unique as you are. Our center is built on a foundation of empathy, clinical excellence, and unwavering support.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start">
                <Checkmark className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Expert & Compassionate Staff</h4>
                  <p className="text-slate-600 dark:text-slate-300">Our team consists of licensed therapists and medical professionals who specialize in addiction and mental health treatment.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Checkmark className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Personalized Treatment Plans</h4>
                  <p className="text-slate-600 dark:text-slate-300">We don't believe in a one-size-fits-all approach. Your care plan is tailored to your specific needs, history, and goals.</p>
                </div>
              </li>
               <li className="flex items-start">
                <Checkmark className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">A Supportive Community</h4>
                  <p className="text-slate-600 dark:text-slate-300">Heal alongside peers who understand your journey in a safe, non-judgmental, and encouraging environment.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Checkmark: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);


export default WhyChooseUs;