import { getCleanKobisApiKey, sendJson } from './_kobis';

export default async function handler(_req: any, res: any) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    const key = getCleanKobisApiKey();
    return sendJson(res, 200, {
      status: 'ok',
      hasKey: Boolean(key && key.trim().length > 0),
      serverTime: new Date().toISOString(),
      platform: 'vercel-serverless',
    });
  } catch (err: unknown) {
    console.error('Status handler error:', err);
    return sendJson(res, 500, {
      status: 'error',
      error: err instanceof Error ? err.message : '서버 상태 확인 실패',
    });
  }
}
