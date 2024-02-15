import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export function getDocClient() {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  return docClient;
}
