import { AiAnalysis, SeoData, SeoIssue } from '@/types/seo';

export async function generateAiAnalysis(data: SeoData, issues: SeoIssue[]): Promise<AiAnalysis> {
    const apiKey = process.env.OPENAI_API_KEY; // Using Groq key here

    if (!apiKey) {
        throw new Error('API key is not configured');
    }

    const prompt = `
SYSTEM ROLE:
You are a Principal SEO Architect and Enterprise Systems Designer.
Your goal is to provide a high-level strategic analysis of a website based on raw data.
Think like Ahrefs + Semrush + Google Search Console combined.

INPUT DATA:
${JSON.stringify({ data, issues }, null, 2)}

TASK:
Analyze the provided SEO data and issues.
Return a JSON object strictly matching the schema below.
Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.

OUTPUT SCHEMA:
{
  "summary": "3-4 sentences executive summary of the site's health.",
  "intentAnalysis": "Analysis of page intent vs content match (e.g., 'Commercial intent but informational content').",
  "blockers": ["Critical issue 1", "Critical issue 2"],
  "opportunities": ["High-impact opportunity 1", "Opportunity 2"],
  "roadmap": {
    "immediate": ["Fix 1", "Fix 2"],
    "shortTerm": ["Strategy 1", "Strategy 2"],
    "longTerm": ["Big picture goal 1"]
  },
  "automationFixes": ["Fix that can be automated (e.g., 'Auto-generate alt text')"]
}

GUIDELINES:
- Be professional, direct, and actionable.
- Focus on "Why" and "How".
- If CMS is WordPress, suggest plugin-based automation in "automationFixes".
- Prioritize "Critical" issues in the "immediate" roadmap.
`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a Principal SEO Architect. Output strictly valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: "json_object" } // Force JSON mode
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('AI API Error:', err);
            throw new Error('AI API request failed');
        }

        const json = await response.json();
        const content = json.choices[0].message.content;

        return JSON.parse(content);
    } catch (error) {
        console.error('AI Analysis failed:', error);
        // Return fallback data to prevent crash
        return {
            summary: "AI Analysis unavailable at this moment.",
            intentAnalysis: "Unknown",
            blockers: ["Check manual issues list"],
            opportunities: [],
            roadmap: { immediate: [], shortTerm: [], longTerm: [] },
            automationFixes: []
        };
    }
}
