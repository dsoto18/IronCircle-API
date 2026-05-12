import { DynamoClient } from "../../services/dynamodb-client";
import { ENTITY, generateUuid, PK, SK, TABLE_NAME } from "../../services/dynamodb-keys";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { DynamoDBDocumentClient, GetCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { UpdateUserDTO } from "./DTOs/update-user.dto";

export class UserDatastore {
    
    dbClient: DynamoDBDocumentClient | undefined;

    constructor(
        dbClient: DynamoDBDocumentClient
    ){
        this.dbClient = dbClient;
    }

    public static build(): UserDatastore {
        const dbClient = DynamoClient.getInstance().clientInstance;
        return new UserDatastore(dbClient);
    }

    public async createUser(insert: CreateUserDTO) {
        // generate PK and SK with dynamo-keys.ts helper functions
        // const userUuid = generateUuid();  // legacy - should be using sub from auth middleware which is set in the routehandler, but keeping this here for now just in case
        const partitionKey = PK.user(insert.userId); 
        const sortKey = SK.profile;

        // generate PK and SK values for email + username records
        const usernamePK = PK.username(insert.username);
        const usernameSK = SK.user;
        const emailPK = PK.email(insert.email);
        const emailSK = SK.user;

        // populate insert body with dto values
        const entry = {
            TableName: TABLE_NAME,
            Item: {
                PK: partitionKey,
                SK: sortKey,
                UsernameIndexPK: "USERNAME", // static value to allow for GSI on username
                UsernameIndexSK: insert.username, // username as sort key for GSI to allow querying by username
                userId: insert.userId,
                entity: ENTITY.user,
                firstName: insert.firstName,
                lastName: insert.lastName,
                username: insert.username,
                email: insert.email,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isVerified: false,
                bio: "",
                profilePictureUrl: "",
            },
            ConditionExpression: "attribute_not_exists(PK)"
        };

        const usernameEntry = {
            TableName: TABLE_NAME,
            Item: {
                PK: usernamePK,
                SK: usernameSK,
                entity: ENTITY.username,
                userId: insert.userId
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }

        const emailEntry = {
            TableName: TABLE_NAME,
            Item: {
                PK: emailPK,
                SK: emailSK,
                entity: ENTITY.email,
                userId: insert.userId
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }

        const transaction = [ { Put: entry }, { Put: usernameEntry }, { Put: emailEntry } ];
        try {
            const result = await this.dbClient?.send(new TransactWriteCommand({TransactItems: transaction}))
            return result;
        } catch (e) {
            throw new ResourceError("Create User Transaction Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }

    public async getUserById(userId: string){
        // GetItem query for the user body using the userId (just uuid form)
        const user = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.user(userId),
                SK: SK.profile
            }
        }));

        return user;
    }

    public async updateUser(dto: UpdateUserDTO) {
        const updateFields: string[] = [];
        const expressionValues: Record<string, any> = {};
        const expressionNames: Record<string, string> = {};

        if (dto.firstName !== undefined) {
            updateFields.push("#firstName = :firstName");
            expressionNames["#firstName"] = "firstName";
            expressionValues[":firstName"] = dto.firstName;
        }

        if (dto.lastName !== undefined) {
            updateFields.push("#lastName = :lastName");
            expressionNames["#lastName"] = "lastName";
            expressionValues[":lastName"] = dto.lastName;
        }

        if (dto.bio !== undefined) {
            updateFields.push("#bio = :bio");
            expressionNames["#bio"] = "bio";
            expressionValues[":bio"] = dto.bio;
        }

        // always update timestamp
        updateFields.push("#updatedAt = :updatedAt");
        expressionNames["#updatedAt"] = "updatedAt";
        expressionValues[":updatedAt"] = new Date().toISOString();

        if (updateFields.length === 0) {
            throw new ResourceError(
                "No valid fields provided for update.",
                ResourceErrorReason.BAD_REQUEST
            );
        }

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.user(dto.userId),
                SK: SK.profile
            },
            UpdateExpression: `SET ${updateFields.join(", ")}`,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
            ConditionExpression: "attribute_exists(PK)",
            ReturnValues: "ALL_NEW"
        });

        const result = await this.dbClient?.send(command);
        return result;
    }

    public async getUsers(text: string){
        const query = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "UsernameIndex",
            KeyConditionExpression: "UsernameIndexPK = :pk AND begins_with(UsernameIndexSK, :q)",
            ExpressionAttributeValues: {
                ":pk": "USERNAME",
                ":q": text.toLowerCase()
            },
            ProjectionExpression: "userId, username, firstName, lastName, profilePictureUrl",
            Limit: 5
        });

        const result = await this.dbClient?.send(query);
        return result;
    }

    public async getUserEmailLock(email: string){
        // GetItem query for the email lock item
        const lock = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.email(email),
                SK: SK.user
            }
        }));

        return lock;
    }

    public async getUsernameLock(username: string){
        // GetItem query for the username lock item
        const lock = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.username(username),
                SK: SK.user
            }
        }));

        return lock;
    }

    // TODO: The following two datastore functions for "follows", could be moved to their own datastore file
    public async createFollow(follower: string, followee: string){
        const followsPK = PK.user(follower);
        const followsSK = SK.follows(followee);

        const followedByPK = PK.user(followee);
        const followedBySK = SK.followedBy(follower);

        const createdAt = new Date().toISOString();

        const entry1 = {
            TableName: TABLE_NAME,
            Item: {
                PK: followsPK,
                SK: followsSK,
                entity: ENTITY.follow,
                targetUserId: followee,
                createdAt: createdAt,
            },
            ConditionExpression: "attribute_not_exists(SK)"
        };
        const entry2 = {
            TableName: TABLE_NAME,
            Item: {
                PK: followedByPK,
                SK: followedBySK,
                entity: ENTITY.follow,
                sourceUserId: follower,
                createdAt: createdAt,
            },
            ConditionExpression: "attribute_not_exists(SK)"
        };
        
        const transaction = [ { Put: entry1 }, { Put: entry2 } ];
        try {
            const result = await this.dbClient?.send(new TransactWriteCommand({TransactItems: transaction}))
            return result;
        } catch (e) {
            throw new ResourceError("Create Follow Transaction Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO: Possibly move into own "followers" datastore file along with above function
    public async followExists(follower: string, followee: string) {
        const result = await this.dbClient?.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    PK: PK.user(follower),
                    SK: SK.follows(followee)
                }
            })
        );
        return result;
    }

    public async getUsersFollowers(userId: string){
        const command = new QueryCommand({
            TableName: TABLE_NAME,

            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",

            ExpressionAttributeValues: {
                ":pk": PK.user(userId),
                ":sk": "FOLLOWED_BY#"
            }
        });
        const result = await this.dbClient?.send(command);
        return result;
    }

    public async getProfilesUserFollows(userId: string){
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": PK.user(userId),
                ":sk": "FOLLOWS#"
            }
        });

        const result = await this.dbClient?.send(command);
        return result;
    }

    public async removeFollow(userId: string, followerId: string){
        const deleteFollow = {
            Delete: {
                TableName: TABLE_NAME,
                Key: {
                    PK: PK.user(followerId),
                    SK: SK.follows(userId),
                },
                ConditionExpression: "attribute_exists(SK)"
            }
        };

        const deleteFollowedBy = {
            Delete: {
                TableName: TABLE_NAME,
                Key: {
                    PK: PK.user(userId),
                    SK: SK.followedBy(followerId)
                },
                ConditionExpression: "attribute_exists(SK)"
            }
        };

        const transaction = [ deleteFollow, deleteFollowedBy ];

        try {
            const result = await this.dbClient?.send(new TransactWriteCommand({TransactItems: transaction}))
            return result;
        } catch (e) {
            throw new ResourceError("Remove Follow Transaction Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }
}