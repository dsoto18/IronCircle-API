import { ENTITY, PK, SK, generateUuid } from "../src/services/dynamodb-keys"
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
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
      PK: userPK,
      SK: SK.profile,
      entity: ENTITY.user,
      firstName: "John",
      lastName: "Doe",
      username: "mrjohndoe",
      email: "johndoe@example.com",
      password: "password123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false,
      bio: "my name is john doe.",
      profilePictureUrl: ""
    },
    ConditionExpression: "attribute_not_exists(PK)"
  };

  const usernameEntry = {
    TableName: tableName,
    Item: {
        PK: PK.username("mrjohndoe"),
        SK: SK.user,
        entity: ENTITY.username,
        userId: firstUserUuid
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  const emailEntry = {
    TableName: tableName,
    Item: {
        PK: PK.email("johndoe@example.com"),
        SK: SK.user,
        entity: ENTITY.email,
        userId: firstUserUuid
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  // User #2
  const userEntry2 = {
    TableName: tableName,
    Item: {
      PK: user2PK,
      SK: SK.profile,
      entity: ENTITY.user,
      firstName: "Dan",
      lastName: "Smith",
      username: "dansmith123",
      email: "dansmith@example.com",
      password: "password123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false,
      bio: "",
      profilePictureUrl: ""
    },
    ConditionExpression: "attribute_not_exists(PK)"
  };

  const usernameEntry2 = {
    TableName: tableName,
    Item: {
        PK: PK.username("dansmith123"),
        SK: SK.user,
        entity: ENTITY.username,
        userId: secondUserUuid // maybe only store cuid
    },
    ConditionExpression: "attribute_not_exists(PK)"
  }

  const emailEntry2 = {
    TableName: tableName,
    Item: {
        PK: PK.email("dansmith@example.com"),
        SK: SK.user,
        entity: ENTITY.email ,
        userId: secondUserUuid
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
  await docClient.send(new TransactWriteCommand({TransactItems: transaction}));

  console.log("Seed data inserted");

  const result = await docClient.send(
    new ScanCommand({ TableName: tableName })
  );

  console.log(result.Items);
}

seed().catch(console.error);