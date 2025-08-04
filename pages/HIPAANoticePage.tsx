import React from 'react';
import { ShieldCheckIcon, LockClosedIcon } from '../components/IconComponents';

const HIPAANoticePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheckIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            HIPAA Notice of Privacy Practices
          </h1>
          <p className="text-lg text-slate-600 
            Your health information privacy rights and how we protect them
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800 Date: January 1, 2025</span>
          </div>
          <p className="text-blue-700 
            This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-slate-600 mb-4">
              NewVisionWellness is committed to protecting the privacy of your protected health information (PHI). We are required by law to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Keep your PHI private</li>
              <li>Give you this notice of our legal duties and privacy practices</li>
              <li>Follow the terms of the notice that is currently in effect</li>
              <li>Notify you if we are unable to accommodate a reasonable request</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We May Use and Disclose Your PHI</h2>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Treatment</h3>
              <p className="text-slate-600 
                We may use your PHI to provide, coordinate, or manage your healthcare and related services. This includes communication between healthcare providers involved in your treatment.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Payment</h3>
              <p className="text-slate-600 
                We may use and disclose your PHI to obtain payment for services provided. This includes billing activities, claims management, and determining insurance coverage.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Healthcare Operations</h3>
              <p className="text-slate-600 
                We may use your PHI for quality assessment, staff evaluation, licensing activities, and other healthcare operations that support the treatment and payment activities of our practice.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Rights Regarding Your PHI</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Right to Request Restrictions</h4>
                <p className="text-slate-600 text-sm">
                  You may request restrictions on how we use or disclose your PHI for treatment, payment, or healthcare operations.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Right to Access</h4>
                <p className="text-slate-600 text-sm">
                  You have the right to inspect and copy your PHI that we maintain in your medical record.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Right to Amend</h4>
                <p className="text-slate-600 text-sm">
                  You may request amendments to your PHI if you believe the information is incorrect or incomplete.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Right to an Accounting</h4>
                <p className="text-slate-600 text-sm">
                  You may request an accounting of disclosures of your PHI for purposes other than treatment, payment, or healthcare operations.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Security Measures</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 mb-4">
                We maintain comprehensive security measures to protect your PHI:
              </p>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure, HIPAA-compliant cloud infrastructure</li>
                <li>Multi-factor authentication for all staff access</li>
                <li>Regular security audits and compliance assessments</li>
                <li>Staff training on privacy and security requirements</li>
                <li>Incident response procedures for any potential breaches</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Privacy Officer</h3>
              <div className="text-slate-600 space-y-2">
                <p><strong>Email:</strong> privacy@newvisionwellness.com</p>
                <p><strong>Phone:</strong> (818) 600-8640</p>
                <p><strong>Mail:</strong><br />
                   Privacy Officer<br />
                   NewVisionWellness<br />
                   5530 Corbin Ave, Ste 130<br />
                   Tarzana, CA 91356
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Filing a Complaint</h2>
            <p className="text-slate-600 mb-4">
              If you believe your privacy rights have been violated, you may file a complaint with:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">NewVisionWellness</h4>
                <p className="text-slate-600 text-sm">
                  Contact our Privacy Officer using the information above.
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">U.S. Department of Health and Human Services</h4>
                <p className="text-slate-600 text-sm">
                  Office for Civil Rights<br />
                  www.hhs.gov/ocr/privacy/hipaa/complaints/
                </p>
              </div>
            </div>
            <p className="text-slate-600 mt-4 font-medium">
              You will not be retaliated against for filing a complaint.
            </p>
          </section>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> We reserve the right to change this notice. We will post a copy of the current notice at our facility and on our website. The effective date of this notice is listed at the top of the first page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HIPAANoticePage;
