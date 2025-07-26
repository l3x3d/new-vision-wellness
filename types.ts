import React from 'react';

export interface Program {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}