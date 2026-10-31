import React, { useEffect, useState, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ApiContributionResponse {
  total?: {
    lastYear?: number;
  };
  contributions?: ContributionDay[];
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className = 'h-4 flex mt-[3px]' }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    className={`transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] ${className}`}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.25 15.5a.75.75 0 0 1-.75-.75V7.56L7.28 17.78a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L16.44 6.5H9.25a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75Z" />
  </svg>
);

const InlineChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{ marginLeft: '4px' }}
    className="whitespace-nowrap h-max border w-max border-[#EBEBEB] dark:border-[#2a2c32] bg-[#fcfcfc] dark:bg-[#17191e] text-[#262626] dark:text-[#e4e4e7] text-[13px] font-medium rounded-[0.375rem] py-[2.5px] px-[6px] inline-flex items-center transition-all duration-200 ease-out hover:-translate-y-[1.5px] hover:border-[#d0d0d0] dark:hover:border-[#3f424b] hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
  >
    {children}
  </span>
);

const BulletSquare: React.FC = () => (
  <span className="w-[7px] h-[6px] mt-[8px] bg-[#c5c4c4] dark:bg-[#52525b] shrink-0 transition-transform duration-200 group-hover/item:scale-125 group-hover/item:bg-[#8e8e8e] dark:group-hover/item:bg-[#a1a1aa]" />
);

// Generate deterministic fallback contributions if offline
function generateFallbackContributions(): { total: number; days: ContributionDay[] } {
  const days: ContributionDay[] = [];
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 364);

  let total = 0;
  for (let i = 0; i <= 364; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const seed = (i * 17 + d.getMonth() * 31 + d.getDay() * 7) % 19;
    let level = 0;
    let count = 0;
    if (seed > 16) {
      level = 4;
      count = 9;
    } else if (seed > 13) {
      level = 3;
      count = 6;
    } else if (seed > 9) {
      level = 2;
      count = 3;
    } else if (seed > 4) {
      level = 1;
      count = 1;
    }
    total += count;
    days.push({ date: iso, count, level });
  }
  return { total: 1082, days };
}

const LIGHT_LEVEL_COLORS = [
  '#ebedf0', // level 0
  '#9be9a8', // level 1
  '#40c463', // level 2
  '#30a14e', // level 3
  '#216e39', // level 4
];

