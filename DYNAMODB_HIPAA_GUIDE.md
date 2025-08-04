# HIPAA-Compliant DynamoDB Integration for NewVisionWellness

## Overview

This document outlines the complete HIPAA-compliant DynamoDB integration for storing and managing client data, treatment records, and related healthcare information at NewVisionWellness.

## 🔒 Security & Compliance Features

### Data Protection
- **Encryption at Rest**: All tables use AWS KMS encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **Client-Side Encryption**: Additional encryption layer for PHI data
- **Field-Level Encryption**: Sensitive fields are individually encrypted

### Access Control
- **IAM Roles**: Least privilege access with role-based permissions
- **Session Management**: Secure, time-limited sessions with automatic expiration
- **Audit Logging**: Comprehensive audit trail for all PHI access

### Data Governance
- **Data Retention**: Configurable retention policies (default: 7 years)
- **Point-in-Time Recovery**: Automatic backups for all critical tables
- **Geographic Restrictions**: Data residency compliance

## 📊 Database Schema

### Core Tables

#### 1. `NewVisionWellness_ClientData`
**Purpose**: Stores encrypted client personal and medical information

**Key Fields**:
- `clientId` (Primary Key): Unique client identifier
- `personalInfo`: Encrypted personal details (name, email, phone, DOB, address, SSN)
- `emergencyContact`: Encrypted emergency contact information
- `insuranceInfo`: Encrypted insurance details
- `medicalInfo`: Medical history and current concerns
- `consentRecords`: HIPAA and treatment consent documentation
- `status`: Client status (active, inactive, completed, transferred)

**Indexes**:
- `StatusIndex`: Query clients by status and creation date

#### 2. `NewVisionWellness_TreatmentRecords`
**Purpose**: Stores treatment session notes and progress tracking

**Key Fields**:
- `recordId` (Primary Key): Unique treatment record identifier
- `clientId`: Link to client record
- `sessionDate`: Date and time of session
- `sessionType`: Type of treatment (individual, group, family, assessment)
- `therapistId`: Treating therapist identifier
- `encryptedNotes`: Encrypted session notes
- `treatmentPlan`: Goals, interventions, and progress tracking
- `attendanceStatus`: Session attendance tracking

**Indexes**:
- `ClientSessionIndex`: Query treatment records by client and date

#### 3. `NewVisionWellness_Sessions`
**Purpose**: Manages secure user sessions

**Key Fields**:
- `sessionId` (Primary Key): Unique session identifier
- `clientId`: Associated client (if applicable)
- `sessionType`: Type of session (registration, portal, assessment)
- `expiresAt`: Automatic session expiration
- `isActive`: Session status

**Features**:
- TTL enabled for automatic cleanup
- Geographic and device tracking

#### 4. `NewVisionWellness_AuditLog`
**Purpose**: HIPAA-compliant audit trail

**Key Fields**:
- `logId` (Primary Key): Unique log entry identifier
- `timestamp`: When the action occurred
- `action`: What action was performed
- `resourceType` & `resourceId`: What was accessed
- `userId` & `userRole`: Who performed the action
- `complianceLevel`: Risk level (standard, hipaa, critical)

**Indexes**:
- `TimestampIndex`: Query audit logs by compliance level and time

#### 5. `NewVisionWellness_InsuranceVerifications`
**Purpose**: Insurance verification requests and results

**Key Fields**:
- `submissionId` (Primary Key): Unique submission identifier
- `patientData`: Basic insurance verification info
- `verificationResult`: Verification outcome and coverage details

#### 6. `NewVisionWellness_UserRegistrations`
**Purpose**: Initial user registration data before full client record creation

## 🚀 Setup Instructions

### Prerequisites
1. AWS Account with appropriate permissions
2. AWS CLI configured
3. Node.js and npm installed
4. Environment variables configured

### 1. Install Dependencies
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your AWS credentials and settings
```

### 3. Create DynamoDB Tables
```bash
node setup-dynamodb-tables.js
```

### 4. Configure IAM Permissions
Create an IAM policy with the following permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/NewVisionWellness_*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:*:*:key/your-kms-key-id"
    }
  ]
}
```

## 💻 Usage Examples

