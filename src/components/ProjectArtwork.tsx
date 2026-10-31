import React from 'react';

interface ArtworkProps {
  projectId: string;
  className?: string;
}

export const ProjectArtwork: React.FC<ArtworkProps> = ({ projectId, className = '' }) => {
  switch (projectId) {
    case 'drop-p2p':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#111113] text-[#F4F3EF] select-none ${className}`}>
          {/* Subtle architectural dot matrix */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#71717A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono-tabular text-[11px] text-[#EA580C]">WEBRTC // SCTP_CHANNEL</span>
                <span className="text-zinc-600">·</span>
                <span className="font-mono-tabular text-[11px] text-zinc-400">64KB CHUNKS</span>
              </div>
              <span className="font-mono-tabular text-[11px] text-zinc-400">0.00 GB SERVER STORAGE</span>
            </div>

            {/* P2P Node SVG Diagram */}
            <div className="my-auto py-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/90 px-4 py-3 rounded-lg min-w-[130px]">
                <span className="font-mono-tabular text-[10px] text-zinc-400">PEER_A (LOCAL)</span>
                <span className="font-display text-sm font-semibold text-white">release-v2.tar.zst</span>
                <span className="font-mono-tabular text-[11px] text-[#EA580C]">1.84 GB · SHA256</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 px-2">
                <div className="w-full flex items-center gap-1.5">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#EA580C] via-amber-400 to-[#EA580C]" />
                </div>
                <div className="flex items-center justify-between w-full font-mono-tabular text-[10px] text-zinc-400">
                  <span>ICE: DIRECT_LAN</span>
                  <span className="text-amber-400">412 MB/s</span>
                  <span>RTT: 1.8ms</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border border-zinc-800 bg-zinc-900/90 px-4 py-3 rounded-lg min-w-[130px] text-right">
                <span className="font-mono-tabular text-[10px] text-zinc-400">PEER_B (REMOTE)</span>
                <span className="font-display text-sm font-semibold text-white">Verified Stream</span>
                <span className="font-mono-tabular text-[11px] text-emerald-400">94.2% COMPLETE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 font-mono-tabular text-[11px] text-zinc-400">
              <span>DTLS 1.3 ENCRYPTED</span>
              <span>ZERO RELAY BOTTLENECK</span>
            </div>
          </div>
        </div>
      );

    case 'vanguard-ai':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#0D1117] text-[#F4F3EF] select-none ${className}`}>
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono-tabular text-[11px] text-sky-400">VANGUARD // QUANT_TERMINAL</span>
              <span className="font-mono-tabular text-[11px] text-slate-400">60 FPS CANVAS</span>
            </div>

            {/* Financial Telemetry SVG Chart */}
            <div className="my-auto py-3">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="text-[11px] text-slate-400">INSTITUTIONAL LIQUIDITY INDEX</div>
                  <div className="font-mono-tabular text-xl font-semibold text-white">$482,910,400.00</div>
                </div>
                <div className="text-right">
                  <div className="font-mono-tabular text-xs text-emerald-400">+14.82% ALPHA</div>
                  <div className="font-mono-tabular text-[10px] text-slate-400">ML CONFIDENCE 98.4%</div>
                </div>
              </div>

              <svg viewBox="0 0 360 90" className="w-full h-20 overflow-visible">
                <defs>
                  <linearGradient id="vanguardGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,72 L40,64 L85,68 L130,45 L175,49 L220,28 L265,33 L310,14 L360,8 L360,90 L0,90 Z"
                  fill="url(#vanguardGrad)"
                />
                <path
                  d="M0,72 L40,64 L85,68 L130,45 L175,49 L220,28 L265,33 L310,14 L360,8"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <path
                  d="M0,80 L40,75 L85,72 L130,62 L175,58 L220,48 L265,44 L310,36 L360,29"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 font-mono-tabular text-[11px] text-slate-400">
              <span>50,000+ VIRTUALIZED ROWS</span>
              <span>ANOMALY ENGINE</span>
            </div>
          </div>
        </div>
      );

    case 'greenly':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#121A15] text-[#F4F3EF] select-none ${className}`}>
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <span className="font-mono-tabular text-[11px] text-emerald-400">GREENLY // ARCHITECTURAL LANDSCAPE</span>
              <span className="font-mono-tabular text-[11px] text-emerald-200/70">99 LIGHTHOUSE</span>
            </div>

            <div className="my-auto py-4 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-7 space-y-1.5">
                <div className="font-serif-editorial italic text-xs text-emerald-300">Architectural Outdoor Living</div>
                <div className="font-display text-lg font-semibold text-white leading-snug">
                  Biophilic Courtyard &amp; Terraced Stonework
                </div>
                <div className="font-mono-tabular text-[11px] text-emerald-200/70">
                  Interactive Area &amp; Material Estimator
                </div>
              </div>
              <div className="col-span-5 border border-emerald-800/70 bg-emerald-950/60 p-3 rounded-lg">
                <div className="font-mono-tabular text-[10px] text-emerald-300/80">ESTIMATED SCOPE</div>
                <div className="font-mono-tabular text-sm font-semibold text-white mt-0.5">420 sq.m · Tier II</div>
                <div className="mt-2 h-1.5 w-full bg-emerald-900 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-emerald-900/60 font-mono-tabular text-[11px] text-emerald-200/70">
              <span>FCP: 0.6s</span>
              <span>SEMANTIC SEO ARCHITECTURE</span>
            </div>
          </div>
        </div>
      );

    case 'bola-brand':
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#181512] text-[#F4F3EF] select-none ${className}`}>
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="font-mono-tabular text-[11px] text-amber-400">BOLA BRAND // MONOGRAPH COMMERCE</span>
              <span className="font-mono-tabular text-[11px] text-stone-400">CLS 0.00</span>
            </div>

            <div className="my-auto py-4 flex items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="font-mono-tabular text-[10px] text-stone-400">AUTUMN / WINTER ARCHIVE</span>
                <h4 className="font-serif-editorial italic text-2xl text-stone-100">
                  Sculpted Merino Trench — No. 04
                </h4>
                <p className="text-xs text-stone-400">
                  Optimistic bag state · Instant lookbook variant switching · Zero layout shift
                </p>
              </div>

              <div className="shrink-0 border border-stone-700/80 bg-stone-900/90 px-4 py-3 rounded-lg text-right">
                <div className="font-mono-tabular text-[10px] text-stone-400">EDITION</div>
                <div className="font-mono-tabular text-base font-semibold text-amber-300">$640.00</div>
                <div className="font-mono-tabular text-[10px] text-stone-400 mt-1">IN STOCK · LAGOS / LDN</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-800 font-mono-tabular text-[11px] text-stone-400">
              <span>SUB-120MS FILTERING</span>
              <span>HEADLESS STOREFRONT</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-full overflow-hidden bg-[#13111C] text-[#F4F3EF] select-none ${className}`}>
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <span className="font-mono-tabular text-[11px] text-purple-300">SOLANA // SUPERTEAM EARN</span>
              <span className="font-mono-tabular text-[11px] text-purple-300/70">@Cyberpunk738</span>
            </div>

            <div className="my-auto py-4 flex flex-col gap-2">
              <div className="font-mono-tabular text-xs text-purple-300">
                $ solana-sdk-audit --verify-ix --network mainnet-beta
              </div>
              <div className="font-display text-lg font-semibold text-white">
                Protocol Integration Harnesses &amp; Composable dApp UIs
              </div>
              <div className="font-mono-tabular text-[11px] text-zinc-400">
                Deterministic transaction simulation · Wallet Adapter State · SDK Bounties
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-900/50 font-mono-tabular text-[11px] text-purple-200/70">
              <span>TYPESCRIPT SDK</span>
              <span>OPEN SOURCE ECOSYSTEM</span>
            </div>
          </div>
        </div>
      );
  }
};
