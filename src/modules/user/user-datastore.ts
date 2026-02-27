import { DynamoClient } from "../../services/dynamodb-client";
import { generateUuid, PK } from "../../services/dynamodb-keys";

export class UserDatastore {
    
    private dbClient: DynamoClient = DynamoClient.getInstance();

    constructor(){}

    public static build(): UserDatastore {
        return new UserDatastore();
    }

    public createUser(userbody: any) {
        const userId = generateUuid();
        userbody.ID = PK.user(userId);

        console.log(userbody);
        return userbody;
    }
}