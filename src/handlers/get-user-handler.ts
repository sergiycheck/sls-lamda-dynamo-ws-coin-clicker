import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getUserServiceInstance } from "../services/user.service";

const docClient = getDocClient();

export const getUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { id } = JSON.parse(event.body);

  const response = await getUserServiceInstance().getUserById(id);

  await sendMessageToClient(event, JSON.stringify(response.Item));

  return generateLambdaProxyResponse(200, JSON.stringify(response.Item));
};
