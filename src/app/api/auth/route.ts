import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const validUsername = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    // Debug logging (remove in production)
    console.log('Auth attempt:', { 
      providedUsername: username, 
      providedPassword: password ? '[HIDDEN]' : 'undefined',
      validUsername: validUsername ? '[SET]' : 'undefined',
      validPassword: validPassword ? '[SET]' : 'undefined'
    });

    // Check if credentials are provided
    if (!validUsername || !validPassword) {
      console.log('Environment variables not configured');
      
      // For development, allow a default login if no env vars are set
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - using default credentials');
        if (username === 'admin' && password === 'password') {
          return NextResponse.json(
            { success: true, message: 'Login successful (dev mode)' },
            { status: 200 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Authentication not configured. Please set USERNAME and PASSWORD environment variables.' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === validUsername && password === validPassword) {
      console.log('Login successful');
      return NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );
    } else {
      console.log('Login failed - invalid credentials');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 