import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { DateControls } from './components/DateControls';
import { HeroSpotlight } from './components/HeroSpotlight';
import { BoxOfficeCard } from './components/BoxOfficeCard';
import { BoxOfficeRow } from './components/BoxOfficeRow';
import { SummaryStats } from './components/SummaryStats';
import { MovieDetailModal } from './components/MovieDetailModal';
import { SkeletonGrid, EmptyState, ErrorState } from './components/EmptyOrLoadingState';
import {
  DailyBoxOfficeItem,
  BoxOfficeApiResponse,
  NationFilter,
  MultiMovieFilter,
  SortOption,
  ViewMode,
} from './types/kobis';
import {
  getYesterdayYYYYMMDD,
  formatDisplayDate,
} from './utils/formatters';
import { Film, Sparkles, Filter } from 'lucide-react';

export default function App() {
  // Default to yesterday (KOBIS finalizes daily box office at midnight)
  const defaultDate = useMemo(() => {
    // Check if 20260930 or yesterday
    const yesterday = getYesterdayYYYYMMDD();
    return yesterday || '20260930';
  }, []);

  const [currentDate, setCurrentDate] = useState<string>(defaultDate);
  const [boxOfficeList, setBoxOfficeList] = useState<DailyBoxOfficeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & display preferences
  const [nationFilter, setNationFilter] = useState<NationFilter>('ALL');
  const [multiMovieFilter, setMultiMovieFilter] = useState<MultiMovieFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('rank');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Selected movie for detail modal
  const [selectedMovie, setSelectedMovie] = useState<DailyBoxOfficeItem | null>(null);

  // API connectivity status
  const [apiStatus, setApiStatus] = useState<'connected' | 'checking' | 'error'>('checking');

  // Theme support (Apple system dark mode preference + manual toggle)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apple_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('apple_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('apple_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Verify backend API status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasKey) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      })
      .catch(() => {
        setApiStatus('error');
      });
  }, []);

  // Fetch box office data for current date & server filters
  const fetchBoxOffice = useCallback(async (date: string, nation: NationFilter, multi: MultiMovieFilter) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ date });
      if (nation !== 'ALL') params.append('repNationCd', nation);
      if (multi !== 'ALL') params.append('multiMovieYn', multi);

      const response = await fetch(`/api/boxoffice?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`박스오피스 데이터를 불러올 수 없습니다 (${response.status})`);
      }

      const data: BoxOfficeApiResponse = await response.json();

      if (data.faultInfo) {
        throw new Error(data.faultInfo.message || 'KOBIS API 오류가 발생했습니다.');
      }

      const list = data.boxOfficeResult?.dailyBoxOfficeList || [];
      setBoxOfficeList(list);
    } catch (err: unknown) {
      console.error('Fetch box office failed:', err);
      const errMsg = err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.';
      setError(errMsg);
      setBoxOfficeList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoxOffice(currentDate, nationFilter, multiMovieFilter);
  }, [currentDate, nationFilter, multiMovieFilter, fetchBoxOffice]);

  // Client-side search and sort
  const filteredAndSortedList = useMemo(() => {
    let result = [...boxOfficeList];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((item) => item.movieNm.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'rank') {
        return parseInt(a.rank, 10) - parseInt(b.rank, 10);
      }
      if (sortOption === 'audiCnt') {
        return parseInt(b.audiCnt, 10) - parseInt(a.audiCnt, 10);
      }
      if (sortOption === 'audiAcc') {
        return parseInt(b.audiAcc, 10) - parseInt(a.audiAcc, 10);
      }
      if (sortOption === 'salesAmt') {
        return parseInt(b.salesAmt, 10) - parseInt(a.salesAmt, 10);
      }
      if (sortOption === 'scrnCnt') {
        return parseInt(b.scrnCnt, 10) - parseInt(a.scrnCnt, 10);
      }
      return 0;
    });

    return result;
  }, [boxOfficeList, searchQuery, sortOption]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setNationFilter('ALL');
    setMultiMovieFilter('ALL');
    setSortOption('rank');
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() || nationFilter !== 'ALL' || multiMovieFilter !== 'ALL'
  );

  const top1Movie = useMemo(() => {
    return boxOfficeList.find((m) => m.rank === '1') || boxOfficeList[0];
  }, [boxOfficeList]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200">
      {/* 1. Frosted Navigation Header */}
      <Header
        currentDate={currentDate}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        apiStatus={apiStatus}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Date Selection & Filtering Control Panel */}
        <DateControls
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          nationFilter={nationFilter}
          onNationFilterChange={setNationFilter}
          multiMovieFilter={multiMovieFilter}
          onMultiMovieFilterChange={setMultiMovieFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && <SkeletonGrid count={8} />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            message={error}
            onRetry={() => fetchBoxOffice(currentDate, nationFilter, multiMovieFilter)}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedList.length === 0 && (
          <EmptyState
            currentDate={currentDate}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onGoToYesterday={() => setCurrentDate(getYesterdayYYYYMMDD())}
          />
        )}

        {/* Loaded Content */}
        {!isLoading && !error && filteredAndSortedList.length > 0 && (
          <>
            {/* Top Summary Metrics */}
            <SummaryStats items={boxOfficeList} />

            {/* Spotlight Banner: Featured #1 Movie (shown when not filtered by search) */}
            {!searchQuery.trim() && top1Movie && (
              <HeroSpotlight
                movie={top1Movie}
                onSelectMovie={setSelectedMovie}
              />
            )}

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  <span>박스오피스 순위</span>
                  <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-400">
                    총 {filteredAndSortedList.length}개 작품
                  </span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {formatDisplayDate(currentDate)} 기준 공식 집계
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#0071e3] hover:underline self-start sm:self-auto font-medium"
                >
                  필터 초기화
                </button>
              )}
            </div>

            {/* View Mode: Grid or List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredAndSortedList.map((movie) => (
                  <BoxOfficeCard
                    key={movie.movieCd}
                    movie={movie}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-black/[0.04] dark:border-white/[0.06]">
                      <tr>
                        <th className="py-3 pl-4 sm:pl-6 pr-3">순위</th>
                        <th className="py-3 px-3">영화명</th>
                        <th className="py-3 px-3 text-right">일일 관객수</th>
                        <th className="hidden md:table-cell py-3 px-3">점유율</th>
                        <th className="py-3 px-3 text-right">누적 관객수</th>
                        <th className="hidden lg:table-cell py-3 px-3 text-right">스크린수</th>
                        <th className="py-3 pl-2 pr-4 sm:pr-6 text-right">상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedList.map((movie) => (
                        <BoxOfficeRow
                          key={movie.movieCd}
                          movie={movie}
                          onSelect={setSelectedMovie}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 3. Movie Detail Modal Sheet */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {/* 4. Apple-style Minimal Footer */}
      <footer className="mt-16 border-t border-black/[0.06] dark:border-white/[0.08] py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-neutral-700 dark:text-neutral-300">
            KOBIS 일일 박스오피스 대시보드
          </p>
          <p className="text-[11px] text-neutral-400">
            데이터 출처: 영화진흥위원회 (KOBIS) 영화관입장권통합전산망 오픈 API
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-neutral-400">
            <span>실시간 프록시 보안 보호</span>
            <span>·</span>
            <span>Apple HIG 디자인 시스템</span>
            <span>·</span>
            <span>반응형 인터페이스</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
