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

type SeedUser = {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string;
  isVerified?: boolean;
  profilePictureUrl?: string;
};

function isoMinutesAgo(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
}

function buildUserItems(tableName: string, user: SeedUser) {
  const now = new Date().toISOString();

  return [
    {
      Put: {
        TableName: tableName,
        Item: {
          PK: PK.user(user.userId),
          SK: SK.profile,
          entity: ENTITY.user,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          password: "password123",
          createdAt: now,
          updatedAt: now,
          isVerified: user.isVerified ?? false,
          bio: user.bio ?? "",
          profilePictureUrl: user.profilePictureUrl ?? ""
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      }
    },
    {
      Put: {
        TableName: tableName,
        Item: {
          PK: PK.username(user.username),
          SK: SK.user,
          entity: ENTITY.username,
          userId: user.userId
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      }
    },
    {
      Put: {
        TableName: tableName,
        Item: {
          PK: PK.email(user.email),
          SK: SK.user,
          entity: ENTITY.email,
          userId: user.userId
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      }
    }
  ];
}

function buildFollowItems(tableName: string, sourceUserId: string, targetUserId: string, createdAt: string) {
  return [
    {
      Put: {
        TableName: tableName,
        Item: {
          PK: PK.user(sourceUserId),
          SK: SK.follows(targetUserId),
          entity: ENTITY.follow,
          targetUserId,
          createdAt
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      }
    },
    {
      Put: {
        TableName: tableName,
        Item: {
          PK: PK.user(targetUserId),
          SK: SK.followedBy(sourceUserId),
          entity: ENTITY.follow,
          sourceUserId,
          createdAt
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      }
    }
  ];
}

function buildPostItem(
  tableName: string,
  authorUserId: string,
  createdAt: string,
  post: {
    type: string;
    caption?: string;
    calories?: number;
    distance?: string;
    duration?: number;
    imageUrl?: string;
  }
) {
  const postId = generateUuid();

  return {
    Put: {
      TableName: tableName,
      Item: {
        PK: PK.post(authorUserId),
        SK: SK.post(createdAt, postId),
        entity: ENTITY.post,
        postId,
        userId: authorUserId,
        createdAt,
        type: post.type,
        caption: post.caption ?? "",
        calories: post.calories,
        distance: post.distance,
        duration: post.duration,
        imageUrl: post.imageUrl ?? ""
      },
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
    }
  };
}

export async function seed(docClient: any, tableName: string) {
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
  const johnId = generateUuid();
  const danId = generateUuid();
  const saraId = generateUuid();
  const mayaId = generateUuid();

  const users: SeedUser[] = [
    {
      userId: johnId,
      firstName: "John",
      lastName: "Doe",
      username: "mrjohndoe",
      email: "johndoe@example.com",
      bio: "Runner, lifter, and coffee addict.",
      isVerified: false,
      profilePictureUrl: ""
    },
    {
      userId: danId,
      firstName: "Dan",
      lastName: "Smith",
      username: "dansmith123",
      email: "dansmith@example.com",
      bio: "HIIT most mornings. Lift at night.",
      isVerified: false,
      profilePictureUrl: ""
    },
    {
      userId: saraId,
      firstName: "Sara",
      lastName: "Lee",
      username: "sweatswithsara",
      email: "sara@example.com",
      bio: "Training for my next 10k.",
      isVerified: true,
      profilePictureUrl: ""
    },
    {
      userId: mayaId,
      firstName: "Maya",
      lastName: "Patel",
      username: "mayamoves",
      email: "maya@example.com",
      bio: "Pilates, strength, mobility.",
      isVerified: true,
      profilePictureUrl: ""
    }
  ];

  const transactItems: any[] = [];

  for (const user of users) {
    transactItems.push(...buildUserItems(tableName, user));
  }

  // follows
  transactItems.push(
    ...buildFollowItems(tableName, johnId, danId, isoMinutesAgo(120)),
    ...buildFollowItems(tableName, johnId, saraId, isoMinutesAgo(110)),
    ...buildFollowItems(tableName, danId, saraId, isoMinutesAgo(100)),
    ...buildFollowItems(tableName, saraId, mayaId, isoMinutesAgo(90)),
    ...buildFollowItems(tableName, mayaId, johnId, isoMinutesAgo(80))
  );

  // posts
  transactItems.push(
    buildPostItem(tableName, danId, isoMinutesAgo(65), {
      type: "Run",
      distance: "2.3",
      duration: 1120,
      caption: "Easy recovery miles today."
    }),
    buildPostItem(tableName, danId, isoMinutesAgo(50), {
      type: "HIIT",
      duration: 1800,
      calories: 320,
      caption: "Quick lunchtime HIIT session."
    }),
    buildPostItem(tableName, saraId, isoMinutesAgo(40), {
      type: "Run",
      distance: "5.1",
      duration: 2740,
      caption: "Tempo run felt strong."
    }),
    buildPostItem(tableName, saraId, isoMinutesAgo(20), {
      type: "Walk",
      distance: "1.8",
      duration: 1900,
      caption: "Cooldown walk after training."
    }),
    buildPostItem(tableName, johnId, isoMinutesAgo(10), {
      type: "Lift",
      duration: 3600,
      caption: "Push day. Bench felt great."
    }),
    buildPostItem(tableName, mayaId, isoMinutesAgo(5), {
      type: "Mobility",
      duration: 1500,
      caption: "20 minutes of hips + thoracic mobility."
    })
  );

  // DynamoDB transact write limit is 25 items max per request
  for (let i = 0; i < transactItems.length; i += 25) {
    const chunk = transactItems.slice(i, i + 25);
    await docClient.send(
      new TransactWriteCommand({
        TransactItems: chunk
      })
    );
  }

  console.log("Seed data inserted");

  const result = await docClient.send(
    new ScanCommand({ TableName: tableName })
  );

  console.dir(result.Items, { depth: null });

  return {
    johnId,
    danId,
    saraId,
    mayaId
  };
}

seed(docClient, tableName).catch(console.error);