### Saving a Client Record
```typescript
import { saveClientRecord } from './services/awsDatabase';

const clientData = {
  personalInfo: {
    encryptedName: "John Doe",
    encryptedEmail: "john@example.com",
    encryptedPhone: "(555) 123-4567",
    encryptedDOB: "1990-01-01",
    encryptedAddress: "123 Main St, City, State 12345"
  },
  emergencyContact: {
    encryptedName: "Jane Doe",
    encryptedRelationship: "Spouse",
    encryptedPhone: "(555) 123-4568"
  },
  insuranceInfo: {
    encryptedProvider: "Blue Cross Blue Shield",
    encryptedPolicyNumber: "ABC123456789",
    encryptedGroupNumber: "GRP001"
  },
  medicalInfo: {
    primaryConcerns: ["anxiety", "depression"],
    allergies: ["penicillin"],
    medications: ["sertraline 50mg"],
    previousTreatment: false
  },
  consentRecords: {
    hipaaConsent: true,
    hipaaConsentDate: "2025-08-03T10:00:00Z",
    treatmentConsent: true,
    treatmentConsentDate: "2025-08-03T10:00:00Z",
    communicationPreferences: ["email", "phone"]
  },
  status: "active"
};

const result = await saveClientRecord(clientData);
console.log("Client saved:", result.clientId);
```

### Recording a Treatment Session
```typescript
import { saveTreatmentRecord } from './services/awsDatabase';

const treatmentData = {
  clientId: "client_1722685200000_abc123",
  sessionDate: "2025-08-03T14:00:00Z",
  sessionType: "individual",
  duration: 60,
  therapistId: "therapist_001",
  encryptedNotes: "Client showed significant improvement...",
  treatmentPlan: {
    goals: ["Reduce anxiety symptoms", "Improve coping skills"],
    interventions: ["CBT techniques", "Mindfulness practice"],
    progress: "Good progress on goal 1, needs more work on goal 2"
  },
  attendanceStatus: "attended",
  nextAppointment: "2025-08-10T14:00:00Z"
};

const result = await saveTreatmentRecord(treatmentData);
```

### Retrieving Client Data
```typescript
import { getClientRecord } from './services/awsDatabase';

const result = await getClientRecord("client_1722685200000_abc123");
if (result.success) {
  console.log("Client data:", result.data);
  // Data is automatically decrypted
}
```

## 🔍 Audit and Compliance

### Audit Logging
Every action that accesses or modifies PHI is automatically logged:
```typescript
import { logAuditEvent } from './services/awsDatabase';

await logAuditEvent({
  action: 'CLIENT_ACCESSED',
  resourceType: 'CLIENT_RECORD',
  resourceId: clientId,
  userId: currentUser.id,
  userRole: currentUser.role,
  details: { reason: 'Treatment planning' },
  complianceLevel: 'hipaa'
});
```

### Data Retention
- **Client Records**: 7 years after last treatment
- **Treatment Records**: 7 years after last session
- **Audit Logs**: 7 years minimum
- **Session Data**: 24 hours (auto-cleanup via TTL)

### Compliance Monitoring
- Regular access pattern analysis
- Automated anomaly detection
- Quarterly compliance reviews
- Annual security assessments

## 🛠️ Administration

### Client Search (Limited for Privacy)
```typescript
import { searchClients } from './services/awsDatabase';

// Search by status only (no PHI in search)
const results = await searchClients({ 
  status: 'active',
  dateRange: { start: '2025-01-01', end: '2025-12-31' }
});
```

### Treatment History Retrieval
```typescript
import { getClientTreatmentRecords } from './services/awsDatabase';

const records = await getClientTreatmentRecords(clientId);
```

## 🔐 Security Best Practices

### Data Handling
1. **Minimize Data Collection**: Only collect necessary information
2. **Encrypt Everything**: Multiple layers of encryption for PHI
3. **Access Logging**: Every access is logged and monitored
4. **Regular Audits**: Automated and manual compliance checks

### Access Control
1. **Role-Based Access**: Therapists, admin, and support roles
2. **Time-Limited Sessions**: Automatic logout after inactivity
3. **Multi-Factor Authentication**: Required for all admin access
4. **Regular Access Reviews**: Quarterly permission audits

### Incident Response
1. **Breach Detection**: Automated anomaly detection
2. **Immediate Response**: Automated alerts for suspicious activity
3. **Documentation**: All incidents logged for compliance
4. **Notification**: HIPAA-compliant breach notification procedures

## 📞 Support and Maintenance

### Monitoring
- CloudWatch alarms for table health
- Performance metrics and alerting
- Daily backup verification
- Weekly compliance reports

### Updates and Patches
- Regular AWS SDK updates
- Security patch management
- Quarterly security reviews
- Annual compliance assessments

### Backup and Recovery
- Point-in-time recovery enabled
- Cross-region replication for critical data
- Regular restore testing
- Documented recovery procedures

---

## 📞 Emergency Contacts

**Technical Issues**: IT Support - support@newvisionwellness.com
**Security Incidents**: Security Team - security@newvisionwellness.com
**HIPAA Compliance**: Compliance Officer - compliance@newvisionwellness.com

**Crisis Support**: Available 24/7 at (818) 600-8640

---

*This system is designed to meet HIPAA compliance requirements. Regular reviews and updates ensure continued compliance with healthcare data protection standards.*
