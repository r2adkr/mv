/**
 * Shared KOBIS helper for Vercel Serverless Functions in /api
 */

const DEFAULT_KOBIS_KEY = 'ea11fcba159fad4b9da9112b5c5377a7';

export function getCleanKobisApiKey(): string {
  let envKey = process.env.KOBIS_API_KEY?.trim();
  if (envKey) {
    // Strip quotes or key= prefix if accidentally entered in Vercel UI
    envKey = envKey.replace(/^["']|["']$/g, '').trim();
    if (envKey.startsWith('key=')) {
      envKey = envKey.replace('key=', '').trim();
    }
    if (envKey.length > 0) {
      return envKey;
    }
  }
  return DEFAULT_KOBIS_KEY;
}

// In-memory cache for past dates box office & movie details
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

export function sendJson(res: any, statusCode: number, data: unknown) {
  try {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(data);
    }
  } catch (_e) {
    // fallback
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
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

  let apiKey = getCleanKobisApiKey();

  const makeUrl = (key: string, useHttps = false) => {
    const protocol = useHttps ? 'https' : 'http';
    const params = new URLSearchParams({ key, targetDt: date });
    if (multiMovieYn) params.append('multiMovieYn', multiMovieYn);
    if (repNationCd) params.append('repNationCd', repNationCd);
    return `${protocol}://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?${params.toString()}`;
  };

  let response: Response;
  try {
    response = await fetchWithTimeout(makeUrl(apiKey, false), 8000);
  } catch (_err) {
    // Fallback to HTTPS
    response = await fetchWithTimeout(makeUrl(apiKey, true), 8000);
  }

  if (!response.ok) {
    throw new Error(`KOBIS API 응답 실패 (${response.status})`);
  }

  let data = await response.json();

  // If user-provided key is invalid or returned faultInfo, retry with DEFAULT_KOBIS_KEY
  if (data && data.faultInfo && apiKey !== DEFAULT_KOBIS_KEY) {
    console.warn('User KOBIS key failed with faultInfo, retrying with default key:', data.faultInfo);
    apiKey = DEFAULT_KOBIS_KEY;
    try {
      response = await fetchWithTimeout(makeUrl(apiKey, false), 8000);
      if (response.ok) {
        data = await response.json();
      }
    } catch (_e) {
      // ignore
    }
  }

  if (data && data.faultInfo) {
    throw new Error(data.faultInfo.message || 'KOBIS API 호출 오류');
  }

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

  let apiKey = getCleanKobisApiKey();

  const makeUrl = (key: string, useHttps = false) => {
    const protocol = useHttps ? 'https' : 'http';
    return `${protocol}://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${key}&movieCd=${encodeURIComponent(movieCd)}`;
  };

  let response: Response;
  try {
    response = await fetchWithTimeout(makeUrl(apiKey, false), 8000);
  } catch (_err) {
    // Fallback to HTTPS
    response = await fetchWithTimeout(makeUrl(apiKey, true), 8000);
  }

  if (!response.ok) {
    throw new Error(`KOBIS API 응답 실패 (${response.status})`);
  }

  let data = await response.json();

  // If user-provided key is invalid or returned faultInfo, retry with DEFAULT_KOBIS_KEY
  if (data && data.faultInfo && apiKey !== DEFAULT_KOBIS_KEY) {
    console.warn('User KOBIS key failed with faultInfo, retrying with default key:', data.faultInfo);
    apiKey = DEFAULT_KOBIS_KEY;
    try {
      response = await fetchWithTimeout(makeUrl(apiKey, false), 8000);
      if (response.ok) {
        data = await response.json();
      }
    } catch (_e) {
      // ignore
    }
  }

  if (data && data.faultInfo) {
    throw new Error(data.faultInfo.message || 'KOBIS API 호출 오류');
  }

  // Cache for 24 hours
  setCache(cacheKey, data, 86400);
  return data;
}
