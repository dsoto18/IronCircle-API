import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoClient {

    static instance: DynamoClient;
    private client: DynamoDBClient;

    private constructor(){
        this.client = new DynamoDBClient({
            region: 'us-east-1',
            endpoint: 'http://dynamodb:8000'
        });
    }

    public static getInstance(){
        if(!DynamoClient.instance){
            DynamoClient.instance = new DynamoClient();
        }
        return DynamoClient.instance;
    }
}