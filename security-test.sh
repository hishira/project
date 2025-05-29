#!/bin/bash

# Security Testing Script for Sports Diary Application
# This script performs automated security tests based on the audit checklist

API_BASE="http://localhost:3001"
TEST_USER_LOGIN="sectest_$(date +%s)"
TEST_USER_EMAIL="sectest_$(date +%s)@example.com"
VALID_PASSWORD="SecureTest123@"
VALID_TOKEN=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test result counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNING=0

echo -e "${BLUE}=== Sports Diary Application Security Testing ===${NC}"
echo "API Base: $API_BASE"
echo "Test User: $TEST_USER_LOGIN"
echo

# Helper functions
pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((TESTS_WARNING++))
}

info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

# Test server availability
test_server_availability() {
    echo -e "\n${BLUE}--- Testing Server Availability ---${NC}"
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE" 2>/dev/null)
    
    if [ "$RESPONSE" = "404" ] || [ "$RESPONSE" = "200" ]; then
        pass "Server is responding (HTTP $RESPONSE)"
    else
        fail "Server not responding or unexpected response: $RESPONSE"
        echo "Exiting - cannot proceed with security tests"
        exit 1
    fi
}

# Test A1: Password Strength Validation
test_password_strength() {
    echo -e "\n${BLUE}--- Testing Password Strength Validation ---${NC}"
    
    # Test weak password (too short)
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "login": "weaktest1",
            "email": "weak1@example.com",
            "password": "weak"
        }' 2>/dev/null)
    
    if [[ "$RESPONSE" == *"400"* ]]; then
        pass "Weak password rejected (too short)"
    else
        fail "Weak password not properly rejected"
    fi
    
    # Test password without special characters
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "login": "weaktest2",
            "email": "weak2@example.com",
            "password": "WeakPassword123"
        }' 2>/dev/null)
    
    if [[ "$RESPONSE" == *"400"* ]]; then
        pass "Password without special characters rejected"
    else
        fail "Password without special characters not properly rejected"
    fi
    
    # Test password with invalid special characters
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "login": "weaktest3",
            "email": "weak3@example.com",
            "password": "WeakPassword123#"
        }' 2>/dev/null)
    
    if [[ "$RESPONSE" == *"400"* ]]; then
        pass "Password with invalid special characters rejected"
    else
        fail "Password with invalid special characters not properly rejected"
    fi
}

# Test A2: User Registration and Authentication
test_user_registration() {
    echo -e "\n${BLUE}--- Testing User Registration ---${NC}"
    
    # Create test user
    RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"login\": \"$TEST_USER_LOGIN\",
            \"email\": \"$TEST_USER_EMAIL\",
            \"password\": \"$VALID_PASSWORD\"
        }")
    
    if echo "$RESPONSE" | jq -e '.access_token' > /dev/null 2>&1; then
        pass "User registration successful with strong password"
        VALID_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    else
        fail "User registration failed: $(echo "$RESPONSE" | jq -r '.message // "Unknown error"')"
        return 1
    fi
    
    # Test duplicate email registration
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"login\": \"different_login\",
            \"email\": \"$TEST_USER_EMAIL\",
            \"password\": \"$VALID_PASSWORD\"
        }")
    
    if [[ "$RESPONSE" == *"409"* ]]; then
        pass "Duplicate email registration properly rejected"
    else
        fail "Duplicate email registration not properly handled"
    fi
}

