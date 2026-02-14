# Deployment Guide for Fullstack Todo App

This guide explains how to properly deploy the fullstack todo application to Vercel (frontend) and Railway (backend).

## Backend Deployment (Railway)

### Environment Variables Required:

```
DATABASE_URL=your_neon_database_url
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=production
FRONTEND_URL=https://your-frontend-url.vercel.app  # Replace with your actual frontend URL
```

### Deployment Steps:

1. Connect your GitHub repository to Railway
2. Add the environment variables listed above
3. Deploy the application

## Frontend Deployment (Vercel)

### Environment Variables Required:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-railway-url.up.railway.app  # Replace with your actual backend URL
```

### Deployment Steps:

1. Connect your GitHub repository to Vercel
2. Add the environment variable listed above
3. Deploy the application

## Important Notes:

1. The `FRONTEND_URL` in the backend environment variables should match the URL of your deployed frontend
2. The `NEXT_PUBLIC_API_BASE_URL` in the frontend should point to your deployed backend
3. Both applications must be deployed for the fullstack app to work properly
4. The CORS configuration in the backend allows communication between the deployed frontend and backend

## Troubleshooting:

If you encounter "Network error" or CORS issues:
1. Verify that the `FRONTEND_URL` in your backend matches your deployed frontend URL
2. Verify that the `NEXT_PUBLIC_API_BASE_URL` in your frontend points to your deployed backend
3. Check that both applications are properly deployed and accessible
4. Ensure that your Neon database connection is working properly in the deployed backend