import type { IncomingMessage } from 'http';
import { fetchDailyBoxOffice } from '../src/server/kobisService';

function sendJson(res: any, statusCode: number, data: unknown) {
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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const date =
      typeof req.query?.date === 'string'
        ? req.query.date
        : url.searchParams.get('date') || undefined;

    const multiMovieYn =
      typeof req.query?.multiMovieYn === 'string'
        ? req.query.multiMovieYn
        : url.searchParams.get('multiMovieYn') || undefined;

    const repNationCd =
      typeof req.query?.repNationCd === 'string'
        ? req.query.repNationCd
        : url.searchParams.get('repNationCd') || undefined;

    if (!date || !/^\d{8}$/.test(date)) {
      return sendJson(res, 400, { error: '유효한 날짜 형식(YYYYMMDD)을 입력해주세요.' });
    }

    const data = await fetchDailyBoxOffice(date, multiMovieYn, repNationCd);
    return sendJson(res, 200, data);
  } catch (error: unknown) {
    console.error('Vercel Box Office handler error:', error);
    const msg = error instanceof Error ? error.message : '박스오피스 데이터를 불러오는 중 오류가 발생했습니다.';
    return sendJson(res, 500, { error: msg });
  }
}
