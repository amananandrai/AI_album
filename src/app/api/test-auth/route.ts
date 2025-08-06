import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  return NextResponse.json({
    usernameConfigured: !!username,
    passwordConfigured: !!password,
    bothConfigured: !!(username && password),
    message: 'Check if environment variables are set'
  });
} 