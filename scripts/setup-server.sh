#!/bin/bash

# SmartLearning Server Setup Script
# Usage: ./scripts/setup-server.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_info "========================================"
print_info "SmartLearning Server Setup"
print_info "========================================"

# Update system
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_info "✓ Docker installed"
else
    print_info "✓ Docker already installed"
fi

# Install Docker Compose
print_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_info "✓ Docker Compose installed"
else
    print_info "✓ Docker Compose already installed"
fi

# Create deploy user
print_info "Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    sudo adduser --disabled-password --gecos "" deploy
    sudo usermod -aG docker deploy
    sudo usermod -aG sudo deploy
    print_info "✓ Deploy user created"
else
    print_info "✓ Deploy user already exists"
fi

# Create deployment directories
print_info "Creating deployment directories..."
sudo mkdir -p /var/www/smartlearning
sudo mkdir -p /var/www/smartlearning-staging
sudo chown -R deploy:deploy /var/www/smartlearning
sudo chown -R deploy:deploy /var/www/smartlearning-staging
print_info "✓ Directories created"

# Setup firewall
print_info "Configuring firewall..."
if ! command -v ufw &> /dev/null; then
    sudo apt install ufw -y
fi

sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 5000/tcp  # Backend
sudo ufw --force enable
print_info "✓ Firewall configured"

# Install additional tools
print_info "Installing additional tools..."
sudo apt install -y git curl wget nano vim htop

# Display versions
print_info "========================================"
print_info "Installation Summary:"
print_info "========================================"
docker --version
docker-compose --version
git --version

print_info "========================================"
print_info "✓ Server setup completed!"
print_info "========================================"
print_warning "Please log out and log back in for group changes to take effect"
print_info "Next steps:"
print_info "1. Setup SSH keys for deployment"
print_info "2. Clone repository to /var/www/smartlearning"
print_info "3. Create .env file with production credentials"
print_info "4. Run initial deployment"

