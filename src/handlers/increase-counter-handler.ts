import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { generateLambdaProxyResponse } from "../utils/utils";
import { getDocClient } from "../utils/get-doc-client";
import { sendMessageToClient } from "../utils/send-message-to-client";

const docClient = getDocClient();

export async function increaseCounterHandler(event: APIGatewayProxyWebsocketEventV2): Promise<any> {
  //increase counter by value
  const { incrementValue, id } = JSON.parse(event.body) as {
    action: string;
    id: string;
    incrementValue: number;
  };

  const updateCommand = new UpdateCommand({
    TableName: process.env.USERS_TABLE!,
    Key: {
      id,
    },
    UpdateExpression: "SET coinCounter = coinCounter + :val",
    ExpressionAttributeValues: {
      ":val": incrementValue,
    },
    ReturnValues: "UPDATED_NEW",
  });

  const response = await docClient.send(updateCommand);

  await sendMessageToClient(event, JSON.stringify(response.Attributes));

  return generateLambdaProxyResponse(200, JSON.stringify(response.Attributes));
}
