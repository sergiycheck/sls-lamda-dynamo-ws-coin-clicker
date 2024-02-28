import { defaultHandler as defaultHandlerImplementation } from "./src/handlers/default-handler";
import { connectionHandler as connectionHandlerImplementation } from "./src/handlers/websocket-connection-handler";
import { increaseCounterHandler as increaseCounterHandlerImplementation } from "./src/handlers/increase-counter-handler";
import { eventLoggerWrapper } from "./src/utils/event-logger-wrapper";
import { disconnectionHandler as disconnectionHandlerImplementation } from "./src/handlers/websocket-disconnection-handler";
import { getUserByUserName as getUserImplementation } from "./src/handlers/get-user-handler";
import { createUser as createUserImplementation } from "./src/handlers/create-user-handler";

export const defaultHandler = eventLoggerWrapper(defaultHandlerImplementation);

export const connectionHandler = eventLoggerWrapper(connectionHandlerImplementation);

export const disconnectionHandler = eventLoggerWrapper(disconnectionHandlerImplementation);

export const createUserHandler = eventLoggerWrapper(createUserImplementation);

export const getUserHandler = eventLoggerWrapper(getUserImplementation);

export const increaseCounterHandler = eventLoggerWrapper(increaseCounterHandlerImplementation);
