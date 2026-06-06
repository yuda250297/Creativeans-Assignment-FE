# Google OAuth + JWT Integration Setup

## Overview
This project now integrates Google OAuth with JWT token-based authentication. Users can sign in either with email/password (credentials provider) or with their Google account.

## Architecture

```
┌─────────────────────────────────────────┐
│       Authentication Flow              │
├─────────────────────────────────────────┤
│                                         │
│  User → Login Form                      │
│  ├── Credentials (email/password)       │
│  │   └── Backend /api/login             │
│  │       └── Returns JWT token          │
│  │       └── Save to cookie             │
│  │                                      │
│  └── Google OAuth                       │
│      └── NextAuth signIn("google")      │
│      └── Backend /api/auth/google       │
│      └── Returns JWT token              │
│      └── Save to cookie                 │
│                                         │
│  Token stored in authToken cookie       │
│  Synced with Zustand store              │
│  Included in all API requests           │
└─────────────────────────────────────────┘
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install next-auth@^4
```

### 2. Google OAuth Credentials

#### Create Google OAuth App:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 3. Environment Variables

Create `.env.local` (copy from `.env.local.example`):

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Backend API Endpoints Required

Your backend must implement these endpoints:

#### **POST /api/login** (Credentials)
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

#### **POST /api/auth/google** (Google OAuth)
```json
Request:
{
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://...",
  "googleId": "google_oauth_id_123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://..."
  }
}
```

## File Structure

```
lib/
├── auth.ts              ← NextAuth configuration
├── api.ts               ← API client with JWT
└── cookies.ts           ← Cookie management

app/
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts ← NextAuth API route

components/
└── providers/
    └── auth-provider.tsx ← SessionProvider + Auth sync

app/
└── login/
    └── login-form.tsx   ← Email/password + Google OAuth

store/
└── authstore.ts         ← Zustand auth store
```

## Usage

### Sign In with Credentials
```tsx
import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return <LoginForm />;
}
```

### Sign In with Google
```tsx
import { signIn } from "next-auth/react";

async function handleGoogleSignIn() {
  await signIn("google", { redirect: false });
}
```

### Get Current Session
```tsx
import { useSession } from "next-auth/react";

export function Profile() {
  const { data: session } = useSession();
  
  return <div>{session?.user?.email}</div>;
}
```

### Get JWT Token
```tsx
import { useAuth } from "@/store/authstore";

export function MyComponent() {
  const token = useAuth((state) => state.token);
  
  return <div>{token}</div>;
}
```

### Sign Out
```tsx
import { signOut } from "next-auth/react";
import { useAuth } from "@/store/authstore";

export function LogoutButton() {
  const logout = useAuth((state) => state.logout);
  
  async function handleLogout() {
    logout();
    await signOut();
  }
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## Security Notes

1. **NEXTAUTH_SECRET**: Must be a strong random string (use openssl)
2. **JWT Token**: Stored in secure cookie with:
   - `secure: true` (HTTPS only in production)
   - `httpOnly: false` (accessible to frontend)
   - `sameSite: 'strict'` (CSRF protection)
   - 7-day expiration

3. **Google OAuth**: Only enabled with valid CLIENT_ID and CLIENT_SECRET
4. **Token Validation**: Always validate JWT on backend before granting access

## Troubleshooting

### "Invalid `provider` error"
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Check `.env.local` exists in root directory

### Google redirect URI error
- Add `http://localhost:3000/api/auth/callback/google` to Google OAuth redirect URIs
- In production, update to your domain: `https://yourdomain.com/api/auth/callback/google`

### Session not persisting
- Check cookie storage in browser DevTools
- Verify `authToken` cookie is set
- Ensure `NEXTAUTH_SECRET` is configured

### API requests 401 Unauthorized
- Token might be expired (7-day expiration)
- Verify JWT is included in `Authorization: Bearer <token>` header
- Check backend token validation

## Next Steps

1. Generate NEXTAUTH_SECRET and add to `.env.local`
2. Get Google OAuth credentials
3. Create backend `/api/login` and `/api/auth/google` endpoints
4. Test email/password login
5. Test Google OAuth login
6. Deploy to production with HTTPS
