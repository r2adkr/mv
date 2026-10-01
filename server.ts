import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  fetchDailyBoxOffice,
  fetchMovieInfo,
  getKobisApiKey,
} from './src/server/kobisService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// 1. Box Office API proxy
// GET /api/boxoffice?date=YYYYMMDD&multiMovieYn=&repNationCd=
app.get('/api/boxoffice', async (req, res) => {
  try {
    const { date, multiMovieYn, repNationCd } = req.query;
    if (!date || typeof date !== 'string' || !/^\d{8}$/.test(date)) {
      return res.status(400).json({ error: '유효한 날짜 형식(YYYYMMDD)을 입력해주세요.' });
    }

    const data = await fetchDailyBoxOffice(
      date,
      typeof multiMovieYn === 'string' ? multiMovieYn : undefined,
      typeof repNationCd === 'string' ? repNationCd : undefined
    );
    return res.json(data);
  } catch (error: unknown) {
    console.error('Box Office proxy error:', error);
    const msg = error instanceof Error ? error.message : '박스오피스 데이터를 불러오는 중 오류가 발생했습니다.';
    return res.status(500).json({ error: msg });
  }
});

// 2. Movie Info API proxy
// GET /api/movie/:movieCd
app.get('/api/movie/:movieCd', async (req, res) => {
  try {
    const { movieCd } = req.params;
    if (!movieCd) {
      return res.status(400).json({ error: '영화 코드가 필요합니다.' });
    }

    const data = await fetchMovieInfo(movieCd);
    return res.json(data);
  } catch (error: unknown) {
    console.error('Movie info proxy error:', error);
    const msg = error instanceof Error ? error.message : '영화 상세 정보를 불러오는 중 오류가 발생했습니다.';
    return res.status(500).json({ error: msg });
  }
});

// Also support query param: GET /api/movie?movieCd=...
app.get('/api/movie', async (req, res) => {
  try {
    const movieCd = req.query.movieCd;
    if (!movieCd || typeof movieCd !== 'string') {
      return res.status(400).json({ error: '영화 코드가 필요합니다.' });
    }

    const data = await fetchMovieInfo(movieCd);
    return res.json(data);
  } catch (error: unknown) {
    console.error('Movie info proxy error:', error);
    const msg = error instanceof Error ? error.message : '영화 상세 정보를 불러오는 중 오류가 발생했습니다.';
    return res.status(500).json({ error: msg });
  }
});

// 3. Status/Config check endpoint (never exposes key value)
app.get('/api/status', (_req, res) => {
  const key = getKobisApiKey();
  res.json({
    status: 'ok',
    hasKey: Boolean(key && key.trim().length > 0),
    serverTime: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
