export const config = {
  region: process.env.AWS_REGION ?? "us-east-1",
  dynamoEndpoint: process.env.DYNAMODB_ENDPOINT,
  tableName: process.env.TABLE_NAME ?? "dev-bluepnt-app-table"
};