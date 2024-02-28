# !/bin/sh

# connect handler
# serverless invoke local --function connectionHandler --data '{"requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'

# disconnect handler
#  serverless invoke local \
#   --function disconnectionHandler \
#   --data '{"requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'

# get user handler
# serverless invoke local \
#   --function getUserHandler \
#   --data '{ "data": "{ \"userName\": \"userName1\" }", "requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'

# create user handler
serverless invoke local \
  --function createUserHandler \
  --data '{ "data": "{ \"userName\": \"userName1\" }", "requestContext": {"connectionId": "T2hrxd6ooAMCFAg="} }'