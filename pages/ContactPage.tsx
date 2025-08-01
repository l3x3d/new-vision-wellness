
import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '../components/IconComponents';

interface ContactPageProps {
  onOpenModal: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onOpenModal }) => {
  return (
    <section id="contact-page" className="bg-white dark:bg-slate-900 py-24 md:py-32 pt-40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-2 mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-16">
            We're here to help. Whether you have questions, need support, or are ready to begin your journey, our team is available to speak with you. Your call is confidential and free of charge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Contact Information</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPinIcon className="h-7 w-7 text-sky-500 dark:text-sky-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Our Location</h3>
                  <p className="text-slate-600 dark:text-slate-300">123 Recovery Lane<br/>Hopeville, USA 12345</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <PhoneIcon className="h-7 w-7 text-sky-500 dark:text-sky-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Admissions Helpline</h3>
                  <a href="tel:1-800-555-0123" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">1 (800) 555-0123</a>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <EnvelopeIcon className="h-7 w-7 text-sky-500 dark:text-sky-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Email</h3>
                  <a href="mailto:admissions@newvisionwellness.com" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors break-all">admissions@newvisionwellness.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <ClockIcon className="h-7 w-7 text-sky-500 dark:text-sky-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Business Hours</h3>
                  <p className="text-slate-600 dark:text-slate-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map & CTA */}
          <div className="space-y-8">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617154972175!2d-73.987844084594!3d40.748440979328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1678886400000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location of NewVisionWellness"
                ></iframe>
            </div>
            <div className="text-center bg-sky-100 dark:bg-sky-900/40 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-200 mb-4">Confidential Insurance Check</h2>
                <p className="text-sky-700 dark:text-sky-300 mb-6">
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
  );
};

export default ContactPage;