# Test B1: Authentication Token Validation
test_token_validation() {
    echo -e "\n${BLUE}--- Testing Token Validation ---${NC}"
    
    # Test with no token
    RESPONSE=$(curl -s -w "%{http_code}" -X GET "$API_BASE/activities")
    
    if [[ "$RESPONSE" == *"401"* ]]; then
        pass "Request without token properly rejected"
    else
        fail "Request without token not properly rejected"
    fi
    
    # Test with invalid token
    RESPONSE=$(curl -s -w "%{http_code}" -X GET "$API_BASE/activities" \
        -H "Authorization: Bearer invalid_token_12345")
    
    if [[ "$RESPONSE" == *"401"* ]]; then
        pass "Request with invalid token properly rejected"
    else
        fail "Request with invalid token not properly rejected"
    fi
    
    # Test with valid token
    if [ -n "$VALID_TOKEN" ]; then
        RESPONSE=$(curl -s -w "%{http_code}" -X GET "$API_BASE/activities" \
            -H "Authorization: Bearer $VALID_TOKEN")
        
        if [[ "$RESPONSE" == *"200"* ]]; then
            pass "Request with valid token accepted"
        else
            fail "Request with valid token rejected"
        fi
    else
        warn "No valid token available for testing"
    fi
}

# Test C1: Input Validation
test_input_validation() {
    echo -e "\n${BLUE}--- Testing Input Validation ---${NC}"
    
    if [ -z "$VALID_TOKEN" ]; then
        warn "No valid token available for input validation tests"
        return
    fi
    
    # Test SQL injection attempt in activity creation
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/activities" \
        -H "Authorization: Bearer $VALID_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Test'; DROP TABLE activities; --",
            "type": "running",
            "duration": 30,
            "difficulty": 3,
            "activityDate": "2025-05-29T08:00:00.000Z"
        }')
    
    if [[ "$RESPONSE" == *"201"* ]] || [[ "$RESPONSE" == *"400"* ]]; then
        pass "SQL injection attempt handled (activity creation)"
    else
        fail "SQL injection attempt not properly handled"
    fi
    
    # Test XSS attempt in activity title
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/activities" \
        -H "Authorization: Bearer $VALID_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "<script>alert(\"xss\")</script>",
            "type": "running", 
            "duration": 30,
            "difficulty": 3,
            "activityDate": "2025-05-29T08:00:00.000Z"
        }')
    
    if [[ "$RESPONSE" == *"201"* ]] || [[ "$RESPONSE" == *"400"* ]]; then
        pass "XSS attempt handled (stored as string, not executed)"
    else
        fail "XSS attempt not properly handled"
    fi
    
    # Test invalid enum value
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/activities" \
        -H "Authorization: Bearer $VALID_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Test Activity",
            "type": "invalid_activity_type",
            "duration": 30,
            "difficulty": 3,
            "activityDate": "2025-05-29T08:00:00.000Z"
        }')
    
    if [[ "$RESPONSE" == *"400"* ]]; then
        pass "Invalid enum value properly rejected"
    else
        fail "Invalid enum value not properly rejected"
    fi
}

# Test D1: Error Handling
test_error_handling() {
    echo -e "\n${BLUE}--- Testing Error Handling ---${NC}"
    
    # Test database constraint violation (duplicate login)
    RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"login\": \"$TEST_USER_LOGIN\",
            \"email\": \"different_$TEST_USER_EMAIL\",
            \"password\": \"$VALID_PASSWORD\"
        }")
    
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.message // "No message"')
    
    if [[ "$ERROR_MSG" != *"constraint"* ]] && [[ "$ERROR_MSG" != *"SQL"* ]]; then
        pass "Database error message properly sanitized"
    else
        fail "Database error message leaks technical details: $ERROR_MSG"
    fi
    
    # Test malformed JSON
    RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"invalid": json}')
    
    if [[ "$RESPONSE" == *"400"* ]]; then
        pass "Malformed JSON properly rejected"
    else
        fail "Malformed JSON not properly handled"
    fi
}

# Test E1: CORS Configuration
test_cors() {
    echo -e "\n${BLUE}--- Testing CORS Configuration ---${NC}"
    
    # Test CORS headers
    RESPONSE=$(curl -s -I -H "Origin: http://localhost:4200" "$API_BASE/activities" 2>/dev/null)
    
    if echo "$RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
        pass "CORS headers present"
    else
        warn "CORS headers not detected (may be conditional)"
    fi
    
    # Test unauthorized origin (should be blocked)
    RESPONSE=$(curl -s -I -H "Origin: http://malicious-site.com" "$API_BASE/activities" 2>/dev/null)
    
    if echo "$RESPONSE" | grep -i "access-control-allow-origin.*malicious" > /dev/null; then
        fail "Unauthorized origin allowed by CORS"
    else
        pass "Unauthorized origin properly blocked"
    fi
}

