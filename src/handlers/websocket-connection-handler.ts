import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";
import * as uuid from "uuid";

const docClient = getDocClient();

export async function connectionHandler(
  event: APIGatewayProxyWebsocketEventV2
): Promise<any> {
  const { connectionId } = event.requestContext;

  const oneHourFromNow = Math.round(Date.now() / 1000 + 3600);

  await docClient.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE!,
      Item: {
        id: connectionId,
        v4Id: uuid.v4(),
        ttl: oneHourFromNow,
        coinCounter: 100_000,
      },
    })
  );

  return generateLambdaProxyResponse(200, "Connected");
}
