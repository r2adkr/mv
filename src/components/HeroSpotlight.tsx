import React from 'react';
import { Trophy, Users, Eye, TrendingUp, Sparkles, ChevronRight, Film } from 'lucide-react';
import { DailyBoxOfficeItem } from '../types/kobis';
import { formatNumber, formatCompactKorean, formatCompactSales } from '../utils/formatters';

interface HeroSpotlightProps {
  movie: DailyBoxOfficeItem | undefined;
  onSelectMovie: (movie: DailyBoxOfficeItem) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({ movie, onSelectMovie }) => {
  if (!movie) return null;

  const sharePercent = parseFloat(movie.salesShare || '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white shadow-xl border border-white/10 group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-white/20"
      onClick={() => onSelectMovie(movie)}
    >
      {/* Ambient background glow & glass highlights */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0071e3]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative large rank watermark in background */}
      <div className="absolute right-6 sm:right-12 bottom-0 select-none font-bold text-[140px] sm:text-[200px] leading-none text-white/[0.03] pointer-events-none font-mono">
        1
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[260px] sm:min-h-[290px]">
        {/* Top bar: Rank badge & Date */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold text-xs shadow-sm">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              1위 박스오피스 1위
            </span>
            {movie.rankOldAndNew === 'NEW' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white text-[11px] font-semibold">
                NEW 신규 진입
              </span>
            ) : (
              parseInt(movie.rankInten) !== 0 && (
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  전일 대비 {movie.rankInten}위 상승
                </span>
              )
            )}
          </div>

          <span className="text-xs text-neutral-400">
            {movie.openDt ? `${movie.openDt} 개봉` : '개봉일 정보 없음'}
          </span>
        </div>

        {/* Center: Movie Title & Subtitle */}
        <div className="my-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 group-hover:text-[#42a5f5] transition-colors">
            {movie.movieNm}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-400">
            <span>스크린 {formatNumber(movie.scrnCnt)}개</span>
            <span aria-hidden="true">·</span>
            <span>상영 {formatNumber(movie.showCnt)}회</span>
            <span aria-hidden="true">·</span>
            <span>매출 점유율 {movie.salesShare}%</span>
          </div>
        </div>

        {/* Bottom Metrics & Action */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-neutral-400">
                일일 관객수
              </span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {formatNumber(movie.audiCnt)}
                <span className="text-xs font-normal text-neutral-400 ml-1">명</span>
              </span>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-wider text-neutral-400">
                누적 관객수
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-300 tracking-tight">
                {formatCompactKorean(movie.audiAcc)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[11px] uppercase tracking-wider text-neutral-400">
                일일 매출액
              </span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {formatCompactSales(movie.salesAmt)}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md border border-white/15 transition-all group-hover:bg-[#0071e3] group-hover:border-[#0071e3] self-start sm:self-auto">
            <span>상세 정보 및 캐스팅</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
