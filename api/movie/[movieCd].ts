import type { IncomingMessage, ServerResponse } from 'http';
import { fetchMovieInfo } from '../../src/server/kobisService';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    let movieCd = typeof req.query.movieCd === 'string' ? req.query.movieCd : undefined;

    if (!movieCd && req.url) {
      const parts = req.url.split('?')[0].split('/');
      const last = parts.pop() || '';
      if (last && last !== 'movie') {
        movieCd = last;
      }
    }

    if (!movieCd) {
      return res.status(400).json({ error: '영화 코드가 필요합니다.' });
    }

    const data = await fetchMovieInfo(movieCd);
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Vercel Movie dynamic route handler error:', error);
    const msg = error instanceof Error ? error.message : '영화 상세 정보를 불러오는 중 오류가 발생했습니다.';
    return res.status(500).json({ error: msg });
  }
}
