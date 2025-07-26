
import React from 'react';
import { SparklesIcon } from './IconComponents';
import TrustedPartners from './TrustedPartners';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-800 dark:bg-slate-950 text-white">
      <div className="container mx-auto px-6">
        
        <div className="border-t border-slate-700 dark:border-slate-800">
            <TrustedPartners />
        </div>

        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left border-t border-slate-700 dark:border-slate-800">
          
          {/* About */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center justify-center md:justify-start space-x-2 mb-4 transition-opacity hover:opacity-80">
              <SparklesIcon className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                NewVision<span className="font-semibold text-sky-500">Wellness</span>
              </span>
            </a>
            <p className="text-slate-400 max-w-md mx-auto md:mx-0">
              Your journey to a new life starts here. We're committed to providing the highest quality care in a safe and supportive environment.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#learn-more" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#programs-page" className="text-slate-400 hover:text-white transition-colors">Our Programs</a></li>
              <li><a href="#testimonials-page" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact-page" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4">Contact Us</h3>
            <div className="space-y-3 text-slate-400">
                <p>123 Recovery Lane<br/>Hopeville, USA 12345</p>
                <p>
                  <a href="tel:1-800-555-0123" className="hover:text-white transition-colors">1 (800) 555-0123</a>
                </p>
                <p>
                  <a href="mailto:admissions@newvisionwellness.com" className="hover:text-white transition-colors">admissions@newvisionwellness.com</a>
                </p>
            </div>
          </div>

        </div>
        
        <div className="pt-8 pb-16 border-t border-slate-700 dark:border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NewVisionWellness. All Rights Reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#staff-dashboard" className="hover:text-slate-300 transition-colors">Staff Portal</a>
          </div>
          <p className="mt-4">This is a fictional website created for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
