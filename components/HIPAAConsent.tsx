import React, { useState } from 'react';
import { CheckIcon, ShieldCheckIcon } from './IconComponents';

interface HIPAAConsentProps {
  onConsentGiven: (consent: boolean) => void;
  patientName?: string;
}

const HIPAAConsent: React.FC<HIPAAConsentProps> = ({ onConsentGiven, patientName }) => {
  const [hasRead, setHasRead] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleSubmit = () => {
    if (hasRead && consentGiven) {
      onConsentGiven(true);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-4">
      <div className="flex items-center mb-4">
        <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 
          HIPAA Authorization for Insurance Verification
        </h3>
      </div>

      <div className="text-sm text-gray-700 space-y-3">
        <p>
          <strong>Patient Name:</strong> {patientName || '[To be provided]'}
        </p>
        
        <p>
          I understand that my protected health information (PHI) will be used solely for the purpose of verifying my insurance benefits for addiction treatment services at NewVisionWellness.
        </p>

        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="font-medium mb-2">Information to be disclosed:</p>
          <ul className="list-disc list-inside text-xs space-y-1">
            <li>Insurance provider and policy information</li>
            <li>Benefits verification for mental health and substance abuse treatment</li>
            <li>Coverage details relevant to proposed treatment</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="font-medium mb-2">Your rights:</p>
          <ul className="list-disc list-inside text-xs space-y-1">
            <li>You may revoke this authorization at any time</li>
            <li>Treatment is not conditional on signing this authorization</li>
            <li>Information disclosed may be subject to re-disclosure</li>
            <li>This authorization expires 90 days from the date of signing</li>
          </ul>
        </div>

        <p className="text-xs">
          For questions about this authorization or your privacy rights, contact our Privacy Officer at privacy@newvisionwellness.com or (800) 555-0123.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasRead}
            onChange={(e) => setHasRead(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 
            I have read and understand the HIPAA authorization above
          </span>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            disabled={!hasRead}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-700 
            I authorize the use and disclosure of my protected health information as described above
          </span>
        </label>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => onConsentGiven(false)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleSubmit}
          disabled={!hasRead || !consentGiven}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          Authorize & Continue
        </button>
      </div>
    </div>
  );
};

export default HIPAAConsent;
