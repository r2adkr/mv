/**
 * Shared KOBIS API service used by both local Express server and Vercel Serverless Functions
 */

const DEFAULT_KOBIS_KEY = 'ea11fcba159fad4b9da9112b5c5377a7';

export function getKobisApiKey(): string {
  const envKey = process.env.KOBIS_API_KEY?.trim();
  if (envKey && envKey.length > 0) {
    return envKey;
  }
  return DEFAULT_KOBIS_KEY;
}

// In-memory cache for past dates box office & movie details to optimize response time
const cache = new Map<string, { data: unknown; expiry: number }>();

export function getCache<T = unknown>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCache(key: string, data: unknown, ttlSeconds: number): void {
  cache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

export async function fetchDailyBoxOffice(date: string, multiMovieYn?: string, repNationCd?: string) {
  if (!date || !/^\d{8}$/.test(date)) {
    throw new Error('유효한 날짜 형식(YYYYMMDD)을 입력해주세요.');
  }

  const cacheKey = `boxoffice_${date}_${multiMovieYn || ''}_${repNationCd || ''}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const apiKey = getKobisApiKey();
  const params = new URLSearchParams({
    key: apiKey,
    targetDt: date,
  });
  if (multiMovieYn) {
    params.append('multiMovieYn', multiMovieYn);
  }
  if (repNationCd) {
    params.append('repNationCd', repNationCd);
  }

  const kobisUrl = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?${params.toString()}`;
  const response = await fetch(kobisUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`KOBIS API 응답 실패: ${response.statusText}`);
  }

  const data = await response.json();
  // Cache for 30 minutes
  setCache(cacheKey, data, 1800);
  return data;
}

export async function fetchMovieInfo(movieCd: string) {
  if (!movieCd) {
    throw new Error('영화 코드가 필요합니다.');
  }

  const cacheKey = `movie_${movieCd}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const apiKey = getKobisApiKey();
  const kobisUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${encodeURIComponent(movieCd)}`;
  const response = await fetch(kobisUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`KOBIS API 응답 실패: ${response.statusText}`);
  }

  const data = await response.json();
  // Movie details are static, cache for 24 hours
  setCache(cacheKey, data, 86400);
  return data;
}
