#!/bin/bash

# Manual API Test Script with detailed output
echo "🚀 Sports Diary API Test Script"
echo "================================"

BASE_URL="http://localhost:3001"

# Test 1: Health Check
echo -e "\n1. Health Check"
echo "GET /"
curl -s "$BASE_URL/" && echo -e "\n✅ Health check passed\n"

# Test 2: User Registration
echo -e "2. User Registration"
echo "POST /auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "TestPassword123!",
    "firstName": "API",
    "lastName": "Test",
    "login": "apitest"
  }')

echo "$REGISTER_RESPONSE" | jq .
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')
echo "✅ User registered, token extracted"

# Test 3: User Login
echo -e "\n3. User Login"
echo "POST /auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "apitest@example.com",
    "password": "TestPassword123!"
  }')

echo "$LOGIN_RESPONSE" | jq .
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
echo "✅ Login successful, token updated"

# Test 4: Get Current User
echo -e "\n4. Get Current User Info"
echo "GET /auth/me"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ User info retrieved"

# Test 5: Create Activities
echo -e "\n5. Create Running Activity"
echo "POST /activities"
ACTIVITY_RESPONSE=$(curl -s -X POST "$BASE_URL/activities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "type": "running",
    "title": "Test Morning Run",
    "description": "API test run",
    "duration": 30,
    "difficulty": "moderate",
    "activityDate": "2024-01-15",
    "metadata": {
      "location": "outdoor",
      "distance": 5,
      "pace": 6,
      "elevation": 100
    },
    "caloriesBurned": 300,
    "notes": "API test activity"
  }')

echo "$ACTIVITY_RESPONSE" | jq .
ACTIVITY_ID=$(echo "$ACTIVITY_RESPONSE" | jq -r '.id')
echo "✅ Running activity created with ID: $ACTIVITY_ID"

# Test 6: Create Swimming Activity
echo -e "\n6. Create Swimming Activity"
curl -s -X POST "$BASE_URL/activities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "type": "swimming",
    "title": "Pool Training",
    "duration": 45,
    "difficulty": "hard",
    "activityDate": "2024-01-16",
    "metadata": {
      "location": "indoor",
      "laps": 40,
      "poolSize": 25,
      "stroke": "freestyle"
    },
    "caloriesBurned": 400
  }' | jq .
echo "✅ Swimming activity created"

# Test 7: Get All Activities
echo -e "\n7. Get All Activities"
echo "GET /activities"
curl -s -X GET "$BASE_URL/activities" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ All activities retrieved"

# Test 8: Get Activities with Filter
echo -e "\n8. Get Running Activities Only"
echo "GET /activities?type=running"
curl -s -X GET "$BASE_URL/activities?type=running" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Filtered activities retrieved"

# Test 9: Get Recent Activities
echo -e "\n9. Get Recent Activities"
echo "GET /activities/recent"
curl -s -X GET "$BASE_URL/activities/recent" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Recent activities retrieved"

# Test 10: Get Activity Statistics
echo -e "\n10. Get Activity Statistics"
echo "GET /activities/statistics"
curl -s -X GET "$BASE_URL/activities/statistics" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Activity statistics retrieved"

# Test 11: Get Single Activity
echo -e "\n11. Get Single Activity"
echo "GET /activities/$ACTIVITY_ID"
curl -s -X GET "$BASE_URL/activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Single activity retrieved"

# Test 12: Update Activity
echo -e "\n12. Update Activity"
echo "PATCH /activities/$ACTIVITY_ID"
curl -s -X PATCH "$BASE_URL/activities/$ACTIVITY_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Updated Test Run",
    "duration": 35
  }' | jq .
echo "✅ Activity updated"

# Test 13: Get User Statistics
echo -e "\n13. Get User Statistics"
echo "GET /user-statistics"
curl -s -X GET "$BASE_URL/user-statistics" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ User statistics retrieved"

# Test 14: Recalculate Statistics
echo -e "\n14. Recalculate User Statistics"
echo "POST /user-statistics/recalculate"
curl -s -X POST "$BASE_URL/user-statistics/recalculate" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Statistics recalculated"

# Test 15: Get User Sessions
echo -e "\n15. Get User Sessions"
echo "GET /auth/sessions"
curl -s -X GET "$BASE_URL/auth/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ User sessions retrieved"

# Test 16: Get Session Count
echo -e "\n16. Get Session Count"
echo "GET /auth/sessions/count"
curl -s -X GET "$BASE_URL/auth/sessions/count" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ Session count retrieved"

# Test 17: Error Cases
echo -e "\n17. Error Case - Invalid Login"
echo "POST /auth/login (invalid credentials)"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "wrong@example.com",
    "password": "wrongpassword"
  }' | jq .
echo "✅ Invalid login properly rejected"

# Test 18: Error Case - Unauthorized Access
echo -e "\n18. Error Case - No Authorization"
echo "GET /auth/me (no token)"
curl -s -X GET "$BASE_URL/auth/me" | jq .
echo "✅ Unauthorized access properly rejected"

# Test 19: Clean up - Delete Activity
echo -e "\n19. Delete Test Activity"
echo "DELETE /activities/$ACTIVITY_ID"
DELETE_RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "Response code: $DELETE_RESPONSE"
echo "✅ Activity deleted"

# Test 20: Logout
echo -e "\n20. Logout"
echo "POST /auth/logout"
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo "✅ User logged out"

echo -e "\n🎉 All API tests completed successfully!"
echo "==================================="
