import axios from 'axios';

export async function fetchHtml(url: string): Promise<string> {
    try {
        // Ensure URL has protocol
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        const response = await axios.get(url, {
            timeout: 10000, // 10s timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SeoPulseAI/1.0)',
            },
        });

        if (typeof response.data !== 'string') {
            throw new Error('Invalid response content');
        }

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. The website took too long to respond.');
            }
            if (error.response) {
                throw new Error(`Failed to fetch website: ${error.response.status} ${error.response.statusText}`);
            }
        }
        throw new Error(error.message || 'Failed to fetch website content');
    }
}
