import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { ENTITY, generateUuid, PK, SK, TABLE_NAME } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";

export class PostsDatastore {
    dbClient: DynamoDBDocumentClient | undefined;
    
    constructor(
        dbClient: DynamoDBDocumentClient
    ){
        this.dbClient = dbClient;
    }

    public static build(): PostsDatastore {
        const dbClient = DynamoClient.getInstance().clientInstance;
        return new PostsDatastore(dbClient);
    }

    public async createPost(postBody: CreatePostDTO){
        const timestamp = new Date().toISOString();
        const postId = generateUuid();
        const postPK = PK.post(postBody.userId);
        const postSK = SK.post(timestamp, postId); // verify this is correct pattern

        const post = {
            PK: postPK,
            SK: postSK,
            entity: ENTITY.post,
            postId: postId,
            userId: postBody.userId,
            createdAt: timestamp,
            type: postBody.type,
            calories: postBody.calories,
            distance: postBody.distance,
            duration: postBody.duration,
            imageUrl: postBody.imageUrl,
            caption: postBody.caption
        };
        const entry = {
            TableName: TABLE_NAME,
            Item: post
        }

        try {
            const result = await this.dbClient?.send(new PutCommand(entry))
            return result;
        } catch(e) {
            console.log(e)
            throw new ResourceError("Create Post Put Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }

    public async getUsersPosts(userId: string){
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
            ExpressionAttributeValues: {
                ":pk": PK.post(userId),
                ":skPrefix": "POST#"
            },
            ScanIndexForward: false
        });

        const result = this.dbClient?.send(command);
        return result;
    }
}