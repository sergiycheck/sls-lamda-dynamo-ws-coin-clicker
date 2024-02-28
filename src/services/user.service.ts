import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../utils/get-doc-client";
import * as uuid from "uuid";
import { QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

type UserQueryReturned = {
  id: { S: string };
  connectionId: { S: string };
};

type ScanUsersByUserNameReturned = UserQueryReturned & {
  userName: { S: string };
  coinCounter: { N: string };
};

type User = {
  id: string;
  userName: string;
  connectionId: string; // ipv4Address | null
  coinCounter: number;
};

class UserService {
  docClient: DynamoDBDocumentClient;

  constructor(docClient: DynamoDBDocumentClient) {
    this.docClient = docClient;
  }

  public async createUser({ userName, connectionId }: { userName: string; connectionId: string }) {
    const command = new PutCommand({
      TableName: process.env.USERS_TABLE!,
      Item: {
        id: uuid.v4(),
        userName,
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

    const response = await this.docClient.send(command);
    return response.Item as User;
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

  public async scanUsersByUserName(userName: string) {
    const queryUserByUserName = await this.docClient.send(
      new ScanCommand({
        TableName: process.env.USERS_TABLE!,
        ExpressionAttributeValues: {
          ":userName": { S: userName },
        },
        FilterExpression: "userName = :userName",
        ProjectionExpression: "connectionId, id, userName, coinCounter",
      })
    );

    return queryUserByUserName.Items as ScanUsersByUserNameReturned[];
  }

  public async setConnectionId(id: string, connectionId: string) {
    return this.docClient.send(
      new UpdateCommand({
        TableName: process.env.USERS_TABLE!,
        Key: {
          id,
        },
        UpdateExpression: "SET connectionId = :empty_val",
        ExpressionAttributeValues: {
          ":empty_val": connectionId,
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
