import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";

const docClient = getDocClient();

export const getUser = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { userName } = JSON.parse(event.body);

  const command = new GetCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      userName,
    },
    ConsistentRead: true,
  });

  const response = await docClient.send(command);

  return response;
};
