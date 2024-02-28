import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";

const docClient = getDocClient();

export const getUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { id } = JSON.parse(event.body);

  const command = new GetCommand({
    TableName: process.env.USERS_TABLE!,
    Key: {
      id,
    },
    ConsistentRead: true,
  });

  const response = await docClient.send(command);

  await sendMessageToClient(event, JSON.stringify(response.Item));

  return generateLambdaProxyResponse(200, JSON.stringify(response.Item));
};
