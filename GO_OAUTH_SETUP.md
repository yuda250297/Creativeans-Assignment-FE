# Go Backend OAuth Integration

## Overview
Google OAuth is now processed entirely in your Go backend. The frontend simply:
1. Initiates the OAuth flow by redirecting to the backend
2. Receives the token via redirect and stores it
3. Redirects to the home page

## Architecture

```
┌─────────────────────────────────────────┐
│       Authentication Flow               │
├─────────────────────────────────────────┤
│                                         │
│  User → Login Form                      │
│  ├── Credentials (email/password)       │
│  │   └── Frontend POST /api/login       │
│  │       └── Backend returns JWT        │
│  │       └── Save to cookie             │
│  │                                      │
│  └── Google OAuth                       │
│      └── Frontend redirects to          │
│          Go Backend /api/oauth/google   │
│      └── Backend handles OAuth          │
│      └── Backend redirects to           │
│          Frontend /auth/callback        │
│      └── Frontend stores token          │
│      └── Redirect to home               │
│                                         │
│  Token stored in authToken cookie       │
│  Synced with Zustand store              │
│  Included in all API requests           │
└─────────────────────────────────────────┘
```

## Frontend Setup

### Environment Variables
```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:3031
NEXT_PUBLIC_OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_MAPBOX_TOKEN=your_token
```

### Files Changed
- **lib/auth.ts**: Removed NextAuth, added `initiateGoogleOAuth()` function
- **app/login/login-form.tsx**: Updated Google button to use `initiateGoogleOAuth()`
- **app/auth/callback/page.tsx**: New page that handles OAuth redirect from Go backend
- **app/layout.tsx**: Removed `SessionProvider` (NextAuth not needed)
- **components/providers/auth-provider.tsx**: Simplified to just restore token from cookies
- **app/api/auth/[...nextauth]/route.ts**: Now empty (deprecated)

## Go Backend Required Endpoints

### **POST /api/oauth/google?redirect_uri=...**
Initiates Google OAuth flow. The backend should:
1. Accept `redirect_uri` query parameter
2. Redirect user to Google's OAuth consent screen
3. Handle Google's callback
4. Exchange auth code for token
5. Redirect back to `{redirect_uri}?token={jwt_token}`

Example flow:
```
Frontend                          Go Backend                    Google
   │                                  │                            │
   ├─ Redirect to /api/oauth/google ──>│                            │
   │                                  │                            │
   │                                  ├─ Redirect to OAuth consent →│
   │                                  │                            │
   │ (User logs in and authorizes)    │                            │
   │                                  │ ← Callback with code ───────│
   │                                  │                            │
   │                                  ├─ Exchange code for token ───→
   │                                  │                            │
   │ ← Redirect with token ───────────┤                            │
   │                                  │                            │
```

### **POST /api/login**
Existing credentials endpoint:
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  }
}
```

## How It Works

### User Clicks "Sign in with Google"
1. Frontend calls `initiateGoogleOAuth()`
2. Redirects to `{NEXT_PUBLIC_API_URL}/api/oauth/google?redirect_uri=http://localhost:3000/auth/callback`

### Go Backend Processes OAuth
1. Receives redirect_uri parameter
2. Initiates Google OAuth flow
3. Handles user authorization
4. Exchanges code for Google token
5. Creates or retrieves user in database
6. Generates JWT token
7. Redirects to `{redirect_uri}?token={jwt_token}`

### Frontend Receives Token
1. OAuth callback page at `/auth/callback` receives the redirect
2. Extracts `token` from URL query parameters
3. Stores token in cookies via `setToken(token)`
4. Updates Zustand auth state
5. Redirects to home page

## Common Issues

### Callback Page Not Reached
- Ensure Go backend redirects to exact URL: `http://localhost:3000/auth/callback?token=...`
- Check that `NEXT_PUBLIC_API_URL` matches your Go backend URL
- Verify Go backend is configured to redirect to frontend (not process callback itself)

### Token Not Being Used
- Ensure `getAuthHeaders()` is called in API requests
- Check that `authCookies.setToken()` is being called correctly
- Verify token is in cookies after redirect

### CORS Issues
- Go backend must allow requests from `http://localhost:3000`
- Add CORS headers for authentication endpoints
