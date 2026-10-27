export interface BibleVersionOption {
  code: string;
  label: string;
  bollsCode?: string;
}

export const BIBLE_VERSIONS: BibleVersionOption[] = [
  { code: 'NIV', label: 'NIV — New International Version' },
  { code: 'NKJV', label: 'NKJV — New King James Version', bollsCode: 'NKJV' },
  { code: 'KJV', label: 'KJV — King James Version', bollsCode: 'KJV' },
  { code: 'NLT', label: 'NLT — New Living Translation', bollsCode: 'NLT' },
  { code: 'ESV', label: 'ESV — English Standard Version', bollsCode: 'ESV' },
  { code: 'AMP', label: 'AMP — Amplified Bible', bollsCode: 'AMP' },
  { code: 'CSB', label: 'CSB — Christian Standard Bible', bollsCode: 'CSB17' },
  { code: 'NASB', label: 'NASB — New American Standard Bible', bollsCode: 'NASB' },
  { code: 'GNT', label: 'GNT — Good News Translation', bollsCode: 'GNTD' },
  { code: 'ERV', label: 'ERV — Easy-to-Read Version', bollsCode: 'ERV' },
  { code: 'RSV', label: 'RSV — Revised Standard Version', bollsCode: 'RSV' },
  { code: 'WEB', label: 'WEB — World English Bible', bollsCode: 'WEB' },
];

export interface BookDef {
  id: number;
  name: string;
  nivBook: string;
  singleChapter?: boolean;
  aliases: string[];
}

