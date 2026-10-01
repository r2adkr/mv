import React from 'react';
import { ChevronRight, ArrowUp, ArrowDown, Minus, Users, Film } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatCompactKorean, formatCompactSales } from '../utils/formatters';

interface BoxOfficeCardProps {
  movie: DailyBoxOfficeItem;
  onSelect: (movie: DailyBoxOfficeItem) => void;
}

export const BoxOfficeCard: React.FC<BoxOfficeCardProps> = ({ movie, onSelect }) => {
  const rank = parseInt(movie.rank, 10);
  const rankInten = parseInt(movie.rankInten, 10);
  const share = parseFloat(movie.salesShare || '0');

  // Apple-style rank styling
  const getRankBadge = () => {
    if (rank === 1) {
      return 'bg-gradient-to-br from-amber-400 to-amber-500 text-neutral-950 font-bold';
    }
    if (rank === 2) {
      return 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-neutral-700 dark:to-neutral-600 text-neutral-900 dark:text-white font-bold';
    }
    if (rank === 3) {
      return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold';
    }
    return 'bg-black/[0.04] dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 font-semibold';
  };

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 hover:border-black/15 dark:hover:border-white/20 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
    >
      <div>
        {/* Header: Rank + Rank Change */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm shadow-2xs ${getRankBadge()}`}
            >
              {rank}
            </span>

            {/* Rank movement */}
            {movie.rankOldAndNew === 'NEW' ? (
              <span className="text-[11px] font-bold text-[#0071e3] dark:text-[#2997ff] tracking-tight">
                NEW
              </span>
            ) : rankInten > 0 ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                {rankInten}
              </span>
            ) : rankInten < 0 ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-blue-500 dark:text-blue-400">
                <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                {Math.abs(rankInten)}
              </span>
            ) : (
              <span className="text-neutral-400 text-xs">
                <Minus className="w-3 h-3" />
              </span>
            )}
          </div>

          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {movie.openDt ? `${movie.openDt.replace(/-/g, '.')} 개봉` : ''}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-1 mb-2 group-hover:text-[#0071e3] transition-colors">
          {movie.movieNm}
        </h3>

        {/* Sales share bar */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            <span>매출 점유율</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{movie.salesShare}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0071e3] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(share, 100)}%` }}
            />
          </div>
        </div>

        {/* Audience figures */}
        <div className="grid grid-cols-2 gap-2 py-2 border-t border-black/[0.04] dark:border-white/[0.06] text-xs">
          <div>
            <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">일일 관객</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {formatNumber(movie.audiCnt)}명
            </span>
          </div>
          <div>
            <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">누적 관객</span>
            <span className="font-semibold text-[#0071e3] dark:text-[#2997ff]">
              {formatCompactKorean(movie.audiAcc)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Screen count & detail arrow */}
      <div className="mt-3 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Film className="w-3 h-3" />
          스크린 {formatNumber(movie.scrnCnt)}관
        </span>

        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#0071e3] group-hover:translate-x-0.5 transition-transform">
          상세정보
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
