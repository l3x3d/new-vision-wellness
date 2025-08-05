
import React from 'react';
import PageHeader from '../components/PageHeader';
import { PhoneIcon, EnvelopeIconStandard as EnvelopeIcon, MapPinIcon, ClockIcon } from '../components/IconComponents';

interface ContactPageProps {
  onOpenModal: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onOpenModal }) => {
  return (
    <div className="bg-white">
      <PageHeader
        title="Get in Touch"
        subtitle="We're here to help. Whether you have questions, need support, or are ready to begin your journey, our team is available to speak with you. Your call is confidential and free of charge."
        backgroundImage="/images/hero/hero-1.png"
      />
      
      <section id="contact-page" className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="bg-slate-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPinIcon className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700">Location</h3>
                  <p className="text-slate-600">5530 Corbin Ave, Ste 130<br/>Tarzana, CA 91356</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <PhoneIcon className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700">24/7 Helpline</h3>
                  <a href="tel:8186008640" className="text-slate-600 hover:text-sky-600 transition-colors">(818) 600-8640</a>
                  <p className="text-xs text-slate-500 mt-1">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <EnvelopeIcon className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700">Email</h3>
                  <a href="mailto:admissions@newvisionwellness.com" className="text-slate-600 hover:text-sky-600 transition-colors break-all">admissions@newvisionwellness.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <ClockIcon className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700">Hours</h3>
                  <p className="text-slate-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map & CTA */}
          <div className="space-y-8">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.176749155934!2d-118.6120736!3d34.1665858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c295e11c0f4b9f%3A0x1234567890abcdef!2s5530%20Corbin%20Ave%20%23130%2C%20Tarzana%2C%20CA%2091356!5e0!3m2!1sen!2sus!4v1678886400000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NewVisionWellness Location - 5530 Corbin Ave, Ste 130, Tarzana, CA 91356"
                ></iframe>
            </div>
            <div className="text-center bg-sky-100 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-sky-800 mb-4">Confidential Insurance Check</h2>
                <p className="text-sky-700 mb-6">
                    Use our secure AI tool to instantly validate your insurance coverage. It's the fastest way to get started.
                </p>
                <button
                    onClick={onOpenModal}
                    className="bg-sky-600 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg w-full"
                >
                    Validate Insurance with Ai
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default ContactPage;
