#!/bin/bash

# Test Environment Variables Script
# Usage: ./scripts/test-env.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Required variables
REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "EMAIL_USER"
    "EMAIL_PASS"
    "NEXT_PUBLIC_API_URL"
)

# Optional variables
OPTIONAL_VARS=(
    "FRONTEND_URL"
    "SSH_PRIVATE_KEY"
    "SSH_USER"
    "SSH_HOST"
    "DEPLOY_PATH"
    "STAGING_PATH"
)

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

echo "========================================"
echo "Environment Variables Test"
echo "========================================"
echo ""

# Load .env if exists
if [ -f .env ]; then
    echo -e "${GREEN}[INFO]${NC} Loading .env file..."
    export $(cat .env | grep -v '^#' | xargs)
    echo ""
fi

# Check required variables
echo "Checking required variables:"
echo "----------------------------"
MISSING_COUNT=0

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        print_status 1 "$var is NOT set"
        ((MISSING_COUNT++))
    else
        # Check if value looks valid (not empty, not placeholder)
        if [[ "${!var}" == *"your-"* ]] || [[ "${!var}" == *"example"* ]]; then
            echo -e "${YELLOW}⚠${NC} $var is set but looks like a placeholder"
            ((MISSING_COUNT++))
        else
            print_status 0 "$var is set"
        fi
    fi
done
echo ""

# Check optional variables
echo "Checking optional variables:"
echo "----------------------------"
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${YELLOW}⚠${NC} $var is not set (optional)"
    else
        print_status 0 "$var is set"
    fi
done
echo ""

# Validate DATABASE_URL format
echo "Validating configuration:"
echo "-------------------------"
if [ ! -z "$DATABASE_URL" ]; then
    if [[ "$DATABASE_URL" =~ ^postgresql:// ]]; then
        print_status 0 "DATABASE_URL format looks valid"
    else
        print_status 1 "DATABASE_URL format is invalid (should start with postgresql://)"
        ((MISSING_COUNT++))
    fi
fi

# Validate JWT_SECRET length
if [ ! -z "$JWT_SECRET" ]; then
    if [ ${#JWT_SECRET} -ge 32 ]; then
        print_status 0 "JWT_SECRET length is sufficient (${#JWT_SECRET} chars)"
    else
        print_status 1 "JWT_SECRET is too short (should be at least 32 chars)"
        ((MISSING_COUNT++))
    fi
fi

# Validate EMAIL format
if [ ! -z "$EMAIL_USER" ]; then
    if [[ "$EMAIL_USER" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        print_status 0 "EMAIL_USER format is valid"
    else
        print_status 1 "EMAIL_USER format is invalid"
        ((MISSING_COUNT++))
    fi
fi

# Validate URLs
if [ ! -z "$NEXT_PUBLIC_API_URL" ]; then
    if [[ "$NEXT_PUBLIC_API_URL" =~ ^https?:// ]]; then
        print_status 0 "NEXT_PUBLIC_API_URL format is valid"
    else
        print_status 1 "NEXT_PUBLIC_API_URL should start with http:// or https://"
        ((MISSING_COUNT++))
    fi
fi

echo ""
echo "========================================"

if [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "========================================"
    exit 0
else
    echo -e "${RED}✗ Found $MISSING_COUNT issues${NC}"
    echo "========================================"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    echo "Need help? Check:"
    echo "  - GITLAB_VARIABLES.md for variable setup"
    echo "  - env.example for examples"
    exit 1
fi

