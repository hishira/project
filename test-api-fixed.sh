#!/bin/bash

# Sports Diary API Test Script - Fixed Version
BASE_URL="http://localhost:3001"
TIMESTAMP=$(date +%s)
EMAIL="testuser${TIMESTAMP}@example.com"
LOGIN="testuser${TIMESTAMP}"
PASSWORD="TestPass123!"        # Meets all requirements: uppercase, lowercase, number, special char
NEW_PASSWORD="NewPass456@"     # Different password for change password test

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((TESTS_FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local auth_header="$4"
    local expected_status="$5"
    local description="$6"
    
    echo -e "\nTesting: ${method} ${endpoint}"
    if [ ! -z "$description" ]; then
        echo "Description: $description"
    fi
    
    # Build curl command
    local curl_cmd="curl -s -w \"\\nHTTP_STATUS:%{http_code}\" -X ${method}"
    
    if [ ! -z "$auth_header" ]; then
        curl_cmd="$curl_cmd -H \"Authorization: Bearer $auth_header\""
    fi
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -H \"Content-Type: application/json\" -d '$data'"
    fi
    
    curl_cmd="$curl_cmd \"${BASE_URL}${endpoint}\""
    
    # Execute curl command
    local response=$(eval "$curl_cmd")
    local http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    local response_body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Response Status: $http_status"
    echo "Response Body: $response_body"
    
    # Check status code
    if [ "$http_status" = "$expected_status" ]; then
        print_success "${method} ${endpoint} - Status: ${http_status}"
        echo "$response_body"
        return 0
    else
        print_error "${method} ${endpoint} - Expected: ${expected_status}, Got: ${http_status}"
        echo "Response: $response_body"
        return 1
    fi
}

# Start testing
echo -e "${BLUE}🚀 Starting Fixed API Endpoint Tests${NC}"
echo "Base URL: $BASE_URL"
echo "Test User: $LOGIN"
echo "Test Email: $EMAIL"

# Health Check
print_header "Health Check"
test_endpoint "GET" "/" "" "" "200" "Basic health check"

# Authentication Tests
print_header "Authentication Endpoints"

# Register User
echo -e "\n${YELLOW}Registering new user...${NC}"
REGISTER_DATA="{
    \"login\": \"$LOGIN\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
}"

REGISTER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
    "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "$REGISTER_DATA")

REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

if [ "$REGISTER_STATUS" = "201" ]; then
    print_success "User registration successful"
    # Extract tokens
    ACCESS_TOKEN=$(echo "$REGISTER_BODY" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$REGISTER_BODY" | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)
    
    echo "Access Token: ${ACCESS_TOKEN:0:20}..."
    echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."
else
    print_error "User registration failed with status $REGISTER_STATUS"
    echo "Response: $REGISTER_BODY"
    exit 1
fi

# Login Test
LOGIN_DATA="{
    \"identifier\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
}"
test_endpoint "POST" "/auth/login" "$LOGIN_DATA" "" "200" "User login"

# Test authenticated endpoints
test_endpoint "GET" "/auth/me" "" "$ACCESS_TOKEN" "200" "Get current user info"
test_endpoint "GET" "/auth/sessions" "" "$ACCESS_TOKEN" "200" "Get user sessions"
test_endpoint "GET" "/auth/sessions/count" "" "$ACCESS_TOKEN" "200" "Get session count"

# Change Password
CHANGE_PWD_DATA="{
    \"currentPassword\": \"$PASSWORD\",
    \"newPassword\": \"$NEW_PASSWORD\"
}"
test_endpoint "PATCH" "/auth/change-password" "$CHANGE_PWD_DATA" "$ACCESS_TOKEN" "200" "Change password"

# Test refresh token with correct field name
if [ ! -z "$REFRESH_TOKEN" ]; then
    REFRESH_DATA="{\"refresh_token\": \"$REFRESH_TOKEN\"}"
    test_endpoint "POST" "/auth/refresh" "$REFRESH_DATA" "" "200" "Refresh access token"
fi

# Activities Tests
print_header "Activities Endpoints"

# Create Activity with correct format
ACTIVITY_DATA="{
    \"type\": \"running\",
    \"title\": \"Morning Run\",
    \"description\": \"Morning run in the park\",
    \"duration\": 30,
    \"difficulty\": 3,
    \"activityDate\": \"$(date -I)T08:00:00.000Z\",
    \"metadata\": {
        \"location\": \"outdoor\",
        \"distance\": 5.0,
        \"pace\": 6.0
    }
}"

ACTIVITY_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
    "$BASE_URL/activities" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$ACTIVITY_DATA")

ACTIVITY_STATUS=$(echo "$ACTIVITY_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
ACTIVITY_BODY=$(echo "$ACTIVITY_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

if [ "$ACTIVITY_STATUS" = "201" ]; then
    print_success "Activity creation successful"
    ACTIVITY_ID=$(echo "$ACTIVITY_BODY" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Created Activity ID: $ACTIVITY_ID"
else
    print_error "Activity creation failed with status $ACTIVITY_STATUS"
    echo "Response: $ACTIVITY_BODY"
fi

# Test other activity endpoints
test_endpoint "GET" "/activities" "" "$ACCESS_TOKEN" "200" "Get all activities"
test_endpoint "GET" "/activities/recent" "" "$ACCESS_TOKEN" "200" "Get recent activities"
test_endpoint "GET" "/activities/statistics" "" "$ACCESS_TOKEN" "200" "Get activity statistics"

# If we have an activity ID, test individual activity operations
if [ ! -z "$ACTIVITY_ID" ]; then
    test_endpoint "GET" "/activities/$ACTIVITY_ID" "" "$ACCESS_TOKEN" "200" "Get specific activity"
    
    # Update Activity
    UPDATE_DATA="{
        \"title\": \"Updated Morning Run\",
        \"description\": \"Updated morning run description\",
        \"duration\": 35
    }"
    test_endpoint "PATCH" "/activities/$ACTIVITY_ID" "$UPDATE_DATA" "$ACCESS_TOKEN" "200" "Update activity"
fi

# User Statistics Tests
print_header "User Statistics Endpoints"
test_endpoint "GET" "/user-statistics" "" "$ACCESS_TOKEN" "200" "Get user statistics"
test_endpoint "POST" "/user-statistics/recalculate" "" "$ACCESS_TOKEN" "200" "Recalculate statistics"

# Users Endpoints Tests
print_header "Users Endpoints"
test_endpoint "GET" "/users" "" "$ACCESS_TOKEN" "200" "Get all users"
test_endpoint "GET" "/users/me" "" "$ACCESS_TOKEN" "200" "Get current user"

# Clean up - try to delete the activity if we created one (before logout)
if [ ! -z "$ACTIVITY_ID" ]; then
    print_header "Cleanup"
    test_endpoint "DELETE" "/activities/$ACTIVITY_ID" "" "$ACCESS_TOKEN" "200" "Delete test activity"
fi

# Session Management
print_header "Session Management"
test_endpoint "DELETE" "/auth/sessions" "" "$ACCESS_TOKEN" "200" "Delete all sessions"

# Logout (this should be last as it invalidates the token)
test_endpoint "POST" "/auth/logout" "" "$ACCESS_TOKEN" "200" "User logout"

# Test Summary
print_header "Test Summary"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! API is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please check the output above.${NC}"
    exit 1
fi
