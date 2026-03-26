import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
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

    public async getPost(userId: string, postId: string, created: string) {
        const post = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.user(userId),
                SK: SK.post(created, postId)
            }
        }));
        return post;
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
            caption: postBody.caption,
            likeCount: 0
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

    public async likePost(userId: string, author: string, postId: string, createdAt: string){
        const TransactItems = [
            { // Post-side like edge
                Put: {
                    TableName: TABLE_NAME,
                    Item: {
                        PK: PK.user(author),
                        SK: SK.like(postId, userId),
                        entity: ENTITY.like,
                        postId: postId,
                        postAuthor: author,
                        likedByUserId: userId,
                        createdAt: new Date().toISOString()
                    },
                    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
                }
            },
            { // Viewer-side like edge
                Put: {
                    TableName: TABLE_NAME,
                    Item: {
                        PK: PK.user(userId), // viewer userId
                        SK: SK.likedPost(postId),
                        entity: ENTITY.likedPost,
                        postId: postId,
                        postAuthor: author,
                        postCreatedAt: createdAt,
                        createdAt: new Date().toISOString()
                    },
                    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
                }
            },
            {
                Update: {
                    TableName: TABLE_NAME,
                    Key: {
                        PK: PK.user(author),
                        SK: SK.post(createdAt, postId)
                    },
                    UpdateExpression: "SET likeCount = if_not_exists(likeCount, :zero) + :inc",
                    ExpressionAttributeValues: {
                        ":zero": 0,
                        ":inc": 1
                    },
                    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)"
                }
            }
        ];
        
        return await this.dbClient?.send(new TransactWriteCommand({TransactItems}));
    }

    public async unLikePost(userId: string, author: string, postId: string, createdAt: string){
        const TransactItems = [
            {
                Delete: {
                    TableName: TABLE_NAME,
                    Key: {
                        PK: PK.user(author),
                        SK: SK.like(postId, userId)
                    },
                    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)"
                }
            },
            {
                Delete: {
                    TableName: TABLE_NAME,
                    Key: {
                        PK: PK.user(userId),
                        SK: SK.likedPost(postId)
                    },
                    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)"
                }
            },
            {
                Update: {
                    TableName: TABLE_NAME,
                    Key: {
                        PK: PK.user(author),
                        SK: SK.post(createdAt, postId)
                    },
                    UpdateExpression: "SET likeCount = likeCount - :dec",
                    ExpressionAttributeValues: {
                        ":dec": 1
                    },
                    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK) AND likeCount >= :dec"
                }
            }
        ];

        return await this.dbClient?.send(new TransactWriteCommand({TransactItems}));
    }

    public async getIndividualLike(authorId: string, postId: string, viewerUserId: string){
        const like = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.user(authorId),
                SK: SK.like(postId, viewerUserId)
            }
        }));
        return like;
    }

    public async getUserLikedPosts(userId: string) {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
            ExpressionAttributeValues: {
                ":pk": PK.user(userId),
                ":prefix": "LIKED_POST#"
            }
        });

        return await this.dbClient?.send(command);
    }
}