export const BIBLE_BOOKS: BookDef[] = [
  { id: 1, name: 'GENESIS', nivBook: 'Genesis', aliases: ['genesis', 'gen', 'ge', 'gn'] },
  { id: 2, name: 'EXODUS', nivBook: 'Exodus', aliases: ['exodus', 'exod', 'exo', 'ex'] },
  { id: 3, name: 'LEVITICUS', nivBook: 'Leviticus', aliases: ['leviticus', 'lev', 'le', 'lv'] },
  { id: 4, name: 'NUMBERS', nivBook: 'Numbers', aliases: ['numbers', 'num', 'nu', 'nm', 'nb'] },
  { id: 5, name: 'DEUTERONOMY', nivBook: 'Deuteronomy', aliases: ['deuteronomy', 'deut', 'deu', 'dt'] },
  { id: 6, name: 'JOSHUA', nivBook: 'Joshua', aliases: ['joshua', 'josh', 'jos', 'jsh'] },
  { id: 7, name: 'JUDGES', nivBook: 'Judges', aliases: ['judges', 'judg', 'jdg', 'jg', 'jdgs'] },
  { id: 8, name: 'RUTH', nivBook: 'Ruth', aliases: ['ruth', 'rth', 'ru'] },
  { id: 9, name: '1 SAMUEL', nivBook: '1 Samuel', aliases: ['1 samuel', '1 sam', '1sam', '1 sa', '1sa', '1st samuel', '1st sam', 'first samuel', 'i samuel', 'i sam'] },
  { id: 10, name: '2 SAMUEL', nivBook: '2 Samuel', aliases: ['2 samuel', '2 sam', '2sam', '2 sa', '2sa', '2nd samuel', '2nd sam', 'second samuel', 'ii samuel', 'ii sam'] },
  { id: 11, name: '1 KINGS', nivBook: '1 Kings', aliases: ['1 kings', '1 kgs', '1kgs', '1 ki', '1ki', '1st kings', 'first kings', 'i kings', 'i kgs'] },
  { id: 12, name: '2 KINGS', nivBook: '2 Kings', aliases: ['2 kings', '2 kgs', '2kgs', '2 ki', '2ki', '2nd kings', 'second kings', 'ii kings', 'ii kgs'] },
  { id: 13, name: '1 CHRONICLES', nivBook: '1 Chronicles', aliases: ['1 chronicles', '1 chron', '1chron', '1 chr', '1chr', '1 ch', '1ch', '1st chronicles', 'first chronicles', 'i chronicles', 'i chr'] },
  { id: 14, name: '2 CHRONICLES', nivBook: '2 Chronicles', aliases: ['2 chronicles', '2 chron', '2chron', '2 chr', '2chr', '2 ch', '2ch', '2nd chronicles', 'second chronicles', 'ii chronicles', 'ii chr'] },
  { id: 15, name: 'EZRA', nivBook: 'Ezra', aliases: ['ezra', 'ezr', 'ez'] },
  { id: 16, name: 'NEHEMIAH', nivBook: 'Nehemiah', aliases: ['nehemiah', 'neh', 'ne'] },
  { id: 17, name: 'ESTHER', nivBook: 'Esther', aliases: ['esther', 'esth', 'est', 'es'] },
  { id: 18, name: 'JOB', nivBook: 'Job', aliases: ['job', 'jb'] },
  { id: 19, name: 'PSALM', nivBook: 'Psalms', aliases: ['psalms', 'psalm', 'ps', 'psa', 'psm', 'pss'] },
  { id: 20, name: 'PROVERBS', nivBook: 'Proverbs', aliases: ['proverbs', 'proverb', 'prov', 'pro', 'prv', 'pr'] },
  { id: 21, name: 'ECCLESIASTES', nivBook: 'Ecclesiastes', aliases: ['ecclesiastes', 'eccles', 'eccl', 'ecc', 'ec'] },
  { id: 22, name: 'SONG OF SOLOMON', nivBook: 'Song Of Solomon', aliases: ['song of solomon', 'song of songs', 'songs of solomon', 'songs', 'song', 'sos', 'so', 'canticles'] },
  { id: 23, name: 'ISAIAH', nivBook: 'Isaiah', aliases: ['isaiah', 'isa', 'is'] },
  { id: 24, name: 'JEREMIAH', nivBook: 'Jeremiah', aliases: ['jeremiah', 'jer', 'je', 'jr'] },
  { id: 25, name: 'LAMENTATIONS', nivBook: 'Lamentations', aliases: ['lamentations', 'lam', 'la'] },
  { id: 26, name: 'EZEKIEL', nivBook: 'Ezekiel', aliases: ['ezekiel', 'ezek', 'eze', 'ezk'] },
  { id: 27, name: 'DANIEL', nivBook: 'Daniel', aliases: ['daniel', 'dan', 'da', 'dn'] },
  { id: 28, name: 'HOSEA', nivBook: 'Hosea', aliases: ['hosea', 'hos', 'ho'] },
  { id: 29, name: 'JOEL', nivBook: 'Joel', aliases: ['joel', 'jl'] },
  { id: 30, name: 'AMOS', nivBook: 'Amos', aliases: ['amos', 'am'] },
  { id: 31, name: 'OBADIAH', nivBook: 'Obadiah', singleChapter: true, aliases: ['obadiah', 'obad', 'ob'] },
  { id: 32, name: 'JONAH', nivBook: 'Jonah', aliases: ['jonah', 'jon', 'jnh'] },
  { id: 33, name: 'MICAH', nivBook: 'Micah', aliases: ['micah', 'mic', 'mc'] },
  { id: 34, name: 'NAHUM', nivBook: 'Nahum', aliases: ['nahum', 'nah', 'na'] },
  { id: 35, name: 'HABAKKUK', nivBook: 'Habakkuk', aliases: ['habakkuk', 'hab', 'hb'] },
  { id: 36, name: 'ZEPHANIAH', nivBook: 'Zephaniah', aliases: ['zephaniah', 'zeph', 'zep', 'zp'] },
  { id: 37, name: 'HAGGAI', nivBook: 'Haggai', aliases: ['haggai', 'hag', 'hg'] },
  { id: 38, name: 'ZECHARIAH', nivBook: 'Zechariah', aliases: ['zechariah', 'zech', 'zec', 'zc'] },
  { id: 39, name: 'MALACHI', nivBook: 'Malachi', aliases: ['malachi', 'mal', 'ml'] },
  { id: 40, name: 'MATTHEW', nivBook: 'Matthew', aliases: ['matthew', 'matt', 'mat', 'mt'] },
  { id: 41, name: 'MARK', nivBook: 'Mark', aliases: ['mark', 'mrk', 'mk', 'mr'] },
  { id: 42, name: 'LUKE', nivBook: 'Luke', aliases: ['luke', 'luk', 'lk'] },
  { id: 43, name: 'JOHN', nivBook: 'John', aliases: ['john', 'jhn', 'jn'] },
  { id: 44, name: 'ACTS', nivBook: 'Acts', aliases: ['acts of the apostles', 'acts', 'act', 'ac'] },
  { id: 45, name: 'ROMANS', nivBook: 'Romans', aliases: ['romans', 'rom', 'ro', 'rm'] },
  { id: 46, name: '1 CORINTHIANS', nivBook: '1 Corinthians', aliases: ['1 corinthians', '1 cor', '1cor', '1 co', '1co', '1st corinthians', '1st cor', 'first corinthians', 'i corinthians', 'i cor'] },
  { id: 47, name: '2 CORINTHIANS', nivBook: '2 Corinthians', aliases: ['2 corinthians', '2 cor', '2cor', '2 co', '2co', '2nd corinthians', '2nd cor', 'second corinthians', 'ii corinthians', 'ii cor'] },
  { id: 48, name: 'GALATIANS', nivBook: 'Galatians', aliases: ['galatians', 'gal', 'ga'] },
  { id: 49, name: 'EPHESIANS', nivBook: 'Ephesians', aliases: ['ephesians', 'ephes', 'eph'] },
  { id: 50, name: 'PHILIPPIANS', nivBook: 'Philippians', aliases: ['philippians', 'phil', 'php', 'pp'] },
  { id: 51, name: 'COLOSSIANS', nivBook: 'Colossians', aliases: ['colossians', 'col', 'co'] },
  { id: 52, name: '1 THESSALONIANS', nivBook: '1 Thessalonians', aliases: ['1 thessalonians', '1 thess', '1thess', '1 th', '1th', '1st thessalonians', 'first thessalonians', 'i thessalonians', 'i thess'] },
  { id: 53, name: '2 THESSALONIANS', nivBook: '2 Thessalonians', aliases: ['2 thessalonians', '2 thess', '2thess', '2 th', '2th', '2nd thessalonians', 'second thessalonians', 'ii thessalonians', 'ii thess'] },
  { id: 54, name: '1 TIMOTHY', nivBook: '1 Timothy', aliases: ['1 timothy', '1 tim', '1tim', '1 ti', '1ti', '1st timothy', 'first timothy', 'i timothy', 'i tim'] },
  { id: 55, name: '2 TIMOTHY', nivBook: '2 Timothy', aliases: ['2 timothy', '2 tim', '2tim', '2 ti', '2ti', '2nd timothy', 'second timothy', 'ii timothy', 'ii tim'] },
  { id: 56, name: 'TITUS', nivBook: 'Titus', aliases: ['titus', 'tit', 'ti'] },
  { id: 57, name: 'PHILEMON', nivBook: 'Philemon', singleChapter: true, aliases: ['philemon', 'philem', 'phlm', 'phm', 'pm'] },
  { id: 58, name: 'HEBREWS', nivBook: 'Hebrews', aliases: ['hebrews', 'heb'] },
  { id: 59, name: 'JAMES', nivBook: 'James', aliases: ['james', 'jas', 'jm'] },
  { id: 60, name: '1 PETER', nivBook: '1 Peter', aliases: ['1 peter', '1 pet', '1pet', '1 pe', '1pe', '1 pt', '1pt', '1st peter', 'first peter', 'i peter', 'i pet'] },
  { id: 61, name: '2 PETER', nivBook: '2 Peter', aliases: ['2 peter', '2 pet', '2pet', '2 pe', '2pe', '2 pt', '2pt', '2nd peter', 'second peter', 'ii peter', 'ii pet'] },
  { id: 62, name: '1 JOHN', nivBook: '1 John', aliases: ['1 john', '1john', '1 jn', '1jn', '1 jhn', '1st john', 'first john', 'i john'] },
  { id: 63, name: '2 JOHN', nivBook: '2 John', singleChapter: true, aliases: ['2 john', '2john', '2 jn', '2jn', '2 jhn', '2nd john', 'second john', 'ii john'] },
  { id: 64, name: '3 JOHN', nivBook: '3 John', singleChapter: true, aliases: ['3 john', '3john', '3 jn', '3jn', '3 jhn', '3rd john', 'third john', 'iii john'] },
  { id: 65, name: 'JUDE', nivBook: 'Jude', singleChapter: true, aliases: ['jude', 'jd'] },
  { id: 66, name: 'REVELATION', nivBook: 'Revelation', aliases: ['revelations', 'revelation', 'rev', 're', 'apocalypse'] },
];

