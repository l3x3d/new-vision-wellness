import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  className = "" 
}) => {
  return (
    <header className={`relative py-24 md:py-32 pt-40 overflow-hidden ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-900/60"></div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-blue-900/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </header>
  );
};

export default PageHeader;
