#!/bin/bash

# Sports Diary API Test Script - Debug Version
BASE_URL="http://localhost:3001"
EMAIL="testuser$(date +%s)@example.com"
PASSWORD="password123"
NEW_PASSWORD="newpassword123"

echo "🚀 Starting API Debug Tests"
echo "Base URL: $BASE_URL"
echo "Test Email: $EMAIL"

# Health Check
echo -e "\n=== Health Check ==="
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/"

# User Registration
echo -e "\n=== User Registration ==="
REGISTER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"login\": \"testuser123\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

echo "Registration Response:"
echo "$REGISTER_RESPONSE"

# Extract HTTP status
HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
echo "HTTP Status: $HTTP_STATUS"

# Extract response body
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')
echo "Response Body: $RESPONSE_BODY"

# Extract tokens if registration successful
if [ "$HTTP_STATUS" = "201" ] || [ "$HTTP_STATUS" = "200" ]; then
    ACCESS_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    echo "Access Token extracted: ${ACCESS_TOKEN:0:20}..."
    echo "Refresh Token extracted: ${REFRESH_TOKEN:0:20}..."
else
    echo "❌ Registration failed with status $HTTP_STATUS"
    exit 1
fi

# Test authenticated endpoint
echo -e "\n=== Testing Authenticated Endpoint ==="
curl -s -w "\nStatus: %{http_code}\n" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$BASE_URL/auth/me"

# Test creating an activity
echo -e "\n=== Creating Activity ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST \
  "$BASE_URL/activities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"activityType\": \"Running\",
    \"description\": \"Morning run\",
    \"duration\": 30,
    \"distance\": 5.0,
    \"date\": \"$(date -I)\"
  }"

echo -e "\n✅ Debug tests completed"
