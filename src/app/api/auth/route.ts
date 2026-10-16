import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_COOKIE,
    credentialsMatch,
    isAdminRequest,
    sessionCookieOptions,
    signSession,
} from "@/app/lib/adminAuth";

export async function GET(request: NextRequest) {
    return NextResponse.json({ authenticated: isAdminRequest(request) });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const username = typeof body?.username === "string" ? body.username : "";
        const password = typeof body?.password === "string" ? body.password : "";

        const validUsername = process.env.USERNAME;
        const validPassword = process.env.PASSWORD;

        if (!validUsername || !validPassword) {
            return NextResponse.json(
                { error: "Authentication not configured. Please set USERNAME and PASSWORD environment variables." },
                { status: 500 }
            );
        }

        if (!credentialsMatch(username, validUsername) || !credentialsMatch(password, validPassword)) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        const token = signSession(validUsername);
        if (!token) {
            return NextResponse.json(
                { error: "Authentication not configured. Please set USERNAME and PASSWORD environment variables." },
                { status: 500 }
            );
        }

        const response = NextResponse.json({ success: true, message: "Login successful" });
        response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
        return response;
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    return response;
}
