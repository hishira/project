#!/bin/bash

# Sports Diary API Test Script
# This script tests all endpoints in the application using curl

# Configuration
BASE_URL="http://localhost:3001"
CONTENT_TYPE="Content-Type: application/json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables for authentication
ACCESS_TOKEN=""
USER_LOGIN=""
ACTIVITY_ID=""

# Helper functions
print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Test helper function that doesn't exit on failure
test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local auth_header="$4"
    local expected_status="$5"
    
    if [ -n "$data" ]; then
        if [ -n "$auth_header" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "$CONTENT_TYPE" \
                -H "$auth_header" \
                -d "$data" 2>/dev/null || echo -e "\nERROR")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "$CONTENT_TYPE" \
                -d "$data" 2>/dev/null || echo -e "\nERROR")
        fi
    else
        if [ -n "$auth_header" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "$auth_header" 2>/dev/null || echo -e "\nERROR")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                2>/dev/null || echo -e "\nERROR")
        fi
    fi
    
    # Check if curl failed
    if [[ "$response" == *"ERROR"* ]]; then
        print_error "$method $endpoint - Connection failed"
        return 1
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$method $endpoint - Status: $status_code"
        if [ ${#response_body} -lt 500 ]; then
            echo "$response_body"
        else
            echo "Response too long (${#response_body} chars) - truncated"
        fi
        return 0
    else
        print_error "$method $endpoint - Expected: $expected_status, Got: $status_code"
        if [ ${#response_body} -lt 300 ]; then
            echo "$response_body"
        fi
        return 1
    fi
}

# Start testing
echo -e "${GREEN}🚀 Starting API Endpoint Tests${NC}"
echo "Base URL: $BASE_URL"

# 1. Test basic health check
print_section "Health Check"
print_test "GET /"
test_endpoint "GET" "/" "" "" "200"

# 2. Authentication Tests
print_section "Authentication Endpoints"

# Register a new user with timestamp to avoid conflicts
TIMESTAMP=$(date +%s)
print_test "POST /auth/register"
register_data="{
    \"email\": \"testuser${TIMESTAMP}@example.com\",
    \"password\": \"TestPassword123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"login\": \"testuser${TIMESTAMP}\"
}"

register_response=$(test_endpoint "POST" "/auth/register" "$register_data" "" "201")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(echo "$register_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    USER_LOGIN=$(echo "$register_response" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
    print_success "User registered successfully - Login: $USER_LOGIN"
fi

# Login with the user
print_test "POST /auth/login"
login_data="{
    \"identifier\": \"testuser${TIMESTAMP}@example.com\",
    \"password\": \"TestPassword123!\"
}"

login_response=$(test_endpoint "POST" "/auth/login" "$login_data" "" "200")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(echo "$login_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    USER_LOGIN=$(echo "$login_response" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
    print_success "Login successful"
fi

# Get current user info
print_test "GET /auth/me"
test_endpoint "GET" "/auth/me" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get user sessions
print_test "GET /auth/sessions"
test_endpoint "GET" "/auth/sessions" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get session count
print_test "GET /auth/sessions/count"
test_endpoint "GET" "/auth/sessions/count" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# 3. Activities Tests
# print_section "Activities Endpoints"

# # Create a running activity
# print_test "POST /activities (Running)"
# running_activity='{
#     "type": "running",
#     "title": "Morning Run",
#     "description": "A nice morning run",
#     "duration": 30,
#     "difficulty": "moderate",
#     "activityDate": "2024-01-15",
#     "metadata": {
#         "location": "outdoor",
#         "distance": 5,
#         "pace": 6,
#         "elevation": 100
#     },
#     "caloriesBurned": 300,
#     "notes": "Felt great today!"
# }'

# activity_response=$(test_endpoint "POST" "/activities" "$running_activity" "Authorization: Bearer $ACCESS_TOKEN" "201")
# if [ $? -eq 0 ]; then
#     ACTIVITY_ID=$(echo "$activity_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)
#     print_success "Activity created with ID: $ACTIVITY_ID"
# fi

# # Create a swimming activity
# print_test "POST /activities (Swimming)"
# swimming_activity='{
#     "type": "swimming",
#     "title": "Pool Session",
#     "description": "Swimming practice",
#     "duration": 45,
#     "difficulty": "hard",
#     "activityDate": "2024-01-16",
#     "metadata": {
#         "location": "indoor",
#         "laps": 40,
#         "poolSize": 25,
#         "stroke": "freestyle"
#     },
#     "caloriesBurned": 400
# }'

# test_endpoint "POST" "/activities" "$swimming_activity" "Authorization: Bearer $ACCESS_TOKEN" "201"

# # Create a cycling activity
# print_test "POST /activities (Cycling)"
# cycling_activity='{
#     "type": "cycling",
#     "title": "City Ride",
#     "duration": 60,
#     "difficulty": "easy",
#     "activityDate": "2024-01-17",
#     "metadata": {
#         "location": "outdoor",
#         "distance": 20,
#         "avgSpeed": 25,
#         "maxSpeed": 35
#     }
# }'

# test_endpoint "POST" "/activities" "$cycling_activity" "Authorization: Bearer $ACCESS_TOKEN" "201"

# # Get all activities
# print_test "GET /activities"
# test_endpoint "GET" "/activities" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # Get activities with filters
# print_test "GET /activities?type=running"
# test_endpoint "GET" "/activities?type=running" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# print_test "GET /activities?difficulty=moderate"
# test_endpoint "GET" "/activities?difficulty=moderate" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# print_test "GET /activities?limit=2"
# test_endpoint "GET" "/activities?limit=2" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # Get recent activities
# print_test "GET /activities/recent"
# test_endpoint "GET" "/activities/recent" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# print_test "GET /activities/recent?limit=1"
# test_endpoint "GET" "/activities/recent?limit=1" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # Get activity statistics
# print_test "GET /activities/statistics"
# test_endpoint "GET" "/activities/statistics" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# print_test "GET /activities/statistics?dateFrom=2024-01-01&dateTo=2024-12-31"
# test_endpoint "GET" "/activities/statistics?dateFrom=2024-01-01&dateTo=2024-12-31" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # Get single activity
# if [ -n "$ACTIVITY_ID" ]; then
#     print_test "GET /activities/:id"
#     test_endpoint "GET" "/activities/$ACTIVITY_ID" "" "Authorization: Bearer $ACCESS_TOKEN" "200"
# fi

# # Update activity
# if [ -n "$ACTIVITY_ID" ]; then
#     print_test "PATCH /activities/:id"
#     update_data='{
#         "title": "Updated Morning Run",
#         "duration": 35
#     }'
#     test_endpoint "PATCH" "/activities/$ACTIVITY_ID" "$update_data" "Authorization: Bearer $ACCESS_TOKEN" "200"
# fi

# # 4. User Statistics Tests
# print_section "User Statistics Endpoints"

# # Get user statistics
# print_test "GET /user-statistics"
# test_endpoint "GET" "/user-statistics" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # Recalculate statistics
# print_test "POST /user-statistics/recalculate"
# test_endpoint "POST" "/user-statistics/recalculate" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # 5. Users Endpoints (might be protected)
# print_section "Users Endpoints"

# # Get all users
# print_test "GET /users"
# test_endpoint "GET" "/users" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# # 6. Error Cases Tests
# print_section "Error Cases"

# # Test invalid login
# print_test "POST /auth/login (invalid credentials)"
# invalid_login='{
#     "identifier": "invalid@example.com",
#     "password": "wrongpassword"
# }'
# test_endpoint "POST" "/auth/login" "$invalid_login" "" "401"

# # Test unauthorized access
# print_test "GET /auth/me (no token)"
# test_endpoint "GET" "/auth/me" "" "" "401"

# # Test invalid token
# print_test "GET /auth/me (invalid token)"
# test_endpoint "GET" "/auth/me" "" "Authorization: Bearer invalid_token" "401"

# # 7. Cleanup
# print_section "Cleanup"

# # Delete the created activity
# if [ -n "$ACTIVITY_ID" ]; then
#     print_test "DELETE /activities/:id"
#     test_endpoint "DELETE" "/activities/$ACTIVITY_ID" "" "Authorization: Bearer $ACCESS_TOKEN" "204"
# fi

# # Logout
# print_test "POST /auth/logout"
# test_endpoint "POST" "/auth/logout" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# print_section "Test Summary"
# print_success "All API endpoint tests completed!"
# echo -e "${BLUE}Note: Some error cases are expected and show that the API handles invalid requests correctly.${NC}"
# echo -e "${GREEN}🎉 API testing finished!${NC}"
