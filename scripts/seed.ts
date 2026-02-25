import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function seed() {
  // Create Users table
  try {
    await client.send(
      new CreateTableCommand({
        TableName: "Users",
        KeySchema: [
          { AttributeName: "PK", KeyType: "HASH" },
          { AttributeName: "SK", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "SK", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    );
    console.log("Users table created");
  } catch (err: any) {
    if (err.name !== "ResourceInUseException") {
      throw err;
    }
  }

  // Insert user
  await docClient.send(
    new PutCommand({
      TableName: "Users",
      Item: {
        PK: "USER#diego",
        SK: "PROFILE",
        name: "Diego",
        username: "diego123",
        type: "user",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    })
  );

  console.log("Seed data inserted");
}

seed().catch(console.error);