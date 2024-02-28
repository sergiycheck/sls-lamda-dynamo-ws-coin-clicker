import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import * as uuid from "uuid";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

class UserService {
  docClient: DynamoDBDocumentClient;

  constructor(docClient: DynamoDBDocumentClient) {
    this.docClient = docClient;
  }

  public async createUser({ name, connectionId }: { name: string; connectionId: string }) {
    const command = new PutCommand({
      TableName: process.env.USERS_TABLE!,
      Item: {
        id: uuid.v4(),
        name,
        connectionId,
        coinCounter: 1000_000_000,
      },
    });

    return this.docClient.send(command);
  }

  public async getUserById(id: string) {
    const command = new GetCommand({
      TableName: process.env.USERS_TABLE!,
      Key: {
        id,
      },
      ConsistentRead: true,
    });

    return this.docClient.send(command);
  }

  public async updateUserCoinCounter({ id, incrementValue }: { id: string; incrementValue: number }) {
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

    return this.docClient.send(updateCommand);
  }

  public async queryUsersByConnectionId(connectionId: string) {
    type UserQueryReturned = {
      id: { S: string };
      connectionId: { S: string };
    };

    const queryUserByConnectionId = await this.docClient.send(
      new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "ConnectionIdIdIndex",
        ExpressionAttributeValues: {
          ":connId": { S: connectionId },
        },
        KeyConditionExpression: "connectionId = :connId",
        ProjectionExpression: "connectionId, id",
        ScanIndexForward: false,
      })
    );

    return queryUserByConnectionId.Items as UserQueryReturned[];
  }

  public async setConnectionIdToNull(id: string) {
    return this.docClient.send(
      new UpdateCommand({
        TableName: process.env.USERS_TABLE!,
        Key: {
          id,
        },
        UpdateExpression: "SET connectionId = :empty_val",
        ExpressionAttributeValues: {
          ":empty_val": "null",
        },
      })
    );
  }
}

let userServiceInstance: UserService;
export function getUserServiceInstance() {
  if (!userServiceInstance) {
    userServiceInstance = new UserService(getDocClient());
  }

  return userServiceInstance;
}
