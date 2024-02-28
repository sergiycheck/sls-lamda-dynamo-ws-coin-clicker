import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { generateLambdaProxyResponse } from "../utils/utils";
import * as uuid from "uuid";

const docClient = getDocClient();

export const createUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { name } = JSON.parse(event.body);
  const { connectionId } = event.requestContext;

  const command = new PutCommand({
    TableName: process.env.USERS_TABLE!,
    Item: {
      id: uuid.v4(),
      name,
      connectionId,
      coinCounter: 1000_000_000,
    },
  });

  const response = await docClient.send(command);

  await sendMessageToClient(event, JSON.stringify(response));

  return generateLambdaProxyResponse(200, JSON.stringify(response));
};
