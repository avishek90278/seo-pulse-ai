export interface SeoIssue {
    type: 'critical' | 'high' | 'medium' | 'low';
    impact: 'ranking' | 'ctr' | 'crawl' | 'ux';
    message: string;
    explanation: string;
    recommendation: string;
    automationReady: boolean;
}

export interface SeoContext {
    pageType: 'homepage' | 'article' | 'product' | 'service' | 'unknown';
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    audience: 'beginner' | 'professional' | 'enterprise';
    cms: 'wordpress' | 'shopify' | 'custom' | 'unknown';
}

export interface SeoStructure {
    headingsMap: { level: number; text: string }[];
    internalLinks: number;
    externalLinks: number;
    hasOrphanRisks: boolean;
}

export interface SeoData {
    // Layer 1: HTML
    title: string | null;
    titleLength: number;
    metaDescription: string | null;
    metaDescriptionLength: number;

    // Layer 2: Context
    context: SeoContext;

    // Layer 2.5: Structure
    structure: SeoStructure;

    // Layer 3: Content
    wordCount: number;
    paragraphCount: number;
    contentDepth: 'thin' | 'adequate' | 'comprehensive';

    // Layer 4: Technical
    canonical: string | null;
    metaRobots: string | null;
    h1Count: number;
    imagesTotal: number;
    imagesMissingAlt: number;
    mobileViewport: boolean;
    loadTimeSimulation: number; // ms
}

export interface SeoScore {
    total: number;
    crawlability: number;
    indexability: number;
    contentQuality: number;
    topicalAuthority: number;
    ux: number;
    serpReadiness: number;
}

export interface AiAnalysis {
    summary: string;
    intentAnalysis: string;
    blockers: string[];
    opportunities: string[];
    roadmap: {
        immediate: string[];
        shortTerm: string[]; // 30 days
        longTerm: string[]; // 90 days
    };
    automationFixes: string[];
}

export interface SeoResult {
    url: string;
    score: SeoScore;
    data: SeoData;
    issues: SeoIssue[];
    aiAnalysis: AiAnalysis | null;
}
