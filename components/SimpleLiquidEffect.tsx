import React from 'react';

interface SimpleLiquidEffectProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
  color?: 'blue' | 'teal' | 'purple';
}

const SimpleLiquidEffect: React.FC<SimpleLiquidEffectProps> = ({
  className = "",
  intensity = 'medium',
  speed = 'medium',
  color = 'blue'
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'light': return 'opacity-20';
      case 'medium': return 'opacity-30';
      case 'strong': return 'opacity-40';
      default: return 'opacity-30';
    }
  };

  const getSpeedClass = () => {
    switch (speed) {
      case 'slow': return 'animate-[liquidFlow_12s_ease-in-out_infinite]';
      case 'medium': return 'animate-[liquidFlow_8s_ease-in-out_infinite]';
      case 'fast': return 'animate-[liquidFlow_4s_ease-in-out_infinite]';
      default: return 'animate-[liquidFlow_8s_ease-in-out_infinite]';
    }
  };

  const getColorGradient = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'teal':
        return 'from-teal-400 via-teal-500 to-teal-600';
      case 'purple':
        return 'from-purple-400 via-purple-500 to-purple-600';
      default:
        return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary liquid layer */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${getColorGradient()} 
          ${getIntensityClass()} ${getSpeedClass()}
          bg-[length:400%_400%]
        `}
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
            radial-gradient(circle at 75% 75%, rgba(37, 99, 235, 0.2) 0%, transparent 70%),
            linear-gradient(45deg, rgba(29, 78, 216, 0.1), rgba(30, 64, 175, 0.2))
          `
        }}
      />
      
      {/* Secondary flowing layer */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-tl ${getColorGradient()} 
          ${getIntensityClass()} 
          animate-[liquidFlow_10s_ease-in-out_infinite_reverse]
          bg-[length:300%_300%]
        `}
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 60% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(29, 78, 216, 0.15) 0%, transparent 50%)
          `,
          animationDelay: '2s'
        }}
      />
      
      {/* Floating blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 liquid-blob animate-[blobFloat_15s_ease-in-out_infinite]" />
      <div 
        className="absolute bottom-20 right-20 w-24 h-24 liquid-blob animate-[blobFloat_12s_ease-in-out_infinite]"
        style={{ animationDelay: '3s' }}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-20 h-20 liquid-blob animate-[blobFloat_18s_ease-in-out_infinite]"
        style={{ animationDelay: '6s' }}
      />
    </div>
  );
};

export default SimpleLiquidEffect;
