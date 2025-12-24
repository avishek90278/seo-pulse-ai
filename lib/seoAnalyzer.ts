import * as cheerio from 'cheerio';
import { SeoData, SeoIssue, SeoScore, SeoContext, SeoStructure } from '@/types/seo';

export function analyzeSeo(html: string, url: string): {
    data: SeoData;
    issues: SeoIssue[];
    score: SeoScore;
} {
    const $ = cheerio.load(html);
    const issues: SeoIssue[] = [];

    // --- LAYER 1: HTML EXTRACTION ---
    const title = $('title').first().text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 0);
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').length;
    const paragraphs = $('p');
    const paragraphCount = paragraphs.length;

    // --- LAYER 2: CONTEXT & INTENT ---
    const context = detectContext($, url, title, wordCount);

    // --- LAYER 2.5: STRUCTURE ---
    const structure = analyzeStructure($, url);

    // --- LAYER 3: CONTENT INTELLIGENCE ---
    let contentDepth: 'thin' | 'adequate' | 'comprehensive' = 'thin';
    if (wordCount > 1200) contentDepth = 'comprehensive';
    else if (wordCount > 600) contentDepth = 'adequate';

    // --- LAYER 4: TECHNICAL & CMS ---
    const canonical = $('link[rel="canonical"]').attr('href') || null;
    const metaRobots = $('meta[name="robots"]').attr('content') || null;
    const viewport = $('meta[name="viewport"]').attr('content') || null;

    const images = $('img');
    let imagesMissingAlt = 0;
    images.each((_, el) => { if (!$(el).attr('alt')) imagesMissingAlt++; });

    // Data Object
    const data: SeoData = {
        title,
        titleLength: title ? title.length : 0,
        metaDescription,
        metaDescriptionLength: metaDescription ? metaDescription.length : 0,
        context,
        structure,
        wordCount,
        paragraphCount,
        contentDepth,
        canonical,
        metaRobots,
        h1Count: h1s.length,
        imagesTotal: images.length,
        imagesMissingAlt,
        mobileViewport: !!viewport,
        loadTimeSimulation: Math.floor(Math.random() * (1200 - 200) + 200), // Simulated for now
    };

    // --- SCORING & ISSUE GENERATION ---
    const score = calculateEnterpriseScore(data, issues);

    return { data, issues, score };
}

function detectContext($: cheerio.CheerioAPI, url: string, title: string | null, wordCount: number): SeoContext {
    let pageType: SeoContext['pageType'] = 'unknown';
    let intent: SeoContext['intent'] = 'informational';
    let audience: SeoContext['audience'] = 'beginner';
    let cms: SeoContext['cms'] = 'unknown';

    // CMS Detection
    // CMS Detection
    const generator = $('meta[name="generator"]').attr('content')?.toLowerCase() || '';
    const html = $.html().toLowerCase();

    if (
        generator.includes('wordpress') ||
        html.includes('/wp-content/') ||
        html.includes('/wp-includes/') ||
        $('link[rel="https://api.w.org/"]').length > 0
    ) {
        cms = 'wordpress';
    } else if (generator.includes('shopify') || url.includes('myshopify')) {
        cms = 'shopify';
    } else {
        cms = 'custom';
    }

    // Page Type & Intent
    if (url === '/' || url.endsWith('index.html')) {
        pageType = 'homepage';
        intent = 'navigational';
    } else if (url.includes('/product/') || url.includes('/shop/') || $('.add-to-cart').length > 0) {
        pageType = 'product';
        intent = 'transactional';
    } else if (url.includes('/blog/') || url.includes('/news/') || wordCount > 1000) {
        pageType = 'article';
        intent = 'informational';
    } else if (url.includes('/services/')) {
        pageType = 'service';
        intent = 'commercial';
    }

    // Audience
    const text = $('body').text().toLowerCase();
    if (text.includes('enterprise') || text.includes('solution') || text.includes('scale')) {
        audience = 'enterprise';
    } else if (text.includes('guide') || text.includes('tutorial') || text.includes('learn')) {
        audience = 'beginner';
    } else {
        audience = 'professional';
    }

    return { pageType, intent, audience, cms };
}

function analyzeStructure($: cheerio.CheerioAPI, url: string): SeoStructure {
    const headingsMap: { level: number; text: string }[] = [];
    $('h1, h2, h3').each((_, el) => {
        const tagName = $(el).prop('tagName').toLowerCase();
        const level = parseInt(tagName.replace('h', ''));
        headingsMap.push({ level, text: $(el).text().trim() });
    });

    let internalLinks = 0;
    let externalLinks = 0;
    try {
        const baseUrl = new URL(url);
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href) {
                if (href.startsWith('/') || href.startsWith('#') || href.includes(baseUrl.hostname)) {
                    internalLinks++;
                } else if (href.startsWith('http')) {
                    externalLinks++;
                }
            }
        });
    } catch (e) { /* ignore */ }

    return {
        headingsMap,
        internalLinks,
        externalLinks,
        hasOrphanRisks: internalLinks === 0
    };
}

