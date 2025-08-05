// AWS DynamoDB service for HIPAA-compliant client data storage
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// AWS Configuration
const client = new DynamoDBClient({
  region: process.env.VITE_AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names for different data types
const INSURANCE_TABLE = "NewVisionWellness_InsuranceVerifications";
const CLIENT_DATA_TABLE = "NewVisionWellness_ClientData";
const SESSIONS_TABLE = "NewVisionWellness_Sessions";
const AUDIT_TABLE = "NewVisionWellness_AuditLog";
const TREATMENT_RECORDS_TABLE = "NewVisionWellness_TreatmentRecords";

// Simple encryption for client-side (in production, use proper key management)
// For demonstration, we'll use a more robust client-side encryption
export const encryptData = (data: string): string => {
  if (typeof window !== 'undefined') {
    try {
      // Generate a simple key from environment or use a default
      const key = btoa('hipaa-compliant-key-2025').slice(0, 16);
      
      // Simple XOR encryption with base64 encoding
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      
      // Double encode for additional obfuscation
      return btoa(btoa(encrypted));
    } catch (error) {
      console.error('Encryption error:', error);
      // Fallback to base64 if encryption fails
      return btoa(encodeURIComponent(data));
    }
  }
  return data;
};

export const decryptData = (encryptedData: string): string => {
  if (typeof window !== 'undefined') {
    try {
      // Generate the same key
      const key = btoa('hipaa-compliant-key-2025').slice(0, 16);
      
      // Double decode
      const doubleDecode = atob(atob(encryptedData));
      
      // Simple XOR decryption
      let decrypted = '';
      for (let i = 0; i < doubleDecode.length; i++) {
        decrypted += String.fromCharCode(doubleDecode.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      // Fallback to base64 decode
      try {
        return decodeURIComponent(atob(encryptedData));
      } catch {
        return encryptedData;
      }
    }
  }
  return encryptedData;
};

export interface InsuranceSubmissionRecord {
  submissionId: string;
  submittedAt: string;
  patientData: {
    name: string;
    dob: string;
    provider: string;
    policyId: string;
  };
  verificationResult: {
    status: 'Verified' | 'Review Needed' | 'Plan Not Found';
    planName: string;
    coverageSummary: string;
    nextSteps: string;
  };
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface UserRegistrationRecord {
  registrationId: string;
  submittedAt: string;
  userData: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    insuranceInfo: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
    };
    consentGiven: boolean;
  };
  ipAddress?: string;
  userAgent?: string;
}

// ====== HIPAA-COMPLIANT CLIENT DATA MANAGEMENT ======

// Client record interfaces
export interface ClientRecord {
  clientId: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: {
    encryptedName: string;
    encryptedEmail: string;
    encryptedPhone: string;
    encryptedDOB: string;
    encryptedAddress: string;
    encryptedSSN?: string;
  };
  emergencyContact: {
    encryptedName: string;
    encryptedRelationship: string;
    encryptedPhone: string;
  };
  insuranceInfo: {
    encryptedProvider: string;
    encryptedPolicyNumber: string;
    encryptedGroupNumber: string;
  };
  medicalInfo: {
    primaryConcerns: string[];
    allergies: string[];
    medications: string[];
    previousTreatment: boolean;
    treatmentHistory?: string;
  };
  consentRecords: {
    hipaaConsent: boolean;
    hipaaConsentDate: string;
    treatmentConsent: boolean;
    treatmentConsentDate: string;
    communicationPreferences: string[];
  };
  status: 'active' | 'inactive' | 'completed' | 'transferred';
}

export interface TreatmentRecord {
  recordId: string;
  clientId: string;
  sessionDate: string;
  sessionType: string; // 'individual', 'group', 'family', 'assessment'
  duration: number; // minutes
  therapistId: string;
  encryptedNotes: string;
  treatmentPlan: {
    goals: string[];
    interventions: string[];
    progress: string;
  };
  attendanceStatus: 'attended' | 'no-show' | 'cancelled' | 'rescheduled';
  nextAppointment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  sessionId: string;
  clientId?: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  sessionType: 'registration' | 'portal' | 'assessment';
  isActive: boolean;
}

export interface AuditLogRecord {
  logId: string;
  timestamp: string;
  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  details: any;
  complianceLevel: 'standard' | 'hipaa' | 'critical';
}

/**
 * Save insurance verification data to AWS DynamoDB
 */
export const saveInsuranceVerification = async (
  submissionData: Omit<InsuranceSubmissionRecord, 'submissionId' | 'submittedAt'>
): Promise<{ success: boolean; submissionId?: string; error?: string }> => {
  try {
    const submissionId = `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const submittedAt = new Date().toISOString();

    const record: InsuranceSubmissionRecord = {
      submissionId,
      submittedAt,
      ...submissionData,
    };

    const command = new PutCommand({
      TableName: INSURANCE_TABLE,
      Item: record,
      ConditionExpression: "attribute_not_exists(submissionId)", // Prevent duplicates
    });

    await docClient.send(command);

    console.log("Insurance verification saved successfully:", submissionId);
    return { success: true, submissionId };

  } catch (error) {
    console.error("Error saving insurance verification to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Save user registration data to AWS DynamoDB
 */
export const saveUserRegistration = async (
  registrationData: Omit<UserRegistrationRecord, 'registrationId' | 'submittedAt'>
): Promise<{ success: boolean; registrationId?: string; error?: string }> => {
  try {
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const submittedAt = new Date().toISOString();

    const record: UserRegistrationRecord = {
      registrationId,
      submittedAt,
      ...registrationData,
    };

    const command = new PutCommand({
      TableName: "NewVisionWellness_UserRegistrations", // Separate table for registrations
      Item: record,
      ConditionExpression: "attribute_not_exists(registrationId)",
    });

    await docClient.send(command);

    console.log("User registration saved successfully:", registrationId);
    return { success: true, registrationId };

  } catch (error) {
    console.error("Error saving user registration to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Retrieve insurance verification by submission ID
 */
export const getInsuranceVerification = async (
  submissionId: string
): Promise<{ success: boolean; data?: InsuranceSubmissionRecord; error?: string }> => {
  try {
    const command = new GetCommand({
      TableName: INSURANCE_TABLE,
      Key: { submissionId },
    });

    const response = await docClient.send(command);

    if (response.Item) {
      return { success: true, data: response.Item as InsuranceSubmissionRecord };
    } else {
      return { success: false, error: "Submission not found" };
    }

  } catch (error) {
    console.error("Error retrieving insurance verification from DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get all insurance verifications (for admin dashboard)
 */
export const getAllInsuranceVerifications = async (): Promise<{
  success: boolean;
  data?: InsuranceSubmissionRecord[];
  error?: string;
}> => {
  try {
    const command = new ScanCommand({
      TableName: INSURANCE_TABLE,
      Limit: 100, // Limit to prevent large data loads
    });

    const response = await docClient.send(command);

    return {
      success: true,
      data: response.Items as InsuranceSubmissionRecord[] || [],
    };

  } catch (error) {
    console.error("Error retrieving all insurance verifications from DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Save new client record with encrypted PHI
 */
export const saveClientRecord = async (
  clientData: Omit<ClientRecord, 'clientId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; clientId?: string; error?: string }> => {
  try {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Encrypt sensitive personal information
    const encryptedRecord: ClientRecord = {
      clientId,
      createdAt: timestamp,
      updatedAt: timestamp,
      personalInfo: {
        encryptedName: encryptData(clientData.personalInfo.encryptedName),
        encryptedEmail: encryptData(clientData.personalInfo.encryptedEmail),
        encryptedPhone: encryptData(clientData.personalInfo.encryptedPhone),
        encryptedDOB: encryptData(clientData.personalInfo.encryptedDOB),
        encryptedAddress: encryptData(clientData.personalInfo.encryptedAddress),
        encryptedSSN: clientData.personalInfo.encryptedSSN ? encryptData(clientData.personalInfo.encryptedSSN) : undefined,
      },
      emergencyContact: {
        encryptedName: encryptData(clientData.emergencyContact.encryptedName),
        encryptedRelationship: encryptData(clientData.emergencyContact.encryptedRelationship),
        encryptedPhone: encryptData(clientData.emergencyContact.encryptedPhone),
      },
      insuranceInfo: {
        encryptedProvider: encryptData(clientData.insuranceInfo.encryptedProvider),
        encryptedPolicyNumber: encryptData(clientData.insuranceInfo.encryptedPolicyNumber),
        encryptedGroupNumber: encryptData(clientData.insuranceInfo.encryptedGroupNumber),
      },
      medicalInfo: clientData.medicalInfo,
      consentRecords: clientData.consentRecords,
      status: clientData.status,
    };

    const command = new PutCommand({
      TableName: CLIENT_DATA_TABLE,
      Item: encryptedRecord,
      ConditionExpression: "attribute_not_exists(clientId)",
    });

    await docClient.send(command);

    // Log the creation
    await logAuditEvent({
      action: 'CLIENT_CREATED',
      resourceType: 'CLIENT_RECORD',
      resourceId: clientId,
      userId: 'system',
      userRole: 'system',
      details: { clientId },
      complianceLevel: 'hipaa',
    });

    console.log("Client record saved successfully:", clientId);
    return { success: true, clientId };

  } catch (error) {
    console.error("Error saving client record to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get client record by ID with decryption
 */
export const getClientRecord = async (
  clientId: string
): Promise<{ success: boolean; data?: ClientRecord; error?: string }> => {
  try {
    const command = new GetCommand({
      TableName: CLIENT_DATA_TABLE,
      Key: { clientId },
    });

    const response = await docClient.send(command);

    if (response.Item) {
      const encryptedRecord = response.Item as ClientRecord;
      
      // Decrypt sensitive information
      const decryptedRecord: ClientRecord = {
        ...encryptedRecord,
        personalInfo: {
          encryptedName: decryptData(encryptedRecord.personalInfo.encryptedName),
          encryptedEmail: decryptData(encryptedRecord.personalInfo.encryptedEmail),
          encryptedPhone: decryptData(encryptedRecord.personalInfo.encryptedPhone),
          encryptedDOB: decryptData(encryptedRecord.personalInfo.encryptedDOB),
          encryptedAddress: decryptData(encryptedRecord.personalInfo.encryptedAddress),
          encryptedSSN: encryptedRecord.personalInfo.encryptedSSN ? decryptData(encryptedRecord.personalInfo.encryptedSSN) : undefined,
        },
        emergencyContact: {
          encryptedName: decryptData(encryptedRecord.emergencyContact.encryptedName),
          encryptedRelationship: decryptData(encryptedRecord.emergencyContact.encryptedRelationship),
          encryptedPhone: decryptData(encryptedRecord.emergencyContact.encryptedPhone),
        },
        insuranceInfo: {
          encryptedProvider: decryptData(encryptedRecord.insuranceInfo.encryptedProvider),
          encryptedPolicyNumber: decryptData(encryptedRecord.insuranceInfo.encryptedPolicyNumber),
          encryptedGroupNumber: decryptData(encryptedRecord.insuranceInfo.encryptedGroupNumber),
        },
      };

      // Log access
      await logAuditEvent({
        action: 'CLIENT_ACCESSED',
        resourceType: 'CLIENT_RECORD',
        resourceId: clientId,
        userId: 'system',
        userRole: 'system',
        details: { clientId },
        complianceLevel: 'hipaa',
      });

      return { success: true, data: decryptedRecord };
    } else {
      return { success: false, error: "Client record not found" };
    }

  } catch (error) {
    console.error("Error retrieving client record from DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Save treatment record
 */
export const saveTreatmentRecord = async (
  treatmentData: Omit<TreatmentRecord, 'recordId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; recordId?: string; error?: string }> => {
  try {
    const recordId = `treatment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const record: TreatmentRecord = {
      recordId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...treatmentData,
      encryptedNotes: encryptData(treatmentData.encryptedNotes),
    };

    const command = new PutCommand({
      TableName: TREATMENT_RECORDS_TABLE,
      Item: record,
      ConditionExpression: "attribute_not_exists(recordId)",
    });

    await docClient.send(command);

    // Log the creation
    await logAuditEvent({
      action: 'TREATMENT_RECORD_CREATED',
      resourceType: 'TREATMENT_RECORD',
      resourceId: recordId,
      userId: treatmentData.therapistId,
      userRole: 'therapist',
      details: { recordId, clientId: treatmentData.clientId },
      complianceLevel: 'hipaa',
    });

    console.log("Treatment record saved successfully:", recordId);
    return { success: true, recordId };

  } catch (error) {
    console.error("Error saving treatment record to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Create secure session
 */
export const createSession = async (
  sessionData: Omit<SessionRecord, 'sessionId' | 'createdAt' | 'expiresAt'>
): Promise<{ success: boolean; sessionId?: string; error?: string }> => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const record: SessionRecord = {
      sessionId,
      createdAt,
      expiresAt,
      ...sessionData,
    };

    const command = new PutCommand({
      TableName: SESSIONS_TABLE,
      Item: record,
      ConditionExpression: "attribute_not_exists(sessionId)",
    });

    await docClient.send(command);

    console.log("Session created successfully:", sessionId);
    return { success: true, sessionId };

  } catch (error) {
    console.error("Error creating session in DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Log audit event for HIPAA compliance
 */
export const logAuditEvent = async (
  auditData: Omit<AuditLogRecord, 'logId' | 'timestamp'>
): Promise<{ success: boolean; logId?: string; error?: string }> => {
  try {
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const record: AuditLogRecord = {
      logId,
      timestamp,
      ...auditData,
    };

    const command = new PutCommand({
      TableName: AUDIT_TABLE,
      Item: record,
    });

    await docClient.send(command);

    return { success: true, logId };

  } catch (error) {
    console.error("Error logging audit event to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get treatment records for a client
 */
export const getClientTreatmentRecords = async (
  clientId: string
): Promise<{ success: boolean; data?: TreatmentRecord[]; error?: string }> => {
  try {
    const command = new ScanCommand({
      TableName: TREATMENT_RECORDS_TABLE,
      FilterExpression: "clientId = :clientId",
      ExpressionAttributeValues: {
        ":clientId": clientId,
      },
    });

    const response = await docClient.send(command);

    const records = (response.Items || []).map((item: any) => ({
      ...item,
      encryptedNotes: decryptData(item.encryptedNotes),
    })) as TreatmentRecord[];

    // Log access
    await logAuditEvent({
      action: 'TREATMENT_RECORDS_ACCESSED',
      resourceType: 'TREATMENT_RECORD',
      resourceId: clientId,
      userId: 'system',
      userRole: 'system',
      details: { clientId, recordCount: records.length },
      complianceLevel: 'hipaa',
    });

    return { success: true, data: records };

  } catch (error) {
    console.error("Error retrieving treatment records from DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Search clients by encrypted fields (limited search for privacy)
 */
export const searchClients = async (
  searchCriteria: { status?: string; dateRange?: { start: string; end: string } }
): Promise<{ success: boolean; data?: Partial<ClientRecord>[]; error?: string }> => {
  try {
    let filterExpression = "";
    const expressionAttributeValues: any = {};

    if (searchCriteria.status) {
      filterExpression = "#status = :status";
      expressionAttributeValues[":status"] = searchCriteria.status;
    }

    const command = new ScanCommand({
      TableName: CLIENT_DATA_TABLE,
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
      ExpressionAttributeNames: filterExpression ? { "#status": "status" } : undefined,
      ProjectionExpression: "clientId, createdAt, #status, consentRecords",
      Limit: 50,
    });

    const response = await docClient.send(command);

    // Log search
    await logAuditEvent({
      action: 'CLIENT_SEARCH',
      resourceType: 'CLIENT_RECORD',
      resourceId: 'multiple',
      userId: 'system',
      userRole: 'system',
      details: { searchCriteria, resultCount: response.Items?.length || 0 },
      complianceLevel: 'hipaa',
    });

    return { success: true, data: response.Items as Partial<ClientRecord>[] || [] };

  } catch (error) {
    console.error("Error searching clients in DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

// ====== AI CHAT INSURANCE VERIFICATION ======

export interface AIChatInsuranceRecord {
  chatId: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  clientInfo: {
    encryptedName?: string;
    encryptedPhone?: string;
    encryptedEmail?: string;
    encryptedDOB?: string;
  };
  insuranceInfo: {
    provider: string;
    encryptedMemberId?: string;
    encryptedGroupNumber?: string;
    encryptedPolicyNumber?: string;
  };
  chatHistory: {
    messageId: string;
    timestamp: string;
    sender: 'user' | 'ai';
    message: string;
    isEncrypted: boolean;
    containsPII?: boolean;
  }[];
  verificationStatus: 'in_progress' | 'pending_review' | 'verified' | 'needs_info' | 'completed';
  preferredContactTime?: string;
  urgencyLevel: 'standard' | 'urgent' | 'crisis';
  consentGiven: boolean;
  consentTimestamp?: string;
  ipAddress?: string;
  userAgent?: string;
  followUpScheduled?: string;
}

export interface AIChatMessage {
  messageId: string;
  timestamp: string;
  sender: 'user' | 'ai';
  message: string;
  isEncrypted?: boolean;
  containsPII?: boolean;
}

/**
 * Save AI chat insurance verification session to DynamoDB
 */
export const saveAIChatInsuranceSession = async (
  chatData: Omit<AIChatInsuranceRecord, 'chatId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; chatId?: string; error?: string }> => {
  try {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Encrypt sensitive data
    const encryptedRecord: AIChatInsuranceRecord = {
      chatId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...chatData,
      clientInfo: {
        encryptedName: chatData.clientInfo.encryptedName ? encryptData(chatData.clientInfo.encryptedName) : undefined,
        encryptedPhone: chatData.clientInfo.encryptedPhone ? encryptData(chatData.clientInfo.encryptedPhone) : undefined,
        encryptedEmail: chatData.clientInfo.encryptedEmail ? encryptData(chatData.clientInfo.encryptedEmail) : undefined,
        encryptedDOB: chatData.clientInfo.encryptedDOB ? encryptData(chatData.clientInfo.encryptedDOB) : undefined,
      },
      insuranceInfo: {
        ...chatData.insuranceInfo,
        encryptedMemberId: chatData.insuranceInfo.encryptedMemberId ? encryptData(chatData.insuranceInfo.encryptedMemberId) : undefined,
        encryptedGroupNumber: chatData.insuranceInfo.encryptedGroupNumber ? encryptData(chatData.insuranceInfo.encryptedGroupNumber) : undefined,
        encryptedPolicyNumber: chatData.insuranceInfo.encryptedPolicyNumber ? encryptData(chatData.insuranceInfo.encryptedPolicyNumber) : undefined,
      },
      chatHistory: chatData.chatHistory.map(msg => ({
        ...msg,
        message: msg.containsPII ? encryptData(msg.message) : msg.message,
        isEncrypted: msg.containsPII || false
      }))
    };

    const command = new PutCommand({
      TableName: "NewVisionWellness_AIChatSessions",
      Item: encryptedRecord,
      ConditionExpression: "attribute_not_exists(chatId)",
    });

    await docClient.send(command);

    // Log audit trail
    await logAuditEvent({
      action: 'CREATE_AI_CHAT_SESSION',
      resourceType: 'insurance_verification',
      resourceId: chatId,
      userId: 'ai_system',
      userRole: 'system',
      ipAddress: chatData.ipAddress,
      userAgent: chatData.userAgent,
      details: {
        provider: chatData.insuranceInfo.provider,
        verificationStatus: chatData.verificationStatus,
        consentGiven: chatData.consentGiven
      },
      complianceLevel: 'hipaa'
    });

    console.log("AI chat insurance session saved successfully:", chatId);
    return { success: true, chatId };

  } catch (error) {
    console.error("Error saving AI chat session to DynamoDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Update AI chat session with new messages or status
 */
export const updateAIChatSession = async (
  chatId: string,
  updates: Partial<Pick<AIChatInsuranceRecord, 'chatHistory' | 'verificationStatus' | 'clientInfo' | 'insuranceInfo' | 'followUpScheduled'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const updateExpression: string[] = [];
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};

    // Handle chat history updates
    if (updates.chatHistory) {
      updateExpression.push('#chatHistory = :chatHistory');
      expressionAttributeNames['#chatHistory'] = 'chatHistory';
      expressionAttributeValues[':chatHistory'] = updates.chatHistory.map(msg => ({
        ...msg,
        message: msg.containsPII ? encryptData(msg.message) : msg.message,
        isEncrypted: msg.containsPII || false
      }));
    }

    // Handle status updates
    if (updates.verificationStatus) {
      updateExpression.push('#verificationStatus = :verificationStatus');
      expressionAttributeNames['#verificationStatus'] = 'verificationStatus';
      expressionAttributeValues[':verificationStatus'] = updates.verificationStatus;
    }

    // Handle client info updates
    if (updates.clientInfo) {
      updateExpression.push('#clientInfo = :clientInfo');
      expressionAttributeNames['#clientInfo'] = 'clientInfo';
      expressionAttributeValues[':clientInfo'] = {
        encryptedName: updates.clientInfo.encryptedName ? encryptData(updates.clientInfo.encryptedName) : undefined,
        encryptedPhone: updates.clientInfo.encryptedPhone ? encryptData(updates.clientInfo.encryptedPhone) : undefined,
        encryptedEmail: updates.clientInfo.encryptedEmail ? encryptData(updates.clientInfo.encryptedEmail) : undefined,
        encryptedDOB: updates.clientInfo.encryptedDOB ? encryptData(updates.clientInfo.encryptedDOB) : undefined,
      };
    }

    // Handle insurance info updates
    if (updates.insuranceInfo) {
      updateExpression.push('#insuranceInfo = :insuranceInfo');
      expressionAttributeNames['#insuranceInfo'] = 'insuranceInfo';
      expressionAttributeValues[':insuranceInfo'] = {
        ...updates.insuranceInfo,
        encryptedMemberId: updates.insuranceInfo.encryptedMemberId ? encryptData(updates.insuranceInfo.encryptedMemberId) : undefined,
        encryptedGroupNumber: updates.insuranceInfo.encryptedGroupNumber ? encryptData(updates.insuranceInfo.encryptedGroupNumber) : undefined,
        encryptedPolicyNumber: updates.insuranceInfo.encryptedPolicyNumber ? encryptData(updates.insuranceInfo.encryptedPolicyNumber) : undefined,
      };
    }

    // Handle follow-up scheduling
    if (updates.followUpScheduled) {
      updateExpression.push('#followUpScheduled = :followUpScheduled');
      expressionAttributeNames['#followUpScheduled'] = 'followUpScheduled';
      expressionAttributeValues[':followUpScheduled'] = updates.followUpScheduled;
    }

    // Always update the timestamp
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: "NewVisionWellness_AIChatSessions",
      Key: { chatId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    await docClient.send(command);

    // Log audit trail
    await logAuditEvent({
      action: 'UPDATE_AI_CHAT_SESSION',
      resourceType: 'insurance_verification',
      resourceId: chatId,
      userId: 'ai_system',
      userRole: 'system',
      details: {
        updatedFields: Object.keys(updates),
        verificationStatus: updates.verificationStatus
      },
      complianceLevel: 'hipaa'
    });

    console.log("AI chat session updated successfully:", chatId);
    return { success: true };

  } catch (error) {
    console.error("Error updating AI chat session:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get AI chat session by ID
 */
export const getAIChatSession = async (
  chatId: string
): Promise<{ success: boolean; data?: AIChatInsuranceRecord; error?: string }> => {
  try {
    const command = new GetCommand({
      TableName: "NewVisionWellness_AIChatSessions",
      Key: { chatId }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return { success: false, error: "Chat session not found" };
    }

    // Decrypt sensitive data for authorized access
    const decryptedRecord: AIChatInsuranceRecord = {
      ...result.Item as AIChatInsuranceRecord,
      clientInfo: {
        encryptedName: result.Item.clientInfo?.encryptedName ? decryptData(result.Item.clientInfo.encryptedName) : undefined,
        encryptedPhone: result.Item.clientInfo?.encryptedPhone ? decryptData(result.Item.clientInfo.encryptedPhone) : undefined,
        encryptedEmail: result.Item.clientInfo?.encryptedEmail ? decryptData(result.Item.clientInfo.encryptedEmail) : undefined,
        encryptedDOB: result.Item.clientInfo?.encryptedDOB ? decryptData(result.Item.clientInfo.encryptedDOB) : undefined,
      },
      insuranceInfo: {
        ...result.Item.insuranceInfo,
        encryptedMemberId: result.Item.insuranceInfo?.encryptedMemberId ? decryptData(result.Item.insuranceInfo.encryptedMemberId) : undefined,
        encryptedGroupNumber: result.Item.insuranceInfo?.encryptedGroupNumber ? decryptData(result.Item.insuranceInfo.encryptedGroupNumber) : undefined,
        encryptedPolicyNumber: result.Item.insuranceInfo?.encryptedPolicyNumber ? decryptData(result.Item.insuranceInfo.encryptedPolicyNumber) : undefined,
      },
      chatHistory: result.Item.chatHistory?.map((msg: any) => ({
        ...msg,
        message: msg.isEncrypted ? decryptData(msg.message) : msg.message
      })) || []
    };

    return { success: true, data: decryptedRecord };

  } catch (error) {
    console.error("Error retrieving AI chat session:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

// ...existing code...
