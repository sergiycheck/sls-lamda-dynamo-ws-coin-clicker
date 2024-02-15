import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";

export const sendMessageToClient = (
  event: APIGatewayProxyWebsocketEventV2,
  payload: string
) =>
  new Promise((resolve, reject) => {
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    const callbackUrlForAWS = `https://${domain}/${stage}`;

    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: callbackUrlForAWS,
    });

    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId,
        Data: payload,
      },
      (err, data) => {
        if (err) {
          console.log("err is", err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
