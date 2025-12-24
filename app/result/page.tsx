'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import SeoScore from '@/components/SeoScore';
import SeoIssues from '@/components/SeoIssues';
import AiSuggestions from '@/components/AiSuggestions';
import { SeoResult } from '@/types/seo';

function ResultContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    const [result, setResult] = useState<SeoResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'ai'>('overview');

    useEffect(() => {
        if (!url) {
            setError('No URL provided');
            setLoading(false);
            return;
        }

        const analyze = async () => {
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Analysis failed');
                }

                setResult(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        analyze();
    }, [url]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <div className="fixed inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-white">Analyzing Website...</h2>
                    <p className="text-gray-400">This usually takes 10-20 seconds.</p>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-white">
                <div className="fixed inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
                </div>
                <div className="relative z-10 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 max-w-md w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
                    <p className="text-gray-400 mb-6">{error || 'Something went wrong'}</p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
                        Try Another URL
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20 selection:bg-blue-500/30">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="font-semibold text-white truncate max-w-md">
                        {result.url}
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Score & Navigation */}
                    <div className="lg:col-span-1 space-y-6">
                        <SeoScore score={result.score} />

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full text-left px-6 py-4 font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-500/10 text-blue-400 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('issues')}
                                className={`w-full text-left px-6 py-4 font-medium transition-colors ${activeTab === 'issues' ? 'bg-blue-500/10 text-blue-400 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                Issues Found
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                                    {result.issues.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`w-full text-left px-6 py-4 font-medium transition-colors ${activeTab === 'ai' ? 'bg-blue-500/10 text-blue-400 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                Intelligence Report
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                            <h3 className="font-bold text-white mb-4">Page Stats</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Word Count</span>
                                    <span className="font-medium text-white">{result.data.wordCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Images</span>
                                    <span className="font-medium text-white">{result.data.imagesTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Internal Links</span>
                                    <span className="font-medium text-white">{result.data.structure.internalLinks}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">CMS Detected</span>
                                    <span className="font-medium text-white uppercase">{result.data.context.cms}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Analysis Overview</h2>
                                    <p className="text-gray-400 mb-6">
                                        We analyzed your page content, meta tags, and structure.
                                        Your Enterprise Score is <strong className="text-white">{result.score.total}/100</strong>.
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-sm text-gray-400 mb-1">Title Tag</div>
                                            <div className="font-medium text-white break-words">
                                                {result.data.title || <span className="text-red-400">Missing</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{result.data.titleLength} chars</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="text-sm text-gray-400 mb-1">Meta Description</div>
                                            <div className="font-medium text-white break-words">
                                                {result.data.metaDescription || <span className="text-red-400">Missing</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{result.data.metaDescriptionLength} chars</div>
                                        </div>
                                    </div>
                                </div>

                                {result.aiAnalysis && (
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white border border-white/10">
                                        <h3 className="font-bold text-lg mb-2">AI Quick Take</h3>
                                        <p className="opacity-90">{result.aiAnalysis.summary}</p>
                                        <button
                                            onClick={() => setActiveTab('ai')}
                                            className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
                                        >
                                            View All Suggestions
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'issues' && (
                            <SeoIssues issues={result.issues} />
                        )}

                        {activeTab === 'ai' && (
                            <>
                                {result.aiAnalysis ? (
                                    <AiSuggestions analysis={result.aiAnalysis} />
                                ) : (
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-8 text-center">
                                        <p className="text-gray-400">AI Analysis is not available for this run.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
