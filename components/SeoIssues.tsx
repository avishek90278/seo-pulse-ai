import { SeoIssue } from '@/types/seo';
import { AlertCircle, CheckCircle, XCircle, Info, Zap, BarChart, Eye, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    issues: SeoIssue[];
}

export default function SeoIssues({ issues }: Props) {
    const getSeverityIcon = (type: string) => {
        switch (type) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Detected Issues</h3>
            <div className="space-y-4">
                {issues.length === 0 ? (
                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span>Great job! No issues found.</span>
                    </div>
                ) : (
                    issues.map((issue, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">{getSeverityIcon(issue.type)}</div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={clsx(
                                            "text-xs font-bold px-2 py-0.5 rounded uppercase",
                                            issue.type === 'critical' ? 'bg-red-100 text-red-700' :
                                                issue.type === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                        )}>
                                            {issue.type}
                                        </span>

                                        <span className="flex items-center text-xs font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-700 uppercase">
                                            {getImpactIcon(issue.impact)}
                                            {issue.impact} Impact
                                        </span>

                                        {issue.automationReady && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 flex items-center">
                                                <Zap className="w-3 h-3 mr-1" /> Auto-Fix Ready
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-1">{issue.message}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{issue.explanation}</p>

                                    <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                                        <span className="font-bold text-gray-700">Fix: </span>
                                        <span className="text-gray-600">{issue.recommendation}</span>
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
