import { createHash, createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function authSecret(): string | null {
    const password = process.env.PASSWORD;
    return password && password.length > 0 ? password : null;
}

export function credentialsMatch(provided: string, expected: string): boolean {
    const providedHash = createHash("sha256").update(provided).digest();
    const expectedHash = createHash("sha256").update(expected).digest();
    return timingSafeEqual(providedHash, expectedHash);
}

export function signSession(username: string): string | null {
    const secret = authSecret();
    if (!secret) return null;
    const payload = Buffer.from(JSON.stringify({
        username,
        exp: Date.now() + MAX_AGE_SECONDS * 1000,
    })).toString("base64url");
    const signature = createHmac("sha256", secret).update(payload).digest("base64url");
    return `${payload}.${signature}`;
}

export function verifySession(token: string | undefined): boolean {
    const secret = authSecret();
    const username = process.env.USERNAME;
    if (!secret || !username || !token) return false;

    const separator = token.lastIndexOf(".");
    if (separator <= 0) return false;
    const payload = token.slice(0, separator);
    const signature = token.slice(separator + 1);

    const expected = createHmac("sha256", secret).update(payload).digest("base64url");
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length) return false;
    if (!timingSafeEqual(actualBuffer, expectedBuffer)) return false;

    try {
        const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { username?: string; exp?: number };
        if (typeof data.username !== "string" || typeof data.exp !== "number") return false;
        if (!credentialsMatch(data.username, username)) return false;
        return data.exp >= Date.now();
    } catch {
        return false;
    }
}

export function sessionCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: MAX_AGE_SECONDS,
    };
}

export function isAdminRequest(request: NextRequest): boolean {
    return verifySession(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
