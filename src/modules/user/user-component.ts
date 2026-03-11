import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { CreateUserDTO } from "./DTOs/create-user.dto";
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
        console.log(dto);
        return await this.userDatastore.getUser(dto.userIdentifier);
    }
}