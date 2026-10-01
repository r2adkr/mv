import type { IncomingMessage, ServerResponse } from 'http';
import { fetchDailyBoxOffice } from '../src/server/kobisService';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const multiMovieYn = typeof req.query.multiMovieYn === 'string' ? req.query.multiMovieYn : undefined;
    const repNationCd = typeof req.query.repNationCd === 'string' ? req.query.repNationCd : undefined;

    if (!date || !/^\d{8}$/.test(date)) {
      return res.status(400).json({ error: '유효한 날짜 형식(YYYYMMDD)을 입력해주세요.' });
    }

    const data = await fetchDailyBoxOffice(date, multiMovieYn, repNationCd);
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Vercel Box Office handler error:', error);
    const msg = error instanceof Error ? error.message : '박스오피스 데이터를 불러오는 중 오류가 발생했습니다.';
    return res.status(500).json({ error: msg });
  }
}
