import React from 'react';
import { Film, Moon, Sun, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDisplayDate } from '../utils/formatters';

interface HeaderProps {
  currentDate: string;
  isDark: boolean;
  onToggleTheme: () => void;
  apiStatus: 'connected' | 'checking' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  isDark,
  onToggleTheme,
  apiStatus,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#f5f5f7]/80 dark:bg-black/75 border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#42a5f5] text-white flex items-center justify-center shadow-sm shadow-[#0071e3]/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                KOBIS 박스오피스
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                · 일별 순위
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              영화관입장권 통합전산망 데이터
            </p>
          </div>
        </div>

        {/* Right side: Selected date reminder & theme toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* API Status badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            {apiStatus === 'connected' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[12px]">실시간 연동</span>
              </>
            )}
            {apiStatus === 'checking' && (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[12px]">연결 확인 중</span>
              </>
            )}
            {apiStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[12px] text-rose-500">API 오류</span>
              </>
            )}
          </div>

          {/* Quick Date Indicator */}
          <div className="hidden lg:block text-xs font-medium text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
            {formatDisplayDate(currentDate)}
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="화면 모드 전환"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] transition-all duration-150 active:scale-95"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
