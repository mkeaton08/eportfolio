# Quick Start Guide

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure `.env` file exists with:
```
JWT_SECRET=your_secret_key_here
DB_HOST=mongodb://localhost:27017/travlr
```

### 3. Create Admin User
```bash
npm run create-admin
```

This creates an admin user with:
- Email: `admin@travlr.com`
- Password: `admin123`

**⚠️ IMPORTANT**: Change this password after first login in production!

### 4. Start the Server
```bash
npm start
```

Server runs on `http://localhost:3000`

## Testing the API

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@travlr.com","password":"admin123"}'
```

Copy the token from the response.

### 2. Create a Trip (Admin Only)
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "code":"BEACH01",
    "name":"Beach Paradise",
    "length":"7 days",
    "start":"2024-06-01",
    "resort":"Paradise Resort",
    "perPerson":"$1500",
    "image":"beach.jpg",
    "description":"Relaxing beach vacation"
  }'
```

### 3. Get All Trips (Public)
```bash
curl http://localhost:3000/api/trips
```

### 4. Register a Regular User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

Regular users can view trips but cannot create/update/delete them.

## Key Features

✅ **RBAC**: Admin vs User roles
✅ **JWT Authentication**: Secure token-based auth
✅ **Input Validation**: All inputs validated
✅ **Error Handling**: Centralized, consistent errors
✅ **Request Logging**: All requests logged
✅ **Clean Architecture**: Routes → Controllers → Services

## Common Issues

### "Invalid or missing token"
- Ensure you're including the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`
- Token expires after 1 hour

### "Forbidden - Insufficient permissions"
- You're trying to access an admin-only route
- Login with admin credentials to get admin token

### "Validation error"
- Check that all required fields are present
- Ensure field types are correct (strings, dates, etc.)

## Project Structure

```
app_api/
├── config/          # Passport configuration
├── constants/       # App constants (roles, status codes)
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, logging, errors
├── models/          # Mongoose schemas
├── routes/          # Route definitions
├── scripts/         # Utility scripts
└── services/        # Business logic & DB operations
```

## Next Steps

1. Change the default admin password
2. Configure CORS for your Angular app origin
3. Set up proper environment variables for production
4. Review and customize validation rules as needed
5. Add additional admin users if needed
