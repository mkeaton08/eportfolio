# API Testing Guide

## Prerequisites

1. Server is running: `npm start`
2. Admin user created: `npm run create-admin`
3. MongoDB is running

## Test Scenarios

### 1. Create Admin User

```bash
npm run create-admin
```

Expected output:
```
Admin user created successfully
Email: admin@travlr.com
Password: admin123
```

---

### 2. Register a Regular User

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Login as Admin

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travlr.com",
    "password": "admin123"
  }'
```

Expected response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save this token as ADMIN_TOKEN for next tests!**

---

### 4. Login as Regular User

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save this token as USER_TOKEN for next tests!**

---

### 5. Get All Trips (Public - No Auth)

```bash
curl http://localhost:3000/api/trips
```

Expected response (200):
```json
[
  {
    "_id": "...",
    "code": "TRIP001",
    "name": "Beach Paradise",
    ...
  }
]
```

---

### 6. Get Single Trip (Public - No Auth)

```bash
curl http://localhost:3000/api/trips/TRIP001
```

Expected response (200):
```json
{
  "_id": "...",
  "code": "TRIP001",
  "name": "Beach Paradise",
  ...
}
```

---

### 7. Create Trip as Admin (Should Succeed)

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "code": "BEACH01",
    "name": "Beach Paradise",
    "length": "7 days",
    "start": "2024-06-01",
    "resort": "Paradise Resort",
    "perPerson": "$1500",
    "image": "beach.jpg",
    "description": "Relaxing beach vacation"
  }'
```

Expected response (201):
```json
{
  "_id": "...",
  "code": "BEACH01",
  "name": "Beach Paradise",
  ...
}
```

---

### 8. Create Trip as Regular User (Should Fail)

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "code": "BEACH02",
    "name": "Another Beach",
    "length": "5 days",
    "start": "2024-07-01",
    "resort": "Beach Resort",
    "perPerson": "$1200",
    "image": "beach2.jpg",
    "description": "Another beach vacation"
  }'
```

Expected response (403):
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

---

### 9. Create Trip Without Token (Should Fail)

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BEACH03",
    "name": "Beach Trip",
    "length": "5 days",
    "start": "2024-08-01",
    "resort": "Resort",
    "perPerson": "$1000",
    "image": "beach3.jpg",
    "description": "Beach vacation"
  }'
```

Expected response (401):
```json
{
  "message": "Invalid or missing token"
}
```

---

### 10. Create Trip with Invalid Data (Should Fail)

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "code": "",
    "name": "Beach Trip"
  }'
```

Expected response (400):
```json
{
  "message": "Validation error",
  "errors": [
    "code is required and must be a non-empty string",
    "length is required and must be a string",
    "start date is required",
    "resort is required and must be a non-empty string",
    "perPerson is required and must be a string",
    "image is required and must be a non-empty string",
    "description is required and must be a non-empty string"
  ]
}
```

---

### 11. Update Trip as Admin (Should Succeed)

```bash
curl -X PUT http://localhost:3000/api/trips/BEACH01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "code": "BEACH01",
    "name": "Beach Paradise Updated",
    "length": "10 days",
    "start": "2024-06-01",
    "resort": "Paradise Resort",
    "perPerson": "$2000",
    "image": "beach.jpg",
    "description": "Updated beach vacation"
  }'
```

Expected response (200):
```json
{
  "_id": "...",
  "code": "BEACH01",
  "name": "Beach Paradise Updated",
  "perPerson": "$2000",
  ...
}
```

---

### 12. Update Trip as Regular User (Should Fail)

```bash
curl -X PUT http://localhost:3000/api/trips/BEACH01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "code": "BEACH01",
    "name": "Hacked Name",
    "length": "10 days",
    "start": "2024-06-01",
    "resort": "Paradise Resort",
    "perPerson": "$2000",
    "image": "beach.jpg",
    "description": "Hacked description"
  }'
```

Expected response (403):
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

---

### 13. Delete Trip as Admin (Should Succeed)

```bash
curl -X DELETE http://localhost:3000/api/trips/BEACH01 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Expected response (200):
```json
{
  "message": "Trip deleted successfully"
}
```

---

### 14. Delete Trip as Regular User (Should Fail)

```bash
curl -X DELETE http://localhost:3000/api/trips/TRIP001 \
  -H "Authorization: Bearer USER_TOKEN"
```

Expected response (403):
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

---

### 15. Register with Invalid Email (Should Fail)

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "invalid-email",
    "password": "password123"
  }'
```

Expected response (400):
```json
{
  "message": "Validation error",
  "errors": [
    "email must be a valid email address"
  ]
}
```

---

### 16. Login with Wrong Password (Should Fail)

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travlr.com",
    "password": "wrongpassword"
  }'
```

Expected response (401):
```json
{
  "message": "Incorrect email or password"
}
```

---

### 17. Access Non-Existent Trip (Should Fail)

```bash
curl http://localhost:3000/api/trips/NONEXISTENT
```

Expected response (404):
```json
{
  "message": "Trip not found"
}
```

---

## PowerShell Testing (Windows)

If using PowerShell, use `Invoke-RestMethod`:

### Login Example
```powershell
$body = @{
    email = "admin@travlr.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.token
Write-Host "Token: $token"
```

### Create Trip Example
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

$body = @{
    code = "BEACH01"
    name = "Beach Paradise"
    length = "7 days"
    start = "2024-06-01"
    resort = "Paradise Resort"
    perPerson = "$1500"
    image = "beach.jpg"
    description = "Relaxing beach vacation"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/trips" `
    -Method Post `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $body
```

---

## Checklist

- [ ] Admin user created successfully
- [ ] Regular user can register
- [ ] Admin can login and get token
- [ ] Regular user can login and get token
- [ ] Anyone can view trips (no auth)
- [ ] Admin can create trips
- [ ] Regular user CANNOT create trips (403)
- [ ] Admin can update trips
- [ ] Regular user CANNOT update trips (403)
- [ ] Admin can delete trips
- [ ] Regular user CANNOT delete trips (403)
- [ ] Invalid data is rejected with clear errors
- [ ] Missing token returns 401
- [ ] Invalid token returns 401
- [ ] All requests are logged in console

---

## Troubleshooting

### "Cannot connect to server"
- Ensure server is running: `npm start`
- Check port 3000 is not in use

### "Invalid or missing token"
- Token may have expired (1 hour lifetime)
- Login again to get a new token
- Ensure Authorization header format: `Bearer TOKEN`

### "Forbidden - Insufficient permissions"
- You're using a regular user token for admin routes
- Login with admin credentials

### "Validation error"
- Check all required fields are present
- Verify data types match requirements
- Ensure email format is valid
- Ensure dates are valid

### "Trip not found"
- Trip code doesn't exist in database
- Check spelling of trip code
