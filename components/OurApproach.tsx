import React from 'react';

const OurApproach: React.FC = () => {
  return (
    <section id="approach" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1">
            <span className="text-sky-600 font-semibold tracking-wider uppercase">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2 mb-6">
              Holistic Care for a Whole Life
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              We believe that true recovery extends beyond just treating symptoms. Our approach is rooted in addressing the whole person—mind, body, and spirit. We create personalized treatment plans that integrate evidence-based clinical therapies with wellness practices to foster sustainable healing.
            </p>
            <p className="text-lg text-slate-600">
              Our dedicated team of professionals provides a supportive and non-judgmental environment, empowering you to build the resilience and skills needed to navigate life's challenges and embrace a future filled with hope.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="/images/hero/hero-3.png" 
              alt="NewVision Wellness holistic approach - peaceful therapy environment promoting healing and wellness." 
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;