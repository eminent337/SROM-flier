import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildStandaloneMobileAppHtml } from './server-standalone-app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOLLS_VERSION_MAP: Record<string, string> = {
  NKJV: 'NKJV',
  KJV: 'KJV',
  NLT: 'NLT',
  ESV: 'ESV',
  AMP: 'AMP',
  CSB: 'CSB17',
  NASB: 'NASB',
  GNT: 'GNTD',
  ERV: 'ERV',
  RSV: 'RSV',
  WEB: 'WEB',
};

// Load complete 66-book NIV compact database into memory at startup
type NivCompactDb = Record<string, Record<string, Record<string, string>>>;
let nivDatabase: NivCompactDb | null = null;
try {
  const nivPath = path.resolve(__dirname, 'server-data', 'niv-compact.json');
  if (fs.existsSync(nivPath)) {
    nivDatabase = JSON.parse(fs.readFileSync(nivPath, 'utf-8')) as NivCompactDb;
    console.log('Loaded local 66-book NIV database into memory.');
  }
} catch (err) {
  console.error('Failed to load local NIV database:', err);
}

function cleanVerseHtml(raw: string): string {
  return raw
    .replace(/<S>\d+<\/S>/gi, '')
    .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, ' ')
    .replace(/<b[^>]*>.*?<\/b>/gi, ' ')
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<a[^>]*>.*?<\/a>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '’')
    .replace(/`/g, '’')
    .replace(/^["“']+|["”']+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const serverNivBookCache = new Map<
  string,
  { chapters: Array<{ chapter: string; verses: Array<{ verse: string; text: string }> }> }
>();

const serverBollsChapterCache = new Map<string, Array<{ verse: number; text: string }>>();

async function fetchNivExact(
  bookId: number,
  nivBook: string,
  chapter: number,
  verseStart: number,
  verseEnd: number
): Promise<string | null> {
  // 1. Instant lookup from local memory database (all 66 books)
  if (nivDatabase) {
    const chMap = nivDatabase[String(bookId)]?.[String(chapter)];
    if (chMap) {
      const parts: string[] = [];
      for (let v = verseStart; v <= verseEnd; v++) {
        if (chMap[String(v)]) {
          parts.push(chMap[String(v)]);
        }
      }
      if (parts.length > 0) {
        return parts.join(' ');
      }
    }
  }

  // 2. Fallback to CDN if local file was missing
  if (!nivBook) return null;
  let bookData = serverNivBookCache.get(nivBook);
  if (!bookData) {
    const encoded = encodeURIComponent(nivBook);
    const urls = [
      `https://cdn.jsdelivr.net/gh/aruljohn/Bible-niv@master/${encoded}.json`,
      `https://raw.githubusercontent.com/aruljohn/Bible-niv/master/${encoded}.json`,
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.chapters)) {
            bookData = json;
            serverNivBookCache.set(nivBook, json);
            break;
          }
        }
      } catch {
        // try next mirror
      }
    }
  }
  if (!bookData) return null;

  const chObj = bookData.chapters.find((c) => Number(c.chapter) === chapter);
  if (!chObj || !Array.isArray(chObj.verses)) return null;

  const matching = chObj.verses.filter((v) => {
    const vNum = Number(v.verse);
    return vNum >= verseStart && vNum <= verseEnd;
  });
  if (matching.length === 0) return null;

  return matching
    .map((v) => v.text.replace(/`/g, '’').replace(/\s+/g, ' ').trim())
    .join(' ');
}

async function fetchFromBolls(
  bollsCode: string,
  bookId: number,
  chapter: number,
  verseStart: number,
  verseEnd: number
): Promise<string | null> {
  try {
    const cacheKey = `${bollsCode}|${bookId}|${chapter}`;
    let data = serverBollsChapterCache.get(cacheKey);
    if (!data) {
      const res = await fetch(`https://bolls.life/get-text/${bollsCode}/${bookId}/${chapter}/`);
      if (!res.ok) return null;
      const json = await res.json();
      if (!Array.isArray(json)) return null;
      data = json;
      serverBollsChapterCache.set(cacheKey, json);
    }

    const matching = data.filter(
      (v: { verse: number; text: string }) => v.verse >= verseStart && v.verse <= verseEnd
    );
    if (matching.length === 0) return null;
    const text = matching.map((v: { text: string }) => cleanVerseHtml(v.text)).join(' ');
    if (!text || text.includes('Biblica, Inc.')) return null;
    return text;
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/manifest.webmanifest', (_req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.resolve(__dirname, 'public', 'manifest.webmanifest'));
  });

  app.get('/sw.js', (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
  });

  let cachedStandaloneHtml: string | null = null;
  app.get('/api/download-mobile-app', (_req, res) => {
    try {
      if (!cachedStandaloneHtml) {
        cachedStandaloneHtml = buildStandaloneMobileAppHtml(__dirname);
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="SROM-Morning-Vitamins-App.html"'
      );
      res.send(cachedStandaloneHtml);
    } catch (err) {
      console.error('Failed to generate standalone mobile app:', err);
      res.status(500).send('Failed to generate mobile app file');
    }
  });

  app.get('/api/bible', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const ref = String(req.query.ref || '').trim();
    const nivBook = String(req.query.nivBook || '').trim();
    const version = String(req.query.version || 'NIV').trim().toUpperCase();
    const bookId = parseInt(String(req.query.bookId || '0'), 10);
    const chapter = parseInt(String(req.query.chapter || '0'), 10);
    const verseStart = parseInt(String(req.query.verseStart || '0'), 10);
    const verseEnd = parseInt(String(req.query.verseEnd || verseStart), 10);

    if (!ref || !bookId || !chapter || !verseStart) {
      res.status(400).json({ error: 'Invalid scripture parameters' });
      return;
    }

    if (version === 'NIV') {
      const nivText = await fetchNivExact(bookId, nivBook, chapter, verseStart, verseEnd);
      if (nivText) {
        res.json({ ref, version, text: nivText });
        return;
      }
    }

    const bollsCode = BOLLS_VERSION_MAP[version];
    if (bollsCode) {
      const bollsText = await fetchFromBolls(bollsCode, bookId, chapter, verseStart, verseEnd);
      if (bollsText) {
        res.json({ ref, version, text: bollsText });
        return;
      }
    }

    res.status(404).json({ error: 'Verse not found' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`SROM Studio server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
