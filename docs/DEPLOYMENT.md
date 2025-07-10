# 🚀 Deployment Guide

## Overview

This guide covers various deployment options for the Nexus Student Management System, from development to production environments.

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git
- Modern web browser

## 🏗️ Build Process

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Build Analysis
```bash
npm run analyze
```

## 🌐 Deployment Options

### 1. GitHub Pages (Recommended for Demo)

#### Automatic Deployment
The project includes GitHub Actions for automatic deployment:

```yaml
# .github/workflows/ci.yml handles automatic deployment
# Push to main branch triggers deployment
```

#### Manual Deployment
```bash
npm run build
npm run deploy
```

### 2. Netlify

#### Via Git Integration
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

#### Via CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

### 3. Vercel

#### Via CLI
```bash
npm install -g vercel
vercel --prod
```

#### Via Git Integration
1. Connect repository to Vercel
2. Auto-deploy on push to main branch

### 4. AWS S3 + CloudFront

#### Setup S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html
```

#### Deploy to S3
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
```

#### CloudFront Distribution
```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 5. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run
```bash
docker build -t nexus-sms .
docker run -p 80:80 nexus-sms
```

### 6. Kubernetes Deployment

#### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus-sms
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexus-sms
  template:
    metadata:
      labels:
        app: nexus-sms
    spec:
      containers:
      - name: nexus-sms
        image: nexus-sms:latest
        ports:
        - containerPort: 80
```

#### service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nexus-sms-service
spec:
  selector:
    app: nexus-sms
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔧 Environment Configuration

### Environment Variables
```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### Build Optimization
```json
{
  "scripts": {
    "build:analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'",
    "build:prod": "GENERATE_SOURCEMAP=false npm run build"
  }
}
```

## 📊 Performance Optimization

### Bundle Analysis
```bash
npm run analyze
```

### Code Splitting
- Lazy loading implemented for all routes
- Dynamic imports for heavy components
- Chunk optimization for better caching

### Caching Strategy
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
}
```

## 🔒 Security Configuration

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               font-src 'self' fonts.gstatic.com;">
```

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 📈 Monitoring & Analytics

### Performance Monitoring
```javascript
// reportWebVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking
```javascript
// Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Routing Issues (SPA)
```nginx
# nginx.conf for SPA routing
location / {
    try_files $uri $uri/ /index.html;
}
```

### Health Checks
```bash
# Check build size
npm run build
du -sh build/

# Check for vulnerabilities
npm audit
npm audit fix
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build process tested
- [ ] Security headers implemented
- [ ] Performance optimized
- [ ] Error tracking configured
- [ ] Monitoring setup
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Backup strategy implemented
- [ ] Rollback plan prepared

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

## 📞 Support

For deployment issues or questions:
- Create an issue on GitHub
- Contact: parth@example.com
- Documentation: [docs/](../docs/)

---

**Developed by [Parth Rai](https://github.com/IMFParth)**