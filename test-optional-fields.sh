#!/bin/bash

# Test script for optional fields in activity creation
# This script tests that optional fields are only sent when they have values

API_BASE="http://localhost:3001"
TOKEN=""

echo "=== Testing Optional Fields in Activity Creation ==="
echo

# Function to get auth token
get_auth_token() {
    echo "Getting auth token..."
    RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "login": "testuser",
            "password": "Qazwsxedc12@"
        }')
    
    TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
        echo "Failed to get auth token. Response: $RESPONSE"
        exit 1
    fi
    echo "Auth token obtained successfully"
    echo
}

# Function to test activity creation
test_activity_creation() {
    local test_name="$1"
    local payload="$2"
    local expected_fields="$3"
    
    echo "--- Test: $test_name ---"
    echo "Payload: $payload"
    
    RESPONSE=$(curl -s -X POST "$API_BASE/activities" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "$payload")
    
    echo "Response: $RESPONSE"
    
    # Check if activity was created successfully
    ACTIVITY_ID=$(echo "$RESPONSE" | jq -r '.id')
    if [ "$ACTIVITY_ID" = "null" ] || [ -z "$ACTIVITY_ID" ]; then
        echo "❌ FAILED: Activity creation failed"
        echo "Error: $(echo "$RESPONSE" | jq -r '.message // .error // "Unknown error"')"
    else
        echo "✅ SUCCESS: Activity created with ID: $ACTIVITY_ID"
        
        # Get the created activity to verify fields
        ACTIVITY_RESPONSE=$(curl -s -X GET "$API_BASE/activities/$ACTIVITY_ID" \
            -H "Authorization: Bearer $TOKEN")
        
        echo "Created activity details:"
        echo "$ACTIVITY_RESPONSE" | jq '.'
        
        # Clean up - delete the test activity
        curl -s -X DELETE "$API_BASE/activities/$ACTIVITY_ID" \
            -H "Authorization: Bearer $TOKEN" > /dev/null
    fi
    echo
}

# Get authentication token
get_auth_token

# Test 1: Minimal activity (only required fields)
test_activity_creation "Minimal Activity (required fields only)" '{
    "type": "running",
    "title": "Morning Run",
    "duration": 30,
    "difficulty": 3,
    "activityDate": "2025-05-29T08:00:00.000Z"
}' "type,title,duration,difficulty,activityDate"

# Test 2: Activity with calories but no description or notes
test_activity_creation "Activity with calories only" '{
    "type": "cycling",
    "title": "Evening Bike Ride",
    "duration": 45,
    "difficulty": 2,
    "activityDate": "2025-05-29T18:00:00.000Z",
    "caloriesBurned": 250
}' "type,title,duration,difficulty,activityDate,caloriesBurned"

# Test 3: Activity with description but no calories or notes
test_activity_creation "Activity with description only" '{
    "type": "swimming",
    "title": "Pool Training",
    "duration": 60,
    "difficulty": 4,
    "activityDate": "2025-05-29T07:00:00.000Z",
    "description": "Good morning swim session"
}' "type,title,duration,difficulty,activityDate,description"

# Test 4: Activity with notes but no calories or description
test_activity_creation "Activity with notes only" '{
    "type": "gym_workout",
    "title": "Strength Training",
    "duration": 90,
    "difficulty": 3,
    "activityDate": "2025-05-29T19:00:00.000Z",
    "notes": "Focused on upper body exercises"
}' "type,title,duration,difficulty,activityDate,notes"

# Test 5: Activity with all optional fields
test_activity_creation "Activity with all optional fields" '{
    "type": "running",
    "title": "Long Distance Run",
    "duration": 120,
    "difficulty": 5,
    "activityDate": "2025-05-29T06:00:00.000Z",
    "caloriesBurned": 800,
    "description": "Training for marathon",
    "notes": "Felt strong throughout the run",
    "metadata": {
        "location": "outdoor",
        "distance": 15,
        "pace": 8,
        "elevation": 100
    }
}' "type,title,duration,difficulty,activityDate,caloriesBurned,description,notes,metadata"

# Test 6: Activity with metadata only
test_activity_creation "Activity with metadata only" '{
    "type": "swimming",
    "title": "Pool Workout",
    "duration": 45,
    "difficulty": 3,
    "activityDate": "2025-05-29T12:00:00.000Z",
    "metadata": {
        "poolSize": 25,
        "laps": 40,
        "strokeType": "freestyle"
    }
}' "type,title,duration,difficulty,activityDate,metadata"

echo "=== Optional Fields Testing Complete ==="