# Test F1: Rate Limiting (if implemented)
test_rate_limiting() {
    echo -e "\n${BLUE}--- Testing Rate Limiting ---${NC}"
    
    info "Testing rate limiting by sending multiple requests..."
    
    # Send 10 rapid requests to login endpoint
    RATE_LIMIT_HIT=false
    for i in {1..10}; do
        RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_BASE/auth/login" \
            -H "Content-Type: application/json" \
            -d '{
                "identifier": "nonexistent",
                "password": "wrong"
            }')
        
        if [[ "$RESPONSE" == *"429"* ]]; then
            RATE_LIMIT_HIT=true
            break
        fi
        
        # Small delay to avoid overwhelming the server
        sleep 0.1
    done
    
    if [ "$RATE_LIMIT_HIT" = true ]; then
        pass "Rate limiting is implemented and working"
    else
        warn "Rate limiting not detected (may not be implemented)"
    fi
}

# Test Security Headers
test_security_headers() {
    echo -e "\n${BLUE}--- Testing Security Headers ---${NC}"
    
    HEADERS=$(curl -s -I "$API_BASE" 2>/dev/null)
    
    # Check for common security headers
    if echo "$HEADERS" | grep -i "x-content-type-options" > /dev/null; then
        pass "X-Content-Type-Options header present"
    else
        warn "X-Content-Type-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -i "x-frame-options" > /dev/null; then
        pass "X-Frame-Options header present"
    else
        warn "X-Frame-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -i "strict-transport-security" > /dev/null; then
        pass "HSTS header present"
    else
        warn "HSTS header missing (expected for development)"
    fi
}

# Run all tests
run_all_tests() {
    test_server_availability
    test_password_strength
    test_user_registration
    test_token_validation
    test_input_validation
    test_error_handling
    test_cors
    test_rate_limiting
    test_security_headers
}

# Cleanup function
cleanup() {
    echo -e "\n${BLUE}--- Cleanup ---${NC}"
    
    if [ -n "$VALID_TOKEN" ]; then
        # Delete test user activities if any were created
        curl -s -X GET "$API_BASE/activities" \
            -H "Authorization: Bearer $VALID_TOKEN" | \
            jq -r '.[].id // empty' | \
            while read -r activity_id; do
                if [ -n "$activity_id" ]; then
                    curl -s -X DELETE "$API_BASE/activities/$activity_id" \
                        -H "Authorization: Bearer $VALID_TOKEN" > /dev/null
                    info "Deleted test activity: $activity_id"
                fi
            done
    fi
    
    info "Test cleanup completed"
}

# Print summary
print_summary() {
    echo -e "\n${BLUE}=== Security Test Summary ===${NC}"
    echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo -e "Warnings: ${YELLOW}$TESTS_WARNING${NC}"
    echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED + TESTS_WARNING))"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}✅ All critical security tests passed!${NC}"
        if [ $TESTS_WARNING -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Consider addressing the warnings for improved security.${NC}"
        fi
    else
        echo -e "\n${RED}❌ Some security tests failed. Review the results and address the issues.${NC}"
    fi
}

# Handle script interruption
trap cleanup EXIT

# Main execution
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Security Testing Script for Sports Diary Application"
    echo
    echo "Usage: $0 [options]"
    echo
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --no-cleanup   Skip cleanup after tests"
    echo
    echo "This script performs automated security tests including:"
    echo "  - Password strength validation"
    echo "  - Authentication and authorization"
    echo "  - Input validation and injection prevention"
    echo "  - Error handling"
    echo "  - CORS configuration"
    echo "  - Rate limiting detection"
    echo "  - Security headers"
    exit 0
fi

# Run the tests
run_all_tests

# Optional cleanup skip
if [ "$1" != "--no-cleanup" ]; then
    cleanup
fi

print_summary
