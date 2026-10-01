import type { IncomingMessage, ServerResponse } from 'http';
import { getKobisApiKey } from '../src/server/kobisService';

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export default async function handler(_req: IncomingMessage, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = getKobisApiKey();
  res.status(200).json({
    status: 'ok',
    hasKey: Boolean(key && key.trim().length > 0),
    serverTime: new Date().toISOString(),
    platform: 'vercel-serverless',
  });
}