export interface ParsedReference {
  bookId: number;
  bookName: string;
  nivBook: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  canonicalRef: string; // e.g. "ACTS 6:8" or "PROVERBS 3:5-6"
}

function findMatchingBook(rawBookInput: string): BookDef | null {
  const normalized = rawBookInput
    .toLowerCase()
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return null;

  // 1. Exact match on book name or alias
  for (const book of BIBLE_BOOKS) {
    if (book.name.toLowerCase() === normalized || book.aliases.includes(normalized)) {
      return book;
    }
  }

  // 2. Prefix match (only if at least 3 chars, and must match leading number if numbered book)
  if (normalized.length >= 3) {
    const startsWithNumber = /^[1-3]\s/.test(normalized);
    for (const book of BIBLE_BOOKS) {
      const bookHasNumber = /^[1-3]\s/.test(book.name);
      if (startsWithNumber !== bookHasNumber) continue;
      if (book.name.toLowerCase().startsWith(normalized)) {
        return book;
      }
    }
  }

  return null;
}

export function parseBibleReference(rawInput: string): ParsedReference | null {
  // Strip any trailing version in parentheses e.g. "(NIV)"
  const cleaned = rawInput
    .replace(/\([a-zA-Z0-9\s-]+\)/g, '')
    .replace(/\b(?:chapter|chap)\b\.?/gi, ' ')
    .replace(/\b(?:verses|verse|vs|v)\b\.?/gi, ':')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  // Pattern 1: Book + Chapter + Separator (:, ., ;, or space) + VerseStart + optional -VerseEnd
  const match = cleaned.match(
    /^((?:[1-3]|I{1,3}|1st|2nd|3rd|first|second|third)?\s*[a-zA-Z][a-zA-Z\s.]*?)\s*(\d+)\s*(?:[:.;,]\s*|\s+)(\d+)(?:\s*[-–—]\s*(\d+))?$/i
  );

  if (match) {
    const book = findMatchingBook(match[1]);
    const chapter = parseInt(match[2], 10);
    const verseStart = parseInt(match[3], 10);
    const verseEnd = match[4] ? parseInt(match[4], 10) : verseStart;

    if (book && chapter > 0 && verseStart > 0 && verseEnd >= verseStart) {
      const rangeStr = verseEnd > verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
      return {
        bookId: book.id,
        bookName: book.name,
        nivBook: book.nivBook,
        chapter,
        verseStart,
        verseEnd,
        canonicalRef: `${book.name} ${chapter}:${rangeStr}`,
      };
    }
  }

  // Pattern 2: Single-chapter books written as "Jude 24" or "Philemon 6"
  const singleMatch = cleaned.match(
    /^((?:[1-3]|I{1,3}|2nd|3rd|second|third)?\s*[a-zA-Z][a-zA-Z\s.]*?)\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/i
  );
  if (singleMatch) {
    const book = findMatchingBook(singleMatch[1]);
    if (book && book.singleChapter) {
      const verseStart = parseInt(singleMatch[2], 10);
      const verseEnd = singleMatch[3] ? parseInt(singleMatch[3], 10) : verseStart;
      if (verseStart > 0 && verseEnd >= verseStart) {
        const rangeStr = verseEnd > verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
        return {
          bookId: book.id,
          bookName: book.name,
          nivBook: book.nivBook,
          chapter: 1,
          verseStart,
          verseEnd,
          canonicalRef: `${book.name} 1:${rangeStr}`,
        };
      }
    }
  }

  return null;
}

