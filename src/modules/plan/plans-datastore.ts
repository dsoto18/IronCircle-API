import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoClient } from "../../services/dynamodb-client";
import { PK, TABLE_NAME } from "../../services/dynamodb-keys";
import { PlanMeta } from "./types/plan-meta";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { PlanWeek } from "./types/plan-week";
import { PlanBlock } from "./types/plan-block";
import { PlanDay } from "./types/plan-day";
import { PlanItem } from "./types/plan-item";

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
        // build the update expression dynamically TODO: Move this logic into its own helper function
        let expressionNames: Record<string, string> = {
            "#updatedAt": "updatedAt"
        };
        let expressionValues: Record<string, string> = {
            ":updatedAt": new Date().toISOString()
        };
        const setExpressions = ["#updatedAt = :updatedAt"];
        if (updates.title !== undefined) { // undefined check allows us to store null ex.- remove field
            expressionNames["#title"] = "title";
            expressionValues[":title"] = updates.title;
            setExpressions.push("#title = :title");
        }

        if (updates.description !== undefined) {
            expressionNames["#description"] = "description";
            expressionValues[":description"] = updates.description;
            setExpressions.push("#description = :description");
        }

        // perform update query
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: PK.plan(updates.planId),
                SK: "META"
            },
            UpdateExpression: `SET ${setExpressions.join(", ")}`,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
            ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
            ReturnValues: "ALL_NEW" // returns the updated item after the update is applied
        });

        try {
            const result = await this.dbClient?.send(updateCommand);
            return result;
        } catch (error) {
            throw new ResourceError("Update Plan Meta Operation Failed.", ResourceErrorReason.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------- Node Specific Functions - TODO: Move to own file? -----------------
    public async addWeekNodeToPlan(weekNodeBody: PlanWeek){
        const entry = {
            TableName: TABLE_NAME,
            Item: weekNodeBody,
            ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
        };
        const result = await this.dbClient?.send(new PutCommand(entry));
        return result;
    }

    public async addDayNodeToWeek(dayNodeBody: PlanDay){
        const entry = {
            TableName: TABLE_NAME,
            Item: dayNodeBody,
            ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
        };
        const result = await this.dbClient?.send(new PutCommand(entry));
        return result;
    }

    public async addBlockNodeToDay(blockNodeBody: PlanBlock){
        const entry = {
            TableName: TABLE_NAME,
            Item: blockNodeBody,
            ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
        };
        const result = await this.dbClient?.send(new PutCommand(entry));
        return result;
    }

    public async addItemNodeToBlock(itemNodeBody: PlanItem){
        const entry = {
            TableName: TABLE_NAME,
            Item: itemNodeBody,
            ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
        };
        const result = await this.dbClient?.send(new PutCommand(entry));
        return result;
    }
}