import { ENTITY, generateUuid, PK, SK } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreateFeaturePostDTO } from "./DTOs/create-feature-post.dto";
import { ExplorePostsDatastore } from "./explore-posts-datastore";
import { ExplorePost } from "./types/explore-post";

export class ExplorePostsComponent {
    constructor(
        private userDatastore: UserDatastore,
        private exploreDatastore: ExplorePostsDatastore
    ){}

    public static build(): ExplorePostsComponent {
        const userDatastore = UserDatastore.build();
        const exploreDatastore = ExplorePostsDatastore.build();
        return new ExplorePostsComponent(userDatastore, exploreDatastore);
    }

    public async createPost(postBody: CreateFeaturePostDTO){
        if(!postBody.userId){
            throw new ResourceError("User ID is required to create a featured post.", ResourceErrorReason.INVALID_ACCESS);
        }

        const user = await this.userDatastore.getUserById(postBody.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        if(user?.Item.isVerified !== true){
            throw new ResourceError("Requester must have verified account.", ResourceErrorReason.FORBIDDEN);
        }

        const createdAt = new Date().toISOString();
        const postId = generateUuid();

        const post: ExplorePost = {
            PK: PK.explorePost(),
            SK: SK.explorePost(createdAt, postId),
            entity: ENTITY.explorePost,
            sourceId: user.Item.userId,
            sourceName: user.Item.username,
            sourceType: 'influencer',
            isVerified: true,
            contentType: postBody.contentType,
            title: postBody.title,
            summary: postBody.summary,
            tags: postBody.tags,
            createdAt: createdAt,
            updatedAt: createdAt
        }

        return await this.exploreDatastore.createPost(post);
    }

    public async getFeaturedPosts(requester: string){
        const user = await this.userDatastore.getUserById(requester);
        if(!user?.Item){
            throw new ResourceError("Requesting user is not found.", ResourceErrorReason.NOT_FOUND);
        }

        return await this.exploreDatastore.getPosts();
    }
}