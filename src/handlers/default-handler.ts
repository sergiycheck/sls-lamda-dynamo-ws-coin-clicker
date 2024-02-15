"use strict";

import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { generateLambdaProxyResponse } from "../utils/utils";

export const defaultHandler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<any> => {
  return generateLambdaProxyResponse(200, JSON.stringify(event));
};
