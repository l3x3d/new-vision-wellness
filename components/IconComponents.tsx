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
  size = 'large',
  variant = 'outlined',
  animate = false,
  iconName
}) => {
  const sizeClass = typeof size === 'number' ? '' : 
    size === 'small' ? 'text-2xl' :
    size === 'medium' ? 'text-4xl' :
    'text-5xl';
  
  const variantClass = 
    variant === 'filled' ? 'material-icons' :
    variant === 'round' ? 'material-icons-round' :
    'material-icons-outlined';
  
  const style = typeof size === 'number' ? { fontSize: `${size}px` } : {};
  
  return (
    <span 
      className={`${variantClass} ${sizeClass} ${className} ${animate ? 'transition-all duration-300 hover:scale-110' : ''}`}
      style={style}
    >
      {iconName}
    </span>
  );
};

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

export default MaterialIcon;