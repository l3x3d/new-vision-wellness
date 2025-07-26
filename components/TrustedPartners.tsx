
import React from 'react';
import { JointCommissionLogo, LegitScriptLogo, NaatpLogo, PsychologyTodayLogo, DhcsLogo, BbbLogo } from './IconComponents';

const partners = [
  {
    name: 'The Joint Commission',
    logo: <JointCommissionLogo className="h-12 w-auto" />,
    url: 'https://www.jointcommission.org/',
  },
  {
    name: 'DHCS',
    logo: <DhcsLogo className="h-12 w-auto" />,
    url: 'https://www.dhcs.ca.gov/',
  },
  {
    name: 'LegitScript Certified',
    logo: <LegitScriptLogo className="h-10 w-auto" />,
    url: 'https://www.legitscript.com/',
  },
  {
    name: 'Better Business Bureau',
    logo: <BbbLogo className="h-10 w-auto" />,
    url: 'https://www.bbb.org/',
  },
  {
    name: 'NAATP',
    logo: <NaatpLogo className="h-10 w-auto" />,
    url: 'https://www.naatp.org/',
  },
  {
    name: 'Psychology Today Verified',
    logo: <PsychologyTodayLogo className="h-8 w-auto" />,
    url: 'https://www.psychologytoday.com/us/treatment-rehab',
  },
];

const TrustedPartners: React.FC = () => {
  return (
    <div className="py-8">
      <h3 className="text-center font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-8">
        Our Accreditations & Partners
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 items-center justify-items-center">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="transition-transform duration-300 transform hover:scale-105"
          >
            <div className="filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
               {partner.logo}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TrustedPartners;
