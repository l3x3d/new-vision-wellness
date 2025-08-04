import React, { useState } from 'react';
import { saveClientRecord, createSession, generateClientId } from '../services/awsDatabase';
import type { ClientFormData } from '../types';

interface ClientRegistrationFormProps {
  onRegistrationComplete?: (clientId: string) => void;
  onClose?: () => void;
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ 
  onRegistrationComplete, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClientFormData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      ssn: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      groupNumber: ''
    },
    medicalInfo: {
      primaryConcerns: [],
      allergies: [],
      medications: [],
      previousTreatment: false,
      treatmentHistory: ''
    },
    consentRecords: {
      hipaaConsent: false,
      hipaaConsentDate: '',
      treatmentConsent: false,
      treatmentConsentDate: '',
      communicationPreferences: []
    }
  });

  const handleInputChange = (section: keyof ClientFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof ClientFormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create secure session first
      const sessionResult = await createSession({
        sessionType: 'registration',
        isActive: true,
        ipAddress: undefined, // Would be captured server-side
        userAgent: navigator.userAgent
      });

      if (!sessionResult.success) {
        throw new Error('Failed to create secure session');
      }

      // Set consent timestamps
      const now = new Date().toISOString();
      const updatedFormData = {
        ...formData,
        consentRecords: {
          ...formData.consentRecords,
          hipaaConsentDate: formData.consentRecords.hipaaConsent ? now : '',
          treatmentConsentDate: formData.consentRecords.treatmentConsent ? now : ''
        }
      };

      // Convert form data to encrypted client record format
      const clientRecord = {
        personalInfo: {
          encryptedName: updatedFormData.personalInfo.name,
          encryptedEmail: updatedFormData.personalInfo.email,
          encryptedPhone: updatedFormData.personalInfo.phone,
          encryptedDOB: updatedFormData.personalInfo.dateOfBirth,
          encryptedAddress: updatedFormData.personalInfo.address,
          encryptedSSN: updatedFormData.personalInfo.ssn || undefined
        },
        emergencyContact: {
          encryptedName: updatedFormData.emergencyContact.name,
          encryptedRelationship: updatedFormData.emergencyContact.relationship,
          encryptedPhone: updatedFormData.emergencyContact.phone
        },
        insuranceInfo: {
          encryptedProvider: updatedFormData.insuranceInfo.provider,
          encryptedPolicyNumber: updatedFormData.insuranceInfo.policyNumber,
          encryptedGroupNumber: updatedFormData.insuranceInfo.groupNumber
        },
        medicalInfo: updatedFormData.medicalInfo,
        consentRecords: updatedFormData.consentRecords,
        status: 'active' as const
      };

      // Save client record
      const result = await saveClientRecord(clientRecord);

      if (result.success && result.clientId) {
        setSuccess(`Registration completed successfully! Your client ID is: ${result.clientId}`);
        if (onRegistrationComplete) {
          onRegistrationComplete(result.clientId);
        }
      } else {
        throw new Error(result.error || 'Failed to save client record');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.personalInfo.name}
            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Address *
        </label>
        <textarea
          value={formData.personalInfo.address}
          onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Social Security Number (Optional)
        </label>
        <input
          type="password"
          value={formData.personalInfo.ssn}
          onChange={(e) => handleInputChange('personalInfo', 'ssn', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          placeholder="XXX-XX-XXXX"
        />
        <p className="text-xs text-slate-500 mt-1">This information is encrypted and stored securely for insurance verification purposes.</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Emergency Contact</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Relationship *
          </label>
          <select
            value={formData.emergencyContact.relationship}
            onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          >
            <option value="">Select relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent</option>
            <option value="Child">Child</option>
            <option value="Sibling">Sibling</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Insurance Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Insurance Provider *
          </label>
          <input
            type="text"
            value={formData.insuranceInfo.provider}
            onChange={(e) => handleInputChange('insuranceInfo', 'provider', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            placeholder="e.g., Blue Cross Blue Shield"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Policy Number *
          </label>
          <input
            type="text"
            value={formData.insuranceInfo.policyNumber}
            onChange={(e) => handleInputChange('insuranceInfo', 'policyNumber', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Group Number
          </label>
          <input
            type="text"
            value={formData.insuranceInfo.groupNumber}
            onChange={(e) => handleInputChange('insuranceInfo', 'groupNumber', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Medical Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Primary Concerns (separate with commas)
        </label>
        <textarea
          value={formData.medicalInfo.primaryConcerns.join(', ')}
          onChange={(e) => handleArrayChange('medicalInfo', 'primaryConcerns', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          placeholder="e.g., anxiety, depression, substance use"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Allergies (separate with commas)
        </label>
        <input
          type="text"
          value={formData.medicalInfo.allergies.join(', ')}
          onChange={(e) => handleArrayChange('medicalInfo', 'allergies', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          placeholder="e.g., penicillin, shellfish"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Current Medications (separate with commas)
        </label>
        <textarea
          value={formData.medicalInfo.medications.join(', ')}
          onChange={(e) => handleArrayChange('medicalInfo', 'medications', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
          placeholder="e.g., Sertraline 50mg, Lisinopril 10mg"
        />
      </div>
      
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.medicalInfo.previousTreatment}
            onChange={(e) => handleInputChange('medicalInfo', 'previousTreatment', e.target.checked)}
            className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
          />
          <span className="text-sm font-medium text-slate-700 
            I have received previous treatment for mental health or substance use
          </span>
        </label>
      </div>
      
      {formData.medicalInfo.previousTreatment && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Previous Treatment History
          </label>
          <textarea
            value={formData.medicalInfo.treatmentHistory}
            onChange={(e) => handleInputChange('medicalInfo', 'treatmentHistory', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent 
            placeholder="Please describe your previous treatment experience..."
          />
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Consent & Agreements</h3>
      
      <div className="bg-slate-50 p-6 rounded-lg space-y-4">
        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.consentRecords.hipaaConsent}
              onChange={(e) => handleInputChange('consentRecords', 'hipaaConsent', e.target.checked)}
              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mt-1"
              required
            />
            <div>
              <span className="text-sm font-medium text-slate-700 
                I acknowledge that I have received and read the HIPAA Notice of Privacy Practices *
              </span>
              <p className="text-xs text-slate-500 mt-1">
                This consent allows us to use and disclose your health information for treatment, payment, and healthcare operations as described in our Notice of Privacy Practices.
              </p>
            </div>
          </label>
        </div>
        
        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.consentRecords.treatmentConsent}
              onChange={(e) => handleInputChange('consentRecords', 'treatmentConsent', e.target.checked)}
              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mt-1"
              required
            />
            <div>
              <span className="text-sm font-medium text-slate-700 
                I consent to receive treatment at NewVisionWellness *
              </span>
              <p className="text-xs text-slate-500 mt-1">
                This includes individual therapy, group therapy, family counseling, and other treatment services as recommended by our clinical team.
              </p>
            </div>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Communication Preferences (select all that apply)
        </label>
        <div className="space-y-2">
          {['Email', 'Phone', 'Text Message', 'Secure Portal'].map(pref => (
            <label key={pref} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.consentRecords.communicationPreferences.includes(pref)}
                onChange={(e) => {
                  const current = formData.consentRecords.communicationPreferences;
                  const updated = e.target.checked
                    ? [...current, pref]
                    : current.filter(p => p !== pref);
                  handleInputChange('consentRecords', 'communicationPreferences', updated);
                }}
                className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700 
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.personalInfo.name && formData.personalInfo.email && 
               formData.personalInfo.phone && formData.personalInfo.dateOfBirth && 
               formData.personalInfo.address;
      case 2:
        return formData.emergencyContact.name && formData.emergencyContact.relationship && 
               formData.emergencyContact.phone;
      case 3:
        return formData.insuranceInfo.provider && formData.insuranceInfo.policyNumber;
      case 4:
        return true; // Medical info is optional
      case 5:
        return formData.consentRecords.hipaaConsent && formData.consentRecords.treatmentConsent;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 Registration</h2>
              <p className="text-slate-600 {currentStep} of 5</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Personal Info</span>
              <span>Emergency Contact</span>
              <span>Insurance</span>
              <span>Medical Info</span>
              <span>Consent</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {/* Error and Success Messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStepValid() || isLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;
