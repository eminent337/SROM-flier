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
  Share2,
  Copy,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';
import {
  BIBLE_VERSIONS,
  parseBibleReference,
  fetchBibleVerseText,
} from './bibleLookup';

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

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [pastorImg, setPastorImg] = useState<HTMLImageElement | null>(null);
  const [pastorUrl, setPastorUrl] = useState<string>(PASTOR_SRC);
  const [loading, setLoading] = useState<boolean>(true);

  const [content, setContent] = useState<DevotionalContent>(DEFAULT_CONTENT);
  const [portrait, setPortrait] = useState<PortraitSettings>(DEFAULT_PORTRAIT);

  // Automatic Bible Verse & Version Lookup State
  const [verseInput, setVerseInput] = useState<string>('ACTS 6:8');
  const [bibleVersion, setBibleVersion] = useState<string>('NIV');
  const [isFetchingVerse, setIsFetchingVerse] = useState<boolean>(false);
  const [verseLookupNote, setVerseLookupNote] = useState<string | null>(
    'Loaded ACTS 6:8 (NIV)'
  );
  const latestLookupIdRef = useRef<number>(0);

  const loadDevotionalIntoEditor = useCallback((item: DevotionalContent) => {
    latestLookupIdRef.current += 1;
    setContent(item);
    const versionMatch = item.verseRef.match(/\(([A-Za-z0-9]+)\)\s*$/);
    const extractedVersion = versionMatch ? versionMatch[1].toUpperCase() : 'NIV';
    const extractedRef = item.verseRef
      .replace(/\([A-Za-z0-9\s]+\)\s*$/, '')
      .trim()
      .toUpperCase();
    const validVersion = BIBLE_VERSIONS.some((v) => v.code === extractedVersion)
      ? extractedVersion
      : 'NIV';

    if (extractedRef) setVerseInput(extractedRef);
    setBibleVersion(validVersion);
    setIsFetchingVerse(false);
    setVerseLookupNote(`Loaded ${item.verseRef}`);
  }, []);

  useEffect(() => {
    const cleanRefKey = verseInput.replace(/\([A-Za-z0-9\s]+\)/g, '').trim().toUpperCase();
    const parsed = parseBibleReference(verseInput);

    if (!parsed) {
      if (cleanRefKey) {
        setContent((prev) => ({
          ...prev,
          verseRef: `${cleanRefKey} (${bibleVersion})`,
        }));
      }
      setIsFetchingVerse(false);
      setVerseLookupNote('Type book, chapter & verse (e.g. John 3:16)');
      return;
    }

    const formattedBannerRef = `${parsed.canonicalRef} (${bibleVersion})`;
    setContent((prev) =>
      prev.verseRef === formattedBannerRef
        ? prev
        : { ...prev, verseRef: formattedBannerRef }
    );

    const lookupId = ++latestLookupIdRef.current;
    const controller = new AbortController();
    setIsFetchingVerse(true);

    const timer = setTimeout(async () => {
      try {
        const fetchedText = await fetchBibleVerseText(
          parsed,
          bibleVersion,
          controller.signal
        );
        if (controller.signal.aborted || lookupId !== latestLookupIdRef.current) return;

        if (fetchedText) {
          setContent((prev) => ({
            ...prev,
            verseRef: formattedBannerRef,
            verseText: fetchedText.toUpperCase(),
          }));
          setVerseLookupNote(`Loaded ${formattedBannerRef}`);
        } else {
          setVerseLookupNote(
            `Verse ${formattedBannerRef} not found — check chapter/verse number`
          );
        }
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError' && lookupId === latestLookupIdRef.current) {
          setVerseLookupNote(null);
        }
      } finally {
        if (!controller.signal.aborted && lookupId === latestLookupIdRef.current) {
          setIsFetchingVerse(false);
        }
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [verseInput, bibleVersion]);

  // Desktop tab ('edit' | 'saved' | 'portrait') and Mobile bottom tab ('preview' | 'edit' | 'saved')
  const [activeTab, setActiveTab] = useState<'edit' | 'saved' | 'portrait'>('edit');
  const [mobileView, setMobileView] = useState<'preview' | 'edit' | 'saved'>('edit');
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Automatically hide the Install Mobile App button once the app is downloaded/installed
  const hideAppDownloadOption = isInstalled;
  const [installHelpHint, setInstallHelpHint] = useState<boolean>(false);
  const [isPromptingInstall, setIsPromptingInstall] = useState<boolean>(false);
  const isInIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.search.includes('install=1') &&
      !isInstalled
    ) {
      setShowPhoneModal(true);
    }
  }, [isInstalled]);

  const handleInstallOnPhone = async () => {
    setIsPromptingInstall(true);
    const installed = await install();
    setIsPromptingInstall(false);
    if (installed) {
      setShowPhoneModal(false);
      setInstallHelpHint(false);
      setMobileView('edit');
      setExportMessage('Downloading & installing SROM Mobile App onto your phone!');
      setTimeout(() => setExportMessage(null), 5000);
      return;
    }
    // If the browser could not open the native install dialog immediately (e.g. inside preview iframe or iOS), show guidance modal
    setInstallHelpHint(true);
    setShowPhoneModal(true);
  };

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

    Promise.all([loadImg(CLEAN_TEMPLATE_SRC), loadImg(pastorUrl), loadFonts()])
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

      // 2. AUTO-FIT DATE LINE
      const dateStr = content.dateLine.trim().toUpperCase();
      if (dateStr) {
        ctx.save();
        let dateFontSize = 31.5;
        const maxDateWidth = 566;
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

        const measuredW = Math.min(ctx.measureText(dateStr).width, maxDateWidth);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(226, 146);
        ctx.lineTo(226 + measuredW, 146);
        ctx.stroke();
        ctx.restore();
      }

      // 3. AUTO-FIT BIBLE VERSE REFERENCE
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

        for (fontSize = 68; fontSize >= 22; fontSize -= 0.5) {
          ctx.font = `900 ${fontSize}px "Montserrat", sans-serif`;
          if ('letterSpacing' in ctx) {
            (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-fontSize * 0.02}px`;
          }
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
          const lineCenterX = currentY >= 1158 ? 552 : 542;
          drawBoldText(ctx, line, lineCenterX, currentY, declStrokeBoldness);
          currentY += declLineHeight;
        });

        ctx.restore();
      }

      // 6. Draw the Pastor Portrait in the bottom-left gold circle
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
  }, [templateImg, pastorImg, content, portrait, mobileView, renderFlyer]);

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
      setMobileView('edit');
      return;
    }

    setActiveTab('edit');
    setMobileView('edit');
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
    }, 50);
  };

  const getSafeFileName = (ext: 'png' | 'jpg') => {
    const safeSlug = content.dateLine
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    return `${safeSlug || 'morning-vitamins'}.${ext}`;
  };

  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!templateImg || !pastorImg) return;
    const offscreen = document.createElement('canvas');
    renderFlyer(offscreen);

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = offscreen.toDataURL(mimeType, 0.96);

    const link = document.createElement('a');
    link.download = getSafeFileName(format === 'png' ? 'png' : 'jpg');
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportMessage(`Saved ${format.toUpperCase()} Flyer to your device!`);
    setTimeout(() => setExportMessage(null), 4000);
  };

  // Native Mobile Share (WhatsApp, Photos, Telegram, etc.) with automatic fallback to Download
  const handleShareFlyer = async () => {
    if (!templateImg || !pastorImg) return;
    const offscreen = document.createElement('canvas');
    renderFlyer(offscreen);

    offscreen.toBlob(
      async (blob) => {
        if (!blob) {
          handleDownload('png');
          return;
        }
        const fileName = getSafeFileName('png');
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: content.dateLine,
              text: `${content.verseRef} — ${content.dateLine}`,
              files: [file],
            });
            setExportMessage('Shared Flyer!');
            setTimeout(() => setExportMessage(null), 3500);
            return;
          } catch (err) {
            if ((err as Error)?.name === 'AbortError') return;
          }
        }
        handleDownload('png');
      },
      'image/png',
      0.96
    );
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

  const directAppUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-tqtu5ee44t2h2h3uobn53i-939373021882.europe-west2.run.app';

  const handleCopyAppLink = () => {
    navigator.clipboard?.writeText(directAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-slate-900 flex flex-col pb-20 lg:pb-6">
      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center shadow-sm">
          Offline Mode Active — You can still create and download flyers without internet.
        </div>
      )}

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <a
          href="#editor"
          className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
        >
          SROM Morning Vitamins
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a
            href="#edit"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('edit');
              setMobileView('edit');
            }}
            className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'edit'
                ? 'text-slate-950 font-bold underline underline-offset-8 decoration-amber-500 decoration-2'
                : ''
            }`}
          >
            Edit Daily Text
          </a>
          <a
            href="#saved"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('saved');
              setMobileView('saved');
            }}
            className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'saved'
                ? 'text-slate-950 font-bold underline underline-offset-8 decoration-amber-500 decoration-2'
                : ''
            }`}
          >
            Saved Flyers ({savedList.length})
          </a>
          <a
            href="#portrait"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('portrait');
              setMobileView('edit');
            }}
            className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'portrait'
                ? 'text-slate-950 font-bold underline underline-offset-8 decoration-amber-500 decoration-2'
                : ''
            }`}
          >
            Pastor Portrait
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!hideAppDownloadOption && (
            <button
              type="button"
              onClick={handleInstallOnPhone}
              disabled={isPromptingInstall}
              className="min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isPromptingInstall ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-amber-400" />
              )}
              <span>{isPromptingInstall ? 'Installing...' : 'Install Mobile App'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleShareFlyer}
            className="min-h-[42px] px-3 sm:px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/40 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share / Save Flyer</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Workspace (Mobile Single-View + Desktop 2-Column) */}
      <main
        id="editor"
        className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
      >
        {/* Left Column: Editor / Saved / Phone Install (Visible on Desktop always, or on Mobile when active) */}
        <section
          className={`lg:col-span-6 flex flex-col gap-5 ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Desktop Sub-Navigation Tabs */}
          <div className="hidden lg:flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-amber-400 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                1. Type Daily Devotional
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-amber-400 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                2. Saved & Presets ({savedList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('portrait')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'portrait'
                    ? 'bg-amber-400 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                3. Adjust Photo
              </button>
            </div>
          </div>

          {/* Mobile Top Quick Bar: Reset & Download JPG */}
          <div className="lg:hidden flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/apple-touch-icon.png"
                alt="SROM App Icon"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl shrink-0 border border-amber-500"
              />
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 truncate">{content.verseRef}</p>
                <p className="text-[11px] font-medium text-slate-600 truncate">{content.dateLine}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => loadDevotionalIntoEditor(DEFAULT_CONTENT)}
                className="min-h-[40px] px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleDownload('jpeg')}
                className="min-h-[40px] px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download JPG
              </button>
            </div>
          </div>

          {/* MAIN EDITOR FORM */}
          {activeTab === 'edit' && mobileView !== 'saved' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 font-display">
                    Daily Morning Vitamins Editor
                  </h1>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    Type into the 3 sections below — the text automatically fits the flyer in the original bold font.
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => loadDevotionalIntoEditor(DEFAULT_CONTENT)}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('jpeg')}
                    className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JPG
                  </button>
                </div>
              </div>

              {/* STEP 1: THE DATE */}
              <div className="flex flex-col gap-2.5 pb-5 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="date-line-input"
                    className="text-sm font-bold text-slate-900 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    1. Date & Heading Line
                  </label>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="min-h-[38px] px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="min-h-[38px] px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <label className="min-h-[38px] px-3 py-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center cursor-pointer">
                      Pick Date
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
                  className="w-full min-h-[48px] px-4 py-3 text-base font-bold bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none rounded-xl text-slate-950 placeholder:text-slate-400"
                />
              </div>

              {/* STEP 2: BIBLE VERSE & QUOTE (AUTO-FETCH BY VERSE & VERSION) */}
              <div className="flex flex-col gap-4 pb-5 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="verse-ref-input"
                    className="text-sm font-bold text-slate-900 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    2. Bible Verse & Version (Auto-Loads Scripture)
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    {isFetchingVerse ? (
                      <span className="text-amber-700 font-bold flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading {bibleVersion} words...
                      </span>
                    ) : verseLookupNote ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {verseLookupNote}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium">Auto-fits</span>
                    )}
                  </div>
                </div>

                {/* Verse Reference + Bible Version Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Type Bible Book, Chapter & Verse
                    </span>
                    <input
                      ref={verseRefInputRef}
                      id="verse-ref-input"
                      type="text"
                      value={verseInput}
                      onChange={(e) => setVerseInput(e.target.value)}
                      placeholder="e.g. Acts 6:8 or John 3:16"
                      className="w-full min-h-[48px] px-4 py-3 text-base font-extrabold uppercase bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none rounded-xl text-slate-950 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="sm:col-span-5 flex flex-col gap-1.5">
                    <label
                      htmlFor="bible-version-select"
                      className="text-xs font-bold text-slate-700"
                    >
                      Choose Bible Version
                    </label>
                    <select
                      id="bible-version-select"
                      value={bibleVersion}
                      onChange={(e) => setBibleVersion(e.target.value)}
                      className="w-full min-h-[48px] px-3.5 py-3 text-sm font-extrabold bg-amber-50 border-2 border-amber-400 focus:border-amber-600 focus:outline-none rounded-xl text-slate-950 cursor-pointer"
                    >
                      {BIBLE_VERSIONS.map((v) => (
                        <option key={v.code} value={v.code} className="bg-white text-slate-950">
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Bible Verse Words (loads automatically — or edit below)
                    </span>
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Banner: {content.verseRef}
                    </span>
                  </div>
                  <textarea
                    ref={verseTextInputRef}
                    rows={4}
                    value={content.verseText}
                    onChange={(e) => setContent((c) => ({ ...c, verseText: e.target.value }))}
                    placeholder="Bible verse words load here automatically..."
                    className="w-full px-4 py-3 text-base font-bold uppercase bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none rounded-xl text-slate-950 leading-relaxed resize-y placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* STEP 3: DECLARATION */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="declaration-input"
                    className="text-sm font-bold text-slate-900 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    3. Daily Declaration
                  </label>
                  <span className="text-xs font-medium text-slate-600">Auto-fits</span>
                </div>

                <textarea
                  ref={declarationInputRef}
                  id="declaration-input"
                  rows={5}
                  value={content.declarationText}
                  onChange={(e) => setContent((c) => ({ ...c, declarationText: e.target.value }))}
                  placeholder="Type the prophetic declaration for the day..."
                  className="w-full px-4 py-3 text-base font-semibold bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none rounded-xl text-slate-950 leading-relaxed resize-y placeholder:text-slate-400"
                />
              </div>

              {/* Bottom Action Buttons inside Editor */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDevotional}
                    className="flex-1 sm:flex-initial min-h-[46px] px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    Save to Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView('preview')}
                    className="flex-1 sm:flex-initial lg:hidden min-h-[46px] px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    View Flyer
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareFlyer}
                    className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/40 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-4 h-4" />
                    Share / Save PNG
                  </button>
                </div>
              </div>

              {exportMessage && (
                <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{exportMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* SAVED FLYERS LIST */}
          {(activeTab === 'saved' || mobileView === 'saved') && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Saved Flyers & Presets
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tap any devotional below to load it onto the flyer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDevotional}
                  className="min-h-[42px] px-3.5 py-2 text-xs font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Save Current
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {savedList.map((item) => {
                  const isCurrent =
                    item.dateLine === content.dateLine && item.verseRef === content.verseRef;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-colors flex flex-col gap-2 ${
                        isCurrent
                          ? 'bg-amber-50/70 border-amber-400'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0">
                          <span className="font-extrabold text-amber-800 shrink-0">
                            {item.verseRef}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-700 font-semibold truncate">
                            {item.dateLine}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              loadDevotionalIntoEditor(item);
                              setActiveTab('edit');
                              setMobileView('preview');
                            }}
                            className="min-h-[38px] px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                          >
                            Load Flyer
                          </button>
                          {savedList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSaved(item.id)}
                              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove from saved list"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-900 font-bold line-clamp-2">
                        “{item.verseText}”
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.declarationText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASTOR PORTRAIT SETTINGS */}
          {activeTab === 'portrait' && mobileView !== 'saved' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Pastor Portrait Settings
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Fine-tune or change the photo inside the bottom-left circular frame.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPortrait(DEFAULT_PORTRAIT);
                    setPastorUrl(PASTOR_SRC);
                  }}
                  className="min-h-[38px] px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Photo
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
                  <img
                    src={pastorUrl}
                    alt="Evangelist Albert Dela Amedzro"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-slate-700">
                    Upload a different portrait photo if needed:
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
                      className="min-h-[40px] px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
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
                    <label htmlFor="zoom-range" className="text-slate-800 font-bold">
                      Photo Zoom inside Circle
                    </label>
                    <span className="font-mono font-semibold text-slate-700">
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
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <label htmlFor="panx-range" className="text-slate-800 font-bold">
                        Move Left / Right
                      </label>
                      <span className="font-mono font-semibold text-slate-700">
                        {portrait.offsetX} px
                      </span>
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
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <label htmlFor="pany-range" className="text-slate-800 font-bold">
                        Move Up / Down
                      </label>
                      <span className="font-mono font-semibold text-slate-700">
                        {portrait.offsetY} px
                      </span>
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
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Live High-Resolution Flyer Preview */}
        <section
          className={`lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 lg:sticky lg:top-20 shadow-sm ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900">Live Flyer Preview</span>
              <span aria-hidden="true">·</span>
              <span>Tap any text on the flyer to edit</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">1061 × 1482 px</span>
          </div>

          {loading ? (
            <div className="w-full min-h-[520px] flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-700">
                Preparing SROM Morning Vitamins Flyer...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-slate-100 border border-slate-200 rounded-xl p-2 sm:p-3">
              <div className="relative max-w-[500px] w-full shadow-lg rounded overflow-hidden border border-slate-300 bg-white">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  title="Tap any part of the flyer to edit its text"
                  className="w-full h-auto block cursor-pointer"
                />
              </div>

              {/* Mobile Quick Actions directly below Preview */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileView('edit')}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  Edit Flyer Text
                </button>
                <button
                  type="button"
                  onClick={handleShareFlyer}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share to WhatsApp
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Fixed Bottom Thumb-Zone Navigation Bar on Mobile (< 1024px) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-3 items-center h-16 px-2 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('edit');
            setMobileView('edit');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
            mobileView === 'edit' ? 'text-amber-700 font-extrabold bg-amber-50' : 'text-slate-600'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px] mt-1">Edit Text</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
            mobileView === 'preview' ? 'text-amber-700 font-extrabold bg-amber-50' : 'text-slate-600'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[11px] mt-1">View Flyer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('saved');
            setMobileView('saved');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
            mobileView === 'saved' ? 'text-amber-700 font-extrabold bg-amber-50' : 'text-slate-600'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[11px] mt-1">Saved ({savedList.length})</span>
        </button>
      </nav>

      {/* Phone Installation Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/apple-touch-icon.png"
                  alt="SROM App Icon"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl border border-amber-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Install SROM Mobile App
                  </h3>
                  <p className="text-xs text-slate-600">
                    Installs directly onto your phone home screen & app drawer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isInstalled && (
              <div className="flex flex-col gap-2.5">
                {isInstallable ? (
                  <button
                    type="button"
                    onClick={handleInstallOnPhone}
                    disabled={isPromptingInstall}
                    className="w-full min-h-[50px] py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 border border-amber-500/50 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isPromptingInstall ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {isPromptingInstall
                      ? 'Installing Mobile App...'
                      : 'Install Mobile App Now'}
                  </button>
                ) : isInIframe ? (
                  <a
                    href={`${directAppUrl}/?install=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[50px] py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 border border-amber-500/50 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-5 h-5" />
                    Open Direct Install Page in Chrome
                  </a>
                ) : null}

                {installHelpHint && !isInstallable && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 text-xs leading-relaxed flex flex-col gap-2">
                    {isIOS ? (
                      <p className="font-semibold">
                        On iPhone / iPad: Tap the Safari <strong>Share</strong> button at the bottom of your screen, then tap <strong>Add to Home Screen</strong>.
                      </p>
                    ) : (
                      <>
                        <p className="font-bold text-slate-950">
                          Why didn’t the download start automatically?
                        </p>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-800">
                          <li>
                            <strong>If you still have the previous SROM app icon on your phone:</strong> Please uninstall/remove that old icon from your phone first — Android blocks downloading the app a second time while an older icon is still on your phone.
                          </li>
                          <li>
                            Or tap Chrome’s top-right menu (<strong>⋮</strong>) and tap <strong>Install app</strong> / <strong>Add to Home screen</strong>.
                          </li>
                        </ol>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAppLink}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'App Link Copied!' : 'Copy App Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
