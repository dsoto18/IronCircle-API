import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoClient {

    private static instance: DynamoClient;
    private client: DynamoDBClient;
    private docClient: DynamoDBDocumentClient;

    private constructor(){
        this.client = new DynamoDBClient({
            region: 'us-east-1',
            endpoint: 'http://dynamodb:8000'
        });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    public static getInstance(){
        if(!DynamoClient.instance){
            DynamoClient.instance = new DynamoClient();
        }
        return DynamoClient.instance;
    }

    public get clientInstance(): DynamoDBDocumentClient {
        return this.docClient;
    }
}