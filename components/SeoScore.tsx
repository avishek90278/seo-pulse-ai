import { clsx } from 'clsx';
import { SeoScore as ISeoScore } from '@/types/seo';

interface Props {
    score: ISeoScore;
}

export default function SeoScore({ score }: Props) {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-400 border-green-500/50 bg-green-500/10';
        if (s >= 50) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
        return 'text-red-400 border-red-500/50 bg-red-500/10';
    };

    const getLabel = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 50) return 'Average';
        return 'Critical';
    };

    const BreakdownItem = ({ label, value }: { label: string, value: number }) => (
        <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <div className={clsx(
                "text-lg font-bold",
                value >= 80 ? 'text-green-400' : value >= 50 ? 'text-yellow-400' : 'text-red-400'
            )}>
                {value}
            </div>
            <span className="text-xs text-gray-400 font-medium text-center mt-1">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10">
            <div className={clsx(
                "w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)]",
                getColor(score.total)
            )}>
                {score.total}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{getLabel(score.total)}</h2>
            <p className="text-gray-400 mb-6">Enterprise SEO Score</p>

            <div className="w-full grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
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
