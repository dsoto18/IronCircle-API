import { DynamoDBClient, GetItemCommand, PutItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { ENTITY, generateUuid, PK, SK } from "../../services/dynamodb-keys";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { ResourceError, ResourceErrorReason } from "../../shared/error";

export class UserDatastore {
    
    dbClient: DynamoDBClient | undefined;

    constructor(
        dbClient: DynamoDBClient
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
            TableName: "Users",
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
            TableName: "Users",
            Item: {
                PK: { S: usernamePK },
                SK: { S: usernameSK },
                entity: { S: ENTITY.username },
                userId: { S: partitionKey } // maybe only store cuid
            },
            ConditionExpression: "attribute_not_exists(PK)"
        }

        const emailEntry = {
            TableName: "Users",
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
            console.log("Error caught in datastore funciton.")
            console.log(e)
            
            return;
        }
    }

    public async getUser(identifier: string){

        // GetItem query for the username lock item
        const usernameLock = await this.dbClient?.send(new GetItemCommand({
            TableName: "Users",
            Key: {
                PK: { S: PK.username(identifier) },
                SK: { S: SK.user }
            }
        }));

        // try GetItem query for email lock item
        const emailLock = await this.dbClient?.send(new GetItemCommand({
            TableName: "Users",
            Key: {
                PK: { S: PK.email(identifier)},
                SK: { S: SK.user}
            }
        }));


        // grab PK userid from the item returned
        const userId = usernameLock?.Item?.userId?.S ?? emailLock?.Item?.userId?.S;
        // if doesn't exist, not found
        if(!userId){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND)
        }

        // GetItem query for the user body using the userId
        const user = await this.dbClient?.send(new GetItemCommand({
            TableName: "Users",
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
}