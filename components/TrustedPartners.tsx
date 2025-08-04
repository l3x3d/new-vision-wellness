
import React from 'react';

const partners = [
  {
    name: 'The Joint Commission',
    logo: '/images/accreditation-icons/3981610.png',
    url: 'https://www.jointcommission.org/',
  },
  {
    name: 'Blue Cross Blue Shield',
    logo: '/images/accreditation-icons/bluecross-blueshield.2405281022045.jpg',
    url: 'https://www.bcbs.com/',
  },
  {
    name: 'Aetna',
    logo: '/images/accreditation-icons/Aetna-img.2405281022042.jpg',
    url: 'https://www.aetna.com/',
  },
  {
    name: 'Anthem',
    logo: '/images/accreditation-icons/2560px-Anthem-_Inc._Logo.2311131411550.png',
    url: 'https://www.anthem.com/',
  },
  {
    name: 'Cigna',
    logo: '/images/accreditation-icons/Cigna-Logo.2309201531550.png',
    url: 'https://www.cigna.com/',
  },
  {
    name: 'UnitedHealthcare',
    logo: '/images/accreditation-icons/logo-uhcOptum.2311131400126.png',
    url: 'https://www.uhc.com/',
  },
  {
    name: 'HealthNet',
    logo: '/images/accreditation-icons/healthnet-logo.2309201531550.png',
    url: 'https://www.healthnet.com/',
  },
  {
    name: 'Tricare',
    logo: '/images/accreditation-icons/tricare-img.2405281022052.jpg',
    url: 'https://www.tricare.mil/',
  },
  {
    name: 'Magellan Health',
    logo: '/images/accreditation-icons/insurance_magellan.2402150945391.png',
    url: 'https://www.magellanhealth.com/',
  },
  {
    name: 'MultiPlan',
    logo: '/images/accreditation-icons/MULTIPLAN_LOGO_RGB.2311131407550.png',
    url: 'https://www.multiplan.com/',
  },
  {
    name: 'Beacon Health Options',
    logo: '/images/accreditation-icons/beacon-img.2405281022044.jpg',
    url: 'https://www.beaconhealthoptions.com/',
  },
  {
    name: 'BCBS Federal Employee Program',
    logo: '/images/accreditation-icons/bcbs-Federal-Employee-Program-img.2405281022043.jpg',
    url: 'https://www.fepblue.org/',
  },
  {
    name: 'CoreSource',
    logo: '/images/accreditation-icons/Coresource-img.2405281022046.jpg',
    url: 'https://www.coresource.com/',
  },
  {
    name: 'GEHA',
    logo: '/images/accreditation-icons/GEHA-img.2405281022046.jpg',
    url: 'https://www.geha.com/',
  },
  {
    name: 'Gilsbar',
    logo: '/images/accreditation-icons/gilsbar-img.2405281022047.jpg',
    url: 'https://www.gilsbar.com/',
  },
  {
    name: 'JHM',
    logo: '/images/accreditation-icons/jhm-img.2405281022049.jpg',
    url: '#',
  },
  {
    name: 'Meritain Health',
    logo: '/images/accreditation-icons/Meritain-img.2405281022051.jpg',
    url: 'https://www.meritain.com/',
  },
  {
    name: 'MHN',
    logo: '/images/accreditation-icons/mhn-img.2405281044223.jpg',
    url: 'https://www.mhn.com/',
  },
  {
    name: 'SIHO Insurance Services',
    logo: '/images/accreditation-icons/siho-img.2405281022052.jpg',
    url: 'https://www.siho.com/',
  },
  {
    name: 'Tufts Health Plan',
    logo: '/images/accreditation-icons/tufts.2405281022053.jpg',
    url: 'https://www.tuftshealthplan.com/',
  },
  {
    name: 'Value Options',
    logo: '/images/accreditation-icons/value-img.2405281022054.jpg',
    url: 'https://www.valueoptions.com/',
  },
];

const TrustedPartners: React.FC = () => {
  return (
    <div className="py-12">
      <h3 className="text-center font-semibold text-slate-600 tracking-wider uppercase mb-12 text-lg">
        Insurance Partners & Accreditations
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-8 items-center justify-items-center">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="transition-transform duration-300 transform hover:scale-105 bg-white p-3 rounded-lg shadow-sm hover:shadow-md"
          >
            <div className="filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out">
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="h-12 w-auto max-w-[120px] object-contain"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TrustedPartners;
