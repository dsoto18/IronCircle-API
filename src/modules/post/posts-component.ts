import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { isISOString } from "../../shared/is-iso-string";
import { UserDatastore } from "../user/user-datastore";
import { AddLikeDTO } from "./DTOs/add-like.dto";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { GetFeedDTO } from "./DTOs/get-feed.dto";
import { GetLikesDTO } from "./DTOs/get-likes.dto";
import { GetUsersPostsDTO } from "./DTOs/get-users-posts.dto";
import { UpdatePostDTO } from "./DTOs/update-post.dto";
import { PostsDatastore } from "./posts-datastore";

export class PostsComponent {
    constructor(
        private userDatastore: UserDatastore,
        private postDatastore: PostsDatastore
    ){}

    public static build(): PostsComponent {
        const userDatastore = UserDatastore.build();
        const postDatastore = PostsDatastore.build();
        return new PostsComponent(userDatastore, postDatastore);
    }

    public async createPost(postBody: CreatePostDTO){
        // double check user exists
        const user = await this.userDatastore.getUserById(postBody.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        return await this.postDatastore.createPost(postBody);
    }

    public async getUsersPosts(getUsersPostsDto: GetUsersPostsDTO){
        const user = await this.userDatastore.getUserById(getUsersPostsDto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        return await this.postDatastore.getUsersPosts(getUsersPostsDto.userId);
    }

    // TODO: Not fully implemented yet, low priority though
    public async updatePost(updatePostDto: UpdatePostDTO){
        const user = await this.userDatastore.getUserById(updatePostDto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const post = ""
    }

    public async getLikes(dto: GetLikesDTO){

    }

    public async addLike(dto: AddLikeDTO){
        if(!isISOString(dto.postCreatedAt)){
            throw new ResourceError("Created At Value Is Not ISO Format.", ResourceErrorReason.BAD_REQUEST);
        }

        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        const author = await this.userDatastore.getUserById(dto.postAuthorId);
        if(!author?.Item){
            throw new ResourceError("Post Author Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // check post exists
        const post = await this.postDatastore.getPost(dto.postAuthorId, dto.postId, dto.postCreatedAt);
        if(!post?.Item){
            throw new ResourceError("Post Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // Can Later Remove, this should never hit because of the datastore getPost() implementation (requires AuthorID)
        if(!author?.Item?.userId !== !post?.Item?.userId){
            throw new ResourceError("Author ID Does Not Match Post's Author ID.", ResourceErrorReason.BAD_REQUEST);
        }

        
        console.log("Got Post:");
        console.log(post);
    }

    // TODO: Move into separate FEED component?
    public async getFeed(getFeedDto: GetFeedDTO){
        const user = await this.userDatastore.getUserById(getFeedDto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const follows = await this.userDatastore.getProfilesUserFollows(getFeedDto.userId);
        if(follows?.Items?.length == 0){
            return [];
        }
        const followedUserIds = follows?.Items?.map(x => x.targetUserId);
        followedUserIds?.push(getFeedDto.userId); // get user's own posts too

        const postQueries = followedUserIds?.map(async userId =>
            await this.postDatastore.getUsersPosts(userId)
        );
        const results = await Promise.all(postQueries!);

        // flatten + sort
        const posts = results.flatMap(r => r?.Items ?? []);
        posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        const feedPosts = await Promise.all(
            posts.map(async (p) => {
                const author = await this.userDatastore.getUserById(p.userId);

                // transform to FeedPost Type on Frontend
                return {
                    post: p,
                    author: {
                        userId: author?.Item?.PK,
                        username: author?.Item?.username,
                        profilePictureUrl: author?.Item?.profilePictureUrl,
                        isVerified: author?.Item?.isVerified ?? false
                    },
                    isLiked: false,
                    likeCount: 0
                };
            })
        );

        // return top page
        return feedPosts.slice(0, 20);
    }
}