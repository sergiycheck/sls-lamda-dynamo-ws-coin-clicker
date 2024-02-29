### Actions

Get non existing user

```json
{ "action": "getUserHandler", "userName": "userName2" }
```

Get user handler

```json
{ "action": "getUserHandler", "userName": "userName1" }
```

Create user handler

```json
{ "action": "createUserHandler", "userName": "userName2" }
```

Increment user handler

```json
{ "action": "increaseCounterHandler", "id": "e7cec2cd-e555-4d2f-8368-e9ea6cabe667", "incrementValue": 20 }
```

Connect with wscat

```bash
wscat -c wss://6ri9wdx49c.execute-api.us-east-1.amazonaws.com/dev
```
