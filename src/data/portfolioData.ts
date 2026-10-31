export type ProjectCategory = 'all' | 'systems' | 'saas' | 'web' | 'web3';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  year: string;
  featuredSpan: 'wide' | 'compact';
  summary: string;
  architectureOverview: string;
  challenge: string;
  outcome: string;
  metrics: {
    label: string;
    value: string;
  }[];
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  accentColor: string;
}

export interface CapabilityGroup {
  index: string;
  title: string;
  serifNote: string;
  description: string;
  technologies: string[];
  deliverables: string[];
}

export interface ExperienceMilestone {
  period: string;
  role: string;
  organization: string;
  location: string;
  summary: string;
  outcomes: string[];
}

export const PROFILE_DATA = {
  fullName: 'Afeez Ademola Sule',
  shortName: 'Afeez Sule',
  alias: 'Cyberpunk738',
  handle: '@afeez_dev',
  role: 'Software & Frontend Engineer',
  tagline: 'Shipping resilient web applications, real-time P2P tools, and high-converting digital products.',
  introLead:
    "Hi there, I'm Afeez — also known online as Cyberpunk738. I architect and ship fast, tactile web interfaces, scalable React & TypeScript applications, and developer-first experiences.",
  location: 'Lagos, Nigeria · Remote Worldwide',
  email: 'suleafeez001@gmail.com',
  socials: {
    github: 'https://github.com/Cyberpunk738',
    twitter: 'https://x.com/afeez_dev',
    linkedin: 'https://www.linkedin.com/in/afeez-sule-163380371/',
    superteam: 'https://earn.superteam.fun',
  },
  metrics: [
    {
      value: '99.4%',
      unit: 'Core Web Vitals',
      context: 'Lighthouse performance & accessibility across production client builds',
    },
    {
      value: '< 45ms',
      unit: 'P2P Signaling Latency',
      context: 'Direct browser-to-browser WebRTC data channel handshakes in DROP',
    },
    {
      value: '18+',
      unit: 'Production Shipments',
      context: 'Full-stack web apps, SaaS interfaces, e-commerce stores & Web3 tools',
    },
    {
      value: '100%',
      unit: 'Strict TypeScript',
      context: 'End-to-end type safety across component systems & API contracts',
    },
  ],
};

