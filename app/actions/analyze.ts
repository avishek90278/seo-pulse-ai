'use server';

import { generateClientSignature } from '@/lib/security';

export async function analyzeUrlAction(url: string) {
    const apiUrl = 'http://localhost:3000/api/analyze';
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({ url });

    // Generate security headers server-side
    // Secrets are safe here because this runs on the server
    const signature = generateClientSignature(body, timestamp);
    const masterKey = process.env.MASTER_API_KEY || '';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': masterKey,
                'x-timestamp': timestamp.toString(),
                'x-signature': signature,
                'Origin': 'http://localhost:3000' // Pass domain validation
            },
            body: body,
            cache: 'no-store'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
        }

        return { success: true, data };

    } catch (error: any) {
        console.error('Action Error:', error);
        return { success: false, error: error.message };
    }
}
