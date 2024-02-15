import { APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { generateLambdaProxyResponse } from "./utils";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function increaseCounterHandler(
  event: APIGatewayEvent
): Promise<any> {
  const { eventType, connectionId } = event.requestContext;

  //increase counter by value
  const { incrementValue } = event.body as any;

  const updateCommand = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: connectionId,
    },
    UpdateExpression: "SET counter = counter + :val",
    ExpressionAttributeValues: {
      ":val": incrementValue,
    },
    ReturnValues: "UPDATED_NEW",
  });

  const response = await docClient.send(updateCommand);

  return generateLambdaProxyResponse(200, JSON.stringify(response.Attributes));
}
