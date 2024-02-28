import { getUserServiceInstance } from "./../services/user.service";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";

export const createUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { userName } = JSON.parse(event.body) as {
    action: string;
    userName: string;
  };

  const { connectionId } = event.requestContext;

  const userServiceInstance = getUserServiceInstance();
  await userServiceInstance.createUser({ userName, connectionId });

  const userQueryItems = await userServiceInstance.queryUsersByConnectionId(connectionId);
  const userId = userQueryItems[0].id.S;

  const user = await userServiceInstance.getUserById(userId);

  const jsonResponse = JSON.stringify({
    action: "createUser",
    user,
  });

  await sendMessageToClient(event, jsonResponse);

  return generateLambdaProxyResponse(200, jsonResponse);
};
