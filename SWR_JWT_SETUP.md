# SWR & JWT Authentication Setup

## What I've Set Up

### 1. **Cookie Management** (`lib/cookies.ts`)
- `setToken(token)` - Saves JWT to secure cookie with 7-day expiration
- `getToken()` - Retrieves token from cookie
- `removeToken()` - Clears token on logout
- `hasToken()` - Checks if token exists

### 2. **API Client** (`lib/api.ts`)
- **SWR Fetcher**: Automatically includes JWT in `Authorization: Bearer <token>` header
- **Axios Instance**: Pre-configured with interceptors that:
  - Add JWT to all requests
  - Handle 401 errors (unauthorized)
  - Redirect to login on token expiration

### 3. **Auth Store** (`store/authstore.ts`)
- Zustand store managing authentication state
- Methods: `setToken()`, `logout()`, `initializeAuth()`

### 4. **Auth Provider** (`components/providers/auth-provider.tsx`)
- Restores token from cookies on app startup
- Wraps entire app in layout

### 5. **Updated Login Form**
- Sends credentials to `/api/login`
- Saves returned JWT token to cookie
- Redirects to home on success
- Shows toast notifications

## Usage Examples

### Using SWR for Data Fetching
```tsx
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';

export function MyComponent() {
  const { data, error, isLoading } = useSWR(
    '/api/protected-endpoint',
    swrFetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Using Axios Client
```tsx
import apiClient from '@/lib/api';

const response = await apiClient.get('/api/data');
const data = response.data;
```

### Logging Out
```tsx
import { useAuth } from '@/store/authstore';

export function LogoutButton() {
  const logout = useAuth((state) => state.logout);
  
  return <button onClick={logout}>Logout</button>;
}
```

### Checking Auth State
```tsx
import { useAuth } from '@/store/authstore';

export function Profile() {
  const { token, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? <p>Logged in</p> : <p>Not logged in</p>}
    </div>
  );
}
```

## Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Security Notes
- Token is stored in a cookie with `secure` flag in production
- `httpOnly: false` (set to `true` if using server-side cookie management)
- `sameSite: 'strict'` prevents CSRF attacks
