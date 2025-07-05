import { WebhookTest } from '@/components/test/WebhookTest';

export default function ClerkTestPage() {
  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            🧪 Clerk Integration Test
          </h1>
          <p className="text-zinc-400">
            Test the complete Clerk authentication flow and webhook integration
          </p>
        </div>

        <WebhookTest />

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            📋 Test Instructions
          </h2>
          <div className="space-y-4 text-zinc-300">
            <div>
              <h3 className="text-lg font-medium text-zinc-100">1. Test Sign Up Flow</h3>
              <p>Click "🧪 Test Clerk Sign Up" in the navbar to test user creation</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-zinc-100">2. Monitor Webhook</h3>
              <p>Watch for webhook events in your API logs on Railway</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-zinc-100">3. Check Database</h3>
              <p>Verify that new users are automatically created in your PostgreSQL database</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-zinc-100">4. Test API Access</h3>
              <p>After signing up, visit the dashboard to test protected routes</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            🔍 What to Look For
          </h2>
          <ul className="space-y-2 text-zinc-300">
            <li>✅ Clerk sign-up completes successfully</li>
            <li>✅ Webhook receives user.created event</li>
            <li>✅ User is created in PostgreSQL database</li>
            <li>✅ User can access protected dashboard</li>
            <li>✅ API calls work with Clerk JWT token</li>
          </ul>
        </div>
      </div>
    </div>
  );
}