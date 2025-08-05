
import React, { useState } from 'react';
import ProgramCard from './ProgramCard';
import type { Program } from '../types';
import { 
  UsersIcon, 
  HeartIcon, 
  UserGroupIcon,
  HomeIcon,
  PuzzlePieceIcon,
  StarIcon,
  BrainIcon,
  LifebuoyIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CalendarIcon,
  AlcoholIcon,
  DrugIcon,
  DualDiagnosisIcon,
  MentalHealthIcon
} from './IconComponents';

const programsData: Program[] = [
  // Core Programs
  {
    icon: <UsersIcon className="h-4 w-4" />,
    title: 'Intensive Outpatient Program (IOP)',
    description: 'Our flagship comprehensive treatment program offering structured group therapy, individual counseling, and evidence-based interventions while maintaining your daily responsibilities.',
    duration: '12-16 weeks, 3-4 days/week',
    intensity: 'Intensive',
    category: 'Core Programs',
    features: [
      'Group therapy sessions 3x weekly',
      'Individual therapy sessions',
      'Family therapy component',
      'Psychiatric evaluation and medication management',
      'Case management services',
      'Relapse prevention planning',
      'Life skills workshops',
      'Aftercare planning'
    ]
  },
  {
    icon: <HeartIcon className="h-4 w-4" />,
    title: 'Individual Therapy',
    description: 'Personalized one-on-one sessions with licensed therapists specializing in addiction and mental health, tailored to your unique recovery journey and personal goals.',
    duration: 'Ongoing, weekly sessions',
    intensity: 'Moderate',
    category: 'Core Programs',
    features: [
      'Cognitive Behavioral Therapy (CBT)',
      'Dialectical Behavior Therapy (DBT)',
      'Trauma-informed care',
      'Motivational interviewing',
      'Mindfulness-based approaches',
      'Goal-setting and progress tracking'
    ]
  },
  {
    icon: <UserGroupIcon className="h-4 w-4" />,
    title: 'Family & Couples Therapy',
    description: 'Specialized counseling to heal relationships, rebuild trust, improve communication, and create a supportive family environment essential for lasting recovery.',
    duration: '8-12 sessions, bi-weekly',
    intensity: 'Moderate',
    category: 'Core Programs',
    features: [
      'Family systems therapy approach',
      'Communication skills training',
      'Boundary setting workshops',
      'Trust rebuilding exercises',
      'Co-dependency recovery',
      'Family education sessions'
    ]
  },
  {
    icon: <HomeIcon className="h-4 w-4" />,
    title: 'Partial Hospitalization Program (PHP)',
    description: 'Intensive daily treatment program providing comprehensive care for those needing more support than traditional outpatient services but not requiring residential care.',
    duration: '4-8 weeks, 5-6 hours daily',
    intensity: 'Intensive',
    category: 'Core Programs',
    features: [
      'Daily group and individual therapy',
      'Medical monitoring and psychiatric care',
      'Medication management',
      'Structured daily schedule',
      'Peer support groups',
      'Transition planning to IOP'
    ]
  },

  // Specialized Care
  {
    icon: <AlcoholIcon className="h-4 w-4" />,
    title: 'Alcohol Use Disorder Treatment',
    description: 'Comprehensive treatment specifically designed for alcohol addiction, incorporating medical detox support, specialized therapy, and long-term recovery planning.',
    duration: '12-24 weeks',
    intensity: 'High',
    category: 'Specialized Care',
    features: [
      'Medical detox coordination',
      'Alcohol-specific education',
      'Nutritional counseling',
      'Liver health monitoring',
      'SMART Recovery principles',
      'Relapse prevention strategies'
    ]
  },
  {
    icon: <DrugIcon className="h-4 w-4" />,
    title: 'Substance Use Disorder Treatment',
    description: 'Evidence-based treatment for various substance dependencies including opioids, stimulants, and other controlled substances with medication-assisted treatment options.',
    duration: '16-26 weeks',
    intensity: 'Intensive',
    category: 'Specialized Care',
    features: [
      'Medication-assisted treatment (MAT)',
      'Harm reduction approaches',
      'Overdose prevention education',
      'Peer recovery support',
      'Contingency management',
      'Long-term maintenance planning'
    ]
  },
  {
    icon: <DualDiagnosisIcon className="h-4 w-4" />,
    title: 'Dual Diagnosis Treatment',
    description: 'Integrated treatment for co-occurring mental health and substance use disorders, addressing both conditions simultaneously for optimal outcomes.',
    duration: '16-32 weeks',
    intensity: 'Intensive',
    category: 'Specialized Care',
    features: [
      'Integrated treatment approach',
      'Psychiatric medication management',
      'Mental health stabilization',
      'Trauma-informed care',
      'DBT skills groups',
      'Crisis intervention planning'
    ]
  },
  {
    icon: <MentalHealthIcon className="h-4 w-4" />,
    title: 'Mental Health Services',
    description: 'Comprehensive mental health treatment for anxiety, depression, PTSD, and other mental health conditions that may contribute to or result from substance use.',
    duration: 'Ongoing, as needed',
    intensity: 'Moderate',
    category: 'Specialized Care',
    features: [
      'Anxiety and depression treatment',
      'PTSD and trauma therapy',
      'Bipolar disorder management',
      'Personality disorder treatment',
      'Grief and loss counseling',
      'Stress management techniques'
    ]
  },

  // Therapeutic Modalities
  {
    icon: <BrainIcon className="h-4 w-4" />,
    title: 'Cognitive Behavioral Therapy (CBT)',
    description: 'Evidence-based therapy focusing on identifying and changing negative thought patterns and behaviors that contribute to addiction and mental health challenges.',
    duration: '12-20 sessions',
    intensity: 'Moderate',
    category: 'Therapeutic Modalities',
    features: [
      'Thought pattern identification',
      'Behavioral modification techniques',
      'Coping skills development',
      'Relapse prevention strategies',
      'Homework assignments',
      'Progress monitoring'
    ]
  },
  {
    icon: <StarIcon className="h-4 w-4" />,
    title: 'Dialectical Behavior Therapy (DBT)',
    description: 'Specialized therapy teaching mindfulness, emotion regulation, distress tolerance, and interpersonal effectiveness skills for lasting emotional stability.',
    duration: '24 weeks (6-month program)',
    intensity: 'High',
    category: 'Therapeutic Modalities',
    features: [
      'Mindfulness training',
      'Emotion regulation skills',
      'Distress tolerance techniques',
      'Interpersonal effectiveness',
      'Weekly individual sessions',
      'Skills group participation'
    ]
  },
  {
    icon: <LightBulbIcon className="h-4 w-4" />,
    title: 'EMDR Therapy',
    description: 'Eye Movement Desensitization and Reprocessing therapy for trauma recovery, helping process traumatic experiences that may underlie addiction.',
    duration: '8-16 sessions',
    intensity: 'High',
    category: 'Therapeutic Modalities',
    features: [
      'Trauma processing',
      'Memory reprocessing',
      'Bilateral stimulation',
      'Anxiety reduction',
      'PTSD symptom relief',
      'Emotional healing'
    ]
  },
  {
    icon: <PuzzlePieceIcon className="h-4 w-4" />,
    title: 'Holistic Therapy',
    description: 'Integrative approaches including yoga, meditation, art therapy, and wellness practices that support whole-person healing and recovery.',
    duration: 'Ongoing, flexible',
    intensity: 'Low',
    category: 'Therapeutic Modalities',
    features: [
      'Yoga and meditation',
      'Art and music therapy',
      'Nutritional counseling',
      'Fitness and wellness',
      'Mindfulness practices',
      'Stress reduction techniques'
    ]
  },

  // Support Services
  {
    icon: <CalendarIcon className="h-4 w-4" />,
    title: 'Case Management',
    description: 'Comprehensive coordination of care including healthcare, housing, employment, legal, and social services to support your recovery journey.',
    duration: 'Throughout treatment',
    intensity: 'Low',
    category: 'Support Services',
    features: [
      'Healthcare coordination',
      'Housing assistance',
      'Employment support',
      'Legal referrals',
      'Benefits navigation',
      'Crisis intervention'
    ]
  },
  {
    icon: <LifebuoyIcon className="h-4 w-4" />,
    title: 'Peer Recovery Support',
    description: 'Support from trained peer recovery specialists who have lived experience with addiction and can provide guidance, hope, and practical assistance.',
    duration: 'Ongoing availability',
    intensity: 'Low',
    category: 'Support Services',
    features: [
      'Peer mentorship',
      'Recovery coaching',
      'Support group facilitation',
      'Crisis support',
      'Community resource connection',
      'Advocacy assistance'
    ]
  },
  {
    icon: <DocumentTextIcon className="h-4 w-4" />,
    title: 'Aftercare & Alumni Services',
    description: 'Continuing support after program completion including alumni groups, ongoing counseling, and access to resources for maintaining long-term recovery.',
    duration: 'Lifetime access',
    intensity: 'Low',
    category: 'Support Services',
    features: [
      'Alumni support groups',
      'Continuing therapy options',
      'Crisis intervention',
      'Social events and activities',
      'Mentor program',
      'Resource library access'
    ]
  }
];

interface ProgramsProps {
  onOpenModal: () => void;
}

const Programs: React.FC<ProgramsProps> = ({ onOpenModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Core Programs', 'Specialized Care', 'Therapeutic Modalities', 'Support Services'];
  
  const filteredPrograms = selectedCategory === 'All' 
    ? programsData 
    : programsData.filter(program => program.category === selectedCategory);

  return (
    <section id="programs" className="py-20 md:py-32 bg-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sky-600 font-semibold tracking-wider uppercase">Our Programs</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2 mb-6">
            Tailored Pathways to Recovery
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We offer a comprehensive range of evidence-based treatment programs and therapeutic modalities, 
            each designed to meet you where you are in your recovery journey and provide the support you need to heal.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program, index) => (
            <ProgramCard key={`${program.title}-${index}`} program={program} onOpenModal={onOpenModal} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Not sure which program is right for you?
            </h3>
            <p className="text-slate-600 mb-6">
              Our experienced team will work with you to create a personalized treatment plan that addresses your 
              unique needs, goals, and circumstances. Every recovery journey is different, and we're here to support yours.
            </p>
            <button
              onClick={onOpenModal}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Personalized Recommendations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;