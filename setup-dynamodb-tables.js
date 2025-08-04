#!/usr/bin/env node

/**
 * DynamoDB Table Setup Script for HIPAA-Compliant NewVisionWellness
 * 
 * This script creates the necessary DynamoDB tables for storing client data,
 * treatment records, session information, and audit logs in a HIPAA-compliant manner.
 * 
 * Usage: node setup-dynamodb-tables.js
 */

import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

// AWS Configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Table configurations
const tables = [
  {
    TableName: "NewVisionWellness_InsuranceVerifications",
    KeySchema: [
      { AttributeName: "submissionId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "submissionId", AttributeType: "S" }
    ],
    BillingMode: "PAY_PER_REQUEST",
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "Insurance" },
      { Key: "HIPAA", Value: "Compliant" }
    ]
  },
  {
    TableName: "NewVisionWellness_ClientData",
    KeySchema: [
      { AttributeName: "clientId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "clientId", AttributeType: "S" },
      { AttributeName: "status", AttributeType: "S" },
      { AttributeName: "createdAt", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "StatusIndex",
        KeySchema: [
          { AttributeName: "status", KeyType: "HASH" },
          { AttributeName: "createdAt", KeyType: "RANGE" }
        ],
        Projection: { ProjectionType: "ALL" }
      }
    ],
    BillingMode: "PAY_PER_REQUEST",
    PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    SSESpecification: {
      SSEEnabled: true,
      SSEType: "KMS"
    },
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "PHI" },
      { Key: "HIPAA", Value: "Critical" },
      { Key: "Encryption", Value: "Required" }
    ]
  },
  {
    TableName: "NewVisionWellness_TreatmentRecords",
    KeySchema: [
      { AttributeName: "recordId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "recordId", AttributeType: "S" },
      { AttributeName: "clientId", AttributeType: "S" },
      { AttributeName: "sessionDate", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ClientSessionIndex",
        KeySchema: [
          { AttributeName: "clientId", KeyType: "HASH" },
          { AttributeName: "sessionDate", KeyType: "RANGE" }
        ],
        Projection: { ProjectionType: "ALL" }
      }
    ],
    BillingMode: "PAY_PER_REQUEST",
    PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    SSESpecification: {
      SSEEnabled: true,
      SSEType: "KMS"
    },
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "Treatment" },
      { Key: "HIPAA", Value: "Critical" },
      { Key: "Encryption", Value: "Required" }
    ]
  },
  {
    TableName: "NewVisionWellness_Sessions",
    KeySchema: [
      { AttributeName: "sessionId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "sessionId", AttributeType: "S" },
      { AttributeName: "expiresAt", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ExpirationIndex",
        KeySchema: [
          { AttributeName: "expiresAt", KeyType: "HASH" }
        ],
        Projection: { ProjectionType: "KEYS_ONLY" }
      }
    ],
    BillingMode: "PAY_PER_REQUEST",
    TimeToLiveSpecification: {
      AttributeName: "expiresAt",
      Enabled: true
    },
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "Session" },
      { Key: "HIPAA", Value: "Compliant" }
    ]
  },
  {
    TableName: "NewVisionWellness_AuditLog",
    KeySchema: [
      { AttributeName: "logId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "logId", AttributeType: "S" },
      { AttributeName: "timestamp", AttributeType: "S" },
      { AttributeName: "complianceLevel", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "TimestampIndex",
        KeySchema: [
          { AttributeName: "complianceLevel", KeyType: "HASH" },
          { AttributeName: "timestamp", KeyType: "RANGE" }
        ],
        Projection: { ProjectionType: "ALL" }
      }
    ],
    BillingMode: "PAY_PER_REQUEST",
    PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    SSESpecification: {
      SSEEnabled: true,
      SSEType: "KMS"
    },
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "Audit" },
      { Key: "HIPAA", Value: "Critical" },
      { Key: "Retention", Value: "7Years" }
    ]
  },
  {
    TableName: "NewVisionWellness_UserRegistrations",
    KeySchema: [
      { AttributeName: "registrationId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "registrationId", AttributeType: "S" }
    ],
    BillingMode: "PAY_PER_REQUEST",
    SSESpecification: {
      SSEEnabled: true,
      SSEType: "KMS"
    },
    Tags: [
      { Key: "Environment", Value: "Production" },
      { Key: "Application", Value: "NewVisionWellness" },
      { Key: "DataType", Value: "Registration" },
      { Key: "HIPAA", Value: "Compliant" }
    ]
  }
];

/**
 * Check if table exists
 */
async function tableExists(tableName) {
  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    return response.TableNames?.includes(tableName) || false;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Create a single table
 */
async function createTable(tableConfig) {
  try {
    console.log(`Creating table: ${tableConfig.TableName}...`);
    
    const command = new CreateTableCommand(tableConfig);
    const response = await client.send(command);
    
    console.log(`✅ Table ${tableConfig.TableName} created successfully`);
    console.log(`   Status: ${response.TableDescription?.TableStatus}`);
    console.log(`   ARN: ${response.TableDescription?.TableArn}`);
    
    return { success: true, tableArn: response.TableDescription?.TableArn };
  } catch (error) {
    console.error(`❌ Error creating table ${tableConfig.TableName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Main setup function
 */
async function setupTables() {
  console.log("🚀 Starting DynamoDB table setup for NewVisionWellness...\n");
  
  const results = [];
  
  for (const tableConfig of tables) {
    const exists = await tableExists(tableConfig.TableName);
    
    if (exists) {
      console.log(`⚠️  Table ${tableConfig.TableName} already exists, skipping...`);
      results.push({ tableName: tableConfig.TableName, status: 'exists' });
    } else {
      const result = await createTable(tableConfig);
      results.push({
        tableName: tableConfig.TableName,
        status: result.success ? 'created' : 'failed',
        error: result.error
      });
    }
    
    // Add delay between table creations to avoid throttling
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n📊 Setup Summary:");
  console.log("================");
  
  results.forEach(result => {
    const status = result.status === 'created' ? '✅ Created' : 
                   result.status === 'exists' ? '⚠️  Exists' : '❌ Failed';
    console.log(`${status} - ${result.tableName}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  const createdCount = results.filter(r => r.status === 'created').length;
  const existsCount = results.filter(r => r.status === 'exists').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  
  console.log(`\n📈 Results: ${createdCount} created, ${existsCount} existed, ${failedCount} failed`);
  
  if (failedCount === 0) {
    console.log("\n🎉 All tables are ready for HIPAA-compliant data storage!");
    console.log("\n📋 Next Steps:");
    console.log("1. Configure AWS KMS keys for enhanced encryption");
    console.log("2. Set up IAM roles with least privilege access");
    console.log("3. Configure CloudWatch monitoring and alerts");
    console.log("4. Set up automated backups and retention policies");
    console.log("5. Review and test audit logging");
  } else {
    console.log("\n⚠️  Some tables failed to create. Please review the errors above.");
  }
}

/**
 * Environment validation
 */
function validateEnvironment() {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach(key => console.error(`   - ${key}`));
    console.error("\nPlease set these environment variables and try again.");
    return false;
  }
  
  return true;
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!validateEnvironment()) {
    process.exit(1);
  }
  
  setupTables()
    .then(() => {
      console.log("\n✨ Setup complete!");
      process.exit(0);
    })
    .catch(error => {
      console.error("💥 Setup failed:", error);
      process.exit(1);
    });
}

export { setupTables, createTable, tableExists };
