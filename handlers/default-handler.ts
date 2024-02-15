"use strict";

import { generateLambdaProxyResponse } from "./utils";

export const defaultHandler = async (
  event: any = {},
  context,
  callback
): Promise<any> => {
  const timestamp = new Date().getTime();

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;

  return generateLambdaProxyResponse(200, JSON.stringify(event));
};
