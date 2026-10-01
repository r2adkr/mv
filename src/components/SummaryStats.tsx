import React from 'react';
import { Users, CreditCard, Clapperboard, PieChart } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatCompactKorean, formatCompactSales } from '../utils/formatters';

interface SummaryStatsProps {
  items: DailyBoxOfficeItem[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const totalAudi = items.reduce((acc, cur) => acc + (parseInt(cur.audiCnt, 10) || 0), 0);
  const totalSales = items.reduce((acc, cur) => acc + (parseInt(cur.salesAmt, 10) || 0), 0);
  const totalScreens = items.reduce((acc, cur) => acc + (parseInt(cur.scrnCnt, 10) || 0), 0);
  const top1Share = items[0]?.salesShare || '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Audience */}
      <div className="bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.07] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 mb-1.5">
          <Users className="w-3.5 h-3.5 text-[#0071e3]" />
          <span className="text-[11px] font-medium tracking-tight">총 일일 관객수</span>
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {formatNumber(totalAudi)}
          <span className="text-xs font-normal text-neutral-400 ml-1">명</span>
        </div>
      </div>

      {/* Total Sales */}
      <div className="bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.07] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 mb-1.5">
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-medium tracking-tight">총 일일 매출액</span>
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {formatCompactSales(totalSales)}
        </div>
      </div>

      {/* Total Screens */}
      <div className="bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.07] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 mb-1.5">
          <Clapperboard className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-medium tracking-tight">총 상영 스크린</span>
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          {formatNumber(totalScreens)}
          <span className="text-xs font-normal text-neutral-400 ml-1">개관</span>
        </div>
      </div>

      {/* Top 1 Share */}
      <div className="bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.07] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 mb-1.5">
          <PieChart className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-medium tracking-tight">1위 점유율</span>
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
          {top1Share}%
          <span className="text-xs font-normal text-neutral-400 ml-1">({items[0]?.movieNm?.slice(0, 5)}...)</span>
        </div>
      </div>
    </div>
  );
};
