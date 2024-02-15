export const generateLambdaProxyResponse = (
  httpCode: number,
  jsonBody: string
) => {
  return {
    statusCode: httpCode,
    body: jsonBody,
  };
};
