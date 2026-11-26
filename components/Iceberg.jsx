'use client';

import { useEffect, useRef, useState } from 'react';

// Studio hero illustration. A hand-cut iceberg: the website is the tip, and the work below the
// waterline is frozen into the ice in layers, like a core sample. Each layer holds a real
// object from the job (a search log, record cards, a chart, tool tags). A diver sinks as you
// scroll and lights each one in turn. Copy comes from content/site/studio.json (iceberg).
const W = 1200;
const H = 1500;
// Label position (percent of the scene), the frozen object's center and half height (scene units),
// and the scroll point where it lights up.
const SPOTS = [
  { left: 50, top: 35, cx: 430, cy: 590, hh: 95, at: 0.08 },
  { left: 16, top: 52, cx: 820, cy: 815, hh: 85, at: 0.3 },
  { left: 51, top: 66, cx: 420, cy: 1035, hh: 80, at: 0.52 },
  { left: 15, top: 81, cx: 790, cy: 1255, hh: 80, at: 0.74 },
];
const DIVER_X = 1118;
const clamp = (v) => Math.min(1, Math.max(0, v));

const ICE = 'M428 446 L872 446 L950 514 L1002 590 L1034 676 L1064 762 L1052 856 L1068 934 L1032 1030 L1004 1108 L950 1188 L904 1262 L830 1320 L760 1372 L668 1404 L590 1396 L504 1374 L430 1330 L366 1270 L316 1196 L262 1122 L238 1036 L196 958 L182 866 L206 776 L228 690 L270 614 L320 548 L372 492 Z';

