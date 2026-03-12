import { UserDatastore } from "../user/user-datastore";
import { CreatePostDTO } from "./DTOs/create-post.dto";
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

    }
}