import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";

const docClient = getDocClient();

export async function disconnectionHandler(event: APIGatewayEvent) {
  const { connectionId } = event.requestContext;

  await docClient.send(
    new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        connectionId,
      },
    })
  );

  return generateLambdaProxyResponse(200, "Disconnected");
}
