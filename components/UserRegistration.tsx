import React, { useState } from 'react';
import { ShieldCheckIcon, LockClosedIcon, CheckIcon } from './IconComponents';

interface UserRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToHIPAA: boolean;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
}

interface RegistrationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  agreeToHIPAA?: string;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'verification' | 'complete'>('info');
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToHIPAA: false,
    communicationPreferences: {
      email: true,
      sms: false,
      phone: false,
    },
  });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const validateForm = (): boolean => {
    const newErrors: RegistrationErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter phone as (XXX) XXX-XXXX';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    if (!formData.agreeToHIPAA) newErrors.agreeToHIPAA = 'HIPAA consent is required for treatment';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // In a real implementation, this would call a secure API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password: undefined, // Don't send password in plain text
          confirmPassword: undefined,
          // In reality, password would be hashed client-side before sending
        }),
      });

      if (response.ok) {
        setStep('verification');
        // Send verification code via email/SMS
      } else {
        const error = await response.json();
        setErrors({ email: error.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setStep('complete');
        setTimeout(() => {
          onSuccess(userData);
          onClose();
        }, 2000);
      } else {
        setErrors({ email: 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ email: 'Verification failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return phoneNumber;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-slate-800 
              {step === 'info' && 'Create Secure Account'}
              {step === 'verification' && 'Verify Your Account'}
              {step === 'complete' && 'Registration Complete'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 'info' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="(XXX) XXX-XXXX"
                      maxLength={14}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="Enter password"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Communication Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPreferences.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        communicationPreferences: { ...prev.communicationPreferences, email: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-slate-700 notifications and updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPreferences.sms}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        communicationPreferences: { ...prev.communicationPreferences, sms: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-slate-700 message reminders</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPreferences.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        communicationPreferences: { ...prev.communicationPreferences, phone: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-slate-700 call reminders</span>
                  </label>
                </div>
              </div>

              {/* Legal Agreements */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-2 text-slate-700 text-sm">
                    I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToHIPAA}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToHIPAA: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-2 text-slate-700 text-sm">
                    I consent to the use of my protected health information as described in the <a href="/hipaa-notice" className="text-blue-600 hover:underline">HIPAA Notice of Privacy Practices</a>
                  </span>
                </label>
                {errors.agreeToHIPAA && <p className="text-red-500 text-sm">{errors.agreeToHIPAA}</p>}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-4 w-4 mr-2" />
                      Create Secure Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'verification' && (
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-blue-600 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Check Your Email</h3>
                <p className="text-slate-600 mb-6">
                  We've sent a verification code to <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-wider"
                  placeholder="XXXXXX"
                  maxLength={6}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || verificationCode.length !== 6}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </form>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="h-8 w-8 text-green-600 />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Created Successfully!</h3>
              <p className="text-slate-600 mb-6">
                Welcome to NewVisionWellness. Your secure account has been created and you're now logged in.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  You can now access your patient portal, schedule appointments, and securely communicate with our care team.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