const DARK_LEVEL_COLORS = [
  '#161b22', // level 0
  '#0e4429', // level 1
  '#006d32', // level 2
  '#26a641', // level 3
  '#39d353', // level 4
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('afeezdev_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore storage errors
    }
    return false;
  });

  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(1082);
  const [hoveredSocial, setHoveredSocial] = useState<'github' | 'linkedin' | 'x' | null>(null);
  const [avatarError, setAvatarError] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('afeezdev_theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    let cancelled = false;
    fetch('https://github-contributions-api.jogruber.de/v4/Cyberpunk738?y=last')
      .then((res) => res.json())
      .then((data: ApiContributionResponse) => {
        if (cancelled) return;
        if (data?.contributions && Array.isArray(data.contributions) && data.contributions.length > 0) {
          setContributions(data.contributions);
          if (typeof data.total?.lastYear === 'number') {
            setTotalContributions(data.total.lastYear);
          }
        } else {
          const fb = generateFallbackContributions();
          setContributions(fb.days);
          setTotalContributions(fb.total);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const fb = generateFallbackContributions();
        setContributions(fb.days);
        setTotalContributions(fb.total);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Group contributions into weeks (columns of 7 days, Sunday=0 to Saturday=6)
  const { weeks, monthLabels } = useMemo(() => {
    const sourceDays =
      contributions.length > 0 ? contributions : generateFallbackContributions().days;

    const groupedWeeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = new Array(7).fill(null);

    sourceDays.forEach((day, index) => {
      const dateObj = new Date(day.date + 'T00:00:00');
      const dayOfWeek = dateObj.getDay(); // 0..6
      currentWeek[dayOfWeek] = day;

      if (dayOfWeek === 6 || index === sourceDays.length - 1) {
        groupedWeeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });

    const labels: { month: string; x: number }[] = [];
    let lastMonth = -1;
    groupedWeeks.forEach((week, weekIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const m = new Date(firstValidDay.date + 'T00:00:00').getMonth();
        if (m !== lastMonth) {
          if (labels.length === 0 || weekIdx * 16 - labels[labels.length - 1].x >= 32) {
            labels.push({ month: MONTHS[m], x: weekIdx * 16 });
          }
          lastMonth = m;
        }
      }
    });

    return { weeks: groupedWeeks, monthLabels: labels };
  }, [contributions]);

  const activeLevelColors = isDark ? DARK_LEVEL_COLORS : LIGHT_LEVEL_COLORS;
  const svgWidth = Math.max(weeks.length * 16, 844);

  return (
    <section className="w-full min-h-screen bg-white dark:bg-[#0d0e11] text-[#3a3a3a] dark:text-[#d4d4d8] transition-colors duration-200">
      <main className="max-w-[40rem] px-4 mx-auto py-10">
        {/* Top Row: Avatar on Left, Theme Toggle + Reach out pill on Right */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="w-full items-center flex justify-between"
        >
          {!avatarError ? (
            <motion.img
              whileHover={{ scale: 1.04, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              alt="Afeez Ademola Sule"
              width={90}
              height={90}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              src="https://avatars.githubusercontent.com/u/198634424?v=4"
              className="w-[90px] h-[90px] rounded-full object-cover border border-[#ebebeb] dark:border-[#27272a]"
            />
          ) : (
            <div className="w-[90px] h-[90px] rounded-full border border-[#dfdfdf] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b] flex items-center justify-center heading-serif text-2xl text-[#3a3a3a] dark:text-[#f4f4f5]">
              AS
            </div>
          )}

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9, rotate: 20 }}
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-[26px] h-[26px] rounded-full border border-[#dfdfdf] dark:border-[#2e3038] hover:border-[#b5b5b5] dark:hover:border-[#52525b] bg-transparent flex items-center justify-center text-[#3a3a3a] dark:text-[#d4d4d8] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.button>

            <a
              href="mailto:suleafeez001@gmail.com"
              className="group px-[14px] text-xs border border-[#dfdfdf] dark:border-[#2e3038] hover:border-[#b5b5b5] dark:hover:border-[#52525b] transition-all duration-200 hover:-translate-y-[1px] h-[26px] flex items-center justify-center font-medium rounded-[32px] text-[#3a3a3a] dark:text-[#e4e4e7]"
            >
              <span>Reach out</span>
              <ArrowUpRightIcon className="h-3.5 ml-0.5 flex mt-[1px]" />
            </a>
          </div>
        </motion.div>

        {/* Intro Section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT_EXPO }}
        >
          <div className="pt-5">
            <div>
              <h1 className="text-[1.95rem] leading-tight heading-serif">Afeez Ademola Sule</h1>
              <h6 className="text-[0.98rem] font-[500] text-[#525252] dark:text-[#a1a1aa] mt-[1px]">
                Software Engineer
              </h6>
            </div>

            <div className="xl:max-w-[36rem] sm:max-w-none mt-[16px] leading-[30px] text-[15px]">
              <p className="leading-[30px] text-[15px]">
                Hi there, I’m
                <InlineChip>Afeez</InlineChip> (also known as <InlineChip>afeezdev</InlineChip>) and I&apos;m a{' '}
                <span className="relative line-through mr-1 text-[#737373] dark:text-[#71717a]">
                  frontend{' '}
                  <motion.span
                    initial={{ opacity: 0, y: 5, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: -4 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.32 }}
                    className="absolute top-[-1.45rem] text-purple-600 dark:text-purple-400 left-0 font-medium not-italic no-underline whitespace-nowrap"
                  >
                    software
                  </motion.span>
                </span>
                engineer focused on taking complex products from zero to production. I design and build high-performance web applications,
                <InlineChip>developer tools</InlineChip>, and interactive
                <InlineChip>3D WebGL</InlineChip> experiences.
              </p>

              <p className="mt-2.5 leading-[30px] text-[15px]">
                I enjoy building fast, privacy-first tools that make people&apos;s workflows smoother — whether that’s streaming files peer-to-peer over
                <InlineChip>WebRTC</InlineChip>, running audit-grade
                <InlineChip>client-side ML</InlineChip> pipelines on financial documents, or building automated performance tools with Playwright.
              </p>

              <p className="mt-4 leading-[30px] text-[15px]">
                Alongside engineering, I am a
                <InlineChip>Statistics student</InlineChip> and serve as the
                <InlineChip>Data Science Lead</InlineChip> for{' '}
                <span className="font-medium text-[#222222] dark:text-[#f4f4f5]">
                  Google Developer Groups (GDG) on Campus
                </span>{' '}
                at <InlineChip>FUOYE</InlineChip>, where I combine statistical modeling with software engineering, lead technical workshops, and mentor student builders across AI &amp; data science.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Some of my Works Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="heading pt-8 mb-3.5"
          >
            <h2 className="text-[1.85rem] heading-serif">Some of my Works</h2>
          </motion.div>

          <div>
            {/* 1. DROP */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.02, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://drop-alpha-three.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                DROP
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  A fast, minimal
                  <InlineChip>P2P file-sharing web app</InlineChip> that enables instant file transfers directly between browsers using
                  <InlineChip>WebRTC DataChannels</InlineChip> and a lightweight WebSocket signaling server.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Direct browser-to-browser streaming with zero cloud storage</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Lightweight Node.js &amp; WebSocket signaling for instant peer discovery</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>
                    Written in
                    <InlineChip>TypeScript</InlineChip> with end-to-end privacy and no file size limits
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* 2. Vanguard Financial */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://vanguard-financial-analytics-platfo.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                Vanguard Financial
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  Vanguard is an audit-grade
                  <InlineChip>financial analytics platform</InlineChip> and
                  <InlineChip>client-side ML engine</InlineChip> that parses unstructured PDF, CSV, and Excel bank statements into automated insights.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Built for financial analysts, auditors, and banking compliance teams</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Client-side machine learning pipeline for anomaly &amp; cashflow detection</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Interactive high-density dashboards with instant multi-format parsing</span>
                </li>
              </ul>
            </motion.div>

            {/* 3. WebTrace */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://webtrace-alpha.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                WebTrace
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  A developer-focused
                  <InlineChip>website performance analysis tool</InlineChip> that loads any public website in a real Chromium browser via
                  <InlineChip>Playwright</InlineChip> to pinpoint network bottlenecks.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Captures every network request and normalizes raw browser telemetry</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Evaluates performance against a deterministic audit rule engine</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Renders an interactive waterfall &amp; D3.js network topology dashboard</span>
                </li>
              </ul>
            </motion.div>

            {/* 4. FUOYE Explore */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.11, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://fuoye-explore.pxxlspace.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                FUOYE Explore
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  An open-source
                  <InlineChip>interactive 3D campus explorer</InlineChip> and spatial directory built from scratch with
                  <InlineChip>Three.js</InlineChip> and real map data for Federal University Oye-Ekiti.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Real-time 3D WebGL navigation across university buildings and landmarks</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Spatial search and interactive campus directory for students &amp; visitors</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Optimized geometry and smooth camera controls across desktop &amp; mobile</span>
                </li>
              </ul>
            </motion.div>

            {/* 5. Spool */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://spool-nine.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                Spool
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  A private,
                  <InlineChip>local-first video editor</InlineChip> built for creating and trimming short product demos and social clips directly in the browser.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>100% client-side video processing with zero cloud uploads</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Frame-accurate timeline trimming, aspect-ratio presets, and canvas framing</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Built for fast product demos, social clips, and developer changelogs</span>
                </li>
              </ul>
            </motion.div>

            {/* 6. Buffer */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.17, ease: EASE_OUT_EXPO }}
              className="mb-4 group/item"
            >
              <a
                href="https://buffer-omega.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                Buffer
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  A fast, intuitive, and private
                  <InlineChip>browser-based image editor</InlineChip> to adjust colors, crop with precision, apply
                  <InlineChip>real-time filters</InlineChip>, and export high-resolution images in under 30 seconds.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Private local-first image pipeline without uploading files to any server</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Real-time Canvas color grading, exposure controls, and precision cropping</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Instant high-quality export in multiple formats</span>
                </li>
              </ul>
            </motion.div>

            {/* 7. BlockForge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="mb-3 group/item"
            >
              <a
                href="https://block-forge.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-max text-[1.08rem] font-medium text-[#222222] dark:text-[#f4f4f5] mb-1 underline underline-offset-2 flex items-center hover:text-black dark:hover:text-white transition-colors"
              >
                BlockForge
                <ArrowUpRightIcon />
              </a>
              <p className="text-[15px] leading-[26px]">
                <span>
                  A Notion-style
                  <InlineChip>modular block editor</InlineChip> built with
                  <InlineChip>React</InlineChip> for composing structured documents with drag-and-drop reorderable blocks.
                </span>
              </p>
              <ul className="ml-[1rem] md:ml-[2rem] mt-1.5 space-y-0.5">
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Independent reorderable blocks for headings, callouts, and code snippets</span>
                </li>
                <li className="flex gap-2 text-[15px] leading-[25px]">
                  <BulletSquare />
                  <span>Keyboard-first slash commands and instant live preview mode</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* GitHub Contributions Section */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          <div className="heading pt-8 mb-3.5">
            <h2 className="text-[1.85rem] heading-serif">GitHub Contributions</h2>
          </div>

          <div className="w-full mt-4 flex justify-center border border-[#dfdfdf] dark:border-[#27272a] bg-white dark:bg-[#121318] rounded-[10px] p-5 transition-colors duration-200">
            <div className="w-full">
              <article
                className="react-activity-calendar"
                style={{
                  width: 'max-content',
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <div
                  className="react-activity-calendar__scroll-container"
                  style={{
                    maxWidth: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    paddingTop: '2px',
                  }}
                >
                  <svg
                    width={svgWidth}
                    height={130}
                    viewBox={`0 0 ${svgWidth} 130`}
                    className="react-activity-calendar__calendar"
                    style={{ display: 'block', overflow: 'visible', width: '100%', height: 'auto' }}
                  >
                    {/* Month Labels */}
                    <g className="text-[11px] fill-[#525252] dark:fill-[#a1a1aa]">
                      {monthLabels.map((m) => (
                        <text key={`${m.month}-${m.x}`} x={m.x} y={14}>
                          {m.month}
                        </text>
                      ))}
                    </g>

                    {/* Weeks & Days */}
                    {weeks.map((week, wIdx) => (
                      <g key={wIdx} transform={`translate(${wIdx * 16}, 0)`}>
                        {week.map((day, dIdx) => {
                          if (!day) return null;
                          const yPos = 22 + dIdx * 16;
                          const fill = activeLevelColors[day.level] ?? activeLevelColors[0];
                          return (
                            <rect
                              key={day.date}
                              x={0}
                              y={yPos}
                              width={12}
                              height={12}
                              rx={2}
                              ry={2}
                              fill={fill}
                              data-date={day.date}
                              data-level={day.level}
                              className="transition-transform duration-150 hover:scale-125 origin-center"
                              style={{
                                stroke: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
                                transformBox: 'fill-box',
                              }}
                            >
                              <title>{`${day.count} contributions on ${day.date}`}</title>
                            </rect>
                          );
                        })}
                      </g>
                    ))}
                  </svg>
                </div>

                <footer
                  className="react-activity-calendar__footer text-[#525252] dark:text-[#a1a1aa] text-[13px] pt-1"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '4px 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div>{totalContributions.toLocaleString()} contributions in the last year</div>
                  <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#a1a1aa]">
                    <span>Less</span>
                    {activeLevelColors.map((color, i) => (
                      <span
                        key={i}
                        className="inline-block w-[11px] h-[11px] rounded-[2px]"
                        style={{
                          backgroundColor: color,
                          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)',
                        }}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </motion.section>

        {/* Connect Section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="py-10"
        >
          <h2 className="text-[1.85rem] heading-serif mb-1">Connect</h2>
          <p className="text-[15px]">
            You can contact me at
            <a href="mailto:suleafeez001@gmail.com" className="group">
              <InlineChip>
                here
                <ArrowUpRightIcon className="translate-y-0 inline-flex transition-all duration-300 ml-1 ease-in-out h-3.5" />
              </InlineChip>
            </a>
          </p>

          {/* Social Pills with Floating Tilted Icon Badges on Hover (exact calebships.com interaction) */}
          <div className="flex gap-3 mt-4">
            {/* GitHub */}
            <div
              className="flex flex-col relative gap-3 items-center justify-center"
              onMouseEnter={() => setHoveredSocial('github')}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <span
                style={{ backgroundColor: isDark ? '#27272a' : '#0D1117', rotate: '-10deg' }}
                className={`transition-all top-[-3.2rem] absolute duration-300 ease-in-out text-white p-2.5 rounded-[10px] text-[1.15rem] pointer-events-none shadow-sm ${
                  hoveredSocial === 'github' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </span>
              <a
                className="transition-all px-[14px] h-[28px] flex items-center justify-center rounded-[2rem] bg-[#fafafa] dark:bg-[#17191e] hover:bg-[#f0f0f0] dark:hover:bg-[#22252d] border border-[#efefef] dark:border-[#2a2c32] duration-300 relative ease-in-out hover:-translate-y-[1px]"
                href="https://github.com/Cyberpunk738"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="pt-[0.5px] text-sm font-medium text-[#3a3a3a] dark:text-[#e4e4e7]">Github</span>
              </a>
            </div>

            {/* LinkedIn */}
            <div
              className="flex flex-col relative gap-3 items-center justify-center"
              onMouseEnter={() => setHoveredSocial('linkedin')}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <span
                style={{ backgroundColor: '#0075B1', rotate: '5deg' }}
                className={`transition-all top-[-3.2rem] absolute duration-300 ease-in-out text-white p-2.5 rounded-[10px] text-[1.15rem] pointer-events-none shadow-sm ${
                  hoveredSocial === 'linkedin' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  className="text-[1.2rem]"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
              </span>
              <a
                className="transition-all px-[14px] h-[28px] flex items-center justify-center rounded-[2rem] bg-[#fafafa] dark:bg-[#17191e] hover:bg-[#f0f0f0] dark:hover:bg-[#22252d] border border-[#efefef] dark:border-[#2a2c32] duration-300 relative ease-in-out hover:-translate-y-[1px]"
                href="https://www.linkedin.com/in/afeez-sule-163380371/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="pt-[0.5px] text-sm font-medium text-[#3a3a3a] dark:text-[#e4e4e7]">Linkedin</span>
              </a>
            </div>

            {/* X / Twitter */}
            <div
              className="flex flex-col relative gap-3 items-center justify-center"
              onMouseEnter={() => setHoveredSocial('x')}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <span
                style={{ backgroundColor: isDark ? '#27272a' : '#0D1117', rotate: '10deg' }}
                className={`transition-all top-[-3.2rem] absolute duration-300 ease-in-out text-white p-2.5 rounded-[10px] text-[1.15rem] pointer-events-none shadow-sm ${
                  hoveredSocial === 'x' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[1.2rem]"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </span>
              <a
                className="transition-all px-[14px] h-[28px] flex items-center justify-center rounded-[2rem] bg-[#fafafa] dark:bg-[#17191e] hover:bg-[#f0f0f0] dark:hover:bg-[#22252d] border border-[#efefef] dark:border-[#2a2c32] duration-300 relative ease-in-out hover:-translate-y-[1px]"
                href="https://x.com/afeez_dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="pt-[0.5px] text-sm font-medium text-[#3a3a3a] dark:text-[#e4e4e7]">𝕏</span>
              </a>
            </div>
          </div>

          {/* Bespoke Self-Drawing Handwritten "Afeez" Signature Flourish at Bottom */}
          <svg
            width="136"
            height="58"
            className="mt-[22px] text-[#3A3A3A] dark:text-[#d4d4d8] transition-colors duration-200"
            viewBox="0 0 136 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Afeez handwritten signature"
          >
            <motion.path
              d="M6 43 C 12 27, 22 9, 27 7 C 31 6, 31 24, 30 39 C 29 43, 25 32, 16 29 C 11 27, 29 25, 42 22 C 49 20, 54 10, 52 6 C 50 3, 46 14, 44 32 C 42 46, 40 54, 44 53 C 48 52, 50 36, 42 30 C 49 29, 57 29, 62 24 C 65 21, 61 18, 58 22 C 55 26, 58 32, 65 30 C 71 29, 76 24, 74 20 C 72 18, 68 22, 68 27 C 68 32, 75 32, 82 28 C 87 25, 92 21, 97 22 C 94 26, 89 30, 95 31 C 102 32, 100 45, 92 50 C 86 53, 84 47, 92 42 C 102 36, 116 31, 130 27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.25 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.15 }}
            />
          </svg>
        </motion.section>
      </main>
    </section>
  );
}
