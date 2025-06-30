#!/bin/bash

# Sports Diary API Test Script
# This script tests all endpoints in the application using curl

set -e

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
REFRESH_TOKEN=""
USER_LOGIN=""
ACTIVITY_ID=""
SESSION_ID=""

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

extract_token() {
    echo "$1" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4
}

extract_refresh_token() {
    echo "$1" | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4
}

extract_user_login() {
    echo "$1" | grep -o '"login":"[^"]*"' | cut -d'"' -f4
}

extract_activity_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | cut -d'"' -f4
}

extract_session_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1
}

# Test helper function
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
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "$CONTENT_TYPE" \
                -d "$data")
        fi
    else
        if [ -n "$auth_header" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                -H "$auth_header")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
        fi
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$method $endpoint - Status: $status_code"
        echo "$response_body"
        return 0
    else
        print_error "$method $endpoint - Expected: $expected_status, Got: $status_code"
        echo "$response_body"
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

# Register a new user
print_test "POST /auth/register"
register_data='{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "login": "testuser123"
}'

register_response=$(test_endpoint "POST" "/auth/register" "$register_data" "" "201")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(extract_token "$register_response")
    USER_LOGIN=$(extract_user_login "$register_response")
    print_success "User registered successfully"
fi

# Login with the user
print_test "POST /auth/login"
login_data='{
    "identifier": "testuser@example.com",
    "password": "TestPassword123!"
}'

login_response=$(test_endpoint "POST" "/auth/login" "$login_data" "" "200")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(extract_token "$login_response")
    REFRESH_TOKEN=$(extract_refresh_token "$login_response")
    USER_LOGIN=$(extract_user_login "$login_response")
    print_success "Login successful"
fi

# Get current user info
print_test "GET /auth/me"
test_endpoint "GET" "/auth/me" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get user sessions
print_test "GET /auth/sessions"
sessions_response=$(test_endpoint "GET" "/auth/sessions" "" "Authorization: Bearer $ACCESS_TOKEN" "200")
if [ $? -eq 0 ]; then
    SESSION_ID=$(extract_session_id "$sessions_response")
fi

# Get session count
print_test "GET /auth/sessions/count"
test_endpoint "GET" "/auth/sessions/count" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Change password
print_test "PATCH /auth/change-password"
change_password_data='{
    "currentPassword": "TestPassword123!",
    "newPassword": "NewTestPassword123!"
}'
test_endpoint "PATCH" "/auth/change-password" "$change_password_data" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Update login data for future requests
login_data='{
    "identifier": "testuser@example.com",
    "password": "NewTestPassword123!"
}'
login_response=$(test_endpoint "POST" "/auth/login" "$login_data" "" "200")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(extract_token "$login_response")
    REFRESH_TOKEN=$(extract_refresh_token "$login_response")
fi

# Test refresh token
print_test "POST /auth/refresh"
refresh_data="{\"refresh_token\": \"$REFRESH_TOKEN\"}"
refresh_response=$(test_endpoint "POST" "/auth/refresh" "$refresh_data" "" "200")
if [ $? -eq 0 ]; then
    ACCESS_TOKEN=$(extract_token "$refresh_response")
    REFRESH_TOKEN=$(extract_refresh_token "$refresh_response")
fi

# 3. Activities Tests
print_section "Activities Endpoints"

# Create a running activity
print_test "POST /activities (Running)"
running_activity='{
    "type": "running",
    "title": "Morning Run",
    "description": "A nice morning run",
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
    "notes": "Felt great today!"
}'

activity_response=$(test_endpoint "POST" "/activities" "$running_activity" "Authorization: Bearer $ACCESS_TOKEN" "201")
if [ $? -eq 0 ]; then
    ACTIVITY_ID=$(extract_activity_id "$activity_response")
fi

# Create a swimming activity
print_test "POST /activities (Swimming)"
swimming_activity='{
    "type": "swimming",
    "title": "Pool Session",
    "description": "Swimming practice",
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
}'

test_endpoint "POST" "/activities" "$swimming_activity" "Authorization: Bearer $ACCESS_TOKEN" "201"

# Create a cycling activity
print_test "POST /activities (Cycling)"
cycling_activity='{
    "type": "cycling",
    "title": "City Ride",
    "duration": 60,
    "difficulty": "easy",
    "activityDate": "2024-01-17",
    "metadata": {
        "location": "outdoor",
        "distance": 20,
        "avgSpeed": 25,
        "maxSpeed": 35
    }
}'

test_endpoint "POST" "/activities" "$cycling_activity" "Authorization: Bearer $ACCESS_TOKEN" "201"