function calculateEnterpriseScore(data: SeoData, issues: SeoIssue[]): SeoScore {
    let crawlability = 100;
    let indexability = 100;
    let contentQuality = 100;
    let topicalAuthority = 100;
    let ux = 100;
    let serpReadiness = 100;

    // 1. Crawlability & Indexability
    if (!data.mobileViewport) {
        crawlability -= 20;
        issues.push({
            type: 'critical', impact: 'crawl',
            message: 'Mobile Viewport Missing',
            explanation: 'Search engines primarily crawl with mobile agents. Your site may be penalized.',
            recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
            automationReady: true
        });
    }
    if (!data.canonical) {
        indexability -= 15;
        issues.push({
            type: 'high', impact: 'ranking',
            message: 'Missing Canonical Tag',
            explanation: 'Canonical tags prevent duplicate content issues.',
            recommendation: 'Add <link rel="canonical" href="..."> to the <head>.',
            automationReady: true
        });
    }

    // 2. Content Quality & Authority
    if (data.wordCount < 300) {
        contentQuality -= 40;
        issues.push({
            type: 'critical', impact: 'ranking',
            message: 'Thin Content Detected',
            explanation: 'Content under 300 words is rarely ranked by Google for competitive terms.',
            recommendation: 'Expand content to at least 600 words with unique value.',
            automationReady: false
        });
    } else if (data.wordCount < 600) {
        contentQuality -= 15;
        issues.push({
            type: 'medium', impact: 'ranking',
            message: 'Content Depth Could Be Improved',
            explanation: '600+ words is a common benchmark for informational content.',
            recommendation: 'Add more sections covering related subtopics.',
            automationReady: false
        });
    }

    if (data.h1Count === 0) {
        contentQuality -= 20;
        issues.push({
            type: 'critical', impact: 'ranking',
            message: 'Missing H1 Heading',
            explanation: 'The H1 tag is the primary signal of page topic.',
            recommendation: 'Add exactly one <h1> tag containing your main keyword.',
            automationReady: true
        });
    } else if (data.h1Count > 1) {
        contentQuality -= 10;
        issues.push({
            type: 'medium', impact: 'ux',
            message: 'Multiple H1 Tags',
            explanation: 'Multiple H1s can confuse document structure.',
            recommendation: 'Use only one H1 per page.',
            automationReady: true
        });
    }

    // 3. UX & Accessibility
    if (data.imagesMissingAlt > 0) {
        ux -= Math.min(20, data.imagesMissingAlt * 2);
        issues.push({
            type: 'high', impact: 'ux',
            message: `${data.imagesMissingAlt} Images Missing Alt Text`,
            explanation: 'Alt text is required for screen readers and helps image SEO.',
            recommendation: 'Add descriptive alt attributes to all images.',
            automationReady: data.context.cms === 'wordpress' // WordPress can auto-fill
        });
    }

    if (data.structure.internalLinks === 0) {
        topicalAuthority -= 10;
        issues.push({
            type: 'high', impact: 'crawl',
            message: 'No Internal Links',
            explanation: 'Internal links help search engines discover your content.',
            recommendation: 'Add links to other relevant pages on your site.',
            automationReady: false
        });
    }

    // 4. SERP Readiness
    if (!data.title) {
        serpReadiness -= 50;
        issues.push({
            type: 'critical', impact: 'ctr',
            message: 'Missing Title Tag',
            explanation: 'Your page will not display correctly in search results.',
            recommendation: 'Add a descriptive <title> tag.',
            automationReady: true
        });
    } else if (data.titleLength < 10 || data.titleLength > 60) {
        serpReadiness -= 10;
        issues.push({
            type: 'medium', impact: 'ctr',
            message: 'Suboptimal Title Length',
            explanation: 'Titles should be between 10-60 characters to avoid truncation.',
            recommendation: 'Rewrite title to be concise and keyword-rich.',
            automationReady: false
        });
    }

    if (!data.metaDescription) {
        serpReadiness -= 30;
        issues.push({
            type: 'high', impact: 'ctr',
            message: 'Missing Meta Description',
            explanation: 'Meta descriptions influence click-through rates.',
            recommendation: 'Add a unique meta description summary.',
            automationReady: true
        });
    }

    // Calculate Total
    const total = Math.round(
        (crawlability * 0.15) +
        (indexability * 0.15) +
        (contentQuality * 0.25) +
        (topicalAuthority * 0.15) +
        (ux * 0.15) +
        (serpReadiness * 0.15)
    );

    return {
        total,
        crawlability,
        indexability,
        contentQuality,
        topicalAuthority,
        ux,
        serpReadiness
    };
}
