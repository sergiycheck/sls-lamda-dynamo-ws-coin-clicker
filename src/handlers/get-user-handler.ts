import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getUserServiceInstance } from "../services/user.service";

export const getUserByUserName = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;

  const { userName } = JSON.parse(event.body) as {
    action: string;
    userName: string;
  };

  const userServiceInstance = getUserServiceInstance();
  const userQueryItems = await userServiceInstance.scanUsersByUserName(userName);
  if (!userQueryItems.length) {
    return generateLambdaProxyResponse(404, "User not found");
  }

  const userId = userQueryItems[0].id.S;

  const user = await userServiceInstance.getUserById(userId);

  if (user.connectionId === "null") {
    await userServiceInstance.setConnectionId(userId, connectionId);
  }

  await sendMessageToClient(event, JSON.stringify(user));

  return generateLambdaProxyResponse(200, JSON.stringify(user));
};