export const SELECTED_PROJECTS: ProjectItem[] = [
  {
    id: 'drop-p2p',
    index: '01',
    title: 'DROP',
    subtitle: 'Zero-Server P2P File Transfer Engine',
    category: 'systems',
    categoryLabel: 'Real-Time Systems',
    year: '2026',
    featuredSpan: 'wide',
    summary:
      'Peer-to-peer encrypted file streaming application built with WebRTC DataChannels and lightweight WebSocket signaling for instant browser-to-browser transfers without cloud storage bottlenecks.',
    architectureOverview:
      'Uses ephemeral WebSocket rooms for SDP offer/answer negotiation and ICE candidate trickling, handing off binary payload streaming to chunked WebRTC SCTP channels with backpressure flow control.',
    challenge:
      'Large multi-gigabyte browser transfers frequently crash tab memory when buffered in RAM or suffer throttling through relay servers.',
    outcome:
      'Engineered a 64KB chunked stream pipeline with real-time SHA-256 integrity verification and automatic local LAN discovery, achieving zero intermediate server storage.',
    metrics: [
      { label: 'Chunk Buffer Size', value: '64 KB' },
      { label: 'Handshake Time', value: '38 ms' },
      { label: 'Cloud Storage Cost', value: '$0.00' },
    ],
    stack: ['React 19', 'TypeScript', 'WebRTC DataChannel', 'WebSockets', 'Tailwind CSS', 'Web Crypto API'],
    liveUrl: 'https://github.com/Cyberpunk738',
    repoUrl: 'https://github.com/Cyberpunk738',
    accentColor: '#EA580C',
  },
  {
    id: 'vanguard-ai',
    index: '02',
    title: 'Vanguard AI Platform',
    subtitle: 'Institutional Banking & ML Risk Terminal',
    category: 'saas',
    categoryLabel: 'Fintech & AI',
    year: '2026',
    featuredSpan: 'compact',
    summary:
      'High-density institutional banking analytics workspace combining real-time liquidity telemetry, automated credit anomaly detection, and machine learning portfolio forecasting.',
    architectureOverview:
      'Modular multi-pane dashboard architecture with virtualized tabular grids, deterministic state synchronization, and sub-second chart rendering for high-frequency financial datasets.',
    challenge:
      'Institutional analysts needed to inspect thousands of concurrent risk vectors and ML confidence intervals without UI frame drops.',
    outcome:
      'Delivered a 60fps keyboard-navigable analytics terminal with custom canvas sparklines and accessible high-contrast data hierarchy.',
    metrics: [
      { label: 'Grid Render Speed', value: '60 FPS' },
      { label: 'Concurrent Rows', value: '50,000+' },
      { label: 'Analyst Task Speed', value: '+42%' },
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Charting Engine', 'REST & Streaming APIs'],
    liveUrl: 'https://github.com/Cyberpunk738',
    repoUrl: 'https://github.com/Cyberpunk738',
    accentColor: '#2563EB',
  },
  {
    id: 'greenly',
    index: '03',
    title: 'Greenly',
    subtitle: 'Architectural Landscaping & Outdoor Platform',
    category: 'web',
    categoryLabel: 'Interactive Web',
    year: '2025',
    featuredSpan: 'compact',
    summary:
      'Custom digital flagship and interactive project estimator for an architectural landscaping studio, pairing editorial botanical photography with instant scope configuration.',
    architectureOverview:
      'Built around semantic SEO architecture, responsive art-directed viewports, and an interactive multi-step spatial quote calculator.',
    challenge:
      'Prospective property owners struggled to estimate landscaping scope and material tiers before booking on-site consultations.',
    outcome:
      'Transformed visitor conversion with a transparent interactive estimator, achieving a 99 Lighthouse performance score and streamlined lead capture.',
    metrics: [
      { label: 'Lighthouse Perf', value: '99 / 100' },
      { label: 'First Contentful Paint', value: '0.6 s' },
      { label: 'Quote Completion', value: '+64%' },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Semantic SEO', 'Responsive Design'],
    liveUrl: 'https://github.com/Cyberpunk738',
    repoUrl: 'https://github.com/Cyberpunk738',
    accentColor: '#16A34A',
  },
  {
    id: 'bola-brand',
    index: '04',
    title: 'Bola Brand',
    subtitle: 'Bespoke Luxury E-Commerce Experience',
    category: 'web',
    categoryLabel: 'E-Commerce',
    year: '2025',
    featuredSpan: 'wide',
    summary:
      'End-to-end editorial e-commerce storefront designed like a collectible monograph, featuring instant variant switching, optimistic cart state, and frictionless checkout flows.',
    architectureOverview:
      'Decoupled storefront frontend with optimistic UI mutations, persistent local bag synchronization, and zero-layout-shift image preloading.',
    challenge:
      'Standard e-commerce templates diluted the brand story and suffered from sluggish page transitions on mobile networks.',
    outcome:
      'Crafted a tactile lookbook-to-cart shopping pipeline with sub-200ms filter interactions and zero cumulative layout shift (CLS 0.00).',
    metrics: [
      { label: 'Cumulative Layout Shift', value: '0.00' },
      { label: 'Filter Response', value: '< 120 ms' },
      { label: 'Mobile Checkout Rate', value: '+38%' },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'State Management', 'Headless Commerce', 'Performance'],
    liveUrl: 'https://github.com/Cyberpunk738',
    repoUrl: 'https://github.com/Cyberpunk738',
    accentColor: '#D97706',
  },
  {
    id: 'superteam-solana-suite',
    index: '05',
    title: 'Solana Protocol & SDK Tooling',
    subtitle: 'Superteam Earn Bounties & Web3 Developer Kits',
    category: 'web3',
    categoryLabel: 'Web3 & Solana',
    year: '2026',
    featuredSpan: 'wide',
    summary:
      'Open-source developer tooling, protocol integration guides, SDK edge-case audits, and interactive Solana dApp interfaces shipped across the Superteam ecosystem under @Cyberpunk738.',
    architectureOverview:
      'Combines Solana RPC transaction inspection, wallet adapter state machines, and developer-friendly interactive playgrounds for rapid protocol onboarding.',
    challenge:
      'Developers integrating emerging Solana protocols often hit undocumented SDK edge cases and opaque transaction simulation errors.',
    outcome:
      'Authored reproducible SDK test harnesses, developer documentation, and clean frontend reference implementations recognized in Superteam ecosystem challenges.',
    metrics: [
      { label: 'Ecosystem', value: 'Solana' },
      { label: 'Handle', value: '@Cyberpunk738' },
      { label: 'Focus', value: 'SDKs & dApps' },
    ],
    stack: ['TypeScript', 'React', 'Solana Web3.js', 'Protocol SDKs', 'Developer Tooling', 'Open Source'],
    liveUrl: 'https://github.com/Cyberpunk738',
    repoUrl: 'https://github.com/Cyberpunk738',
    accentColor: '#9333EA',
  },
];

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    index: '01',
    title: 'Frontend Architecture & UI Engineering',
    serifNote: 'Tactile interfaces built with mathematical precision',
    description:
      'Translating complex product requirements and Figma systems into resilient, accessible, pixel-accurate React and TypeScript applications with fluid 60fps micro-interactions.',
    technologies: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Motion / Framer', 'HTML5 Canvas'],
    deliverables: [
      'Design System & Component Libraries',
      'Complex SaaS Dashboards & Data Grids',
      'Keyboard-First Accessible Workflows',
    ],
  },
  {
    index: '02',
    title: 'Real-Time Web & Full-Stack Systems',
    serifNote: 'Low-latency networking & state synchronization',
    description:
      'Engineering browser-to-browser WebRTC pipelines, WebSocket signaling servers, RESTful APIs, and optimistic client-side state architectures that remain snappy under heavy load.',
    technologies: ['WebRTC DataChannels', 'WebSockets', 'Node.js & Express', 'State Machines', 'Web Crypto API', 'REST APIs'],
    deliverables: [
      'P2P Streaming & Collaborative Tools',
      'End-to-End Custom Web Applications',
      'API Integration & State Orchestration',
    ],
  },
  {
    index: '03',
    title: 'Performance, Core Web Vitals & Web3',
    serifNote: 'Speed as a primary product feature',
    description:
      'Auditing render waterfalls, eliminating layout shifts, structuring technical SEO metadata, and contributing SDK integrations and frontend interfaces in the Solana & Web3 ecosystem.',
    technologies: ['Core Web Vitals', 'Technical SEO', 'Solana Web3.js', 'Bundle Optimization', 'WCAG AA Accessibility', 'Git Workflows'],
    deliverables: [
      'Sub-Second High-Converting Landing Pages',
      'Web3 dApp Frontends & Protocol Guides',
      'Performance & Accessibility Audits',
    ],
  },
];

