# Authentication API Documentation

This document describes the secure authentication and authorization API endpoints for the NestJS backend application.

## Overview

The authentication system provides:
- JWT-based authentication
- Secure password storage with bcrypt hashing (12 salt rounds)
- User registration and login functionality
- Password change capability
- Rate limiting for sensitive endpoints
- Input validation with custom error messages

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Creates a new user account with secure password hashing.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, max 255 characters
- `password`: 8-100 characters, must contain lowercase, uppercase, number, and special character (@$!%*?&)
- `firstName`: 1-50 characters, letters, spaces, hyphens, apostrophes only
- `lastName`: 1-50 characters, letters, spaces, hyphens, apostrophes only

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2025-05-27T10:00:00.000Z",
    "updatedAt": "2025-05-27T10:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `409 Conflict`: Email address already in use
- `400 Bad Request`: Validation errors

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user and returns JWT token.

**Rate Limiting:** 5 attempts per 15 minutes per IP address

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2025-05-27T10:00:00.000Z",
    "updatedAt": "2025-05-27T10:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
- `401 Unauthorized`: Account is deactivated
- `429 Too Many Requests`: Rate limit exceeded

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Returns current authenticated user information.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2025-05-27T10:00:00.000Z",
  "updatedAt": "2025-05-27T10:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `401 Unauthorized`: User not found

### 4. Change Password

**Endpoint:** `PATCH /auth/change-password`

**Description:** Changes the current user's password.

**Authentication:** Required (Bearer token)

**Rate Limiting:** 3 attempts per 10 minutes per IP address

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewStrongPassword123!"
}
```

**Validation Rules:**
- `currentPassword`: Required, must match user's current password
- `newPassword`: Same rules as registration password

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `401 Unauthorized`: Current password is incorrect
- `401 Unauthorized`: Account is deactivated
- `400 Bad Request`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded

## Authentication Flow

### 1. Registration Flow
1. User submits registration form
2. System validates input data
3. System checks if email already exists
4. Password is hashed using bcrypt with 12 salt rounds
5. User is created in database
6. JWT token is generated and returned

### 2. Login Flow
1. User submits login credentials
2. Rate limiting check (5 attempts per 15 minutes)
3. System validates credentials
4. System checks if user is active
5. Password is verified using bcrypt
6. JWT token is generated and returned

### 3. Password Change Flow
1. User submits current and new password
2. Rate limiting check (3 attempts per 10 minutes)
3. JWT token is validated
4. Current password is verified
5. New password is validated and hashed
6. Password is updated in database

## Security Features

### Password Security
- **Hashing:** bcrypt with 12 salt rounds
- **Validation:** Minimum 8 characters, maximum 100 characters
- **Complexity:** Must contain lowercase, uppercase, number, and special character
- **Pattern Detection:** Rejects common patterns and repeated characters

### Rate Limiting
- **Login:** 5 attempts per 15 minutes per IP
- **Password Change:** 3 attempts per 10 minutes per IP
- **Automatic Reset:** Counters reset after time window expires

### JWT Token Security
- **Payload:** Contains user ID and email only
- **Expiration:** Configurable (default settings apply)
- **Secret:** Environment variable (change in production)

### Input Validation
- **Class Validators:** Comprehensive validation with custom error messages
- **SQL Injection Protection:** TypeORM parameterized queries
- **XSS Protection:** Input sanitization and validation

## Headers

### Authentication Header
All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Content Type
All POST/PATCH requests should include:

```
Content-Type: application/json
```

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

### Validation Errors (400)
```json
{
  "message": [
    "New password must be at least 8 characters long",
    "New password must contain at least one uppercase letter"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Unauthorized Errors (401)
```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Rate Limit Errors (429)
```json
{
  "message": "Too many attempts. Try again in 300 seconds.",
  "error": "Too Many Requests",
  "statusCode": 429
}
```

## Testing Examples

### Using cURL

#### Register a new user
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPassword123!"
  }'
```

#### Get current user (replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer TOKEN"
```

#### Change password (replace TOKEN with actual JWT)
```bash
curl -X PATCH http://localhost:3001/auth/change-password \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "StrongPassword123!",
    "newPassword": "NewStrongPassword123!"
  }'
```

## Environment Variables

Ensure these environment variables are set:

```env
JWT_SECRET=your-secure-secret-key-change-in-production
DATABASE_PATH=./database.sqlite
```

## Database Schema

The User entity includes:
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `firstName`: User's first name
- `lastName`: User's last name
- `isActive`: Account status flag
- `createdAt`: Account creation timestamp
- `updatedAt`: Last modification timestamp
