import { DynamoDBClient, GetItemCommand, PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { ENTITY, generateUuid, PK, SK, TABLE_NAME } from "../../services/dynamodb-keys";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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
        const partitionKey = PK.user(generateUuid()); 
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
                PK: { S: partitionKey },
                SK: { S: sortKey },
                entity: { S: ENTITY.user },
                firstName: { S: insert.firstName },
                lastName: { S: insert.lastName },
                username: { S: insert.username },
                email: { S: insert.email },
                password: { S: "password123" },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() },
                isVerified: { BOOL: false },
                bio: { S: "" },
                profilePictureUrl: { S: "" }
            },
            ConditionExpression: "attribute_not_exists(PK)"
        };

        const usernameEntry = {
            TableName: TABLE_NAME,
            Item: {
                PK: { S: usernamePK },
                SK: { S: usernameSK },
                entity: { S: ENTITY.username },
                userId: { S: partitionKey } // maybe only store cuid
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }

        const emailEntry = {
            TableName: TABLE_NAME,
            Item: {
                PK: { S: emailPK },
                SK: { S: emailSK },
                entity: { S: ENTITY.email },
                userId: { S: partitionKey } // maybe only store cuid
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }

        const transaction = [ { Put: entry }, { Put: usernameEntry }, { Put: emailEntry } ];
        try {
            const result = await this.dbClient?.send(new TransactWriteItemsCommand({TransactItems: transaction}))
            return result;
        } catch (e) {
            throw new ResourceError("Create User Transaction Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }

    public async getUser(identifier: string){
        // Figure out PK type to use based off if identifier is email or username
        const isEmail = identifier.includes('@');
        const pkToFind = isEmail ? PK.email(identifier) : PK.username(identifier);

        // GetItem query for the username/email lock item
        const lock = await this.dbClient?.send(new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: { S: pkToFind },
                SK: { S: SK.user }
            }
        }));

        // grab PK userid from the item returned
        const userId = lock?.Item?.userId?.S;
        // if doesn't exist, not found
        if(!userId){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND)
        }

        // GetItem query for the user body using the userId
        const user = await this.dbClient?.send(new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: { S: userId },
                SK: { S: SK.profile }
            }
        }));

        if(!user?.Item){
            // should not reach here since at this point there should be a username or email lock file
            // if this is thrown this is on me
            throw new ResourceError("User Entity Item Not Found.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }

        return user?.Item;
    }

    public async getUsers(){

    }

    public async createFollow(follower: string, followee: string){
        const followsPK = PK.user(follower);
        const followsSK = SK.follows(followee);

        const followedByPK = PK.user(followee);
        const followedBySK = SK.followedBy(follower);

        const entry1 = {
            TableName: TABLE_NAME,
            Item: {
                PK: { S: followsPK },
                SK: { S: followsSK },
                entity: { S: ENTITY.user },
                targetUserId: { S: followee },
                createdAt: { S: new Date().toISOString() },
            },
            ConditionExpression: "attribute_not_exists(PK)"
        };
        const entry2 = {
            TableName: TABLE_NAME,
            Item: {
                PK: { S: followedByPK },
                SK: { S: followedBySK },
                entity: { S: ENTITY.follow },
                sourceUserId: { S: follower },
                createdAt: { S: new Date().toISOString() },
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }
        
        const transaction = [ { Put: entry1 }, { Put: entry2 } ];
        try {
            const result = await this.dbClient?.send(new TransactWriteItemsCommand({TransactItems: transaction}))
            return result;
        } catch (e) {
            throw new ResourceError("Create Follow Transaction Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }
}