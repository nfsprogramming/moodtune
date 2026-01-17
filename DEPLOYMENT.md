# 🚀 MoodTune - Deployment Guide

**Copyright (c) 2026 NFS Programming**

This guide will help you deploy MoodTune to production environments.

---

## 📋 Pre-Deployment Checklist

- [x] All unwanted files removed
- [x] `__pycache__` directories cleaned
- [x] `.gitignore` file added
- [x] Copyright headers in all files
- [x] MIT License added
- [x] Documentation complete
- [x] No syntax errors
- [x] Dependencies listed in requirements.txt

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### **Frontend Deployment (Vercel)**

1. **Build the frontend:**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

3. **Environment Variables:**
- Set `VITE_API_URL` to your backend URL

#### **Backend Deployment (Render)**

1. **Create `Procfile`:**
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

2. **Update `requirements.txt`:**
```bash
pip freeze > requirements.txt
```

3. **Deploy to Render:**
- Connect your GitHub repository
- Select "Web Service"
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables:**
- None required (all hardcoded for now)

---

### Option 2: Railway (Full Stack)

1. **Create `railway.json`:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Deploy:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

### Option 3: Docker (Self-Hosted)

#### **Backend Dockerfile:**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install yt-dlp
RUN pip install yt-dlp

COPY . .

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### **docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

---

## 🔧 Production Configuration

### **Update API URL in Frontend**

Edit `frontend/src/App.jsx`:

```javascript
// Change from:
const API_URL = "http://localhost:8000"

// To:
const API_URL = import.meta.env.VITE_API_URL || "https://your-backend.com"
```

### **CORS Configuration**

Update `server.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],  # Specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📦 Build Commands

### **Frontend Build**
```bash
cd ModernFrontend
npm install
npm run build
# Output: dist/ folder
```

### **Backend Requirements**
```bash
pip install -r requirements.txt
```

---

## 🌍 Environment Variables

### **Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.com
```

### **Backend (.env)** *(Optional)*
```env
PORT=8000
ENVIRONMENT=production
```

---

## 🔒 Security Considerations

1. **API Rate Limiting**: Add rate limiting to prevent abuse
2. **CORS**: Restrict to specific domains in production
3. **HTTPS**: Always use HTTPS in production
4. **API Keys**: Store sensitive keys in environment variables
5. **Input Validation**: Already implemented in FastAPI

---

## 📊 Performance Optimization

### **Frontend**
- ✅ Code splitting (Vite default)
- ✅ Lazy loading images
- ✅ Minified CSS/JS
- ✅ Gzip compression (server-side)

### **Backend**
- ✅ Async endpoints (FastAPI)
- ✅ Concurrent iTunes API calls
- ✅ Caching (add Redis for production)

---

## 🧪 Testing Before Deployment

### **Backend Tests**
```bash
# Test API endpoints
curl http://localhost:8000/
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I am happy", "model": "simple"}'
```

### **Frontend Tests**
```bash
cd ModernFrontend
npm run build
npm run preview
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend accessible via HTTPS
- [ ] Backend API responding
- [ ] CORS configured correctly
- [ ] All features working (emotion detection, music playback)
- [ ] YouTube audio extraction working
- [ ] iTunes API fetching cover art
- [ ] Error handling working
- [ ] Mobile responsive
- [ ] Performance optimized

---

## 🐛 Troubleshooting

### **Issue: CORS Error**
**Solution**: Update `allow_origins` in `server.py` to include your frontend domain

### **Issue: YouTube Audio Not Playing**
**Solution**: Ensure `yt-dlp` is installed on the server:
```bash
pip install yt-dlp
```

### **Issue: iTunes API Rate Limit**
**Solution**: Add caching or reduce concurrent requests

### **Issue: Build Fails**
**Solution**: Check Node.js version (requires 16+)

---

## 📞 Support

**Developer**: NFS Programming  
**Email**: mohammed.nifras.000555@gmail.com  
**GitHub**: @nfsprogramming

---

## 📄 License

This project is licensed under the MIT License.  
See `LICENSE` file for details.

---

**Ready for deployment! 🚀**

*Last Updated: January 18, 2026*
