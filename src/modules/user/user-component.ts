import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { FollowDTO } from "./DTOs/follow.dto";
import { GetUserDTO } from "./DTOs/get-user.dto";
import { UserDatastore } from "./user-datastore";

export class UserComponent {

    constructor(
        private userDatastore: UserDatastore
    ){}

    public static build(): UserComponent {
        const userDatastore = UserDatastore.build();
        return new UserComponent(userDatastore);
    }

    public async createUser(dto: CreateUserDTO) {
        // normalize username
        dto.username = dto.username.toLowerCase();

        // check if username or email already exist
        const usernameExists = await this.userDatastore.getUser(dto.username);
        if(usernameExists){
            throw new ResourceError("Username already in use.", ResourceErrorReason.CONFLICT);
        }
        const emailExists = await this.userDatastore.getUser(dto.email);
        if(emailExists){
            throw new ResourceError("Email already in use.", ResourceErrorReason.CONFLICT)
        }
        
        // hash password

        return await this.userDatastore.createUser(dto);
    }

    public async getUser(dto: GetUserDTO){
        return await this.userDatastore.getUser(dto.userIdentifier);
    }

    public async getUsers() {
        return await this.userDatastore.getUsers();
    }

    public async addFollower(followBody: FollowDTO){
        // Get First User
        const user = await this.userDatastore.getUser(followBody.userId);
        if(!user){
            throw new ResourceError("User requesting to follow, does not exist.", ResourceErrorReason.NOT_FOUND);
        }
        // Check if user to follow exists
        const follow = await this.userDatastore.getUser(followBody.following);
        if(!follow){
            throw new ResourceError("User to follow, does not exist.", ResourceErrorReason.NOT_FOUND);
        }

        // check if this follow relationship already exists
        const check = false;
        if(check){
            throw new ResourceError("Follow relationship already exists.", ResourceErrorReason.CONFLICT);
        }

        return await this.userDatastore.createFollow(followBody.userId, followBody.following);
    }
}