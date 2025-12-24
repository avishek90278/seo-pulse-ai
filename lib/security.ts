// SECURITY: Private API authentication middleware
// This system is OWNER-ONLY. No public access allowed.

import { NextRequest } from 'next/server';
import crypto from 'crypto';

const MASTER_API_KEY = process.env.MASTER_API_KEY;
const REQUEST_SIGNATURE_SECRET = process.env.REQUEST_SIGNATURE_SECRET;
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || 'localhost:3000').split(',');

interface SecurityCheckResult {
    allowed: boolean;
    reason?: string;
}

/**
 * SECURITY LAYER 1: Master API Key Validation
 * Only the owner has this key. Never exposed to frontend.
 */
function validateMasterKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-api-key');
    return apiKey === MASTER_API_KEY;
}

/**
 * SECURITY LAYER 2: Request Signature Validation (HMAC-SHA256)
 * Prevents request tampering and replay attacks.
 */
function validateSignature(request: NextRequest, body: string): boolean {
    const signature = request.headers.get('x-signature');
    const timestamp = request.headers.get('x-timestamp');

    if (!signature || !timestamp) {
        return false;
    }

    // Generate expected signature
    const payload = `${timestamp}:${body}`;
    const expectedSignature = crypto
        .createHmac('sha256', REQUEST_SIGNATURE_SECRET!)
        .update(payload)
        .digest('hex');

    return signature === expectedSignature;
}

/**
 * SECURITY LAYER 3: Timestamp Validation
 * Requests must be made within ±60 seconds to prevent replay attacks.
 */
function validateTimestamp(request: NextRequest): boolean {
    const timestamp = request.headers.get('x-timestamp');

    if (!timestamp) {
        return false;
    }

    const requestTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTime - requestTime);

    // Allow 60 second window
    return timeDiff <= 60;
}

/**
 * SECURITY LAYER 4: Domain Allowlist
 * Only requests from approved domains are allowed.
 */
function validateDomain(request: NextRequest): boolean {
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    // Extract domain from origin or referer
    let domain = '';
    try {
        if (origin) {
            domain = new URL(origin).host;
        } else if (referer) {
            domain = new URL(referer).host;
        }
    } catch (e) {
        return false;
    }

    return ALLOWED_DOMAINS.some(allowed => domain.includes(allowed));
}

/**
 * MAIN SECUR ITY CHECK
 * All layers must pass for request to be authorized.
 */
export async function validateRequest(request: NextRequest, body: string): Promise<SecurityCheckResult> {
    // Layer 1: Master API Key
    if (!validateMasterKey(request)) {
        return { allowed: false, reason: 'invalid_credentials' };
    }

    // Layer 2: Timestamp (prevents replay attacks)
    if (!validateTimestamp(request)) {
        return { allowed: false, reason: 'invalid_timestamp' };
    }

    // Layer 3: Request Signature
    if (!validateSignature(request, body)) {
        return { allowed: false, reason: 'invalid_signature' };
    }

    // Layer 4: Domain Allowlist
    if (!validateDomain(request)) {
        return { allowed: false, reason: 'unauthorized_domain' };
    }

    return { allowed: true };
}

/**
 * Helper: Generate client signature for testing
 * NOTE: This is only for owner's internal testing. Never expose SECRET to frontend.
 */
export function generateClientSignature(body: string, timestamp: number): string {
    const payload = `${timestamp}:${body}`;
    return crypto
        .createHmac('sha256', REQUEST_SIGNATURE_SECRET!)
        .update(payload)
        .digest('hex');
}
