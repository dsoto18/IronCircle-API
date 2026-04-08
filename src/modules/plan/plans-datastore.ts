import { DynamoDBDocumentClient, GetCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { PK, TABLE_NAME } from "../../services/dynamodb-keys";
import { PlanMeta } from "./types/plan-meta";
import { ResourceError, ResourceErrorReason } from "../../shared/error";

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

    public async createPlanShellAndRef(planBody: PlanMeta, userReference: any){
        const transactItems = [
            {
                Put: {
                    TableName: TABLE_NAME,
                    Item: planBody,
                    ConditionExpression: "attribute_not_exists(PK)"
                }
            },
            {
                Put: {
                    TableName: TABLE_NAME,
                    Item: userReference,
                    ConditionExpression: "attribute_not_exists(PK)"
                }
            }
        ];

        try {
            const result = await this.dbClient?.send(new TransactWriteCommand({
                TransactItems: transactItems
            }));
            return result;
        } catch (error) {
            console.error("Error creating plan shell and user reference: ", error);
            throw error;
        }

    }

    public async getUsersPlans(userId: string){
        const plans = await this.dbClient?.send(new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk and begins_with(SK, :skPrefix)",
            ExpressionAttributeValues: {
                ":pk": PK.user(userId),
                ":skPrefix": `PLAN#`
            }
        }));
        return plans;
    }

    public async getPlanMeta(planId: string){
        const result = await this.dbClient?.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.plan(planId),
                SK: "META"
            }
        }));
        return result;
    }

    // TEST THIS FUNCTION - NOT FINAL IMPLEMENTATION - JUST TO TEST UPDATE COMMAND
    public async updatePlanMeta(updates: any) {
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.plan(updates.planId),
                SK: "META"
            },
            UpdateExpression: "SET title = :title, description = :description, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":title": "Updated Plan Title",
                ":description": "Updated Plan Description",
                ":updatedAt": new Date().toISOString()
            },
            ExpressionAttributeNames: {
                "#title": "title",
                "#description": "description"
            },
            ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
            ReturnValues: "ALL_NEW"
        });

        try {
            const result = await this.dbClient?.send(updateCommand);
            return result;
        } catch (error) {
            throw new ResourceError("Update Plan Meta Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }
}