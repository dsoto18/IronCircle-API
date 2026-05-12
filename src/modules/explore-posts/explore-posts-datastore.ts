import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { ExplorePost } from "./types/explore-post";
import { TABLE_NAME } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";

export class ExplorePostsDatastore {
    dbClient: DynamoDBDocumentClient | undefined;
    
    constructor(
        dbClient: DynamoDBDocumentClient
    ){
        this.dbClient = dbClient;
    }

    public static build(): ExplorePostsDatastore {
        const dbClient = DynamoClient.getInstance().clientInstance;
        return new ExplorePostsDatastore(dbClient);
    }

    public async createPost(postBody: ExplorePost){
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: postBody
        });
        try {
            const result = await this.dbClient?.send(command);
            return result;
        } catch(e) {
            throw new ResourceError("Error creating explore post.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }
}