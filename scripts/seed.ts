import { ENTITY, PK, SK, generateUuid } from "../src/services/dynamodb-keys"
import { DynamoDBClient, CreateTableCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "../src/config";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const tableName = config.tableName;
const firstUserUuid = generateUuid();
const secondUserUuid = generateUuid();
const userPK = PK.user(firstUserUuid);
const user2PK = PK.user(secondUserUuid);

async function seed() {
  // Create Users table
  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
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
    console.log("App table created");
  } catch (err: any) {
    if (err.name !== "ResourceInUseException") {
      throw err;
    }
  }

  // mock data
  const userEntry = {
    TableName: tableName,
    Item: {
      PK: { S: userPK },
      SK: { S: SK.profile },
      entity: { S: ENTITY.user },
      firstName: { S: "John" },
      lastName: { S: "Doe" },
      username: { S: "mrjohndoe" },
      email: { S: "johndoe@example.com" },
      password: { S: "password123" },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
      isVerified: { BOOL: false },
      bio: { S: "my name is john doe." },
      profilePictureUrl: { S: "" }
    },
    ConditionExpression: "attribute_not_exists(PK)"
  };

  const usernameEntry = {
    TableName: tableName,
    Item: {
        PK: { S: PK.username("mrjohndoe") },
        SK: { S: SK.user },
        entity: { S: ENTITY.username },
        userId: { S: firstUserUuid }
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  const emailEntry = {
    TableName: tableName,
    Item: {
        PK: { S: PK.email("johndoe@example.com") },
        SK: { S: SK.user },
        entity: { S: ENTITY.email },
        userId: { S: firstUserUuid }
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  // User #2
  const userEntry2 = {
    TableName: tableName,
    Item: {
      PK: { S: user2PK },
      SK: { S: SK.profile },
      entity: { S: ENTITY.user },
      firstName: { S: "Dan" },
      lastName: { S: "Smith" },
      username: { S: "dansmith123" },
      email: { S: "dansmith@example.com" },
      password: { S: "password123" },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
      isVerified: { BOOL: false },
      bio: { S: "" },
      profilePictureUrl: { S: "" }
    },
    ConditionExpression: "attribute_not_exists(PK)"
  };

  const usernameEntry2 = {
    TableName: tableName,
    Item: {
        PK: { S: PK.username("dansmith123") },
        SK: { S: SK.user },
        entity: { S: ENTITY.username },
        userId: { S: secondUserUuid } // maybe only store cuid
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  const emailEntry2 = {
    TableName: tableName,
    Item: {
        PK: { S: PK.email("dansmith@example.com") },
        SK: { S: SK.user },
        entity: { S: ENTITY.email },
        userId: { S: secondUserUuid }
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  const transaction = [ 
    { Put: userEntry },
    { Put: usernameEntry },
    { Put: emailEntry },
    { Put: userEntry2 },
    { Put: usernameEntry2 },
    { Put: emailEntry2 }
  ];

  // Insert items via transaction
  await docClient.send(new TransactWriteItemsCommand({TransactItems: transaction}));

  console.log("Seed data inserted");
}

seed().catch(console.error);