export default function Iceberg({ data }) {
  const sec = useRef(null);
  const scene = useRef(null);
  const [p, setP] = useState(0);
  const [travel, setTravel] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); return undefined; }
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = sec.current;
      const sc = scene.current;
      if (!el || !sc) return;
      const vh = window.innerHeight;
      setTravel(Math.max(0, sc.offsetHeight - vh + 48));
      const run = el.offsetHeight - vh;
      const next = run > 0 ? clamp(-el.getBoundingClientRect().top / run) : 1;
      setP((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const pan = still ? 0 : clamp(p / 0.88) * travel;
  const layers = (data.layers || []).slice(0, SPOTS.length);
  let active = -1;
  SPOTS.forEach((s, i) => { if (still || p >= s.at) active = i; });
  const lit = (i) => still || i <= active;
  // The diver hangs beside whichever layer is lit and points the beam at it.
  const target = SPOTS[Math.max(0, active)];
  const diverY = active < 0 ? 520 : target.cy - 30;
  const beam = active < 0 ? '' : `${DIVER_X - 36},${diverY + 8} ${target.cx + 150},${target.cy - target.hh} ${target.cx + 150},${target.cy + target.hh}`;

  return (
    <section ref={sec} className={`ib ${still ? 'is-still' : ''}`} aria-labelledby="ib-h">
      <div className="ib-pin">
        <div ref={scene} className="ib-scene" style={{ transform: `translate3d(0, ${-pan}px, 0)` }}>
          <h2 id="ib-h" className="ib-h">{data.heading}</h2>

          <svg className="ib-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="ib-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#18291F" />
                <stop offset="1" stopColor="#090C0A" />
              </linearGradient>
              <clipPath id="ib-ice"><path d={ICE} /></clipPath>
              <pattern id="ib-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M16 0H0V16" fill="none" stroke="#D9D4C8" strokeWidth="1" />
              </pattern>
            </defs>

            {/* water, with a hand-cut surface */}
            <path d="M0 452 C80 440 150 446 230 452 C320 459 380 444 460 446 L860 446 C930 444 990 458 1070 452 C1120 448 1160 444 1200 450 V1500 H0 Z" fill="url(#ib-water)" />
            <g className="ib-wave" fill="#18291F">
              <path d="M-400 452 C-340 436 -280 436 -220 452 C-160 466 -100 466 -40 452 C20 436 80 436 140 452 C200 466 260 466 320 452 C380 436 440 436 500 452 C560 466 620 466 680 452 C740 436 800 436 860 452 C920 466 980 466 1040 452 C1100 436 1160 436 1220 452 C1280 466 1340 466 1400 452 C1460 436 1520 436 1580 452 V480 H-400 Z" />
            </g>

            {/* ice below the waterline, in layers */}
            <g clipPath="url(#ib-ice)">
              <rect x="0" y="440" width={W} height="270" fill="#2F4428" />
              <path d="M0 700 C200 690 380 718 600 704 C800 692 1000 716 1200 702 V940 H0 Z" fill="#293B23" />
              <path d="M0 930 C220 944 420 918 640 934 C860 948 1020 922 1200 936 V1170 H0 Z" fill="#23331E" />
              <path d="M0 1160 C240 1148 460 1176 700 1162 C900 1150 1060 1174 1200 1160 V1500 H0 Z" fill="#1E2C1A" />
              <g fill="none" stroke="#405A36" strokeWidth="3">
                <path d="M0 700 C200 690 380 718 600 704 C800 692 1000 716 1200 702" />
                <path d="M0 930 C220 944 420 918 640 934 C860 948 1020 922 1200 936" />
                <path d="M0 1160 C240 1148 460 1176 700 1162 C900 1150 1060 1174 1200 1160" />
              </g>
              {/* cut faces catching light */}
              <polygon points="872,446 950,514 1002,590 1034,676 930,610" fill="#ffffff" opacity=".05" />
              <polygon points="182,866 206,776 228,690 300,820 250,980" fill="#000000" opacity=".12" />
              <polygon points="668,1404 760,1372 830,1320 904,1262 760,1300" fill="#ffffff" opacity=".04" />
              {/* trapped air */}
              <g fill="#4C6842">
                <ellipse cx="300" cy="760" rx="7" ry="5" /><ellipse cx="318" cy="772" rx="4" ry="3" /><ellipse cx="960" cy="610" rx="6" ry="4" />
                <ellipse cx="640" cy="1000" rx="5" ry="4" /><ellipse cx="900" cy="1060" rx="8" ry="5" /><ellipse cx="480" cy="1240" rx="6" ry="4" />
                <ellipse cx="560" cy="1350" rx="4" ry="3" /><ellipse cx="1000" cy="860" rx="4" ry="3" />
              </g>
            </g>

            {/* ice above the waterline */}
            <path d="M462 446 C480 380 505 300 540 252 C560 222 578 192 592 172 C606 190 626 204 645 214 C662 182 688 152 704 136 C726 176 748 220 768 258 C790 292 812 332 830 372 C846 404 858 428 866 446 Z" fill="#D4FF3A" />
            <path d="M704 136 C726 176 748 220 768 258 C790 292 812 332 830 372 C846 404 858 428 866 446 L716 446 C708 380 690 300 676 238 Z" fill="#BCE52C" />
            <path d="M462 446 C480 380 505 300 540 252 C560 222 578 192 592 172 C578 240 560 340 548 446 Z" fill="#E6FF85" />
            {/* a flag on the peak */}
            <line x1="704" y1="138" x2="704" y2="66" stroke="#0C0C0C" strokeWidth="4" />
            <path className="ib-flag" d="M706 68 C740 62 770 76 806 70 L806 104 C770 110 740 96 706 102 Z" fill="#0C0C0C" />

            {/* search: a torn receipt of real queries */}
            <g className={`ib-obj ${lit(0) ? 'on' : ''}`} transform="rotate(-4 430 590)">
              <path d="M300 492 H560 V676 L547 688 L534 676 L521 688 L508 676 L495 688 L482 676 L469 688 L456 676 L443 688 L430 676 L417 688 L404 676 L391 688 L378 676 L365 688 L352 676 L339 688 L326 676 L313 688 L300 676 Z" fill="#F1EEE8" />
              <text className="ib-mono ib-mono-s" x="318" y="522">SEARCH LOG</text>
              <rect x="314" y="606" width="232" height="26" fill="#D4FF3A" />
              <g className="ib-mono">
                <text x="318" y="560">booth 214</text><text x="540" y="560" textAnchor="end">3</text>
                <text x="318" y="590">parking hall c</text><text x="540" y="590" textAnchor="end">6</text>
                <text x="318" y="625">gluten free lunch</text><text x="540" y="625" textAnchor="end">0</text>
                <text x="318" y="660">sponsor tiers</text><text x="540" y="660" textAnchor="end">4</text>
              </g>
            </g>

            {/* data: fanned record cards */}
            <g className={`ib-obj ${lit(1) ? 'on' : ''}`}>
              <rect x="712" y="742" width="210" height="136" rx="6" fill="#B9B4A8" transform="rotate(-9 817 810)" />
              <rect x="712" y="742" width="210" height="136" rx="6" fill="#D8D3C7" transform="rotate(5 817 810)" />
              <g transform="rotate(-2 817 815)">
                <rect x="712" y="748" width="210" height="136" rx="6" fill="#F1EEE8" />
                <rect x="730" y="736" width="56" height="20" rx="4" fill="#D4FF3A" />
                <g className="ib-mono ib-mono-s">
                  <text x="730" y="784">NAME</text><text x="730" y="818">SESSION</text><text x="730" y="852">ORDER</text>
                </g>
                <g fill="#0C0C0C">
                  <rect x="800" y="776" width="100" height="6" rx="3" /><rect x="800" y="810" width="76" height="6" rx="3" />
                </g>
                <text className="ib-mono" x="800" y="854">#1048</text>
              </g>
            </g>

            {/* dashboards: torn graph paper with a hand-drawn line */}
            <g className={`ib-obj ${lit(2) ? 'on' : ''}`} transform="rotate(3 420 1035)">
              <path d="M290 955 H556 V1112 H290 L298 1096 L289 1080 L298 1064 L289 1048 L298 1032 L289 1016 L298 1000 L289 984 L298 968 Z" fill="#F1EEE8" />
              <rect x="300" y="960" width="250" height="148" fill="url(#ib-grid)" opacity=".7" />
              <path d="M310 1088 C330 1080 340 1092 360 1072 C380 1052 392 1066 412 1048 C432 1030 446 1046 466 1022 C486 1000 500 1014 520 988 L536 980" fill="none" stroke="#0C0C0C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="536" cy="980" r="9" fill="#D4FF3A" stroke="#0C0C0C" strokeWidth="3" />
            </g>

            {/* integrations: tool tags on a string */}
            <g className={`ib-obj ${lit(3) ? 'on' : ''}`}>
              <path d="M600 1190 C660 1200 700 1230 740 1222 C790 1212 830 1240 880 1236 C920 1232 950 1250 980 1262" fill="none" stroke="#F1EEE8" strokeWidth="3" />
              {[
                { x: 690, y: 1222, r: -10, t: 'CRM', lime: true },
                { x: 800, y: 1226, r: 6, t: 'SHOPIFY' },
                { x: 910, y: 1240, r: -4, t: 'SWOOGO' },
              ].map((g) => (
                <g key={g.t} transform={`rotate(${g.r} ${g.x} ${g.y})`}>
                  <line x1={g.x} y1={g.y} x2={g.x} y2={g.y + 26} stroke="#F1EEE8" strokeWidth="3" />
                  <path d={`M${g.x - 44} ${g.y + 44} L${g.x} ${g.y + 22} L${g.x + 44} ${g.y + 44} V${g.y + 112} H${g.x - 44} Z`} fill={g.lime ? '#D4FF3A' : '#F1EEE8'} />
                  <circle cx={g.x} cy={g.y + 40} r="6" fill="#1E2C1A" />
                  <text className="ib-mono ib-mono-s" x={g.x} y={g.y + 84} textAnchor="middle">{g.t}</text>
                </g>
              ))}
            </g>

            {/* the diver and the beam */}
            {beam && <polygon key={active} className="ib-beam" points={beam} fill="#F1EEE8" />}
            <g className="ib-diver" style={{ transform: `translate(${DIVER_X}px, ${diverY}px)` }}>
              <g className="ib-bob">
                <rect x="-4" y="-26" width="44" height="12" rx="6" fill="#D4FF3A" />
                <rect x="-8" y="-14" width="58" height="28" rx="14" fill="#E9E4D8" />
                <path d="M48 -6 L78 -16 L86 -4 L52 6 Z" fill="#0C0C0C" />
                <path d="M48 6 L76 14 L80 26 L50 14 Z" fill="#0C0C0C" />
                <circle cx="-20" cy="-2" r="16" fill="#E9E4D8" />
                <circle cx="-24" cy="-4" r="9" fill="#0C0C0C" />
                <circle cx="-26" cy="-6" r="3" fill="#D4FF3A" />
                <rect x="-46" y="6" width="22" height="9" rx="3" fill="#0C0C0C" />
              </g>
            </g>

            {/* rising bubbles */}
            <g className="ib-bubbles" fill="#F1EEE8">
              <circle cx="1100" cy="1300" r="6" /><circle cx="1120" cy="1360" r="4" /><circle cx="110" cy="1180" r="5" />
              <circle cx="90" cy="1260" r="3" /><circle cx="80" cy="980" r="4" />
            </g>
          </svg>
          <div className="ib-grain" aria-hidden="true" />

          <div className="ib-label ib-tip" style={{ left: '73%', top: '9%' }}>
            <h3>{data.tip.title}</h3>
            <p>{data.tip.text}</p>
          </div>

          {layers.map((l, i) => (
            <div key={l.title} className={`ib-label ib-under ${lit(i) ? 'on' : ''}`} style={{ left: `${SPOTS[i].left}%`, top: `${SPOTS[i].top}%` }}>
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="ib-list">
        <li><h3>{data.tip.title}</h3><p>{data.tip.text}</p></li>
        {layers.map((l) => <li key={l.title}><h3>{l.title}</h3><p>{l.text}</p></li>)}
      </ul>
    </section>
  );
}
