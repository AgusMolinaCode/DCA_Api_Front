"use client";

import { useState } from 'react';
import { useApiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

export function ClerkApiTest() {
  const { user } = useUser();
  const apiClient = useApiClient();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const endTime = Date.now();
      
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'success',
        result,
        duration: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error: any) {
      const endTime = Date.now();
      
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'error',
        error: error.message,
        duration: endTime - startTime,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const testClerkAuth = () => {
    runTest('Clerk Authentication Test', async () => {
      return await apiClient.get('/clerk/test');
    });
  };

  const testGetUser = () => {
    runTest('Get User Info', async () => {
      return await apiClient.get('/user');
    });
  };

  const testGetDashboard = () => {
    runTest('Get Dashboard Data', async () => {
      return await apiClient.get('/dashboard');
    });
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-zinc-100">Clerk API Integration Test</CardTitle>
        <p className="text-zinc-400">
          Logged in as: {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testClerkAuth} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test Clerk Auth
          </Button>
          <Button 
            onClick={testGetUser} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Get User Info
          </Button>
          <Button 
            onClick={testGetDashboard} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Test Dashboard
          </Button>
          <Button 
            onClick={clearResults} 
            variant="outline"
            className="border-zinc-600 text-zinc-100 hover:bg-zinc-700"
          >
            Clear Results
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-zinc-100">Test Results:</h3>
            {testResults.map((test, index) => (
              <div 
                key={index} 
                className={`p-3 rounded border-l-4 ${
                  test.status === 'success' 
                    ? 'bg-green-900/20 border-green-500' 
                    : 'bg-red-900/20 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-zinc-100">{test.name}</h4>
                  <span className="text-sm text-zinc-400">
                    {test.timestamp} ({test.duration}ms)
                  </span>
                </div>
                
                {test.status === 'success' ? (
                  <pre className="text-sm text-green-300 bg-zinc-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(test.result, null, 2)}
                  </pre>
                ) : (
                  <div className="text-sm text-red-300 bg-zinc-900 p-2 rounded">
                    Error: {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-zinc-300 border-t-transparent rounded-full"></div>
              <span className="text-zinc-300">Running test...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}