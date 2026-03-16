import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreatePostDTO } from "./DTOs/create-post.dto";
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
}