import { clsx } from 'clsx';
import { SeoScore as ISeoScore } from '@/types/seo';

interface Props {
    score: ISeoScore;
}

export default function SeoScore({ score }: Props) {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-500 border-green-500 bg-green-50';
        if (s >= 50) return 'text-yellow-500 border-yellow-500 bg-yellow-50';
        return 'text-red-500 border-red-500 bg-red-50';
    };

    const getLabel = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 50) return 'Average';
        return 'Critical';
    };

    const BreakdownItem = ({ label, value }: { label: string, value: number }) => (
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <div className={clsx(
                "text-lg font-bold",
                value >= 80 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600'
            )}>
                {value}
            </div>
            <span className="text-xs text-gray-500 font-medium text-center mt-1">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className={clsx(
                "w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold mb-4",
                getColor(score.total)
            )}>
                {score.total}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{getLabel(score.total)}</h2>
            <p className="text-gray-500 mb-6">Enterprise SEO Score</p>

            <div className="w-full grid grid-cols-3 gap-2 pt-6 border-t border-gray-100">
                <BreakdownItem label="Crawlability" value={score.crawlability} />
                <BreakdownItem label="Indexability" value={score.indexability} />
                <BreakdownItem label="Content" value={score.contentQuality} />
                <BreakdownItem label="Authority" value={score.topicalAuthority} />
                <BreakdownItem label="UX" value={score.ux} />
                <BreakdownItem label="SERP" value={score.serpReadiness} />
            </div>
        </div>
    );
}
