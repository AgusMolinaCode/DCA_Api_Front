# Clerk Frontend Setup Guide

Your Next.js frontend is now configured with Clerk authentication! Here's what has been set up and how to use it.

## ✅ What's Been Configured

### 1. Environment Variables
Added to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3dlZXQtc3RhZy0xNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PxzXhWGCoJGcxqJS32P26CHkflyjZPPsZbU6U6Gc4G
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_API_URL=https://dcaapi-production-up.railway.app
```

### 2. Clerk Provider
- Added `ClerkProvider` to your root layout (`app/layout.tsx`)
- All authentication features are now available throughout your app

### 3. Authentication Pages
- **Sign In**: `/sign-in` - Beautiful Clerk sign-in component
- **Sign Up**: `/sign-up` - Beautiful Clerk sign-up component

### 4. Components Created
- **ClerkNavbar** - New navbar with Clerk authentication
- **ClerkProtectedRoute** - Route protection using Clerk
- **ClerkApiTest** - Test component for API integration

### 5. API Integration
- **useApiClient** hook - Automatically includes Clerk JWT tokens
- **createApiClient** function - For server-side API calls

## 🚀 How to Use

### Step 1: Install Clerk SDK
```bash
npm install @clerk/nextjs
```

### Step 2: Switch to Clerk Components
Replace your current navbar in `app/layout.tsx`:

```tsx
// Instead of:
import { Navbar } from "@/components/Navbar";

// Use:
import { ClerkNavbar } from "@/components/ClerkNavbar";

// And in the JSX:
<ClerkNavbar />
```

### Step 3: Update Dashboard Protection
In `app/dashboard/layout.tsx`, replace the existing protection:

```tsx
// Instead of:
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Use:
import { ClerkProtectedRoute } from "@/components/auth/ClerkProtectedRoute";

// And wrap with:
<ClerkProtectedRoute>
  {children}
</ClerkProtectedRoute>
```

### Step 4: Update API Calls
Replace your existing API calls with the new Clerk-authenticated client:

```tsx
import { useApiClient } from '@/lib/api-client';

function MyComponent() {
  const apiClient = useApiClient();
  
  const fetchData = async () => {
    try {
      // This automatically includes the Clerk JWT token
      const data = await apiClient.get('/dashboard');
      console.log(data);
    } catch (error) {
      console.error('API error:', error);
    }
  };
}
```

## 🧪 Testing the Integration

### 1. Add Test Component to Dashboard
Add this to your dashboard page for testing:

```tsx
import { ClerkApiTest } from '@/components/test/ClerkApiTest';

export default function DashboardPage() {
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* Add this for testing */}
      <ClerkApiTest />
    </div>
  );
}
```

### 2. Test the Complete Flow
1. **Start your frontend**: `npm run dev`
2. **Visit**: `http://localhost:3000`
3. **Click "Registrarse"** to sign up
4. **Complete registration** through Clerk
5. **Get redirected** to `/dashboard`
6. **Run API tests** using the ClerkApiTest component

## 🔄 Migration Strategy

### Phase 1: Test Clerk (Current)
- Keep both authentication systems running
- Test Clerk with the new components
- Verify webhook creates users in your database

### Phase 2: Switch to Clerk
```tsx
// In app/layout.tsx, replace:
<Navbar />
// With:
<ClerkNavbar />

// In app/dashboard/layout.tsx, replace:
<ProtectedRoute>
// With:
<ClerkProtectedRoute>
```

### Phase 3: Update All API Calls
Replace all fetch calls with the new `useApiClient` hook.

## 🎯 Expected Results

After setup, when a user:

1. **Signs up through Clerk** → Webhook creates user in your database
2. **Signs in** → Gets Clerk JWT token
3. **Accesses dashboard** → Token is verified by your API
4. **Makes API calls** → Token is automatically included

## 🔧 Troubleshooting

### Common Issues

1. **"Token inválido" errors**
   - Check that webhook is working
   - Verify user exists in your database
   - Check Clerk keys in `.env.local`

2. **Redirect loops**
   - Clear browser storage
   - Check that sign-in/sign-up URLs are correct

3. **API calls failing**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check that your backend is running
   - Test with the ClerkApiTest component

### Debugging Steps

1. Check browser console for errors
2. Verify webhook logs in your backend
3. Test API endpoints with the test component
4. Check Clerk dashboard for user status

## 🎉 Success Indicators

You'll know it's working when:

- ✅ Users can sign up through Clerk UI
- ✅ Webhook creates users in your database
- ✅ Dashboard is protected and accessible
- ✅ API calls work with Clerk tokens
- ✅ All tests pass in ClerkApiTest component

Your frontend is now ready for modern, secure authentication with Clerk! 🚀