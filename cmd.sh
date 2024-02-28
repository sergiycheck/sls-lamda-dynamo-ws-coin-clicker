# !/bin/sh

# connect handler
# serverless invoke local --function connectionHandler --data '{"a":"bar"}'

# disconnect handler
#  serverless invoke local \
#   --function disconnectionHandler \
#   --data '{"a":"bar", "requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'

# get user handler
serverless invoke local \
  --function getUserHandler \
  --data '{ "body": "{ \"userName\": \"userName1\" }", "requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'

# create user handler
# serverless invoke local \
#   --function createUserHandler \
#   --data '{ "body": "{ \"userName\": \"userName1\" }", "requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'