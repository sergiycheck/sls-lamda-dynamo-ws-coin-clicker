export const eventLoggerWrapper = (handler: Function) => {
  return (event, context, callback) => {
    console.log("Received event:", event);
    return handler(event, context, callback);
  };
};
