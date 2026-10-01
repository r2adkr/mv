import React from 'react';
import { Calendar, Film, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '../utils/formatters';

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/60 dark:bg-[#1c1c1e]/60 rounded-2xl p-5 border border-black/[0.04] dark:border-white/[0.06] animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-black/[0.06] dark:bg-white/[0.08]" />
            <div className="w-16 h-3 rounded-md bg-black/[0.04] dark:bg-white/[0.06]" />
          </div>
          <div className="h-5 bg-black/[0.06] dark:bg-white/[0.08] rounded-md w-3/4" />
          <div className="h-2 bg-black/[0.04] dark:bg-white/[0.06] rounded-full w-full" />
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
            <div className="h-4 bg-black/[0.04] dark:bg-white/[0.06] rounded-md" />
            <div className="h-4 bg-black/[0.04] dark:bg-white/[0.06] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  currentDate: string;
  hasFilters: boolean;
  onResetFilters?: () => void;
  onGoToYesterday?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentDate,
  hasFilters,
  onResetFilters,
  onGoToYesterday,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md rounded-3xl border border-black/[0.05] dark:border-white/[0.06] max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto mb-4">
        <Film className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
        {hasFilters
          ? '선택한 조건에 맞는 박스오피스 영화가 없습니다.'
          : `${formatDisplayDate(currentDate)} 박스오피스 데이터가 없습니다.`}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
        {hasFilters
          ? '검색어나 국적/영화구분 필터 설정을 변경해보세요.'
          : 'KOBIS 공식 일별 박스오피스는 매일 자정 이후 최종 집계가 완료됩니다. 어제 날짜나 과거 날짜를 조회해보세요.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.14] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95"
          >
            필터 초기화
          </button>
        )}

        {onGoToYesterday && (
          <button
            type="button"
            onClick={onGoToYesterday}
            className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-semibold text-white transition-all shadow-xs active:scale-95"
          >
            어제 박스오피스 보기
          </button>
        )}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-16 px-4 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md rounded-3xl border border-rose-500/20 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
        데이터를 불러올 수 없습니다
      </h3>

      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {message || 'KOBIS 서버와의 통신에 일시적인 문제가 발생했습니다.'}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        다시 시도하기
      </button>
    </div>
  );
};