export function cleanBollsVerseHtml(raw: string): string {
  return raw
    // Remove Strong's numbers <S>1234</S>
    .replace(/<S>\d+<\/S>/gi, '')
    // Remove section headings or bold psalm titles <h3>...</h3>, <b>...</b>
    .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, ' ')
    .replace(/<b[^>]*>.*?<\/b>/gi, ' ')
    // Remove footnotes or superscripts <sup>...</sup> or <a>...</a>
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<a[^>]*>.*?<\/a>/gi, '')
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode basic HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '’')
    .replace(/`/g, '’')
    // Strip leading/trailing unmatched quotes if the API wrapped only the start
    .replace(/^["“']+|["”']+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface NivBookJson {
  book: string;
  chapters: Array<{
    chapter: string;
    verses: Array<{
      verse: string;
      text: string;
    }>;
  }>;
}

const nivBookCache = new Map<string, NivBookJson>();
const bollsChapterCache = new Map<string, Array<{ verse: number; text: string }>>();
const memoryVerseCache = new Map<string, string>();

async function fetchNivFromCdn(
  parsed: ParsedReference,
  signal?: AbortSignal
): Promise<string | null> {
  let bookData = nivBookCache.get(parsed.nivBook);

  if (!bookData) {
    const encodedBook = encodeURIComponent(parsed.nivBook);
    const urls = [
      `https://cdn.jsdelivr.net/gh/aruljohn/Bible-niv@master/${encodedBook}.json`,
      `https://raw.githubusercontent.com/aruljohn/Bible-niv/master/${encodedBook}.json`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, { signal });
        if (res.ok) {
          const json = (await res.json()) as NivBookJson;
          if (json && Array.isArray(json.chapters)) {
            bookData = json;
            nivBookCache.set(parsed.nivBook, json);
            break;
          }
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') throw err;
      }
    }
  }

  if (!bookData) return null;

  const chObj = bookData.chapters.find((c) => Number(c.chapter) === parsed.chapter);
  if (!chObj || !Array.isArray(chObj.verses)) return null;

  const matching = chObj.verses.filter((v) => {
    const vNum = Number(v.verse);
    return vNum >= parsed.verseStart && vNum <= parsed.verseEnd;
  });

  if (matching.length === 0) return null;

  return matching
    .map((v) => v.text.replace(/`/g, '’').replace(/\s+/g, ' ').trim())
    .join(' ');
}

async function fetchBollsChapterText(
  bollsCode: string,
  parsed: ParsedReference,
  signal?: AbortSignal
): Promise<string | null> {
  const chapterKey = `${bollsCode}|${parsed.bookId}|${parsed.chapter}`;
  let chapterVerses = bollsChapterCache.get(chapterKey);

  if (!chapterVerses) {
    const res = await fetch(
      `https://bolls.life/get-text/${bollsCode}/${parsed.bookId}/${parsed.chapter}/`,
      { signal }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!Array.isArray(json)) return null;
    chapterVerses = json;
    bollsChapterCache.set(chapterKey, json);
  }

  const matching = chapterVerses.filter(
    (v) => v.verse >= parsed.verseStart && v.verse <= parsed.verseEnd
  );
  if (matching.length === 0) return null;

  const combined = matching.map((v) => cleanBollsVerseHtml(v.text)).join(' ');
  if (!combined || combined.includes('Biblica, Inc.')) return null;
  return combined;
}

