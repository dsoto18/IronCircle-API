import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { ENTITY, generateUuid, PK, SK, TABLE_NAME } from "../../services/dynamodb-keys";

export class PlansDatastore {
    
    dbClient: DynamoDBDocumentClient | undefined;

    constructor(
        dbClient: DynamoDBDocumentClient
    ){
        this.dbClient = dbClient;
    }

    public static build(): PlansDatastore {
        const dbClient = DynamoClient.getInstance().clientInstance;
        return new PlansDatastore(dbClient);
    }

    public async createPlan(planBody: any){

    }
}