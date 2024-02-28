import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

const docClient = getDocClient();

export async function disconnectionHandler(event: APIGatewayEvent) {
  const { connectionId } = event.requestContext;

  await docClient.send(
    new DeleteCommand({
      TableName: process.env.USERS_CONNECTIONS_TABLE!,
      Key: {
        id: connectionId,
      },
    })
  );

  const queryUserByConnectionId = await docClient.send(
    new QueryCommand({
      TableName: process.env.USERS_TABLE!,
      ExpressionAttributeValues: {
        ":connId": { S: connectionId },
      },
      KeyConditionExpression: "connectionId = :connId",
      ConsistentRead: true,
    })
  );

  const user = queryUserByConnectionId.Items?.[0];
  const { id } = user;

  await docClient.send(
    new UpdateCommand({
      TableName: process.env.USERS_TABLE!,
      Key: {
        id,
      },
      UpdateExpression: "SET connectionId = :null_val",
      ExpressionAttributeValues: {
        ":null_val": { NULL: true },
      },
    })
  );

  return generateLambdaProxyResponse(200, "Disconnected");
}
