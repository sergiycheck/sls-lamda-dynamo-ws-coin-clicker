import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getUserServiceInstance } from "../services/user.service";

export const getUserByUserName = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;
  const { userName } = JSON.parse(event.body);

  const userServiceInstance = getUserServiceInstance();
  const userQueryItems = await userServiceInstance.queryUsersByUserName(userName);
  const userId = userQueryItems[0].id.S;

  await userServiceInstance.setConnectionId(userId, connectionId);

  const response = await userServiceInstance.getUserById(userId);

  await sendMessageToClient(event, JSON.stringify(response.Item));

  return generateLambdaProxyResponse(200, JSON.stringify(response.Item));
};
