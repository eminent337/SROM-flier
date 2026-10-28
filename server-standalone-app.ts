import fs from 'fs';
import path from 'path';

export function buildStandaloneMobileAppHtml(rootDir: string): string {
  const templatePath = path.resolve(rootDir, 'public', 'assets', 'aistudio', 'srom_clean_template.png');
  const pastorPath = path.resolve(rootDir, 'public', 'assets', 'aistudio', 'image_ac3cca0a.png');
  const iconPath = path.resolve(rootDir, 'public', 'apple-touch-icon.png');

  const templateB64 = fs.existsSync(templatePath)
    ? `data:image/png;base64,${fs.readFileSync(templatePath).toString('base64')}`
    : '';
  const pastorB64 = fs.existsSync(pastorPath)
    ? `data:image/png;base64,${fs.readFileSync(pastorPath).toString('base64')}`
    : '';
  const iconB64 = fs.existsSync(iconPath)
    ? `data:image/png;base64,${fs.readFileSync(iconPath).toString('base64')}`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  <title>SROM Morning Vitamins — Mobile App</title>
  <link rel="icon" type="image/png" href="${iconB64}" />
  <link rel="apple-touch-icon" href="${iconB64}" />
  <meta name="theme-color" content="#F7F5EE" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="SROM Flyer" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=Montserrat:wght@700;800;900&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F7F5EE;
      color: #0F172A;
      min-height: 100vh;
      padding-bottom: 32px;
    }
    header {
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 20;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 16px;
      color: #0F172A;
    }
    .brand img {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1.5px solid #F59E0B;
    }
    .container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 960px) {
      .container {
        grid-template-columns: 1fr 1fr;
        align-items: start;
      }
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid #E2E8F0;
    }
    .field-group:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }
    .label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    label {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
    }
    .sub-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }
    input[type="text"], select, textarea {
      width: 100%;
      padding: 12px 14px;
      font-size: 15px;
      font-weight: 700;
      border: 2px solid #CBD5E1;
      border-radius: 12px;
      background: #F8FAFC;
      color: #020617;
      font-family: inherit;
    }
    input[type="text"]:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #F59E0B;
      background: #FFFFFF;
    }
    select {
      background: #FFFBEB;
      border-color: #FBBF24;
      cursor: pointer;
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    @media (min-width: 540px) {
      .row-2 {
        grid-template-columns: 1.3fr 1fr;
      }
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    button, .btn-label {
      min-height: 42px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 800;
      border-radius: 10px;
      border: 1px solid #CBD5E1;
      background: #F1F5F9;
      color: #0F172A;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-amber {
      background: #FBBF24;
      border-color: #F59E0B;
      color: #020617;
    }
    .btn-dark {
      background: #0F172A;
      border-color: #0F172A;
      color: #FFFFFF;
    }
    .status-badge {
      font-size: 12px;
      font-weight: 700;
      color: #047857;
    }
    .canvas-wrap {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    canvas {
      width: 100%;
      max-width: 480px;
      height: auto;
      display: block;
      border-radius: 6px;
      background: #FFFFFF;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <img src="${iconB64}" alt="SROM" />
      <span>SROM Morning Vitamins</span>
    </div>
    <button type="button" class="btn-amber" id="topShareBtn">Share / Save Flyer</button>
  </header>

  <main class="container">
    <section class="card">
      <div class="label-row">
        <div>
          <div class="section-title">Daily Morning Vitamins Editor</div>
          <p style="font-size:12px;color:#475569;margin-top:4px;font-weight:500;">
            Type the Bible verse and choose the version — the scripture words load automatically.
          </p>
        </div>
        <div class="btn-row">
          <button type="button" id="resetBtn">Reset</button>
          <button type="button" class="btn-dark" id="saveJpgBtn">Download JPG</button>
        </div>
      </div>

      <div class="field-group">
        <div class="label-row">
          <label for="dateInput">1. Date & Heading Line</label>
          <div class="btn-row">
            <button type="button" id="todayBtn" style="min-height:34px;padding:4px 10px;">Today</button>
            <button type="button" id="tomorrowBtn" style="min-height:34px;padding:4px 10px;">Tomorrow</button>
            <label class="btn-label" style="min-height:34px;padding:4px 10px;background:#FEF3C7;border-color:#FCD34D;">
              Pick Date
              <input type="date" id="datePicker" style="display:none;" />
            </label>
          </div>
        </div>
        <input type="text" id="dateInput" value="1ST OCTOBER, 2026 - MORNING VITAMINS" />
      </div>

      <div class="field-group">
        <div class="label-row">
          <label for="verseInput">2. Bible Verse & Version (Auto-Loads Words)</label>
          <span class="status-badge" id="lookupStatus">Loaded NIV</span>
        </div>

        <div class="row-2">
          <div>
            <div class="sub-label" style="margin-bottom:4px;">Type Bible Book, Chapter & Verse</div>
            <input type="text" id="verseInput" value="ACTS 6:8" placeholder="e.g. Acts 6:8 or John 3:16" style="text-transform:uppercase;" />
          </div>
          <div>
            <div class="sub-label" style="margin-bottom:4px;">Choose Bible Version</div>
            <select id="versionSelect">
              <option value="NIV">NIV — New International Version</option>
              <option value="NKJV">NKJV — New King James Version</option>
              <option value="KJV">KJV — King James Version</option>
              <option value="NLT">NLT — New Living Translation</option>
              <option value="ESV">ESV — English Standard Version</option>
              <option value="AMP">AMP — Amplified Bible</option>
              <option value="CSB">CSB — Christian Standard Bible</option>
              <option value="NASB">NASB — New American Standard Bible</option>
              <option value="GNT">GNT — Good News Translation</option>
              <option value="ERV">ERV — Easy-to-Read Version</option>
              <option value="RSV">RSV — Revised Standard Version</option>
              <option value="WEB">WEB — World English Bible</option>
            </select>
          </div>
        </div>

        <div>
          <div class="label-row" style="margin-bottom:4px;">
            <span class="sub-label">Bible Verse Words (loads automatically)</span>
            <span id="bannerPreview" style="font-size:11px;font-weight:800;background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:6px;">Banner: ACTS 6:8 (NIV)</span>
          </div>
          <textarea id="verseTextInput" rows="4" style="text-transform:uppercase;">NOW STEPHEN, A MAN FULL OF GOD’S GRACE AND POWER, PERFORMED GREAT WONDERS AND SIGNS AMONG THE PEOPLE.</textarea>
        </div>
      </div>

      <div class="field-group">
        <div class="label-row">
          <label for="declInput">3. Daily Declaration</label>
          <span style="font-size:11px;color:#475569;font-weight:600;">Auto-fits</span>
        </div>
        <textarea id="declInput" rows="5">I am not an ordinary person. I am filled with God’s grace and mighty power. God will use me in various ways to solve mysterious problems. I am a trailblazer and a pacesetter. God will use me to perform great signs and wonders! I will surely leave an indelible mark on the earth.</textarea>
      </div>

      <div class="btn-row" style="justify-content:space-between;">
        <button type="button" class="btn-dark" id="viewFlyerBtn" style="flex:1;">View Flyer</button>
        <button type="button" class="btn-amber" id="sharePngBtn" style="flex:1;">Share / Save PNG</button>
      </div>
    </section>

    <section class="card" id="previewSection">
      <div class="label-row">
        <span class="section-title" style="font-size:15px;">Live Flyer Preview</span>
        <span style="font-size:11px;color:#64748B;font-family:monospace;">1061 × 1482 px</span>
      </div>
      <div class="canvas-wrap">
        <canvas id="flyerCanvas" width="1061" height="1482"></canvas>
      </div>
    </section>
  </main>

  <script>
    const TEMPLATE_DATA_URL = "${templateB64}";
    const PASTOR_DATA_URL = "${pastorB64}";

    const BIBLE_BOOKS = [
      { id: 1, name: 'GENESIS', nivBook: 'Genesis', aliases: ['genesis', 'gen', 'ge', 'gn'] },
      { id: 2, name: 'EXODUS', nivBook: 'Exodus', aliases: ['exodus', 'exod', 'exo', 'ex'] },
      { id: 3, name: 'LEVITICUS', nivBook: 'Leviticus', aliases: ['leviticus', 'lev', 'le', 'lv'] },
      { id: 4, name: 'NUMBERS', nivBook: 'Numbers', aliases: ['numbers', 'num', 'nu', 'nm', 'nb'] },
      { id: 5, name: 'DEUTERONOMY', nivBook: 'Deuteronomy', aliases: ['deuteronomy', 'deut', 'deu', 'dt'] },
      { id: 6, name: 'JOSHUA', nivBook: 'Joshua', aliases: ['joshua', 'josh', 'jos', 'jsh'] },
      { id: 7, name: 'JUDGES', nivBook: 'Judges', aliases: ['judges', 'judg', 'jdg', 'jg', 'jdgs'] },
      { id: 8, name: 'RUTH', nivBook: 'Ruth', aliases: ['ruth', 'rth', 'ru'] },
      { id: 9, name: '1 SAMUEL', nivBook: '1 Samuel', aliases: ['1 samuel', '1 sam', '1sam', '1 sa', '1sa'] },
      { id: 10, name: '2 SAMUEL', nivBook: '2 Samuel', aliases: ['2 samuel', '2 sam', '2sam', '2 sa', '2sa'] },
      { id: 11, name: '1 KINGS', nivBook: '1 Kings', aliases: ['1 kings', '1 kgs', '1kgs', '1 ki', '1ki'] },
      { id: 12, name: '2 KINGS', nivBook: '2 Kings', aliases: ['2 kings', '2 kgs', '2kgs', '2 ki', '2ki'] },
      { id: 13, name: '1 CHRONICLES', nivBook: '1 Chronicles', aliases: ['1 chronicles', '1 chron', '1chron', '1 chr', '1chr'] },
      { id: 14, name: '2 CHRONICLES', nivBook: '2 Chronicles', aliases: ['2 chronicles', '2 chron', '2chron', '2 chr', '2chr'] },
      { id: 15, name: 'EZRA', nivBook: 'Ezra', aliases: ['ezra', 'ezr', 'ez'] },
      { id: 16, name: 'NEHEMIAH', nivBook: 'Nehemiah', aliases: ['nehemiah', 'neh', 'ne'] },
      { id: 17, name: 'ESTHER', nivBook: 'Esther', aliases: ['esther', 'esth', 'est', 'es'] },
      { id: 18, name: 'JOB', nivBook: 'Job', aliases: ['job', 'jb'] },
      { id: 19, name: 'PSALM', nivBook: 'Psalms', aliases: ['psalms', 'psalm', 'ps', 'psa', 'psm', 'pss'] },
      { id: 20, name: 'PROVERBS', nivBook: 'Proverbs', aliases: ['proverbs', 'proverb', 'prov', 'pro', 'prv', 'pr'] },
      { id: 21, name: 'ECCLESIASTES', nivBook: 'Ecclesiastes', aliases: ['ecclesiastes', 'eccles', 'eccl', 'ecc', 'ec'] },
      { id: 22, name: 'SONG OF SOLOMON', nivBook: 'Song Of Solomon', aliases: ['song of solomon', 'song of songs', 'songs', 'song', 'sos'] },
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
      { id: 46, name: '1 CORINTHIANS', nivBook: '1 Corinthians', aliases: ['1 corinthians', '1 cor', '1cor', '1 co', '1co'] },
      { id: 47, name: '2 CORINTHIANS', nivBook: '2 Corinthians', aliases: ['2 corinthians', '2 cor', '2cor', '2 co', '2co'] },
      { id: 48, name: 'GALATIANS', nivBook: 'Galatians', aliases: ['galatians', 'gal', 'ga'] },
      { id: 49, name: 'EPHESIANS', nivBook: 'Ephesians', aliases: ['ephesians', 'ephes', 'eph'] },
      { id: 50, name: 'PHILIPPIANS', nivBook: 'Philippians', aliases: ['philippians', 'phil', 'php', 'pp'] },
      { id: 51, name: 'COLOSSIANS', nivBook: 'Colossians', aliases: ['colossians', 'col', 'co'] },
      { id: 52, name: '1 THESSALONIANS', nivBook: '1 Thessalonians', aliases: ['1 thessalonians', '1 thess', '1thess', '1 th', '1th'] },
      { id: 53, name: '2 THESSALONIANS', nivBook: '2 Thessalonians', aliases: ['2 thessalonians', '2 thess', '2thess', '2 th', '2th'] },
      { id: 54, name: '1 TIMOTHY', nivBook: '1 Timothy', aliases: ['1 timothy', '1 tim', '1tim', '1 ti', '1ti'] },
      { id: 55, name: '2 TIMOTHY', nivBook: '2 Timothy', aliases: ['2 timothy', '2 tim', '2tim', '2 ti', '2ti'] },
      { id: 56, name: 'TITUS', nivBook: 'Titus', aliases: ['titus', 'tit', 'ti'] },
      { id: 57, name: 'PHILEMON', nivBook: 'Philemon', singleChapter: true, aliases: ['philemon', 'philem', 'phlm', 'phm'] },
      { id: 58, name: 'HEBREWS', nivBook: 'Hebrews', aliases: ['hebrews', 'heb'] },
      { id: 59, name: 'JAMES', nivBook: 'James', aliases: ['james', 'jas', 'jm'] },
      { id: 60, name: '1 PETER', nivBook: '1 Peter', aliases: ['1 peter', '1 pet', '1pet', '1 pe', '1pe'] },
      { id: 61, name: '2 PETER', nivBook: '2 Peter', aliases: ['2 peter', '2 pet', '2pet', '2 pe', '2pe'] },
      { id: 62, name: '1 JOHN', nivBook: '1 John', aliases: ['1 john', '1john', '1 jn', '1jn'] },
      { id: 63, name: '2 JOHN', nivBook: '2 John', singleChapter: true, aliases: ['2 john', '2john', '2 jn', '2jn'] },
      { id: 64, name: '3 JOHN', nivBook: '3 John', singleChapter: true, aliases: ['3 john', '3john', '3 jn', '3jn'] },
      { id: 65, name: 'JUDE', nivBook: 'Jude', singleChapter: true, aliases: ['jude', 'jd'] },
      { id: 66, name: 'REVELATION', nivBook: 'Revelation', aliases: ['revelations', 'revelation', 'rev', 're'] }
    ];

    const BOLLS_MAP = {
      NKJV: 'NKJV', KJV: 'KJV', NLT: 'NLT', ESV: 'ESV', AMP: 'AMP',
      CSB: 'CSB17', NASB: 'NASB', GNT: 'GNTD', ERV: 'ERV', RSV: 'RSV', WEB: 'WEB'
    };

    const dateInput = document.getElementById('dateInput');
    const verseInput = document.getElementById('verseInput');
    const versionSelect = document.getElementById('versionSelect');
    const verseTextInput = document.getElementById('verseTextInput');
    const declInput = document.getElementById('declInput');
    const bannerPreview = document.getElementById('bannerPreview');
    const lookupStatus = document.getElementById('lookupStatus');
    const canvas = document.getElementById('flyerCanvas');

    let templateImg = new Image();
    let pastorImg = new Image();
    let currentBannerRef = 'ACTS 6:8 (NIV)';

    function parseRef(raw) {
      let cleaned = (raw || '').replace(/\\([^)]*\\)/g, '').trim().replace(/[–—]/g, '-');
      const m = cleaned.match(/^(.+?)\\s+(\\d+)\\s*(?:[:.,]|\\s)\\s*(\\d+)(?:\\s*-\\s*(\\d+))?$/i);
      if (!m) return null;
      const bNorm = m[1].toLowerCase().replace(/\\./g, ' ').replace(/\\s+/g, ' ').trim();
      let found = null;
      for (const b of BIBLE_BOOKS) {
        if (b.name.toLowerCase() === bNorm || b.aliases.includes(bNorm)) { found = b; break; }
      }
      if (!found && bNorm.length >= 3) {
        for (const b of BIBLE_BOOKS) {
          if (b.name.toLowerCase().startsWith(bNorm)) { found = b; break; }
        }
      }
      if (!found) return null;
      const ch = parseInt(m[2], 10);
      const vs = parseInt(m[3], 10);
      const ve = m[4] ? Math.max(vs, parseInt(m[4], 10)) : vs;
      const range = ve > vs ? vs + '-' + ve : '' + vs;
      return { bookId: found.id, bookName: found.name, nivBook: found.nivBook, chapter: ch, verseStart: vs, verseEnd: ve, canonicalRef: found.name + ' ' + ch + ':' + range };
    }

    async function lookupVerse() {
      const parsed = parseRef(verseInput.value);
      const ver = versionSelect.value;
      if (!parsed) {
        const clean = verseInput.value.trim().toUpperCase();
        currentBannerRef = clean ? clean + ' (' + ver + ')' : '';
        bannerPreview.textContent = 'Banner: ' + currentBannerRef;
        renderFlyer();
        return;
      }
      currentBannerRef = parsed.canonicalRef + ' (' + ver + ')';
      bannerPreview.textContent = 'Banner: ' + currentBannerRef;
      lookupStatus.textContent = 'Loading ' + ver + '...';
      renderFlyer();

      try {
        if (ver === 'NIV') {
          const res = await fetch('https://cdn.jsdelivr.net/gh/aruljohn/Bible-niv@master/' + encodeURIComponent(parsed.nivBook) + '.json');
          if (res.ok) {
            const data = await res.json();
            const chObj = (data.chapters || []).find(c => Number(c.chapter) === parsed.chapter);
            if (chObj && chObj.verses) {
              const parts = chObj.verses.filter(v => Number(v.verse) >= parsed.verseStart && Number(v.verse) <= parsed.verseEnd).map(v => v.text);
              if (parts.length > 0) {
                verseTextInput.value = parts.join(' ').toUpperCase();
                lookupStatus.textContent = 'Loaded ' + parsed.canonicalRef + ' (NIV)';
                renderFlyer();
                return;
              }
            }
          }
        } else {
          const bollsCode = BOLLS_MAP[ver] || 'KJV';
          const res = await fetch('https://bolls.life/get-text/' + bollsCode + '/' + parsed.bookId + '/' + parsed.chapter + '/');
          if (res.ok) {
            const arr = await res.json();
            const parts = arr.filter(v => v.verse >= parsed.verseStart && v.verse <= parsed.verseEnd)
              .map(v => v.text.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\\s+/g, ' ').trim());
            if (parts.length > 0) {
              verseTextInput.value = parts.join(' ').toUpperCase();
              lookupStatus.textContent = 'Loaded ' + parsed.canonicalRef + ' (' + ver + ')';
              renderFlyer();
              return;
            }
          }
        }
        lookupStatus.textContent = 'Ready';
      } catch (e) {
        lookupStatus.textContent = 'Offline / Custom edit';
      }
    }

    function drawBoldText(ctx, text, x, y, strokeWidth) {
      if (strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
      }
      ctx.fillText(text, x, y);
    }

    function wrapTextLines(ctx, text, getMaxWidthForLine) {
      const paragraphs = text.trim().split(/\\n+/).map(p => p.trim()).filter(Boolean);
      const lines = [];
      for (const para of paragraphs) {
        const words = para.split(/\\s+/);
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const maxW = getMaxWidthForLine(lines.length);
          if (ctx.measureText(testLine).width <= maxW || !currentLine) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
      }
      return lines;
    }

    function renderFlyer() {
      if (!templateImg.complete || !pastorImg.complete) return;
      const ctx = canvas.getContext('2d');
      const width = 1061, height = 1482;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(templateImg, 0, 0, width, height);

      const dateStr = dateInput.value.trim().toUpperCase();
      if (dateStr) {
        ctx.save();
        let dateFontSize = 31.5;
        ctx.font = '700 ' + dateFontSize + 'px "Outfit", "Montserrat", sans-serif';
        while (ctx.measureText(dateStr).width > 566 && dateFontSize > 15) {
          dateFontSize -= 0.5;
          ctx.font = '700 ' + dateFontSize + 'px "Outfit", "Montserrat", sans-serif';
        }
        ctx.fillStyle = '#07222D';
        ctx.strokeStyle = '#07222D';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        drawBoldText(ctx, dateStr, 226, 140.5, dateFontSize * 0.025);
        const measuredW = Math.min(ctx.measureText(dateStr).width, 566);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(226, 146);
        ctx.lineTo(226 + measuredW, 146);
        ctx.stroke();
        ctx.restore();
      }

      if (currentBannerRef) {
        ctx.save();
        let refFontSize = 50;
        ctx.font = '900 ' + refFontSize + 'px "Montserrat", sans-serif';
        while (ctx.measureText(currentBannerRef).width > 385 && refFontSize > 20) {
          refFontSize -= 0.5;
          ctx.font = '900 ' + refFontSize + 'px "Montserrat", sans-serif';
        }
        ctx.fillStyle = '#05070B';
        ctx.strokeStyle = '#05070B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawBoldText(ctx, currentBannerRef, 530.5, 239, refFontSize * 0.026);
        ctx.restore();
      }

      const verseUpper = verseTextInput.value.trim().toUpperCase();
      if (verseUpper) {
        ctx.save();
        const boxTop = 292, boxBottom = 684, boxHeight = boxBottom - boxTop, maxVerseWidth = 790;
        let fontSize = 68, lines = [], lineHeight = fontSize * 1.02;
        for (fontSize = 68; fontSize >= 22; fontSize -= 0.5) {
          ctx.font = '900 ' + fontSize + 'px "Montserrat", sans-serif';
          const effectiveWidth = fontSize >= 62 ? 755 : maxVerseWidth;
          lines = wrapTextLines(ctx, verseUpper, () => effectiveWidth);
          lineHeight = fontSize * 1.03;
          const longestWordWidth = Math.max(...verseUpper.split(/\\s+/).map(w => ctx.measureText(w).width));
          if (lines.length * lineHeight <= boxHeight && longestWordWidth <= maxVerseWidth) break;
        }
        const totalTextHeight = (lines.length - 1) * lineHeight + fontSize * 0.74;
        let currentY = boxTop + (boxHeight - totalTextHeight) / 2 + fontSize * 0.74;
        ctx.fillStyle = '#05070B';
        ctx.strokeStyle = '#05070B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        const strokeBoldness = fontSize * 0.028;
        for (const line of lines) {
          drawBoldText(ctx, line, 531.5, currentY, strokeBoldness);
          currentY += lineHeight;
        }
        ctx.restore();
      }

      const declStr = declInput.value.trim();
      if (declStr) {
        ctx.save();
        const declTop = 828, declBottom = 1254, declBoxHeight = declBottom - declTop;
        let declFontSize = 48, declLines = [], declLineHeight = declFontSize * 1.07;
        for (declFontSize = 48; declFontSize >= 22; declFontSize -= 0.5) {
          ctx.font = '700 ' + declFontSize + 'px "Outfit", sans-serif';
          declLineHeight = declFontSize * 1.07;
          const approxNarrowStartLine = Math.max(5, Math.floor((1150 - declTop) / declLineHeight));
          declLines = wrapTextLines(ctx, declStr, idx => idx >= approxNarrowStartLine ? 508 : 650);
          const totalH = (declLines.length - 1) * declLineHeight + declFontSize * 0.78;
          if (totalH <= declBoxHeight) break;
        }
        const totalDeclHeight = (declLines.length - 1) * declLineHeight + declFontSize * 0.78;
        let currentY = declTop + (declBoxHeight - totalDeclHeight) / 2 + declFontSize * 0.76;
        ctx.fillStyle = '#090C12';
        ctx.strokeStyle = '#090C12';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        const declStrokeBoldness = declFontSize * 0.024;
        declLines.forEach(line => {
          const lineCenterX = currentY >= 1158 ? 552 : 542;
          drawBoldText(ctx, line, lineCenterX, currentY, declStrokeBoldness);
          currentY += declLineHeight;
        });
        ctx.restore();
      }

      const circleX = 187.5, circleY = 1293, circleRadius = 126.5, ringWidth = 6.5;
      const innerRadius = circleRadius - ringWidth / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = '#BBB8AF';
      ctx.fillRect(circleX - circleRadius - 10, circleY - circleRadius - 10, (circleRadius + 10) * 2, (circleRadius + 10) * 2);
      const pWidth = pastorImg.naturalWidth * 0.395;
      const pHeight = pastorImg.naturalHeight * 0.395;
      const drawX = circleX - pWidth / 2 - 6;
      const drawY = circleY - pHeight / 2 + 24;
      ctx.drawImage(pastorImg, drawX, drawY, pWidth, pHeight);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius - ringWidth / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#F6B61E';
      ctx.lineWidth = ringWidth;
      ctx.stroke();
      ctx.restore();
    }

    function formatOrdinalDate(date) {
      const day = date.getDate();
      const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
      const mod100 = day % 100;
      const suffix = (mod100 >= 11 && mod100 <= 13) ? 'TH' : ({1:'ST',2:'ND',3:'RD'}[day % 10] || 'TH');
      return day + suffix + ' ' + months[date.getMonth()] + ', ' + date.getFullYear() + ' - MORNING VITAMINS';
    }

    document.getElementById('todayBtn').onclick = () => { dateInput.value = formatOrdinalDate(new Date()); renderFlyer(); };
    document.getElementById('tomorrowBtn').onclick = () => { const d = new Date(); d.setDate(d.getDate() + 1); dateInput.value = formatOrdinalDate(d); renderFlyer(); };
    document.getElementById('datePicker').onchange = (e) => {
      if (!e.target.value) return;
      const [y, m, d] = e.target.value.split('-').map(Number);
      dateInput.value = formatOrdinalDate(new Date(y, m - 1, d));
      renderFlyer();
    };

    let debounceTimer = null;
    verseInput.oninput = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(lookupVerse, 150); };
    versionSelect.onchange = lookupVerse;
    dateInput.oninput = renderFlyer;
    verseTextInput.oninput = renderFlyer;
    declInput.oninput = renderFlyer;

    function downloadFlyer(mime, ext) {
      const url = canvas.toDataURL(mime, 0.96);
      const a = document.createElement('a');
      a.download = 'morning-vitamins.' + ext;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function shareOrDownload() {
      canvas.toBlob(async (blob) => {
        if (!blob) { downloadFlyer('image/png', 'png'); return; }
        const file = new File([blob], 'morning-vitamins.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ title: dateInput.value, text: currentBannerRef, files: [file] });
            return;
          } catch (e) {}
        }
        downloadFlyer('image/png', 'png');
      }, 'image/png', 0.96);
    }

    document.getElementById('topShareBtn').onclick = shareOrDownload;
    document.getElementById('sharePngBtn').onclick = shareOrDownload;
    document.getElementById('saveJpgBtn').onclick = () => downloadFlyer('image/jpeg', 'jpg');
    document.getElementById('viewFlyerBtn').onclick = () => {
      document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
    };
    document.getElementById('resetBtn').onclick = () => {
      dateInput.value = '1ST OCTOBER, 2026 - MORNING VITAMINS';
      verseInput.value = 'ACTS 6:8';
      versionSelect.value = 'NIV';
      currentBannerRef = 'ACTS 6:8 (NIV)';
      bannerPreview.textContent = 'Banner: ACTS 6:8 (NIV)';
      verseTextInput.value = 'NOW STEPHEN, A MAN FULL OF GOD’S GRACE AND POWER, PERFORMED GREAT WONDERS AND SIGNS AMONG THE PEOPLE.';
      declInput.value = 'I am not an ordinary person. I am filled with God’s grace and mighty power. God will use me in various ways to solve mysterious problems. I am a trailblazer and a pacesetter. God will use me to perform great signs and wonders! I will surely leave an indelible mark on the earth.';
      renderFlyer();
    };

    templateImg.onload = renderFlyer;
    pastorImg.onload = renderFlyer;
    templateImg.src = TEMPLATE_DATA_URL;
    pastorImg.src = PASTOR_DATA_URL;
  </script>
</body>
</html>`;
}
