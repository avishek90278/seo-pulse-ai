import { NextRequest, NextResponse } from 'next/server';
import { fetchHtml } from '@/lib/fetchHtml';
import { analyzeSeo } from '@/lib/seoAnalyzer';
import { generateAiAnalysis } from '@/lib/aiClient';
import { SeoResult } from '@/types/seo';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
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

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal error' },
            { status: 500 }
        );
    }
}
