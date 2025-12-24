'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function UrlInput() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        // Encode URL to pass as query param safely
        const encodedUrl = encodeURIComponent(url);
        router.push(`/result?url=${encodedUrl}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com)"
                    className="w-full px-6 py-4 text-lg rounded-full bg-white/10 border-2 border-white/10 focus:border-blue-500 focus:bg-white/20 outline-none transition-all shadow-sm text-white placeholder:text-gray-400 backdrop-blur-md"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !url}
                    className="absolute right-2 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <ArrowRight className="w-6 h-6" />
                    )}
                </button>
            </div>
        </form>
    );
}
