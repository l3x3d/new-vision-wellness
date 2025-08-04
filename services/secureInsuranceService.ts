// HIPAA-Compliant Insurance Verification Service
// This service handles secure PHI transmission to a HIPAA-compliant backend

export interface SecureInsuranceVerificationData {
  sessionId: string;
  encryptedPayload: string; // Client-side encrypted PHI data
  timestamp: string;
  patientConsent: boolean;
}

export interface SecureInsuranceVerificationResult {
  sessionId: string;
  verificationStatus: 'verified' | 'pending' | 'denied' | 'error';
  coverageDetails?: {
    planName: string;
    deductible: string;
    copay: string;
    outOfNetworkCoverage: string;
    priorAuthRequired: boolean;
    estimatedCoverage: string;
  };
  nextSteps: string[];
  referenceNumber: string;
  expiresAt: string; // ISO timestamp when this verification expires
}

export interface SessionInitResponse {
  sessionId: string;
  encryptionKey: string; // Public key for client-side encryption
  expiresAt: string;
}

class SecureInsuranceService {
  private apiBaseUrl: string;
  private sessionId: string | null = null;
  private encryptionKey: string | null = null;

  constructor() {
    // In production, this would be your HIPAA-compliant backend URL
    this.apiBaseUrl = process.env.VITE_API_BASE_URL || '/api';
  }

  // Initialize a secure session with the backend
  async initializeSession(): Promise<SessionInitResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/insurance/init-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include secure HTTP-only cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize session: ${response.statusText}`);
      }

      const sessionData = await response.json();
      this.sessionId = sessionData.sessionId;
      this.encryptionKey = sessionData.encryptionKey;

      return sessionData;
    } catch (error) {
      console.error('Failed to initialize secure session:', error);
      throw new Error('Unable to establish secure connection. Please try again.');
    }
  }

  // Client-side encryption of PHI data
  private async encryptPHI(data: any): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available. Please initialize session first.');
    }

    // In a real implementation, use Web Crypto API for client-side encryption
    // This is a simplified example - use proper encryption in production
    try {
      const encoder = new TextEncoder();
      const dataString = JSON.stringify(data);
      const encodedData = encoder.encode(dataString);
      
      // Import the public key for encryption
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        this.base64ToArrayBuffer(this.encryptionKey),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );

      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        encodedData
      );

      return this.arrayBufferToBase64(encryptedData);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to secure patient data. Please try again.');
    }
  }

  // Verify insurance with encrypted PHI data
  async verifyInsurance(patientData: any, consentGiven: boolean): Promise<SecureInsuranceVerificationResult> {
    if (!consentGiven) {
      throw new Error('Patient consent is required for insurance verification.');
    }

    if (!this.sessionId) {
      await this.initializeSession();
    }

    try {
      const encryptedPayload = await this.encryptPHI(patientData);
      
      const verificationRequest: SecureInsuranceVerificationData = {
        sessionId: this.sessionId!,
        encryptedPayload,
        timestamp: new Date().toISOString(),
        patientConsent: consentGiven,
      };

      const response = await fetch(`${this.apiBaseUrl}/insurance/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId!,
        },
        credentials: 'include',
        body: JSON.stringify(verificationRequest),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please restart the verification process.');
        }
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Insurance verification failed:', error);
      throw error;
    }
  }

  // Clean up session (called when modal is closed or verification is complete)
  async cleanupSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await fetch(`${this.apiBaseUrl}/insurance/cleanup-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to cleanup session:', error);
    } finally {
      this.sessionId = null;
      this.encryptionKey = null;
    }
  }

  // Utility functions for encryption
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

// Export singleton instance
export const secureInsuranceService = new SecureInsuranceService();
