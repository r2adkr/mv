import React from 'react';
import { ArrowUp, ArrowDown, Minus, ChevronRight } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatCompactKorean } from '../utils/formatters';

interface BoxOfficeRowProps {
  movie: DailyBoxOfficeItem;
  onSelect: (movie: DailyBoxOfficeItem) => void;
}

export const BoxOfficeRow: React.FC<BoxOfficeRowProps> = ({ movie, onSelect }) => {
  const rank = parseInt(movie.rank, 10);
  const rankInten = parseInt(movie.rankInten, 10);
  const share = parseFloat(movie.salesShare || '0');

  const getRankBadge = () => {
    if (rank === 1) return 'bg-amber-400 text-neutral-950 font-bold';
    if (rank === 2) return 'bg-slate-300 dark:bg-neutral-600 text-neutral-900 dark:text-white font-bold';
    if (rank === 3) return 'bg-amber-600 text-white font-bold';
    return 'bg-black/[0.04] dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-400 font-semibold';
  };

  return (
    <tr
      onClick={() => onSelect(movie)}
      className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.04] cursor-pointer transition-colors duration-150 border-b border-black/[0.04] dark:border-white/[0.05]"
    >
      {/* Rank & Trend */}
      <td className="py-3.5 pl-4 sm:pl-6 pr-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${getRankBadge()}`}>
            {rank}
          </span>
          <div className="w-8 text-center">
            {movie.rankOldAndNew === 'NEW' ? (
              <span className="text-[10px] font-bold text-[#0071e3] dark:text-[#2997ff]">NEW</span>
            ) : rankInten > 0 ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-rose-500">
                <ArrowUp className="w-2.5 h-2.5" />
                {rankInten}
              </span>
            ) : rankInten < 0 ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-blue-500">
                <ArrowDown className="w-2.5 h-2.5" />
                {Math.abs(rankInten)}
              </span>
            ) : (
              <span className="text-neutral-400 text-xs">
                <Minus className="w-2.5 h-2.5 mx-auto" />
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Movie Title & Release Date */}
      <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
        <div className="flex flex-col">
          <span className="font-semibold text-sm sm:text-base text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] transition-colors truncate">
            {movie.movieNm}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {movie.openDt ? `${movie.openDt.replace(/-/g, '.')} 개봉` : '개봉일 미상'}
          </span>
        </div>
      </td>

      {/* Daily Audience */}
      <td className="py-3.5 px-3 whitespace-nowrap text-right">
        <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
          {formatNumber(movie.audiCnt)}명
        </div>
        <div className="text-[11px] text-neutral-400">
          {parseInt(movie.audiInten) > 0 ? `+${formatNumber(movie.audiInten)}` : formatNumber(movie.audiInten)}
        </div>
      </td>

      {/* Sales Share */}
      <td className="hidden md:table-cell py-3.5 px-3 whitespace-nowrap w-36">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-[#0071e3] rounded-full" style={{ width: `${Math.min(share, 100)}%` }} />
          </div>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 w-10 text-right">
            {movie.salesShare}%
          </span>
        </div>
      </td>

      {/* Cumulative Audience */}
      <td className="py-3.5 px-3 whitespace-nowrap text-right font-medium text-sm text-[#0071e3] dark:text-[#2997ff]">
        {formatCompactKorean(movie.audiAcc)}
      </td>

      {/* Screen Count */}
      <td className="hidden lg:table-cell py-3.5 px-3 whitespace-nowrap text-right text-xs text-neutral-500 dark:text-neutral-400">
        {formatNumber(movie.scrnCnt)}관
      </td>

      {/* Detail trigger */}
      <td className="py-3.5 pl-2 pr-4 sm:pr-6 whitespace-nowrap text-right">
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#0071e3] group-hover:translate-x-0.5 transition-all inline-block" />
      </td>
    </tr>
  );
};
