import { SeoIssue } from '@/types/seo';
import { AlertCircle, CheckCircle, XCircle, Info, Zap, BarChart, Eye, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    issues: SeoIssue[];
}

export default function SeoIssues({ issues }: Props) {
    const getSeverityIcon = (type: string) => {
        switch (type) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'high': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'medium': return <Info className="w-5 h-5 text-yellow-500" />;
            default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    const getImpactIcon = (impact: string) => {
        switch (impact) {
            case 'ranking': return <BarChart className="w-3 h-3 mr-1" />;
            case 'ctr': return <Eye className="w-3 h-3 mr-1" />;
            case 'crawl': return <Search className="w-3 h-3 mr-1" />;
            case 'ux': return <Zap className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold mb-6 text-white">Detected Issues</h3>
            <div className="space-y-4">
                {issues.length === 0 ? (
                    <div className="flex items-center gap-3 text-green-400 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                        <span>Great job! No issues found.</span>
                    </div>
                ) : (
                    issues.map((issue, idx) => (
                        <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{getSeverityIcon(issue.type)}</div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={clsx(
                                            "text-xs font-bold px-2 py-0.5 rounded uppercase border",
                                            issue.type === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                issue.type === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        )}>
                                            {issue.type}
                                        </span>

                                        <span className="flex items-center text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10 uppercase">
                                            {getImpactIcon(issue.impact)}
                                            {issue.impact} Impact
                                        </span>

                                        {issue.automationReady && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center">
                                                <Zap className="w-3 h-3 mr-1" /> Auto-Fix Ready
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-white mb-2">{issue.message}</h4>
                                    <p className="text-sm text-gray-400 mb-3">{issue.explanation}</p>

                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-sm">
                                        <span className="font-bold text-gray-300">Fix: </span>
                                        <span className="text-gray-400">{issue.recommendation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
