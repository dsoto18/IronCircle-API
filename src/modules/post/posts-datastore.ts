import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { CreatePostDTO } from "./DTOs/create-post.dto";

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

    }
}