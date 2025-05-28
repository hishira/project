# Sports Diary API Documentation

## Overview
The Sports Diary API allows users to track their physical activities including running, swimming, cycling, skating, horse riding, and more. Each activity can have specific metadata relevant to the activity type.

## Activity Types
- `running` - Running activities (outdoor, treadmill, track)
- `swimming` - Swimming activities with pool information
- `cycling` - Cycling activities (road, mountain, indoor)
- `skating` - Skating activities (ice, roller, inline)
- `horse_riding` - Horse riding activities
- `walking` - Walking activities
- `hiking` - Hiking activities
- `gym_workout` - Gym workout activities
- `yoga` - Yoga sessions
- `tennis` - Tennis activities
- `football` - Football activities
- `basketball` - Basketball activities
- `other` - Other custom activities

## Difficulty Levels
- `1` - Very Easy
- `2` - Easy
- `3` - Moderate
- `4` - Hard
- `5` - Very Hard

## Endpoints

### Create Activity
`POST /activities`

**Body:**
```json
{
  "type": "running",
  "title": "Morning Run",
  "description": "A nice morning run in the park",
  "duration": 30,
  "difficulty": 3,
  "activityDate": "2024-01-15",
  "metadata": {
    "location": "outdoor",
    "distance": 5,
    "pace": 6,
    "elevation": 100
  },
  "caloriesBurned": 300,
  "notes": "Felt great today!"
}
```

### Get Activities
`GET /activities`

**Query Parameters:**
- `type` - Filter by activity type
- `difficulty` - Filter by difficulty level (1-5)
- `dateFrom` - Filter activities from this date (ISO format)
- `dateTo` - Filter activities to this date (ISO format)
- `limit` - Limit number of results
- `offset` - Offset for pagination

**Example:** `GET /activities?type=running&difficulty=3&limit=10`

### Get Activity Statistics
`GET /activities/statistics`

**Query Parameters:**
- `dateFrom` - Statistics from this date
- `dateTo` - Statistics to this date

**Response:**
```json
{
  "totalActivities": 45,
  "totalDuration": 1350,
  "averageDifficulty": 3.2,
  "activitiesByType": {
    "running": 20,
    "swimming": 15,
    "cycling": 10
  },
  "activitiesByDifficulty": {
    "1": 5,
    "2": 10,
    "3": 15,
    "4": 10,
    "5": 5
  },
  "totalCaloriesBurned": 12500
}
```

### Get Recent Activities
`GET /activities/recent`

**Query Parameters:**
- `limit` - Number of recent activities to return (default: 10)

### Get Single Activity
`GET /activities/:id`

### Update Activity
`PATCH /activities/:id`

**Body:** Same as create activity (all fields optional)

### Delete Activity
`DELETE /activities/:id`

## Activity-Specific Metadata

### Running Metadata
```json
{
  "location": "outdoor|treadmill|track",
  "distance": 5.0,
  "pace": 6.0,
  "elevation": 100
}
```

### Swimming Metadata
```json
{
  "poolSize": 25,
  "laps": 40,
  "strokeType": "freestyle"
}
```

### Cycling Metadata
```json
{
  "distance": 25.0,
  "location": "road|mountain|indoor|outdoor",
  "avgSpeed": 20.0,
  "elevation": 500
}
```

### Skating Metadata
```json
{
  "type": "ice|roller|inline",
  "distance": 10.0,
  "location": "indoor|outdoor"
}
```

### Horse Riding Metadata
```json
{
  "discipline": "dressage|jumping|trail|racing|western|other",
  "location": "indoor|outdoor",
  "horseName": "Thunder"
}
```

### Gym Workout Metadata
```json
{
  "workoutType": "strength|cardio|mixed",
  "exercises": ["bench press", "squats", "deadlifts"],
  "equipment": ["barbell", "dumbbells", "treadmill"]
}
```

## Example Usage

### 1. Create a Running Activity
```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "running",
    "title": "Morning Jog",
    "duration": 45,
    "difficulty": 3,
    "activityDate": "2024-01-15",
    "metadata": {
      "location": "outdoor",
      "distance": 7.5,
      "pace": 6
    },
    "caloriesBurned": 450
  }'
```

### 2. Create a Swimming Activity
```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "swimming",
    "title": "Pool Training",
    "duration": 60,
    "difficulty": 4,
    "activityDate": "2024-01-15",
    "metadata": {
      "poolSize": 25,
      "laps": 80,
      "strokeType": "freestyle"
    },
    "caloriesBurned": 500
  }'
```

### 3. Get Activity Statistics
```bash
curl -X GET "http://localhost:3000/activities/statistics?dateFrom=2024-01-01&dateTo=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get your token by logging in through the `/auth/login` endpoint.
