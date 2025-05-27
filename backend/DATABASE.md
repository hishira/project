# Database Setup Documentation

## Overview

This backend uses SQLite database with TypeORM for data persistence. The database file is stored as `database.sqlite` in the backend root directory.

## Database Configuration

- **Database**: SQLite (file-based)
- **ORM**: TypeORM
- **Location**: `backend/database.sqlite`
- **Configuration**: `src/database/database.config.ts`

## Entities

### User Entity
Located in `src/entities/user.entity.ts`

**Fields:**
- `id` (Primary Key, Auto-increment)
- `email` (Unique, Required)
- `firstName` (Required)
- `lastName` (Required)
- `isActive` (Boolean, Default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## API Endpoints

### Users API (`/users`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get user by ID | - |
| POST | `/users` | Create new user | `CreateUserDto` |
| PUT | `/users/:id` | Update user | `UpdateUserDto` |
| DELETE | `/users/:id` | Delete user | - |

### DTOs

**CreateUserDto:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**UpdateUserDto:**
```json
{
  "email": "newemail@example.com",
  "firstName": "Jane"
}
```

## Development Commands

```bash
# Start development server
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Database Management

### Viewing the Database
You can use any SQLite browser to view the database:
```bash
sqlite3 database.sqlite
.tables
.schema user
SELECT * FROM user;
```

### Reset Database
To reset the database, simply delete the file:
```bash
rm database.sqlite
```
The database will be recreated on next application start.

## Production Considerations

- Set `synchronize: false` in production
- Use migrations for schema changes
- Consider using PostgreSQL for production
- Implement proper backup strategies

## Migration to Other Databases

To switch to PostgreSQL or MySQL:
1. Install the appropriate driver (`pg` for PostgreSQL, `mysql2` for MySQL)
2. Update `database.config.ts` with new connection settings
3. The code will work without changes due to TypeORM abstraction
