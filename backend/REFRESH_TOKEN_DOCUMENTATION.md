# Refresh Token Implementation

## Overview
The application now supports refresh tokens to allow users to obtain new access tokens without having to log in again. This improves user experience by maintaining authentication sessions securely.

## Implementation Details

### Database Changes
- Added `refreshToken` field to the User entity (nullable, not selected by default)
- Refresh tokens are hashed before storing in the database

### API Endpoints

#### 1. Registration (`POST /auth/register`)
**Request:**
```json
{
  "login": "johndoe",
  "email": "john@example.com", 
  "password": "StrongPassword123!",
  "firstName": "John",  // Optional
  "lastName": "Doe"     // Optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "login": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}
```

#### 2. Login (`POST /auth/login`)
**Request:**
```json
{
  "identifier": "johndoe", // Can be either username or email
  "password": "StrongPassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "login": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}
```

#### 3. Refresh Token (`POST /auth/refresh`)
**Request:**
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "access_token": "new_jwt_access_token",
  "refresh_token": "new_jwt_refresh_token"
}
```

#### 4. Logout (`POST /auth/logout`)
**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Security Features

### Token Expiration
- **Access Token**: Default JWT expiration (typically 15 minutes - 1 hour)
- **Refresh Token**: 7 days

### Security Measures
1. **Hashed Storage**: Refresh tokens are hashed with bcrypt before storing in database
2. **Token Rotation**: Each refresh generates a new access token and refresh token pair
3. **Single Use**: Old refresh tokens are invalidated when new ones are issued
4. **User Validation**: Refresh tokens are validated against user's active status
5. **Secure Logout**: Refresh tokens are cleared from database on logout

### Error Handling
- Invalid refresh tokens return 401 Unauthorized
- Inactive users cannot refresh tokens
- Malformed tokens are rejected

## Usage Example

```typescript
// 1. Login and get tokens
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'johndoe',
    password: 'StrongPassword123!'
  })
});

const { access_token, refresh_token } = await loginResponse.json();

// 2. Use access token for API calls
const apiResponse = await fetch('/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// 3. When access token expires, refresh it
const refreshResponse = await fetch('/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});

const { access_token: newAccessToken, refresh_token: newRefreshToken } = 
  await refreshResponse.json();

// 4. Logout (optional)
await fetch('/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${newAccessToken}` }
});
```

## Database Migration Notes
- The `refreshToken` field was added as nullable to support existing users
- No data migration is required as existing users will get refresh tokens on their next login
