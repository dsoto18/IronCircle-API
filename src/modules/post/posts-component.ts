import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreatePostDTO } from "./DTOs/create-post.dto";
import { GetFeedDTO } from "./DTOs/get-feed.dto";
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

    public async updatePost(updatePostDto: UpdatePostDTO){
        const user = await this.userDatastore.getUserById(updatePostDto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const post = ""
    }

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
        console.log("Followed UserIds: ", followedUserIds)

        const postQueries = followedUserIds?.map(async userId =>
            await this.postDatastore.getUsersPosts(userId)
        );


        const results = await Promise.all(postQueries!);
        console.log("Results")
        console.log(results)

        // flatten + sort
        const posts = results.flatMap(r => r?.Items ?? []);
        // posts.forEach(async (p) => {
        //     const author = await this.userDatastore.getUserById(p.userId);
        //     p = {
        //         post: p,
        //         author: {
        //             userId: author?.Item?.userId,
        //             username: author?.Item?.username,
        //             profilePictureUrl: author?.Item?.profilePictureUrl,
        //             isVerified: false
        //         },
        //         isLiked: false,
        //         likeCount: 0
        //     }
        // })
        console.log("Posts:")
        console.log(posts)
        posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        const feedPosts = await Promise.all(
            posts.map(async (p) => {
                const author = await this.userDatastore.getUserById(p.userId);

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