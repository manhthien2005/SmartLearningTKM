#!/bin/bash

# SmartLearning Health Check Script
# Usage: ./scripts/health-check.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

print_info() {
    echo -e "${YELLOW}[CHECK]${NC} $1"
}

echo "========================================"
echo "SmartLearning Health Check"
echo "========================================"
echo ""

# Check Docker
print_info "Checking Docker..."
if docker ps &> /dev/null; then
    print_status 0 "Docker is running"
else
    print_status 1 "Docker is not running"
fi
echo ""

# Check containers
print_info "Checking containers..."
BACKEND_RUNNING=$(docker ps --filter "name=smartlearning-backend" --format "{{.Names}}" | wc -l)
FRONTEND_RUNNING=$(docker ps --filter "name=smartlearning-frontend" --format "{{.Names}}" | wc -l)
POSTGRES_RUNNING=$(docker ps --filter "name=smartlearning-db" --format "{{.Names}}" | wc -l)

print_status $((1-BACKEND_RUNNING)) "Backend container is running"
print_status $((1-FRONTEND_RUNNING)) "Frontend container is running"
print_status $((1-POSTGRES_RUNNING)) "PostgreSQL container is running"
echo ""

# Check backend health
print_info "Checking Backend API..."
if curl -f -s http://localhost:5000/health &> /dev/null; then
    print_status 0 "Backend API is responding"
    
    # Get response
    RESPONSE=$(curl -s http://localhost:5000/health)
    echo "  Response: $RESPONSE"
else
    print_status 1 "Backend API is not responding"
fi
echo ""

# Check frontend
print_info "Checking Frontend..."
if curl -f -s http://localhost:3000 &> /dev/null; then
    print_status 0 "Frontend is responding"
else
    print_status 1 "Frontend is not responding"
fi
echo ""

# Check database connection
print_info "Checking Database connection..."
if docker exec smartlearning-backend-prod npx prisma db push --skip-generate &> /dev/null 2>&1 || \
   docker exec smartlearning-backend npx prisma db push --skip-generate &> /dev/null 2>&1; then
    print_status 0 "Database is accessible"
else
    print_status 1 "Database connection failed"
fi
echo ""

# Check disk space
print_info "Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    print_status 0 "Disk usage: ${DISK_USAGE}%"
else
    print_status 1 "Disk usage is high: ${DISK_USAGE}%"
fi
echo ""

# Check memory
print_info "Checking memory..."
MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEM_USAGE -lt 90 ]; then
    print_status 0 "Memory usage: ${MEM_USAGE}%"
else
    print_status 1 "Memory usage is high: ${MEM_USAGE}%"
fi
echo ""

# Container stats
print_info "Container resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || true
echo ""

echo "========================================"
echo "Health check completed"
echo "========================================"

