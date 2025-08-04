import React from 'react';

export interface Program {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  duration?: string;
  features?: string[];
  intensity?: 'Low' | 'Moderate' | 'High' | 'Intensive';
  category?: 'Core Programs' | 'Specialized Care' | 'Therapeutic Modalities' | 'Support Services';
}

export interface Testimonial {
  quote: string;
  author: string;
}

// ====== HIPAA-COMPLIANT DATA TYPES ======

export interface ClientPersonalInfo {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  ssn?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
}

export interface MedicalInfo {
  primaryConcerns: string[];
  allergies: string[];
  medications: string[];
  previousTreatment: boolean;
  treatmentHistory?: string;
}

export interface ConsentRecords {
  hipaaConsent: boolean;
  hipaaConsentDate: string;
  treatmentConsent: boolean;
  treatmentConsentDate: string;
  communicationPreferences: string[];
}

export interface ClientFormData {
  personalInfo: ClientPersonalInfo;
  emergencyContact: EmergencyContact;
  insuranceInfo: InsuranceInfo;
  medicalInfo: MedicalInfo;
  consentRecords: ConsentRecords;
}

export interface TreatmentPlan {
  goals: string[];
  interventions: string[];
  progress: string;
}

export interface InsuranceVerificationData {
  name: string;
  dob: string;
  provider: string;
  policyId: string;
}

export interface InsuranceVerificationResult {
  status: 'Verified' | 'Review Needed' | 'Plan Not Found';
  planName: string;
  coverageSummary: string;
  nextSteps: string;
}

// Session and Security Types
export interface SecureSession {
  sessionId: string;
  clientId?: string;
  sessionType: 'registration' | 'portal' | 'assessment';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Audit and Compliance Types
export interface AuditEvent {
  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  userRole: string;
  details: any;
  complianceLevel: 'standard' | 'hipaa' | 'critical';
  ipAddress?: string;
  userAgent?: string;
}