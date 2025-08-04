
import React from 'react';
import type { Testimonial } from '../types';

const testimonialsData: Testimonial[] = [
  {
    quote: "NewVisionWellness gave me the tools not just to get sober, but to build a life I'm proud of. I'm forever grateful to the compassionate staff who guided me every step of the way.",
    author: '— Alex R.'
  },
  {
    quote: "I was hesitant to start, but the sense of community and understanding I found was incredible. This place didn't just treat my addiction; it healed my spirit.",
    author: '— Jessica M.'
  },
  {
    quote: "The family program was a game-changer for us. We learned to communicate and support each other in ways we never thought possible. Our family is healing together.",
    author: '— The P. Family'
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <figure className="bg-white p-8 rounded-xl border border-slate-200/80 flex flex-col h-full">
    <blockquote className="text-lg text-slate-600 italic border-l-2 border-sky-500 pl-6 font-lora flex-grow">
      "{testimonial.quote}"
    </blockquote>
    <figcaption className="mt-6 text-right font-bold text-slate-700">
      {testimonial.author}
    </figcaption>
  </figure>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sky-600 font-semibold tracking-wider uppercase">Words of Hope</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">
            Stories from Our Community
          </h2>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;