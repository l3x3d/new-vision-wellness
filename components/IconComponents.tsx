import React from 'react';

// Icon interface for consistent typing - Updated Aug 4, 2025
interface IconProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | number;
  variant?: 'filled' | 'outlined' | 'round';
  animate?: boolean;
}

// Base Material Icon component
const MaterialIcon: React.FC<IconProps & { iconName: string }> = ({ 
  className = "", 
  size = 'medium',
  variant = 'outlined',
  animate = false,
  iconName
}) => {
  // Check if className already contains size classes (h-*, w-*, text-*)
  const hasExplicitSize = /(?:h-\d+|w-\d+|text-\d*xl|text-xs|text-sm|text-base|text-lg)/.test(className);
  
  const sizeClass = hasExplicitSize ? '' : (typeof size === 'number' ? '' : 
    size === 'small' ? 'text-lg' :
    size === 'medium' ? 'text-xl' :
    'text-2xl');
  
  const variantClass = 
    variant === 'filled' ? 'material-icons' :
    variant === 'round' ? 'material-icons-round' :
    'material-icons-outlined';
  
  const style = typeof size === 'number' ? { fontSize: `${size}px` } : {};
  
  return (
    <span 
      className={`${variantClass} ${sizeClass} ${className} ${animate ? 'transition-all duration-300 hover:scale-110' : ''} inline-block align-text-bottom`}
      style={{
        ...style,
        lineHeight: '1',
        verticalAlign: 'text-bottom'
      }}
    >
      {iconName}
    </span>
  );
};

// SVG-based icons for better text alignment
interface SVGIconProps {
  className?: string;
  size?: number;
}

// SVG Clock Icon - better for text alignment
export const ClockIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

// SVG Check Icon - better for text alignment
export const CheckIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

// Navigation and UI Icons
export const UsersIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="groups" />
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="favorite" />
);

export const AcademicCapIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="school" />
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="auto_awesome" />
);

export const XIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="close" />
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="menu" />
);

// Contact Icons
export const PhoneIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="phone" />
);

export const MapPinIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="location_on" />
);

export const EnvelopeIconStandard: React.FC<IconProps> = (props) => <MaterialIcon {...props} iconName="email" />;
export const EnvelopeIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} iconName="email" />;

export const ClockIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="schedule" />
);

// Treatment Icons
export const AlcoholIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="local_bar" />
);

export const DrugIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="medication" />
);

export const DualDiagnosisIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="psychology" />
);

export const MentalHealthIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="psychology_alt" />
);

// Communication Icons
export const ChatBubbleIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="chat_bubble" />
);

export const SendIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="send" />
);

export const HealthBotIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="smart_toy" />
);

// Utility Icons
export const CheckIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="check" />
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified_user" />
);

// Program Icons
export const CalendarIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="calendar_month" />
);

export const UserGroupIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="group" />
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="home" />
);

export const PuzzlePieceIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="extension" />
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="star" />
);

export const BrainIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="psychology" />
);

export const LifebuoyIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="support" />
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="description" />
);

export const LightBulbIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="lightbulb" />
);

// Additional Required Icons
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="check_circle" />
);

export const ExclamationCircleIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="error" />
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="cancel" />
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="lock" />
);

// Logo placeholders (these will need to be replaced with actual logo components)
export const JointCommissionLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

export const LegitScriptLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

export const NaatpLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

export const PsychologyTodayLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

export const DhcsLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

export const BbbLogo: React.FC<IconProps> = (props) => (
  <MaterialIcon {...props} iconName="verified" />
);

// SVG Icons for better text alignment
// SVG Phone Icon
export const PhoneIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

// SVG Email Icon
export const EmailIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

// SVG Location Icon
export const LocationIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// SVG Chat Bubble Icon
export const ChatBubbleIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// SVG Menu Icon
export const MenuIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// SVG X (Close) Icon
export const XIconSVG: React.FC<SVGIconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block' }}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);