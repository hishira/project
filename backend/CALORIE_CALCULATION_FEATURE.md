# Calorie Calculation Feature Demo

## Overview

The sports diary now includes automatic calorie calculation when users don't provide the `caloriesBurned` field. The system calculates calories based on:

1. **Metadata-based calculation** (when detailed activity data is available)
2. **General MET-based calculation** (fallback for basic activity data)

## How It Works

### 1. Metadata-Based Calculation

When detailed metadata is provided, the system uses activity-specific calculations:

**Running:**
- Uses distance and pace to calculate calories more accurately
- Formula: `distance × 62.5 calories/km × pace_multiplier × difficulty_multiplier`

**Swimming:**
- Calculates distance from pool size and laps
- Formula: `distance × 400 calories/km × difficulty_multiplier`

**Cycling:**
- Uses distance and average speed
- Formula: `distance × 25 calories/km × speed_multiplier × difficulty_multiplier`

**Skating:**
- Uses distance
- Formula: `distance × 35 calories/km × difficulty_multiplier`

**Gym Workout:**
- Different rates per workout type
- Strength: 6 cal/min, Cardio: 10 cal/min, Mixed: 8 cal/min

### 2. General MET-Based Calculation

When metadata is insufficient, uses standard MET (Metabolic Equivalent) values:

- Running: 8.0 MET
- Swimming: 10.0 MET
- Cycling: 6.0 MET
- Skating: 5.5 MET
- Horse Riding: 4.0 MET
- Walking: 3.5 MET
- Hiking: 6.0 MET
- Gym Workout: 6.5 MET
- Yoga: 2.5 MET
- Tennis: 7.0 MET
- Football: 8.0 MET
- Basketball: 6.5 MET
- Other: 4.0 MET

**Formula:** `MET × 70kg × (duration/60) × difficulty_multiplier`

### 3. Difficulty Multipliers

- Very Easy: 0.7x
- Easy: 0.85x
- Moderate: 1.0x
- Hard: 1.2x
- Very Hard: 1.4x

## API Examples

### Example 1: Running with Metadata (Automatic Calorie Calculation)

```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "running",
    "title": "Morning Track Run",
    "duration": 30,
    "difficulty": 3,
    "activityDate": "2023-05-15",
    "metadata": {
      "location": "track",
      "distance": 5,
      "pace": 6
    }
  }'
```

**Response:** System calculates calories based on 5km distance and 6min/km pace, then applies moderate difficulty multiplier.

### Example 2: Swimming with Metadata

```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "swimming",
    "title": "Pool Swimming",
    "duration": 45,
    "difficulty": 4,
    "activityDate": "2023-05-15",
    "metadata": {
      "poolSize": 50,
      "laps": 40,
      "strokeType": "freestyle"
    }
  }'
```

**Response:** System calculates calories based on 2km distance (50m × 40 laps), then applies hard difficulty multiplier.

### Example 3: General Activity (No Metadata)

```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "tennis",
    "title": "Tennis Match",
    "duration": 60,
    "difficulty": 3,
    "activityDate": "2023-05-15"
  }'
```

**Response:** System uses tennis MET value (7.0) with 60 minutes duration and moderate difficulty.

### Example 4: Manual Calorie Override

```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "running",
    "title": "Custom Run",
    "duration": 30,
    "difficulty": 3,
    "activityDate": "2023-05-15",
    "caloriesBurned": 400
  }'
```

**Response:** System uses the provided 400 calories instead of calculating automatically.

## Benefits

1. **User Convenience**: Users don't need to manually calculate or research calorie burn rates
2. **Accuracy**: More accurate calculations when detailed metadata is provided
3. **Flexibility**: Users can still override with manual values when needed
4. **Consistency**: Standardized calculation methods across all activity types
5. **Smart Fallbacks**: Always provides a reasonable estimate even with minimal data