export async function fetchBibleVerseText(
  parsed: ParsedReference,
  versionCode: string,
  signal?: AbortSignal
): Promise<string | null> {
  const upperVersion = versionCode.toUpperCase();
  const cacheKey = `${parsed.canonicalRef}|${upperVersion}`;

  if (memoryVerseCache.has(cacheKey)) {
    return memoryVerseCache.get(cacheKey)!;
  }

  // 1. Primary: Fast same-origin server endpoint (/api/bible) with local in-memory 66-book NIV & cached Bolls chapters
  try {
    const params = new URLSearchParams({
      ref: parsed.canonicalRef,
      nivBook: parsed.nivBook,
      bookId: String(parsed.bookId),
      chapter: String(parsed.chapter),
      verseStart: String(parsed.verseStart),
      verseEnd: String(parsed.verseEnd),
      version: upperVersion,
    });
    const res = await fetch(`/api/bible?${params.toString()}`, { signal });
    if (res.ok) {
      const data = await res.json();
      if (data?.text && typeof data.text === 'string' && data.text.trim().length > 3) {
        const cleaned = data.text.trim();
        memoryVerseCache.set(cacheKey, cleaned);
        return cleaned;
      }
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
  }

  // 2. Client-side fallback for NIV if server endpoint was unreachable
  if (upperVersion === 'NIV') {
    const nivText = await fetchNivFromCdn(parsed, signal);
    if (nivText) {
      memoryVerseCache.set(cacheKey, nivText);
      return nivText;
    }
  }

  // 3. Client-side fallback for NKJV, KJV, NLT, ESV, AMP, CSB, NASB, GNT, ERV, RSV, WEB
  const versionOption = BIBLE_VERSIONS.find((v) => v.code === upperVersion);
  if (versionOption?.bollsCode) {
    try {
      const bollsText = await fetchBollsChapterText(versionOption.bollsCode, parsed, signal);
      if (bollsText) {
        memoryVerseCache.set(cacheKey, bollsText);
        return bollsText;
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') throw err;
    }
  }

  return null;
}
