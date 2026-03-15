import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { CreateUserDTO } from "./DTOs/create-user.dto";
import { FollowDTO } from "./DTOs/follow.dto";
import { GetUserDTO } from "./DTOs/get-user.dto";
import { GetUserFollowersDTO } from "./DTOs/get-users-followers.dto";
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
        const usernameExists = await this.userDatastore.getUsernameLock(dto.username);
        if(usernameExists?.Item){
            throw new ResourceError("Username already in use.", ResourceErrorReason.CONFLICT);
        }
        const emailExists = await this.userDatastore.getUserEmailLock(dto.email);
        if(emailExists?.Item){
            throw new ResourceError("Email already in use.", ResourceErrorReason.CONFLICT)
        }
        
        // hash password

        return await this.userDatastore.createUser(dto);
    }

    public async getUser(dto: GetUserDTO){
        const identifier = dto.userIdentifier;
        // figure out if identifier is email or username, and perform correct query
        const isEmail = identifier.includes('@');
        const lock = isEmail ? await this.userDatastore.getUserEmailLock(identifier) : await this.userDatastore.getUsernameLock(identifier);

        // grab PK userid from the item returned
        const userId = lock?.Item?.userId;
        // if doesn't exist, not found
        if(!userId){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND)
        }

        const user = await this.userDatastore.getUserById(userId);
        if(!user?.Item){
            // should not reach here since at this point there should be a username or email lock file
            // if this is thrown this is on me
            throw new ResourceError("User Entity Item Not Found.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }

        return user;
    }

    public async getUsers() { // Might not need
        return await this.userDatastore.getUsers();
    }

    public async addFollower(followBody: FollowDTO){
        if(followBody.userId === followBody.following){
            throw new ResourceError("User cannot follow themself.", ResourceErrorReason.BAD_REQUEST);
        }

        // Get First User
        const user = await this.userDatastore.getUserById(followBody.userId);
        if(!user?.Item){
            throw new ResourceError("User requesting to follow, does not exist.", ResourceErrorReason.NOT_FOUND);
        }
        // Check if user to follow exists
        const follow = await this.userDatastore.getUserById(followBody.following);
        if(!follow?.Item){
            throw new ResourceError("User to follow, does not exist.", ResourceErrorReason.NOT_FOUND);
        }

        // check if this follow relationship already exists
        const check = await this.userDatastore.followExists(followBody.userId, followBody.following);
        if(check?.Item){
            throw new ResourceError("Follow relationship already exists.", ResourceErrorReason.CONFLICT);
        }

        return await this.userDatastore.createFollow(followBody.userId, followBody.following);
    }

    public async getUsersFollowers(getFollowers: GetUserFollowersDTO){
        const user = await this.userDatastore.getUserById(getFollowers.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        return await this.userDatastore.getUsersFollowers(getFollowers.userId);
    }
}