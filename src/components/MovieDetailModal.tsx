import React, { useEffect, useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Users,
  Film,
  Building2,
  ExternalLink,
  Award,
  Video,
  Clapperboard,
  Tag,
  Flame,
  Search,
} from 'lucide-react';
import { DailyBoxOfficeItem, MovieInfo, MovieInfoApiResponse } from '../types/kobis';
import {
  formatNumber,
  formatCompactKorean,
  formatCompactSales,
  getAuditStyle,
} from '../utils/formatters';

interface MovieDetailModalProps {
  movie: DailyBoxOfficeItem | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  const [details, setDetails] = useState<MovieInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detailed movie info when movie is selected
  useEffect(() => {
    if (!movie?.movieCd) {
      setDetails(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch(`/api/movie/${movie.movieCd}`)
      .then((res) => {
        if (!res.ok) throw new Error('영화 정보를 불러올 수 없습니다.');
        return res.json();
      })
      .then((data: MovieInfoApiResponse) => {
        if (!isMounted) return;
        if (data.movieInfoResult?.movieInfo) {
          setDetails(data.movieInfoResult.movieInfo);
        } else {
          throw new Error('영화 상세 정보 데이터가 없습니다.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Fetch movie details error:', err);
        setError(err.message || '상세 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movie?.movieCd]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  // Extract audit rating
  const auditGrade =
    details?.audits?.[0]?.watchGradeNm ||
    details?.audits?.[details.audits.length - 1]?.watchGradeNm ||
    '';
  const auditStyle = getAuditStyle(auditGrade);

  const formatRuntime = (minsStr: string) => {
    const mins = parseInt(minsStr, 10);
    if (isNaN(mins) || mins <= 0) return minsStr ? `${minsStr}분` : '미상';
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    if (hours > 0) {
      return `${mins}분 (${hours}시간 ${remainder}분)`;
    }
    return `${mins}분`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Frosted Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-200"
      />

      {/* Modal Card (Apple HIG Sheet style) */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-3xl shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden my-auto z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative p-6 sm:p-7 border-b border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02]">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.16] flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#2997ff]">
              박스오피스 {movie.rank}위
            </span>

            {auditGrade && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${auditStyle.bg} ${auditStyle.text} ${auditStyle.border}`}
              >
                {auditStyle.label}
              </span>
            )}

            {details?.typeNm && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                · {details.typeNm}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            {movie.movieNm}
          </h2>

          {/* English / Original Title */}
          {(details?.movieNmEn || details?.movieNmOg) && (
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light">
              {details.movieNmEn || details.movieNmOg}
            </p>
          )}

          {/* Quick meta bar */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-600 dark:text-neutral-300">
            {details?.showTm && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {formatRuntime(details.showTm)}
              </span>
            )}
            {movie.openDt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {movie.openDt.replace(/-/g, '.')} 개봉
              </span>
            )}
            {details?.prdtYear && (
              <span>제작연도: {details.prdtYear}년</span>
            )}
            {details?.prdtStatNm && (
              <span className="text-[#0071e3] font-medium">[{details.prdtStatNm}]</span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          {/* 1. Box Office Performance on Selected Date */}
          <div className="bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#0071e3]" />
              박스오피스 성적 지표
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center sm:text-left">
              <div>
                <span className="text-[11px] text-neutral-400 block">당일 관객수</span>
                <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {formatNumber(movie.audiCnt)}명
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  전일대비 {parseInt(movie.audiInten) >= 0 ? `+${formatNumber(movie.audiInten)}` : formatNumber(movie.audiInten)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block">누적 관객수</span>
                <span className="text-base sm:text-lg font-bold text-[#0071e3] dark:text-[#2997ff]">
                  {formatCompactKorean(movie.audiAcc)}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  ({formatNumber(movie.audiAcc)}명)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block">당일 매출액</span>
                <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {formatCompactSales(movie.salesAmt)}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  점유율 {movie.salesShare}%
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block">상영관 규모</span>
                <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {formatNumber(movie.scrnCnt)}관
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {formatNumber(movie.showCnt)}회 상영
                </span>
              </div>
            </div>
          </div>

          {/* 2. Loading State for Movie Details */}
          {isLoading && (
            <div className="space-y-4 py-4 animate-pulse">
              <div className="h-4 bg-black/[0.05] dark:bg-white/[0.05] rounded-md w-1/3" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-black/[0.05] dark:bg-white/[0.05] rounded-xl" />
                <div className="h-16 bg-black/[0.05] dark:bg-white/[0.05] rounded-xl" />
              </div>
            </div>
          )}

          {/* 3. Error State */}
          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* 4. Movie Info Content */}
          {details && !isLoading && (
            <>
              {/* Director & Genres & Nations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Directors */}
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                    감독
                  </span>
                  <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
                    {details.directors?.length > 0
                      ? details.directors.map((d) => d.peopleNm).join(', ')
                      : '정보 없음'}
                  </div>
                </div>

                {/* Genre & Nations */}
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                    장르 / 국가
                  </span>
                  <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
                    {[
                      details.genres?.map((g) => g.genreNm).join(', '),
                      details.nations?.map((n) => n.nationNm).join(', '),
                    ]
                      .filter(Boolean)
                      .join(' · ') || '정보 없음'}
                  </div>
                </div>
              </div>

              {/* Cast / Actors */}
              {details.actors && details.actors.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0071e3]" />
                    출연진 ({details.actors.length}명)
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {details.actors.slice(0, 9).map((actor, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.04]"
                      >
                        <div className="font-medium text-xs text-neutral-900 dark:text-neutral-100 truncate">
                          {actor.peopleNm}
                        </div>
                        {actor.cast && (
                          <div className="text-[11px] text-neutral-400 truncate">
                            {actor.cast} 역
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show Types (IMAX, 2D etc.) */}
              {details.showTypes && details.showTypes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5 text-[#0071e3]" />
                    상영 포맷
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {details.showTypes.map((st, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        {st.showTypeGroupNm} {st.showTypeNm && st.showTypeNm !== st.showTypeGroupNm ? `(${st.showTypeNm})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies */}
              {details.companys && details.companys.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0071e3]" />
                    제작 및 배급
                  </h3>
                  <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                    {details.companys.slice(0, 4).map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-neutral-400 text-[11px] w-14">{c.companyPartNm}</span>
                        <span className="font-medium">{c.companyNm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 5. External Search Shortcuts */}
          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <span className="text-xs text-neutral-400 block mb-2.5">더 알아보기 (외부 검색)</span>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.youtube.com/results?search_query=영화+${encodeURIComponent(movie.movieNm)}+예고편`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>YouTube 예고편</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href={`https://search.naver.com/search.naver?query=영화+${encodeURIComponent(movie.movieNm)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-emerald-500" />
                <span>네이버 영화 정보</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href={`https://search.daum.net/search?w=tot&q=영화+${encodeURIComponent(movie.movieNm)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span>다음 영화 정보</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
