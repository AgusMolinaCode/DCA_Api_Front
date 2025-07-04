import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/actions';

export async function GET() {
  try {
    const token = await getAuthToken();
    
    const backendUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080';
    
    // Test if backend is reachable
    const testResponse = await fetch(`${backendUrl}/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const debugInfo = {
      backendUrl,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      responseStatus: testResponse.status,
      responseOk: testResponse.ok,
      responseHeaders: Object.fromEntries(testResponse.headers.entries()),
      timestamp: new Date().toISOString(),
    };
    
    if (testResponse.ok) {
      try {
        const data = await testResponse.json();
        return NextResponse.json({
          success: true,
          debugInfo,
          data,
          dataType: Array.isArray(data) ? 'array' : typeof data,
          dataKeys: typeof data === 'object' ? Object.keys(data) : [],
          hasTickerData: Array.isArray(data) 
            ? data.some((item: any) => item.ticker)
            : (data.dashboard && Array.isArray(data.dashboard))
              ? data.dashboard.some((item: any) => item.ticker)
              : false,
        });
      } catch (parseError) {
        const text = await testResponse.text();
        return NextResponse.json({
          success: false,
          debugInfo,
          error: 'Failed to parse JSON',
          responseText: text,
        });
      }
    } else {
      const text = await testResponse.text();
      return NextResponse.json({
        success: false,
        debugInfo,
        error: 'Backend request failed',
        responseText: text,
      });
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}