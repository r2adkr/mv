import React, { useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import {
  formatDisplayDate,
  formatYYYYMMDDToInput,
  inputToYYYYMMDD,
  addDays,
  getYesterdayYYYYMMDD,
} from '../utils/formatters';
import { NationFilter, MultiMovieFilter, SortOption, ViewMode } from '../types/kobis';

interface DateControlsProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  nationFilter: NationFilter;
  onNationFilterChange: (filter: NationFilter) => void;
  multiMovieFilter: MultiMovieFilter;
  onMultiMovieFilterChange: (filter: MultiMovieFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isLoading: boolean;
}

export const DateControls: React.FC<DateControlsProps> = ({
  currentDate,
  onDateChange,
  nationFilter,
  onNationFilterChange,
  multiMovieFilter,
  onMultiMovieFilterChange,
  searchQuery,
  onSearchQueryChange,
  sortOption,
  onSortOptionChange,
  viewMode,
  onViewModeChange,
  isLoading,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const yesterday = getYesterdayYYYYMMDD();
  const isFutureOrToday = currentDate >= yesterday;

  const handlePrevDay = () => {
    onDateChange(addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    if (!isFutureOrToday) {
      onDateChange(addDays(currentDate, 1));
    }
  };

  const handlePreset = (preset: 'yesterday' | 'week' | 'month' | 'year') => {
    if (preset === 'yesterday') {
      onDateChange(yesterday);
    } else if (preset === 'week') {
      onDateChange(addDays(yesterday, -7));
    } else if (preset === 'month') {
      onDateChange(addDays(yesterday, -30));
    } else if (preset === 'year') {
      onDateChange(addDays(yesterday, -365));
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Date Picker & Navigation Card (Apple HIG design) */}
      <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Interactive Date Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Step buttons */}
            <div className="inline-flex items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1 border border-black/[0.04] dark:border-white/[0.04]">
              <button
                type="button"
                onClick={handlePrevDay}
                disabled={isLoading}
                title="이전 날짜로 이동"
                className="p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/10 hover:shadow-xs disabled:opacity-40 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Main Date Button (Triggers native date picker) */}
              <div
                onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                className="relative cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                <CalendarIcon className="w-4 h-4 text-[#0071e3]" />
                <span className="font-semibold text-sm sm:text-base tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {formatDisplayDate(currentDate)}
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  max={formatYYYYMMDDToInput(yesterday)}
                  value={formatYYYYMMDDToInput(currentDate)}
                  onChange={(e) => {
                    if (e.target.value) {
                      onDateChange(inputToYYYYMMDD(e.target.value));
                    }
                  }}
                  className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full"
                />
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                disabled={isLoading || isFutureOrToday}
                title="다음 날짜로 이동"
                className="p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/10 hover:shadow-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets (Segmented control) */}
            <div className="inline-flex items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1 border border-black/[0.04] dark:border-white/[0.04] text-xs font-medium">
              <button
                type="button"
                onClick={() => handlePreset('yesterday')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentDate === yesterday
                    ? 'bg-white dark:bg-white/15 text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                어제
              </button>
              <button
                type="button"
                onClick={() => handlePreset('week')}
                className="px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all"
              >
                1주일 전
              </button>
              <button
                type="button"
                onClick={() => handlePreset('month')}
                className="px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all"
              >
                1개월 전
              </button>
              <button
                type="button"
                onClick={() => handlePreset('year')}
                className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all"
              >
                1년 전
              </button>
            </div>
          </div>

          {/* Right: Search Input & View Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="영화 제목 검색..."
                className="w-full bg-black/[0.04] dark:bg-white/[0.08] border border-transparent focus:border-[#0071e3]/40 focus:bg-white dark:focus:bg-black rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  지우기
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1 border border-black/[0.04] dark:border-white/[0.04]">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                title="카드 그리드 뷰"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-white/15 text-[#0071e3] dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                title="목록 테이블 뷰"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-white/15 text-[#0071e3] dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Movie category & Sort order */}
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Nation Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">제작국가:</span>
            <div className="inline-flex items-center rounded-lg bg-black/[0.03] dark:bg-white/[0.05] p-0.5">
              {(
                [
                  { id: 'ALL', label: '전체' },
                  { id: 'K', label: '한국영화' },
                  { id: 'F', label: '외국영화' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNationFilterChange(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    nationFilter === tab.id
                      ? 'bg-white dark:bg-white/15 text-[#0071e3] dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700">|</span>

            {/* Diversity/Commercial Filter */}
            <span className="hidden sm:inline-block text-neutral-500 dark:text-neutral-400 font-medium">영화구분:</span>
            <div className="inline-flex items-center rounded-lg bg-black/[0.03] dark:bg-white/[0.05] p-0.5">
              {(
                [
                  { id: 'ALL', label: '전체' },
                  { id: 'N', label: '상업영화' },
                  { id: 'Y', label: '다양성' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onMultiMovieFilterChange(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    multiMovieFilter === tab.id
                      ? 'bg-white dark:bg-white/15 text-[#0071e3] dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5 ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">정렬:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
              className="bg-black/[0.04] dark:bg-white/[0.08] dark:text-neutral-100 border border-transparent rounded-lg px-2.5 py-1 text-xs text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-[#0071e3] cursor-pointer"
            >
              <option value="rank" className="dark:bg-[#1c1c1e] dark:text-white">박스오피스 순위순</option>
              <option value="audiCnt" className="dark:bg-[#1c1c1e] dark:text-white">일일 관객수순</option>
              <option value="audiAcc" className="dark:bg-[#1c1c1e] dark:text-white">누적 관객수순</option>
              <option value="salesAmt" className="dark:bg-[#1c1c1e] dark:text-white">일일 매출액순</option>
              <option value="scrnCnt" className="dark:bg-[#1c1c1e] dark:text-white">스크린수순</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
