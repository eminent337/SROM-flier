/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Download,
  RotateCcw,
  Upload,
  Calendar,
  BookOpen,
  Sparkles,
  Check,
  Bookmark,
  Trash2,
  Sliders,
  FileText,
} from 'lucide-react';

interface DevotionalContent {
  id: string;
  dateLine: string;
  verseRef: string;
  verseText: string;
  declarationText: string;
  updatedAt: string;
}

interface PortraitSettings {
  circleX: number;
  circleY: number;
  circleRadius: number;
  ringWidth: number;
  ringColor: string;
  backdropColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

const DEFAULT_CONTENT: DevotionalContent = {
  id: 'default-oct-1',
  dateLine: '1ST OCTOBER, 2026 - MORNING VITAMINS',
  verseRef: 'ACTS 6:8 (NIV)',
  verseText:
    'NOW STEPHEN, A MAN FULL OF GOD’S GRACE AND POWER, PERFORMED GREAT WONDERS AND SIGNS AMONG THE PEOPLE.',
  declarationText:
    'I am not an ordinary person. I am filled with God’s grace and mighty power. God will use me in various ways to solve mysterious problems. I am a trailblazer and a pacesetter. God will use me to perform great signs and wonders! I will surely leave an indelible mark on the earth.',
  updatedAt: 'Default Flyer',
};

const SAMPLE_DEVOTIONALS: DevotionalContent[] = [
  DEFAULT_CONTENT,
  {
    id: 'sample-phil-4-13',
    dateLine: '2ND OCTOBER, 2026 - MORNING VITAMINS',
    verseRef: 'PHILIPPIANS 4:13 (NKJV)',
    verseText: 'I CAN DO ALL THINGS THROUGH CHRIST WHO STRENGTHENS ME.',
    declarationText:
      'I am empowered by Christ for supernatural success today. No obstacle can stand before me because divine strength is at work in my life. I walk in victory, wisdom, and dominion wherever I go. I will surely accomplish great things to the glory of God!',
    updatedAt: 'Preset Template',
  },
  {
    id: 'sample-isa-60-1',
    dateLine: '3RD OCTOBER, 2026 - MORNING VITAMINS',
    verseRef: 'ISAIAH 60:1 (NIV)',
    verseText:
      'ARISE, SHINE, FOR YOUR LIGHT HAS COME, AND THE GLORY OF THE LORD RISES UPON YOU.',
    declarationText:
      'Today is my day of rising and shining! The glory of the Lord is visibly seen upon my life, my family, and my work. Darkness gives way to my light, and helpers of destiny gravitate toward me. I am a city set on a hill that cannot be hidden.',
    updatedAt: 'Preset Template',
  },
];

const DEFAULT_PORTRAIT: PortraitSettings = {
  circleX: 187.5,
  circleY: 1293,
  circleRadius: 126.5,
  ringWidth: 6.5,
  ringColor: '#F6B61E',
  backdropColor: '#BBB8AF',
  scale: 0.395,
  offsetX: -6,
  offsetY: 24,
};

const CLEAN_TEMPLATE_SRC = '/assets/aistudio/srom_clean_template.png';
const PASTOR_SRC = '/assets/aistudio/image_ac3cca0a.png';
const STORAGE_KEY = 'srom_saved_devotionals_v2';

function formatOrdinalDate(date: Date): string {
  const day = date.getDate();
  const months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let suffix = 'TH';
  if (day % 10 === 1 && day !== 11) suffix = 'ST';
  else if (day % 10 === 2 && day !== 12) suffix = 'ND';
  else if (day % 10 === 3 && day !== 13) suffix = 'RD';

  return `${day}${suffix} ${month}, ${year} - MORNING VITAMINS`;
}

// Helper to draw ultra-bold text with matching stroke reinforcement so boldness matches original flyer
function drawBoldText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  strokeWeight: number
) {
  if (strokeWeight > 0) {
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.lineWidth = strokeWeight;
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pastorInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const verseRefInputRef = useRef<HTMLInputElement | null>(null);
  const verseTextInputRef = useRef<HTMLTextAreaElement | null>(null);
  const declarationInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [pastorImg, setPastorImg] = useState<HTMLImageElement | null>(null);
  const [pastorUrl, setPastorUrl] = useState<string>(PASTOR_SRC);
  const [loading, setLoading] = useState<boolean>(true);

  const [content, setContent] = useState<DevotionalContent>(DEFAULT_CONTENT);
  const [portrait, setPortrait] = useState<PortraitSettings>(DEFAULT_PORTRAIT);
  const [activeTab, setActiveTab] = useState<'edit' | 'saved' | 'portrait'>('edit');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [savedList, setSavedList] = useState<DevotionalContent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return SAMPLE_DEVOTIONALS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList));
    } catch {
      // ignore storage errors
    }
  }, [savedList]);

  // Load images and wait for Montserrat + Outfit fonts to be ready before rendering
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });

    const loadFonts = async () => {
      if (!document.fonts) return;
      try {
        await Promise.all([
          document.fonts.load('900 68px "Montserrat"'),
          document.fonts.load('800 50px "Montserrat"'),
          document.fonts.load('700 42px "Outfit"'),
          document.fonts.load('700 31px "Outfit"'),
        ]);
        await document.fonts.ready;
      } catch {
        // continue if font preloading fails
      }
    };

    Promise.all([
      loadImg(CLEAN_TEMPLATE_SRC),
      loadImg(pastorUrl),
      loadFonts(),
    ])
      .then(([loadedTemplate, loadedPastor]) => {
        if (!active) return;
        setTemplateImg(loadedTemplate);
        setPastorImg(loadedPastor);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pastorUrl]);

  // Helper to wrap text for a given font size and per-line width limit
  const wrapTextLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    getMaxWidthForLine: (lineIndex: number) => number
  ): string[] => {
    const paragraphs = text
      .trim()
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    const lines: string[] = [];

    for (const para of paragraphs) {
      const words = para.split(/\s+/);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const maxW = getMaxWidthForLine(lines.length);
        if (ctx.measureText(testLine).width <= maxW || !currentLine) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  };

  // Main Canvas Renderer with 100% Automatic Auto-Fit and Original Font Type & Boldness
  const renderFlyer = useCallback(
    (targetCanvas: HTMLCanvasElement) => {
      if (!templateImg || !pastorImg) return;
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const width = templateImg.naturalWidth || 1061;
      const height = templateImg.naturalHeight || 1482;

      if (targetCanvas.width !== width || targetCanvas.height !== height) {
        targetCanvas.width = width;
        targetCanvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw the clean base flyer template
      ctx.drawImage(templateImg, 0, 0, width, height);

      // 2. AUTO-FIT DATE LINE (Original position: minX=226, maxX=795, top=119, bottom=141, underline y=146)
      const dateStr = content.dateLine.trim().toUpperCase();
      if (dateStr) {
        ctx.save();
        let dateFontSize = 31.5;
        const maxDateWidth = 566; // Stops cleanly before "Depopulating hell"
        ctx.font = `700 ${dateFontSize}px "Outfit", "Montserrat", sans-serif`;
        while (ctx.measureText(dateStr).width > maxDateWidth && dateFontSize > 15) {
          dateFontSize -= 0.5;
          ctx.font = `700 ${dateFontSize}px "Outfit", "Montserrat", sans-serif`;
        }
        ctx.fillStyle = '#07222D';
        ctx.strokeStyle = '#07222D';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        drawBoldText(ctx, dateStr, 226, 140.5, dateFontSize * 0.025);

        // Crisp underline matching SOUL REVIVAL header above it
        const measuredW = Math.min(ctx.measureText(dateStr).width, maxDateWidth);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(226, 146);
        ctx.lineTo(226 + measuredW, 146);
        ctx.stroke();
        ctx.restore();
      }

      // 3. AUTO-FIT BIBLE VERSE REFERENCE (Original position: centerX=530.5, top=214, bottom=261)
      const refStr = content.verseRef.trim().toUpperCase();
      if (refStr) {
        ctx.save();
        let refFontSize = 50;
        const maxRefWidth = 385;
        ctx.font = `900 ${refFontSize}px "Montserrat", sans-serif`;
        while (ctx.measureText(refStr).width > maxRefWidth && refFontSize > 20) {
          refFontSize -= 0.5;
          ctx.font = `900 ${refFontSize}px "Montserrat", sans-serif`;
        }
        ctx.fillStyle = '#05070B';
        ctx.strokeStyle = '#05070B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawBoldText(ctx, refStr, 530.5, 239, refFontSize * 0.026);
        ctx.restore();
      }

      // 4. AUTO-FIT MAIN BIBLE QUOTE / VERSE CONTENT
      // Original bounds: top=294, bottom=683 (boxHeight=390), centerX=531.5, maxWidth=790
      // Original font: Ultra-heavy Montserrat Black (900) uppercase, 68px, line-height 68px (1.0x)
      const verseUpper = content.verseText.trim().toUpperCase();
      if (verseUpper) {
        ctx.save();
        const boxTop = 292;
        const boxBottom = 684;
        const boxHeight = boxBottom - boxTop;
        const maxVerseWidth = 790;

        let fontSize = 68;
        let lines: string[] = [];
        let lineHeight = fontSize * 1.02;

        // Auto-fit loop: finds the largest font size (up to 68px) where all wrapped lines fit both horizontally & vertically
        for (fontSize = 68; fontSize >= 22; fontSize -= 0.5) {
          ctx.font = `900 ${fontSize}px "Montserrat", sans-serif`;
          if ('letterSpacing' in ctx) {
            (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-fontSize * 0.02}px`;
          }
          // Balance width target slightly so 6-line verses break just like the original flyer
          const effectiveWidth = fontSize >= 62 ? 755 : maxVerseWidth;
          lines = wrapTextLines(ctx, verseUpper, () => effectiveWidth);
          lineHeight = fontSize * 1.03;

          const longestWordWidth = Math.max(
            ...verseUpper.split(/\s+/).map((w) => ctx.measureText(w).width)
          );

          if (
            lines.length * lineHeight <= boxHeight &&
            longestWordWidth <= maxVerseWidth
          ) {
            break;
          }
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
        if ('letterSpacing' in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';
        }
        ctx.restore();
      }

      // 5. AUTO-FIT DECLARATION CONTENT
      // Increased font size and width allowance so the declaration renders noticeably larger while staying auto-fitted
      const declStr = content.declarationText.trim();
      if (declStr) {
        ctx.save();
        const declTop = 828;
        const declBottom = 1254;
        const declBoxHeight = declBottom - declTop;

        let declFontSize = 48;
        let declLines: string[] = [];
        let declLineHeight = declFontSize * 1.07;

        for (declFontSize = 48; declFontSize >= 22; declFontSize -= 0.5) {
          ctx.font = `700 ${declFontSize}px "Outfit", sans-serif`;
          declLineHeight = declFontSize * 1.07;

          // Calculate which line indices fall into the lower narrow zone (y >= 1150, next to Pastor portrait & Bible)
          const approxNarrowStartLine = Math.max(
            5,
            Math.floor((1150 - declTop) / declLineHeight)
          );
          const getDeclMaxWidth = (lineIndex: number) =>
            lineIndex >= approxNarrowStartLine ? 508 : 650;

          declLines = wrapTextLines(ctx, declStr, getDeclMaxWidth);
          const totalH = (declLines.length - 1) * declLineHeight + declFontSize * 0.78;

          if (totalH <= declBoxHeight) {
            break;
          }
        }

        const totalDeclHeight =
          (declLines.length - 1) * declLineHeight + declFontSize * 0.78;
        let currentY =
          declTop + (declBoxHeight - totalDeclHeight) / 2 + declFontSize * 0.76;

        ctx.fillStyle = '#090C12';
        ctx.strokeStyle = '#090C12';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';

        const declStrokeBoldness = declFontSize * 0.024;
        declLines.forEach((line) => {
          // Lines sitting lower than y=1158 are centered at x=552 (between the circular portrait and Holy Bible)
          const lineCenterX = currentY >= 1158 ? 552 : 542;
          drawBoldText(ctx, line, lineCenterX, currentY, declStrokeBoldness);
          currentY += declLineHeight;
        });

        ctx.restore();
      }

      // 6. Draw the Replaced Pastor Portrait in the bottom-left gold circle
      const {
        circleX,
        circleY,
        circleRadius,
        ringWidth,
        ringColor,
        backdropColor,
        scale,
        offsetX,
        offsetY,
      } = portrait;

      const innerRadius = Math.max(10, circleRadius - ringWidth / 2);

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, innerRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = backdropColor;
      ctx.fillRect(
        circleX - circleRadius - 10,
        circleY - circleRadius - 10,
        (circleRadius + 10) * 2,
        (circleRadius + 10) * 2
      );

      const pWidth = pastorImg.naturalWidth * scale;
      const pHeight = pastorImg.naturalHeight * scale;
      const drawX = circleX - pWidth / 2 + offsetX;
      const drawY = circleY - pHeight / 2 + offsetY;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Seamlessly extend the top 3px row of the studio backdrop upward so shifting the portrait down leaves zero seam above the head
      const circleTopEdge = circleY - circleRadius - 4;
      if (drawY > circleTopEdge) {
        ctx.drawImage(
          pastorImg,
          0,
          0,
          pastorImg.naturalWidth,
          3,
          drawX,
          circleTopEdge,
          pWidth,
          drawY - circleTopEdge + 2
        );
      }

      ctx.drawImage(pastorImg, drawX, drawY, pWidth, pHeight);
      ctx.restore();

      if (ringWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius - ringWidth / 2, 0, Math.PI * 2);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = ringWidth;
        ctx.stroke();
        ctx.restore();
      }
    },
    [templateImg, pastorImg, content, portrait]
  );

  useEffect(() => {
    if (canvasRef.current && templateImg && pastorImg) {
      renderFlyer(canvasRef.current);
    }
  }, [templateImg, pastorImg, content, portrait, renderFlyer]);

  // Click directly on regions of the flyer preview to focus the corresponding editor box
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / Math.max(1, rect.height);
    const scaleX = canvas.width / Math.max(1, rect.width);
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (Math.hypot(x - portrait.circleX, y - portrait.circleY) <= portrait.circleRadius) {
      setActiveTab('portrait');
      return;
    }

    setActiveTab('edit');
    setTimeout(() => {
      if (y < 185) {
        dateInputRef.current?.focus();
      } else if (y >= 185 && y < 280) {
        verseRefInputRef.current?.focus();
      } else if (y >= 280 && y < 720) {
        verseTextInputRef.current?.focus();
      } else if (y >= 720 && y < 1265) {
        declarationInputRef.current?.focus();
      }
    }, 30);
  };

  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!templateImg || !pastorImg) return;
    const offscreen = document.createElement('canvas');
    renderFlyer(offscreen);

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = offscreen.toDataURL(mimeType, 0.96);
    const safeSlug = content.dateLine
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    const link = document.createElement('a');
    link.download = `${safeSlug || 'morning-vitamins'}.${format === 'png' ? 'png' : 'jpg'}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportMessage(`Saved ${format.toUpperCase()} Flyer (${offscreen.width} × ${offscreen.height} px)`);
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handleSaveDevotional = () => {
    const newEntry: DevotionalContent = {
      ...content,
      id: `devotional-${Date.now()}`,
      updatedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setSavedList((prev) => [newEntry, ...prev]);
    setExportMessage('Saved to your Flyer Library');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month, day] = val.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    setContent((prev) => ({
      ...prev,
      dateLine: formatOrdinalDate(dateObj),
    }));
  };

  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setContent((prev) => ({
      ...prev,
      dateLine: formatOrdinalDate(d),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar (3-Zone Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/90 bg-slate-950/95 sticky top-0 z-30">
        <a
          href="#editor"
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          SROM Morning Vitamins Maker
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#edit"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('edit');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'edit' ? 'text-white underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            Edit Daily Text
          </a>
          <a
            href="#saved"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('saved');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'saved' ? 'text-white underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            Saved Flyers ({savedList.length})
          </a>
          <a
            href="#portrait"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('portrait');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'portrait' ? 'text-white underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            Pastor Portrait
          </a>
          <a
            href="#reset"
            onClick={(e) => {
              e.preventDefault();
              setContent(DEFAULT_CONTENT);
              setPortrait(DEFAULT_PORTRAIT);
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Reset Flyer
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleDownload('png')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Flyer Image
          </button>
        </div>
      </header>

      {/* Main 2-Column Studio Workspace */}
      <main
        id="editor"
        className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Simple, Dad-Friendly Form Editor (6 columns) */}
        <section className="lg:col-span-6 flex flex-col gap-5">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                1. Type Daily Devotional
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                2. Saved & Presets ({savedList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('portrait')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'portrait'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                3. Adjust Photo
              </button>
            </div>
          </div>

          {activeTab === 'edit' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
              <div>
                <h1 className="text-lg font-bold text-white font-display">
                  Daily Morning Vitamins Editor
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Type into the boxes below — every section automatically scales to fit while keeping the original bold typography.
                </p>
              </div>

              {/* STEP 1: THE DATE */}
              <div className="flex flex-col gap-2.5 pb-5 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="date-line-input"
                    className="text-sm font-semibold text-amber-300 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    1. Date & Heading Line
                  </label>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Use Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Use Tomorrow
                    </button>
                    <label className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer">
                      Pick Calendar Date
                      <input
                        type="date"
                        onChange={handleDatePickerChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <input
                  ref={dateInputRef}
                  id="date-line-input"
                  type="text"
                  value={content.dateLine}
                  onChange={(e) => setContent((c) => ({ ...c, dateLine: e.target.value }))}
                  placeholder="e.g. 1ST OCTOBER, 2026 - MORNING VITAMINS"
                  className="w-full px-4 py-3 text-base font-semibold bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-lg text-white"
                />
              </div>

              {/* STEP 2: BIBLE VERSE & QUOTE */}
              <div className="flex flex-col gap-4 pb-5 border-b border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="verse-ref-input"
                    className="text-sm font-semibold text-amber-300 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    2. Bible Verse & Scripture Quote
                  </label>
                  <span className="text-xs text-slate-400">Auto-fits to flyer</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-300">
                    Bible Chapter & Verse (inside the top yellow banner)
                  </span>
                  <input
                    ref={verseRefInputRef}
                    id="verse-ref-input"
                    type="text"
                    value={content.verseRef}
                    onChange={(e) => setContent((c) => ({ ...c, verseRef: e.target.value }))}
                    placeholder="e.g. ACTS 6:8 (NIV)"
                    className="w-full px-4 py-3 text-base font-bold uppercase bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-lg text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-slate-300">
                    Bible Verse Content (automatically capitalized, bolded & sized to fit)
                  </span>
                  <textarea
                    ref={verseTextInputRef}
                    rows={4}
                    value={content.verseText}
                    onChange={(e) => setContent((c) => ({ ...c, verseText: e.target.value }))}
                    placeholder="Type or paste the Bible verse here..."
                    className="w-full px-4 py-3 text-base font-bold uppercase bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-lg text-white leading-relaxed resize-y"
                  />
                </div>
              </div>

              {/* STEP 3: DECLARATION */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="declaration-input"
                    className="text-sm font-semibold text-amber-300 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    3. Daily Declaration
                  </label>
                  <span className="text-xs text-slate-400">Auto-fits to flyer</span>
                </div>

                <textarea
                  ref={declarationInputRef}
                  id="declaration-input"
                  rows={6}
                  value={content.declarationText}
                  onChange={(e) => setContent((c) => ({ ...c, declarationText: e.target.value }))}
                  placeholder="Type the prophetic declaration for the day..."
                  className="w-full px-4 py-3 text-base font-semibold bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none rounded-lg text-white leading-relaxed resize-y"
                />
              </div>

              {/* Bottom Action Bar inside Editor */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDevotional}
                    className="px-3.5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    Save to Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent(DEFAULT_CONTENT)}
                    className="px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Oct 1st Text
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload('png')}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('jpeg')}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    JPG
                  </button>
                </div>
              </div>

              {exportMessage && (
                <div className="px-4 py-2.5 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{exportMessage}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Saved Flyers & Sample Devotionals
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any saved devotional below to load its Date, Verse, and Declaration into the flyer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDevotional}
                  className="px-3 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Save Current Flyer
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {savedList.map((item) => {
                  const isCurrent =
                    item.dateLine === content.dateLine && item.verseRef === content.verseRef;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border transition-colors flex flex-col gap-2 ${
                        isCurrent
                          ? 'bg-amber-400/10 border-amber-400/50'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-bold text-amber-300">{item.verseRef}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300">{item.dateLine}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setContent(item);
                              setActiveTab('edit');
                            }}
                            className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors cursor-pointer"
                          >
                            Load into Editor
                          </button>
                          {savedList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSaved(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Remove from saved list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 font-medium line-clamp-2">
                        “{item.verseText}”
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.declarationText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'portrait' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Pastor Portrait Settings
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The new photo of Evangelist Albert Dela Amedzro is locked into the bottom-left circular frame.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPortrait(DEFAULT_PORTRAIT);
                    setPastorUrl(PASTOR_SRC);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Photo
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                  <img
                    src={pastorUrl}
                    alt="Evangelist Albert Dela Amedzro"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-300">
                    Want to upload a different portrait photo for a special occasion?
                  </span>
                  <div>
                    <input
                      ref={pastorInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPastorUrl(URL.createObjectURL(file));
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => pastorInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Another Photo
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="zoom-range" className="text-slate-300 font-medium">
                      Photo Zoom inside Circle
                    </label>
                    <span className="font-mono text-slate-400">
                      {Math.round(portrait.scale * 100)}%
                    </span>
                  </div>
                  <input
                    id="zoom-range"
                    type="range"
                    min={0.34}
                    max={0.7}
                    step={0.005}
                    value={portrait.scale}
                    onChange={(e) =>
                      setPortrait((p) => ({ ...p, scale: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <label htmlFor="panx-range" className="text-slate-300 font-medium">
                        Move Left / Right
                      </label>
                      <span className="font-mono text-slate-400">{portrait.offsetX} px</span>
                    </div>
                    <input
                      id="panx-range"
                      type="range"
                      min={-80}
                      max={80}
                      step={0.5}
                      value={portrait.offsetX}
                      onChange={(e) =>
                        setPortrait((p) => ({ ...p, offsetX: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <label htmlFor="pany-range" className="text-slate-300 font-medium">
                        Move Up / Down
                      </label>
                      <span className="font-mono text-slate-400">{portrait.offsetY} px</span>
                    </div>
                    <input
                      id="pany-range"
                      type="range"
                      min={-80}
                      max={80}
                      step={0.5}
                      value={portrait.offsetY}
                      onChange={(e) =>
                        setPortrait((p) => ({ ...p, offsetY: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Live High-Resolution Flyer Preview (6 columns) */}
        <section className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 lg:sticky lg:top-20">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-white">Live Flyer Preview</span>
              <span aria-hidden="true">·</span>
              <span>Click any text on the flyer to edit it</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">1061 × 1482 px</span>
          </div>

          {loading ? (
            <div className="w-full min-h-[620px] flex flex-col items-center justify-center gap-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Preparing SROM Morning Vitamins Flyer...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800/80 rounded-lg p-3">
              <div className="relative max-w-[500px] w-full shadow-2xl rounded overflow-hidden border border-slate-800">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  title="Click any part of the flyer to jump to its text box"
                  className="w-full h-auto block cursor-pointer"
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
