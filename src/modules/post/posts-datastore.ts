import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { generateUuid, PK, SK, TABLE_NAME } from "../../services/dynamodb-keys";
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
        const postId = generateUuid();
        const postPK = PK.post(postId);
        const postSK = "some sk"; // gotta figure out this

        const post = {
            PK: postPK,
            SK: postSK,
            userId: postBody.userId,
            createdAt: new Date().toISOString(),
            type: postBody.type,
            calories: postBody.calories,
            distance: postBody.distance,
            duration: postBody.duration,
            imageUrl: postBody.imageUrl
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
}