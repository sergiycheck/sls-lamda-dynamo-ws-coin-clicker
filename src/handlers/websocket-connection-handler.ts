import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";
import * as uuid from "uuid";

const docClient = getDocClient();

export async function connectionHandler(event: APIGatewayProxyWebsocketEventV2): Promise<any> {
  const { connectionId } = event.requestContext;

  const oneHourFromNow = Math.round(Date.now() / 1000 + 3600);

  await docClient.send(
    new PutCommand({
      TableName: process.env.USERS_CONNECTIONS_TABLE!,
      Item: {
        id: connectionId,
        ttl: oneHourFromNow,
      },
    })
  );

  return generateLambdaProxyResponse(200, "Connected");
}
