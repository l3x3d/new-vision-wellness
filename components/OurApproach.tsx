import React from 'react';

const OurApproach: React.FC = () => {
  return (
    <section id="approach" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1">
            <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mt-2 mb-6">
              Holistic Care for a Whole Life
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              We believe that true recovery extends beyond just treating symptoms. Our approach is rooted in addressing the whole person—mind, body, and spirit. We create personalized treatment plans that integrate evidence-based clinical therapies with wellness practices to foster sustainable healing.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Our dedicated team of professionals provides a supportive and non-judgmental environment, empowering you to build the resilience and skills needed to navigate life's challenges and embrace a future filled with hope.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" 
              alt="A woman practicing yoga outdoors, representing a holistic approach to wellness and peace." 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;