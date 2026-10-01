import { fetchMovieInfo, sendJson } from './_kobis';

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
    let movieCd =
      typeof req.query?.movieCd === 'string'
        ? req.query.movieCd
        : url.searchParams.get('movieCd') || undefined;

    if (!movieCd && req.url) {
      const parts = req.url.split('?')[0].split('/');
      const last = parts.pop() || '';
      if (last && last !== 'movie') {
        movieCd = last;
      }
    }

    if (!movieCd) {
      return sendJson(res, 400, { error: '영화 코드가 필요합니다.' });
    }

    const data = await fetchMovieInfo(movieCd);
    return sendJson(res, 200, data);
  } catch (error: unknown) {
    console.error('Vercel Movie info handler error:', error);
    const msg = error instanceof Error ? error.message : '영화 상세 정보를 불러오는 중 오류가 발생했습니다.';
    return sendJson(res, 500, { error: msg });
  }
}
