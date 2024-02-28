import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { getUserServiceInstance } from "../services/user.service";

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

  const userServiceInstance = getUserServiceInstance();
  const queryUserByConnectionIdItems = await userServiceInstance.queryUsersByConnectionId(connectionId);

  if (queryUserByConnectionIdItems.length) {
    const user = queryUserByConnectionIdItems[0];
    const id = user.id.S;

    await userServiceInstance.setConnectionIdToNull(id);
  }

  return generateLambdaProxyResponse(200, "Disconnected");
}
