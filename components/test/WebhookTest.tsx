"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WebhookTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    // Set the webhook URL based on environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dcaapi-production-up.railway.app';
    setWebhookUrl(`${apiUrl}/clerk/webhook`);
  }, []);

  const testWebhook = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Simulate a Clerk webhook payload
      const mockWebhookPayload = {
        type: "user.created",
        data: {
          id: "user_test_" + Date.now(),
          email_addresses: [
            {
              email_address: `test${Date.now()}@example.com`
            }
          ],
          first_name: "Test",
          last_name: "User"
        }
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockWebhookPayload)
      });

      const result = await response.json();
      
      setTestResult({
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        data: result,
        payload: mockWebhookPayload,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error: any) {
      setTestResult({
        status: 'error',
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkApiHealth = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dcaapi-production-up.railway.app';
      const response = await fetch(`${apiUrl}/health`);
      const result = await response.json();
      
      setTestResult({
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        data: result,
        type: 'health_check',
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error: any) {
      setTestResult({
        status: 'error',
        error: error.message,
        type: 'health_check',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-zinc-100">🔗 Webhook Test</CardTitle>
        <p className="text-zinc-400">
          Test si el webhook de Clerk está funcionando correctamente
        </p>
        <p className="text-sm text-zinc-500">
          Webhook URL: {webhookUrl}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testWebhook} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🧪 Test Webhook
          </Button>
          <Button 
            onClick={checkApiHealth} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            ❤️ Check API Health
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-zinc-300 border-t-transparent rounded-full"></div>
              <span className="text-zinc-300">Testing...</span>
            </div>
          </div>
        )}

        {testResult && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-zinc-100">Test Result:</h3>
            <div 
              className={`p-4 rounded border-l-4 ${
                testResult.status === 'success' 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-zinc-100">
                  {testResult.type === 'health_check' ? 'API Health Check' : 'Webhook Test'}
                </h4>
                <span className="text-sm text-zinc-400">
                  {testResult.timestamp} | Status: {testResult.statusCode || 'N/A'}
                </span>
              </div>
              
              {testResult.status === 'success' ? (
                <div>
                  <div className="text-sm text-green-300 mb-2">
                    ✅ {testResult.type === 'health_check' ? 'API is healthy!' : 'Webhook working!'}
                  </div>
                  <pre className="text-sm text-green-300 bg-zinc-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                  {testResult.payload && (
                    <div className="mt-2">
                      <div className="text-sm text-zinc-400 mb-1">Payload sent:</div>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-2 rounded overflow-x-auto">
                        {JSON.stringify(testResult.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-300 bg-zinc-900 p-2 rounded">
                  ❌ Error: {testResult.error}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-zinc-400 space-y-2">
          <p><strong>Instrucciones para probar:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Haz clic en "🧪 Test Webhook" para simular un webhook de Clerk</li>
            <li>Haz clic en "🧪 Test Clerk Sign Up" en el navbar</li>
            <li>Completa el registro en Clerk</li>
            <li>Verifica que el usuario se creó en tu base de datos</li>
            <li>Verifica los logs de tu API en Railway</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}