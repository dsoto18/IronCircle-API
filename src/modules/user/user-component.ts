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
        return await this.userDatastore.createUser(dto);
    }

    public async getUser(dto: GetUserDTO){
        console.log(dto);
        return await this.userDatastore.getUser(dto.userIdentifier);
    }
}