import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";
import { sendMessageToClient } from "../utils/send-message-to-client";
import { getUserServiceInstance } from "../services/user.service";

export async function increaseCounterHandler(event: APIGatewayProxyWebsocketEventV2): Promise<any> {
  //increase counter by value
  const { incrementValue, id } = JSON.parse(event.body) as {
    action: string;
    id: string;
    incrementValue: number;
  };

  const response = await getUserServiceInstance().updateUserCoinCounter({ id, incrementValue });

  await sendMessageToClient(event, JSON.stringify(response.Attributes));

  return generateLambdaProxyResponse(200, JSON.stringify(response.Attributes));
}
