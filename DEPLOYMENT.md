# Legal Advice ChatBot Portal - Deployment Documentation

This document provides complete instructions for deploying the Legal Advice ChatBot Portal to a DigitalOcean Droplet using Docker and GitHub Actions CI/CD.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Docker Configuration](#docker-configuration)
5. [GitHub Actions CI/CD](#github-actions-cicd)
6. [Droplet Setup](#droplet-setup)
7. [Nginx Reverse Proxy](#nginx-reverse-proxy)
8. [SSL/HTTPS Configuration](#sslhttps-configuration)
9. [DNS Configuration](#dns-configuration)
10. [Deployment Workflow](#deployment-workflow)
11. [Maintenance & Troubleshooting](#maintenance--troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DigitalOcean Droplet                        │
│                     IP: 178.128.170.16                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Nginx (Host) - Port 80/443              │   │
│  │                 Reverse Proxy + SSL Termination         │   │
│  └─────────────────┬───────────────────────┬───────────────┘   │
│                    │                       │                    │
│                    ▼                       ▼                    │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  Angular Frontend       │  │  .NET API Backend           │  │
│  │  Container: legal-      │  │  Container: nsembot-api     │  │
│  │  advice-chatbot         │  │                             │  │
│  │  Internal Port: 3000    │  │  Internal Port: 8122        │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Traffic Flow:
- https://nsembot.com/     → Nginx → Frontend (port 3000)
- https://nsembot.com/api/ → Nginx → Backend API (port 8122)
```

---

## Prerequisites

### Local Development Machine
- Node.js 20.x or higher
- npm 10.x or higher
- Docker Desktop (optional, for local testing)
- Git

### DigitalOcean Droplet
- Ubuntu 22.04 LTS (or later)
- Minimum 1GB RAM, 1 vCPU
- Docker installed
- Nginx installed

### GitHub
- Repository with Actions enabled
- Personal Access Token (PAT) with `read:packages` and `write:packages` scopes

### Domain
- Domain name (e.g., nsembot.com)
- Access to DNS management

---

## Project Structure

```
LegalAdviceChatBotPortal/
├── .github/
│   └── workflows/
│       └── deploy-docker-droplet.yml    # CI/CD pipeline
├── src/                                  # Angular source code
│   ├── app/
│   ├── assets/
│   └── index.html
├── Dockerfile                            # Multi-stage Docker build
├── docker-compose.yml                    # Docker Compose config
├── nginx.conf                            # Nginx config for container
├── nginx-ssl.conf                        # Nginx SSL config (reference)
├── .dockerignore                         # Docker build exclusions
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Docker Configuration

### Dockerfile

The application uses a multi-stage Docker build for optimal image size:

```dockerfile
# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist/legal-advice-chat-bot-portal/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf (Container)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    # Handle Angular routing - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### .dockerignore

```
node_modules
dist
docs
.git
.gitignore
.vscode
.idea
*.md
.github
coverage
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: legal-advice-chatbot
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## GitHub Actions CI/CD

### Workflow File: `.github/workflows/deploy-docker-droplet.yml`

```yaml
name: Deploy to DigitalOcean Droplet (Docker)

on:
  push:
    branches: [main]
  workflow_dispatch: # Allow manual trigger

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Deploy to DigitalOcean Droplet
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Log in to GitHub Container Registry
            echo ${{ secrets.GHCR_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            
            # Pull the latest image
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            
            # Stop and remove existing container (if exists)
            docker stop legal-advice-chatbot || true
            docker rm legal-advice-chatbot || true
            
            # Run new container
            docker run -d \
              --name legal-advice-chatbot \
              --restart unless-stopped \
              -p 3000:80 \
              ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            
            # Clean up old images
            docker image prune -f
```

### Required GitHub Secrets

Navigate to: **Repository → Settings → Secrets and variables → Actions**

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DROPLET_IP` | Droplet's public IP address | `178.128.170.16` |
| `DROPLET_USER` | SSH username | `root` |
| `SSH_PRIVATE_KEY` | Private SSH key for authentication | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `GHCR_TOKEN` | GitHub PAT with `read:packages` scope | `ghp_xxxxxxxxxxxx` |

### Generating SSH Keys

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copy public key to droplet
ssh-copy-id -i ~/.ssh/github_deploy.pub root@178.128.170.16

# Get private key content (add to SSH_PRIVATE_KEY secret)
cat ~/.ssh/github_deploy
```

### Generating GitHub PAT

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Select scopes: `read:packages`, `write:packages`
4. Copy the token and save as `GHCR_TOKEN` secret

---

## Droplet Setup

### Initial Server Setup

```bash
# SSH into droplet
ssh root@178.128.170.16

# Update system packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Configure firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Verify Docker Installation

```bash
docker --version
docker ps
```

---

## Nginx Reverse Proxy

### Configuration: `/etc/nginx/sites-available/nsembot.com`

```nginx
server {
    listen 80;
    server_name nsembot.com www.nsembot.com;

    # Backend API - handle /api/ routes
    location /api/ {
        proxy_pass http://127.0.0.1:8122;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Frontend - Angular App (all other routes)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the Site

```bash
# Create symlink to enable site
ln -sf /etc/nginx/sites-available/nsembot.com /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## SSL/HTTPS Configuration

### Obtain SSL Certificate

```bash
# Get certificate from Let's Encrypt
certbot --nginx -d nsembot.com

# Or with www subdomain (requires DNS record for www)
certbot --nginx -d nsembot.com -d www.nsembot.com
```

### Verify Auto-Renewal

```bash
# Test renewal process
certbot renew --dry-run

# Check certbot timer
systemctl status certbot.timer
```

### Final Nginx Config with SSL

After running certbot, the config is automatically updated to:

```nginx
server {
    listen 80;
    server_name nsembot.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name nsembot.com;

    ssl_certificate /etc/letsencrypt/live/nsembot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nsembot.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8122;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## DNS Configuration

### Required DNS Records

Configure these at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `178.128.170.16` | 300 |
| **A** | `www` | `178.128.170.16` | 300 (optional) |

### Verify DNS

```bash
# Check A record
dig nsembot.com A

# Check www subdomain
dig www.nsembot.com A

# Or using nslookup
nslookup nsembot.com
```

---

## Deployment Workflow

### Automatic Deployment

1. Push changes to `main` branch
2. GitHub Actions automatically:
   - Builds Docker image
   - Pushes to GitHub Container Registry
   - SSHs into droplet
   - Pulls and runs new container

### Manual Deployment

```bash
# SSH into droplet
ssh root@178.128.170.16

# Pull latest image
docker pull ghcr.io/kwabenaowusujnr/legaladvicechatbotportal:latest

# Stop and remove old container
docker stop legal-advice-chatbot
docker rm legal-advice-chatbot

# Run new container
docker run -d \
  --name legal-advice-chatbot \
  --restart unless-stopped \
  -p 3000:80 \
  ghcr.io/kwabenaowusujnr/legaladvicechatbotportal:latest
```

### Manual Trigger via GitHub

1. Go to **Repository → Actions**
2. Select **Deploy to DigitalOcean Droplet (Docker)**
3. Click **Run workflow**

---

## Maintenance & Troubleshooting

### Common Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs legal-advice-chatbot
docker logs -f legal-advice-chatbot  # Follow logs

# Restart container
docker restart legal-advice-chatbot

# Stop container
docker stop legal-advice-chatbot

# Remove container
docker rm legal-advice-chatbot

# Check disk usage
docker system df

# Clean up unused images
docker image prune -f
docker system prune -f
```

### Nginx Commands

```bash
# Check Nginx status
systemctl status nginx

# View Nginx error logs
tail -50 /var/log/nginx/error.log

# View Nginx access logs
tail -50 /var/log/nginx/access.log

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx

# Reload Nginx (without downtime)
systemctl reload nginx
```

### SSL Commands

```bash
# Check certificate expiry
certbot certificates

# Manually renew certificate
certbot renew

# Test renewal
certbot renew --dry-run
```

### Debugging

```bash
# Check what's listening on ports
ss -tlnp | grep -E ':80|:443|:3000|:8122'

# Test frontend container
curl http://127.0.0.1:3000

# Test API
curl http://127.0.0.1:8122/api/Health

# Test through Nginx
curl -I https://nsembot.com

# Check DNS resolution
dig nsembot.com
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Site shows "Welcome to nginx!" | Host Nginx default page | Ensure site config is enabled and default is removed |
| Container not found | Container wasn't started | Pull and run the container manually |
| 502 Bad Gateway | Backend container not running | Check `docker ps` and restart container |
| SSL certificate error | Certificate expired or not installed | Run `certbot --nginx -d nsembot.com` |
| GitHub Actions failing | Missing secrets | Verify all secrets are configured correctly |
| DNS not resolving | DNS not configured | Add A record at domain registrar |

### Monitoring

Consider setting up:
- **UptimeRobot** - Free uptime monitoring
- **DigitalOcean Monitoring** - Built-in metrics
- **Datadog/New Relic** - Advanced APM

---

## Quick Reference

### URLs
- **Production Site**: https://nsembot.com
- **API Base**: https://nsembot.com/api
- **GitHub Container Registry**: ghcr.io/kwabenaowusujnr/legaladvicechatbotportal

### Ports
| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Frontend | 80 | 3000 |
| Backend API | 44411 | 8122 |
| Nginx HTTP | - | 80 |
| Nginx HTTPS | - | 443 |

### Container Names
- Frontend: `legal-advice-chatbot`
- Backend: `deploy-nsembot-backend-service-1`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-03 | 1.0.0 | Initial Docker deployment setup |

---

*Documentation generated: February 3, 2026*
