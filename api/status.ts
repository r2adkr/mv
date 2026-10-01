import type { IncomingMessage } from 'http';
import { getKobisApiKey } from '../src/server/kobisService';

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

export default async function handler(_req: IncomingMessage, res: any) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    const key = getKobisApiKey();
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
