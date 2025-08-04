
import React from 'react';
import { SparklesIcon } from './IconComponents';
import TrustedPartners from './TrustedPartners';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-50 text-slate-800">
      <div className="container mx-auto px-6">
        
        <div className="border-t border-slate-200">
            <TrustedPartners />
        </div>

        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-center md:text-left border-t border-slate-200">
          
          {/* About */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center justify-center md:justify-start space-x-2 mb-4 transition-opacity hover:opacity-80">
              <SparklesIcon className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                NewVision<span className="font-semibold text-sky-600">Wellness</span>
              </span>
            </a>
            <p className="text-slate-600 max-w-md mx-auto md:mx-0 mb-4">
              Your journey to a new life starts here. We're committed to providing the highest quality care in a safe and supportive environment.
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>🏆 Licensed & Accredited Treatment Center</p>
              <p>💙 15+ Years of Clinical Experience</p>
              <p>⚡ 24/7 Availability & Support</p>
              <p>🔒 100% Confidential Services</p>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4 text-slate-800">Our Services</h3>
            <ul className="space-y-3">
              <li><span className="text-slate-600">Intensive Outpatient (IOP)</span></li>
              <li><span className="text-slate-600">Individual Therapy</span></li>
              <li><span className="text-slate-600">Group Therapy</span></li>
              <li><span className="text-slate-600">Family Counseling</span></li>
              <li><span className="text-slate-600">Dual Diagnosis Treatment</span></li>
              <li><span className="text-slate-600">Virtual Therapy Options</span></li>
            </ul>
          </div>
          
          {/* What We Treat */}
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4 text-slate-800">We Treat</h3>
            <ul className="space-y-3">
              <li><span className="text-slate-600">Alcohol Addiction</span></li>
              <li><span className="text-slate-600">Drug & Substance Abuse</span></li>
              <li><span className="text-slate-600">Depression & Anxiety</span></li>
              <li><span className="text-slate-600">Trauma & PTSD</span></li>
              <li><span className="text-slate-600">Co-occurring Disorders</span></li>
              <li><span className="text-slate-600">Mental Health Support</span></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4 text-slate-800">Contact & Hours</h3>
            <div className="space-y-3 text-slate-600">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Location:</p>
                  <p>5530 Corbin Ave, Ste 130<br/>Tarzana, CA 91356</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Phone:</p>
                  <p>
                    <a href="tel:8186008640" className="hover:text-slate-800 transition-colors">(818) 600-8640</a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Email:</p>
                  <p>
                    <a href="mailto:admissions@newvisionwellness.com" className="hover:text-slate-800 transition-colors break-all">admissions@newvisionwellness.com</a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Available:</p>
                  <p>24/7 Crisis Support</p>
                  <p>No Waitlists</p>
                </div>
            </div>
          </div>

        </div>
        
        {/* Mission & Credentials Section */}
        <div className="py-12 border-t border-slate-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* Mission Statement */}
            <div className="lg:col-span-2">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Our Mission</h3>
              <p className="text-slate-600 mb-4">
                NewVisionWellness is dedicated to empowering individuals and families on their journey to recovery through compassionate, evidence-based treatment. We believe that recovery is not just about overcoming addiction or mental health challenges—it's about rediscovering hope, rebuilding relationships, and creating a life filled with purpose and joy.
              </p>
              <p className="text-slate-600">
                Our comprehensive approach combines clinical expertise with holistic wellness practices, ensuring that each person receives personalized care that addresses their unique needs, history, and goals. We're here to support you every step of the way.
              </p>
            </div>
            
            {/* Credentials & Accreditation */}
            <div>
              <h3 className="font-bold text-xl text-slate-800 mb-4">Credentials & Quality</h3>
              <ul className="space-y-3 text-slate-600">
                <li>✓ Licensed Treatment Facility</li>
                <li>✓ HIPAA Compliant & Secure</li>
                <li>✓ Evidence-Based Treatments</li>
                <li>✓ Licensed Clinical Staff</li>
                <li>✓ Insurance Accepted</li>
                <li>✓ Continuing Education Programs</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-800 font-semibold">Emergency Support</p>
                <p className="text-sm text-slate-600">If you're in crisis, call us immediately or contact 988 for the Suicide & Crisis Lifeline</p>
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="pt-8 pb-16 border-t border-slate-200 text-center text-slate-600 text-sm">
          <p>&copy; {new Date().getFullYear()} NewVisionWellness. All Rights Reserved.</p>
          <div className="mt-4 space-x-6 flex flex-wrap justify-center gap-y-2">
            <a href="#staff-dashboard" className="hover:text-slate-800 transition-colors">Staff Portal</a>
            <a href="#hipaa-notice" className="hover:text-slate-800 transition-colors">HIPAA Notice</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Patient Rights</a>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p>Licensed by the State of California | DEA Registered | Joint Commission Accredited</p>
            <p className="mt-1">NewVisionWellness is committed to providing accessible treatment regardless of race, gender, sexual orientation, religion, or financial status.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
