# HIPAA-Compliant Backend Setup

This document outlines the requirements and setup for a HIPAA-compliant backend server to support the NewVisionWellness insurance verification system.

## Backend Requirements

### Infrastructure
- **Cloud Provider**: AWS, Azure, or Google Cloud with HIPAA compliance certification
- **Database**: PostgreSQL with encryption at rest and in transit
- **Load Balancer**: SSL/TLS termination with WAF protection
- **Monitoring**: CloudWatch/Azure Monitor with audit logging
- **Backup**: Encrypted, geographically distributed backups

### Security Requirements
- **Encryption**: AES-256 encryption for data at rest, TLS 1.3 for data in transit
- **Authentication**: Multi-factor authentication for all administrative access
- **Access Control**: Role-based access control (RBAC) with principle of least privilege
- **Audit Logging**: Comprehensive audit trails for all PHI access and modifications
- **Network Security**: VPC with private subnets, security groups, and NACLs

### API Endpoints

#### Session Management
```
POST /api/insurance/init-session
- Initializes a secure session with encryption keys
- Returns: sessionId, encryptionKey (public key), expiresAt
- Rate limiting: 10 requests per minute per IP
```

#### Insurance Verification
```
POST /api/insurance/verify
- Accepts encrypted PHI data for verification
- Headers: X-Session-ID, Content-Type: application/json
- Body: { sessionId, encryptedPayload, timestamp, patientConsent }
- Returns: verification results with reference number
```

#### Session Cleanup
```
POST /api/insurance/cleanup-session
- Securely destroys session data and encryption keys
- Headers: X-Session-ID
- Ensures proper data disposal per HIPAA requirements
```

### Database Schema

```sql
-- Sessions table for temporary encryption keys
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_key TEXT NOT NULL,
    private_key_encrypted TEXT NOT NULL, -- Encrypted with master key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- Verification requests (encrypted PHI)
CREATE TABLE verification_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    encrypted_phi TEXT NOT NULL, -- Encrypted patient data
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE
);

-- Audit log for all PHI access
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    user_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);
```

### Environment Variables

Create a `.env` file for the backend:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/newvision_hipaa
DATABASE_SSL_MODE=require

# Encryption
MASTER_ENCRYPTION_KEY=your-master-key-here
KEY_ROTATION_DAYS=30

# Session Management
SESSION_TIMEOUT_MINUTES=30
MAX_SESSIONS_PER_IP=5

# External Services
INSURANCE_VERIFICATION_API_URL=https://api.insuranceverification.com
INSURANCE_API_KEY=your-insurance-api-key

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://newvisionwellness.com

# Monitoring
LOG_LEVEL=info
AUDIT_LOG_RETENTION_DAYS=2555  # 7 years as required by HIPAA
```

### Compliance Checklist

- [ ] Business Associate Agreements (BAAs) with all vendors
- [ ] Risk assessment and security policies documented
- [ ] Employee HIPAA training completed
- [ ] Encryption at rest and in transit implemented
- [ ] Access controls and audit logging in place
- [ ] Incident response plan established
- [ ] Regular security assessments scheduled
- [ ] Data backup and recovery procedures tested
- [ ] Breach notification procedures documented
- [ ] Patient rights and consent management implemented

### Deployment Commands

For production deployment:

```bash
# Install dependencies
npm install

# Set up database
npm run db:migrate

# Start production server
npm run start:prod

# Health check
curl https://api.newvisionwellness.com/health
```

### Monitoring and Alerts

Set up monitoring for:
- Failed authentication attempts
- Unusual data access patterns
- System performance metrics
- Error rates and response times
- Database connection health
- Encryption key rotation status

## Development Setup

For local development with mock services:

```bash
# Install dependencies
npm install

# Set up local database
docker-compose up -d postgres

# Run migrations
npm run db:migrate:dev

# Start development server
npm run dev

# Run tests
npm test
```

This backend infrastructure ensures HIPAA compliance while providing secure, efficient insurance verification services.
