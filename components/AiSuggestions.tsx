import { AiAnalysis } from '@/types/seo';
import { Lightbulb, Target, ShieldAlert, TrendingUp, Calendar, Zap } from 'lucide-react';

interface Props {
    analysis: AiAnalysis;
}

export default function AiSuggestions({ analysis }: Props) {
    return (
        <div className="space-y-8">
            {/* Executive Summary & Intent */}
            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-blue-100">Executive Summary</h3>
                </div>
                <p className="text-blue-200 leading-relaxed mb-4">{analysis.summary}</p>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-start gap-3">
                    <Target className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-indigo-200 text-sm">Intent Analysis</h4>
                        <p className="text-indigo-300 text-sm">{analysis.intentAnalysis}</p>
                    </div>
                </div>
            </div>

            {/* Critical Blockers */}
            {analysis.blockers.length > 0 && (
                <div className="bg-red-900/10 rounded-2xl p-6 border border-red-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-red-100">Critical Ranking Blockers</h3>
                    </div>
                    <ul className="space-y-2">
                        {analysis.blockers.map((blocker, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-red-200">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                <span>{blocker}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Strategic Roadmap */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h3 className="text-xl font-bold text-white">Strategic Roadmap</h3>
                </div>

                <div className="space-y-6">
                    {/* Immediate */}
                    <div>
                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-3">Immediate (0-7 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.immediate.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <span className="font-bold text-red-400">{idx + 1}</span>
                                    <span className="text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Short Term */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-3">Short Term (30 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.shortTerm.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <span className="font-bold text-blue-400">{idx + 1}</span>
                                    <span className="text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Long Term */}
                    <div>
                        <h4 className="text-sm font-bold text-green-400 uppercase tracking-wide mb-3">Long Term (90 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.longTerm.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                    <span className="font-bold text-green-400">{idx + 1}</span>
                                    <span className="text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Automation Opportunities */}
            {analysis.automationFixes.length > 0 && (
                <div className="bg-purple-900/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-purple-100">Automation-Ready Fixes</h3>
                    </div>
                    <p className="text-sm text-purple-300 mb-4">
                        These issues can be automatically resolved using our future plugin or API.
                    </p>
                    <ul className="grid gap-2">
                        {analysis.automationFixes.map((fix, idx) => (
                            <li key={idx} className="flex items-center gap-2 bg-white/5 p-3 rounded border border-purple-500/20 text-purple-200">
                                <Zap className="w-4 h-4 text-purple-400" />
                                {fix}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