export const EXPERIENCE_TIMELINE: ExperienceMilestone[] = [
  {
    period: '2024 — Present',
    role: 'Independent Software & Frontend Engineer',
    organization: 'Afeez.dev Studio & Client Engagements',
    location: 'Remote',
    summary:
      'Architecting and shipping custom web applications, SaaS analytics interfaces, e-commerce platforms, and high-converting digital flagships for founders and product teams.',
    outcomes: [
      'Shipped DROP (WebRTC P2P file transfer), Vanguard AI Platform, Greenly, and Bola Brand with strict TypeScript codebases.',
      'Maintained 99+ Lighthouse performance and accessibility scores across client deliverables through semantic markup and zero-CLS asset pipelines.',
    ],
  },
  {
    period: '2025 — Present',
    role: 'Open-Source & Web3 Developer Contributor',
    organization: 'Superteam Earn · GitHub (@Cyberpunk738)',
    location: 'Global Ecosystem',
    summary:
      'Participating in protocol bounties, SDK bug hunts, developer tooling challenges, and open-source web engineering across the Solana and modern JavaScript ecosystems.',
    outcomes: [
      'Built reproducible SDK validation tools, interactive dApp frontends, and technical deep-dives for ecosystem protocols.',
      'Active builder sharing frontend engineering insights, UI experiments, and shipped builds with the developer community on X (@afeez_dev).',
    ],
  },
];
