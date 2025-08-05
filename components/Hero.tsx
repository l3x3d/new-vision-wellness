
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onOpenModal: () => void;
}

const heroImages = [
  {
    src: '/images/hero/hero-1.png',
    alt: 'NewVision Wellness treatment facility - welcoming environment for recovery and healing.'
  },
  {
    src: '/images/hero/hero-2.png',
    alt: 'Professional therapy session - compassionate care and expert guidance for addiction recovery.'
  },
  {
    src: '/images/hero/hero-3.png',
    alt: 'Group therapy and community support - building connections on the path to wellness.'
  },
  {
    src: '/images/Generated Image August 04, 2025 - 7_19PM.jpeg',
    alt: 'Latest therapeutic environment - modern wellness space designed for comprehensive addiction recovery.'
  }
];

const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const loadImages = async () => {
      try {
        await Promise.all(
          heroImages.map(image => 
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = image.src;
              img.onload = resolve;
              img.onerror = () => reject(`Failed to load image: ${image.src}`);
            })
          )
        );
        if (!cancelled) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error preloading hero images:", error);
        if (!cancelled) {
          setIsLoaded(true); // Attempt to show content even if images fail
        }
      }
    };
    
    loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isLoaded]);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden pt-24">
      {/* Background Image Slider */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {isLoaded ? (
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800"></div>
            )}
          </div>
        ))}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
          A New Vision for a Brighter Future
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
          Compassionate, personalized care to help you reclaim your life from addiction. Your journey to recovery starts here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onOpenModal}
            className="bg-sky-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto"
          >
            Validate Insurance with Ai
          </button>
          <a
            href="#learn-more"
            className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/30 transition-all transform hover:scale-105 w-full sm:w-auto"
          >
            Learn More
          </a>
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;