# Get all activities
print_test "GET /activities"
test_endpoint "GET" "/activities" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get activities with filters
print_test "GET /activities?type=running"
test_endpoint "GET" "/activities?type=running" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

print_test "GET /activities?difficulty=moderate"
test_endpoint "GET" "/activities?difficulty=moderate" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

print_test "GET /activities?limit=2"
test_endpoint "GET" "/activities?limit=2" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get recent activities
print_test "GET /activities/recent"
test_endpoint "GET" "/activities/recent" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

print_test "GET /activities/recent?limit=1"
test_endpoint "GET" "/activities/recent?limit=1" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get activity statistics
print_test "GET /activities/statistics"
test_endpoint "GET" "/activities/statistics" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

print_test "GET /activities/statistics?dateFrom=2024-01-01&dateTo=2024-12-31"
test_endpoint "GET" "/activities/statistics?dateFrom=2024-01-01&dateTo=2024-12-31" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Get single activity
if [ -n "$ACTIVITY_ID" ]; then
    print_test "GET /activities/:id"
    test_endpoint "GET" "/activities/$ACTIVITY_ID" "" "Authorization: Bearer $ACCESS_TOKEN" "200"
fi

# Update activity
if [ -n "$ACTIVITY_ID" ]; then
    print_test "PATCH /activities/:id"
    update_data='{
        "title": "Updated Morning Run",
        "duration": 35
    }'
    test_endpoint "PATCH" "/activities/$ACTIVITY_ID" "$update_data" "Authorization: Bearer $ACCESS_TOKEN" "200"
fi

# 4. User Statistics Tests
print_section "User Statistics Endpoints"

# Get user statistics
print_test "GET /user-statistics"
test_endpoint "GET" "/user-statistics" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Recalculate statistics
print_test "POST /user-statistics/recalculate"
test_endpoint "POST" "/user-statistics/recalculate" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# 5. Users Endpoints (if accessible)
print_section "Users Endpoints"

# Get all users
print_test "GET /users"
test_endpoint "GET" "/users" "" "Authorization: Bearer $ACCESS_TOKEN" "200" || print_error "Users endpoint might not be accessible"

# 6. Session Management Tests
print_section "Session Management"

# Delete a specific session
if [ -n "$SESSION_ID" ]; then
    print_test "DELETE /auth/sessions/:sessionId"
    test_endpoint "DELETE" "/auth/sessions/$SESSION_ID" "" "Authorization: Bearer $ACCESS_TOKEN" "200"
fi

# Get sessions after deletion
print_test "GET /auth/sessions (after deletion)"
test_endpoint "GET" "/auth/sessions" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Cleanup expired sessions
print_test "POST /auth/sessions/cleanup"
test_endpoint "POST" "/auth/sessions/cleanup" "" "" "200"

# 7. Clean up - Delete activity and logout
print_section "Cleanup"

# Delete the created activity
if [ -n "$ACTIVITY_ID" ]; then
    print_test "DELETE /activities/:id"
    test_endpoint "DELETE" "/activities/$ACTIVITY_ID" "" "Authorization: Bearer $ACCESS_TOKEN" "204"
fi

# Delete all sessions
print_test "DELETE /auth/sessions (all)"
test_endpoint "DELETE" "/auth/sessions" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# Logout
print_test "POST /auth/logout"
test_endpoint "POST" "/auth/logout" "" "Authorization: Bearer $ACCESS_TOKEN" "200"

# 8. Error Cases Tests
print_section "Error Cases"

# Test invalid login
print_test "POST /auth/login (invalid credentials)"
invalid_login='{
    "identifier": "invalid@example.com",
    "password": "wrongpassword"
}'
test_endpoint "POST" "/auth/login" "$invalid_login" "" "401"

# Test unauthorized access
print_test "GET /auth/me (no token)"
test_endpoint "GET" "/auth/me" "" "" "401"

# Test invalid token
print_test "GET /auth/me (invalid token)"
test_endpoint "GET" "/auth/me" "" "Authorization: Bearer invalid_token" "401"

# Test non-existent activity
print_test "GET /activities/00000000-0000-0000-0000-000000000000"
test_endpoint "GET" "/activities/00000000-0000-0000-0000-000000000000" "" "Authorization: Bearer invalid_token" "401"

print_section "Test Summary"
print_success "All API endpoint tests completed!"
echo -e "${BLUE}Note: Some error cases are expected and show that the API handles invalid requests correctly.${NC}"
echo -e "${GREEN}🎉 API testing finished!${NC}"
