# YuriAPI

## Sign Up

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@yurisen.se",
    "password": "test",
    "firstName": "Yuri",
    "lastName": "Meier",
    "phone": "1234567"
  }' \
  http://127.0.0.1:3000/api/user/signup
  ```

### Sign In

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@yurisen.se",
    "password": "test"
  }' \
  http://127.0.0.1:3000/api/user/signin
```

### Sign Out

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'yuri-auth-token: YOUR_AUTH_TOKEN_HERE' \
  http://127.0.0.1:3000/api/user/signout
```
