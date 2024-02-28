import { getUserServiceInstance } from "./../services/user.service";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";

export const createUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { name } = JSON.parse(event.body);
  const { connectionId } = event.requestContext;

  const userServiceInstance = getUserServiceInstance();
  await userServiceInstance.createUser({ name, connectionId });

  const userQueryItems = await userServiceInstance.queryUsersByConnectionId(connectionId);
  const userId = userQueryItems[0].id.S;

  const user = await userServiceInstance.getUserById(userId);

  await sendMessageToClient(event, JSON.stringify(user.Item));

  return generateLambdaProxyResponse(200, JSON.stringify(user.Item));
};
