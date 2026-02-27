import { UserDatastore } from "./user-datastore";

export class UserComponent {

    constructor(
        private userDatastore: UserDatastore
    ){}

    public static build(): UserComponent {
        const userDatastore = UserDatastore.build();
        return new UserComponent(userDatastore);
    }

    public createUser() {
        return this.userDatastore.createUser({name: "Dan"});
    }
}