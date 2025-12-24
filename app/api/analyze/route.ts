// SECURITY: PRIVATE API - OWNER ONLY
// This endpoint is completely locked down. No public access allowed.

import { NextRequest, NextResponse } from 'next/server';
import { fetchHtml } from '@/lib/fetchHtml';
import { analyzeSeo } from '@/lib/seoAnalyzer';
import { generateAiAnalysis } from '@/lib/aiClient';
import { validateRequest } from '@/lib/security';
import { SeoResult } from '@/types/seo';

export async function POST(req: NextRequest) {
    try {
        // SECURITY CHECKPOINT: Validate all security layers
        const rawBody = await req.text();
        const security = await validateRequest(req, rawBody);

        if (!security.allowed) {
            // Generic 403 - Never reveal why request was rejected
            return NextResponse.json(
                { error: 'Forbidden' },
                {
                    status: 403,
                    headers: {
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'X-XSS-Protection': '1; mode=block'
                    }
                }
            );
        }

        // Parse body after security validation
        const body = JSON.parse(rawBody);
        const { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
        }

        // 1. Fetch HTML
        let html = '';
        try {
            html = await fetchHtml(url);
        } catch (error: any) {
            return NextResponse.json({ error: error.message || 'Failed to fetch website' }, { status: 422 });
        }

        if (!html) {
            return NextResponse.json({ error: 'Empty HTML received' }, { status: 422 });
        }

        // 2. Analyze SEO
        const { data, issues, score } = analyzeSeo(html, url);

        // 3. AI Analysis
        let aiAnalysis = null;
        try {
            aiAnalysis = await generateAiAnalysis(data, issues);
        } catch (error) {
            console.error('AI generation failed, proceeding without AI results', error);
            // We proceed without AI results rather than failing the whole request
        }

        const result: SeoResult = {
            url,
            score,
            data,
            issues,
            aiAnalysis,
        };

        return NextResponse.json(result, {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                // SECURITY: No CORS - same-origin only
                'Access-Control-Allow-Origin': 'null'
            }
        });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal error' },
            { status: 500 }
        );
    }
}

// SECURITY: Disable OPTIONS (CORS preflight)
export async function OPTIONS() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
