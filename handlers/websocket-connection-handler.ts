import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { APIGatewayEvent } from "aws-lambda";

import { generateLambdaProxyResponse } from "./utils";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function connectionHandler(event: APIGatewayEvent): Promise<any> {
  const { eventType, connectionId } = event.requestContext;

  if (eventType === "CONNECT") {
    const oneHourFromNow = Math.round(Date.now() / 1000 + 3600);
    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE!,
        Item: {
          id: connectionId,
          chatId: "DEFAULT",
          ttl: oneHourFromNow,
        },
      })
    );
    return generateLambdaProxyResponse(200, "Connected");
  }

  if (eventType === "DISCONNECT") {
    await docClient.send(
      new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE!,
        Key: {
          id: connectionId,
          chatId: "DEFAULT",
        },
      })
    );

    return generateLambdaProxyResponse(200, "Disconnected");
  }

  return generateLambdaProxyResponse(200, "Ok");
}
