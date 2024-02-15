import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";

const docClient = getDocClient();

export async function increaseCounterHandler(
  event: APIGatewayProxyWebsocketEventV2
): Promise<any> {
  const { eventType, connectionId } = event.requestContext;

  //increase counter by value
  const { incrementValue, userName } = JSON.parse(event.body) as {
    action: string;
    userName: string;
    incrementValue: number;
  };

  const updateCommand = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      userName,
    },
    UpdateExpression: "SET #coint_counter = #coint_counter + :val",
    ExpressionAttributeValues: {
      ":val": incrementValue,
    },
    ReturnValues: "UPDATED_NEW",
  });

  const response = await docClient.send(updateCommand);

  return generateLambdaProxyResponse(200, JSON.stringify(response.Attributes));
}
