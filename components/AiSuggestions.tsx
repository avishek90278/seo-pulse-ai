import { AiAnalysis } from '@/types/seo';
import { Lightbulb, Target, ShieldAlert, TrendingUp, Calendar, Zap } from 'lucide-react';

interface Props {
    analysis: AiAnalysis;
}

export default function AiSuggestions({ analysis }: Props) {
    return (
        <div className="space-y-8">
            {/* Executive Summary & Intent */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-900">Executive Summary</h3>
                </div>
                <p className="text-blue-800 leading-relaxed mb-4">{analysis.summary}</p>

                <div className="bg-white/60 rounded-lg p-4 border border-blue-100 flex items-start gap-3">
                    <Target className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-indigo-900 text-sm">Intent Analysis</h4>
                        <p className="text-indigo-800 text-sm">{analysis.intentAnalysis}</p>
                    </div>
                </div>
            </div>

            {/* Critical Blockers */}
            {analysis.blockers.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-bold text-red-900">Critical Ranking Blockers</h3>
                    </div>
                    <ul className="space-y-2">
                        {analysis.blockers.map((blocker, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-red-800">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                <span>{blocker}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Strategic Roadmap */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-800">Strategic Roadmap</h3>
                </div>

                <div className="space-y-6">
                    {/* Immediate */}
                    <div>
                        <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3">Immediate (0-7 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.immediate.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                    <span className="font-bold text-red-500">{idx + 1}</span>
                                    <span className="text-gray-800">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Short Term */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">Short Term (30 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.shortTerm.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="font-bold text-blue-500">{idx + 1}</span>
                                    <span className="text-gray-800">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Long Term */}
                    <div>
                        <h4 className="text-sm font-bold text-green-600 uppercase tracking-wide mb-3">Long Term (90 Days)</h4>
                        <ul className="space-y-2">
                            {analysis.roadmap.longTerm.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="font-bold text-green-500">{idx + 1}</span>
                                    <span className="text-gray-800">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Automation Opportunities */}
            {analysis.automationFixes.length > 0 && (
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-purple-900">Automation-Ready Fixes</h3>
                    </div>
                    <p className="text-sm text-purple-700 mb-4">
                        These issues can be automatically resolved using our future plugin or API.
                    </p>
                    <ul className="grid gap-2">
                        {analysis.automationFixes.map((fix, idx) => (
                            <li key={idx} className="flex items-center gap-2 bg-white p-3 rounded border border-purple-100 text-purple-800">
                                <Zap className="w-4 h-4 text-purple-500" />
                                {fix}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
