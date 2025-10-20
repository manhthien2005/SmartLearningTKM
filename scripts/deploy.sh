#!/bin/bash

# SmartLearning Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed!"
        exit 1
    fi
    
    print_info "All requirements met ✓"
}

backup_database() {
    print_info "Creating database backup..."
    
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
    
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres smartlearning > $BACKUP_FILE
    
    print_info "Database backed up to: $BACKUP_FILE"
}

deploy_staging() {
    print_info "Deploying to STAGING environment..."
    
    # Pull latest code
    print_info "Pulling latest code from develop branch..."
    git pull origin develop
    
    # Stop containers
    print_info "Stopping containers..."
    docker-compose down
    
    # Build and start containers
    print_info "Building and starting containers..."
    docker-compose up -d --build
    
    # Wait for services to be ready
    print_info "Waiting for services to start..."
    sleep 10
    
    # Run migrations
    print_info "Running database migrations..."
    docker-compose exec -T backend npx prisma migrate deploy
    
    print_info "✓ Staging deployment completed!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend: http://localhost:5000"
}

deploy_production() {
    print_info "Deploying to PRODUCTION environment..."
    
    # Confirmation
    print_warning "You are about to deploy to PRODUCTION!"
    read -p "Are you sure? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        print_info "Deployment cancelled."
        exit 0
    fi
    
    # Backup database
    backup_database
    
    # Pull latest code
    print_info "Pulling latest code from main branch..."
    git pull origin main
    
    # Stop containers
    print_info "Stopping containers..."
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start containers
    print_info "Building and starting containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be ready
    print_info "Waiting for services to start..."
    sleep 15
    
    # Run migrations
    print_info "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy
    
    print_info "✓ Production deployment completed!"
}

show_logs() {
    print_info "Showing logs..."
    
    if [ "$1" == "production" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

health_check() {
    print_info "Running health check..."
    
    # Check backend
    if curl -f http://localhost:5000/health &> /dev/null; then
        print_info "✓ Backend is healthy"
    else
        print_error "✗ Backend is not responding"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_info "✓ Frontend is healthy"
    else
        print_error "✗ Frontend is not responding"
    fi
}

rollback() {
    print_warning "Rolling back deployment..."
    
    read -p "Are you sure you want to rollback? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        print_info "Rollback cancelled."
        exit 0
    fi
    
    # Reset to previous commit
    git reset --hard HEAD~1
    
    # Restart containers
    if [ "$1" == "production" ]; then
        docker-compose -f docker-compose.prod.yml restart
    else
        docker-compose restart
    fi
    
    print_info "✓ Rollback completed"
}

# Main script
case "$1" in
    staging)
        check_requirements
        deploy_staging
        ;;
    production)
        check_requirements
        deploy_production
        ;;
    logs)
        show_logs $2
        ;;
    health)
        health_check
        ;;
    rollback)
        rollback $2
        ;;
    backup)
        backup_database
        ;;
    *)
        echo "Usage: $0 {staging|production|logs|health|rollback|backup}"
        echo ""
        echo "Commands:"
        echo "  staging     - Deploy to staging environment"
        echo "  production  - Deploy to production environment"
        echo "  logs        - Show application logs"
        echo "  health      - Check application health"
        echo "  rollback    - Rollback to previous version"
        echo "  backup      - Backup database"
        exit 1
        ;;
esac

