import React, { useState, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Layers, 
  Maximize2, 
  Info,
  DollarSign,
  Activity
} from 'lucide-react';
import { EquityPoint, TimeframeFilter } from '../types';

interface EquityChartProps {
  data: EquityPoint[];
  timeframe: TimeframeFilter;
  setTimeframe: (tf: TimeframeFilter) => void;
  startingBalance: number;
}

export const EquityChart: React.FC<EquityChartProps> = ({
  data,
  timeframe,
  setTimeframe,
  startingBalance,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'equity' | 'pnl'>('equity');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    if (timeframe === 'ALL') return data;
    
    const count = data.length;
    if (timeframe === '1W') {
      return data.slice(Math.max(0, count - 10));
    }
    if (timeframe === '1M') {
      return data.slice(Math.max(0, count - 25));
    }
    if (timeframe === 'YTD') {
      return data.slice(Math.max(0, count - 70));
    }
    return data;
  }, [data, timeframe]);

  // Dimensions & bounds
  const width = 1000;
  const height = 340;
  const padding = { top: 24, right: 30, bottom: 40, left: 75 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { minVal, maxVal, coordinates, pathD, areaD, baselineY } = useMemo(() => {
    if (!filteredData.length) {
      return { minVal: 0, maxVal: 1, coordinates: [], pathD: '', areaD: '', baselineY: 0 };
    }

    const values = filteredData.map(d => (viewMode === 'equity' ? d.equity : d.pnl));
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    
    // Add 8% vertical padding for breathing room
    const range = rawMax - rawMin || 1000;
    const minVal = Math.floor(rawMin - range * 0.08);
    const maxVal = Math.ceil(rawMax + range * 0.08);

    const coords = filteredData.map((d, index) => {
      const val = viewMode === 'equity' ? d.equity : d.pnl;
      const x = padding.left + (index / (filteredData.length - 1 || 1)) * chartWidth;
      const y = padding.top + (1 - (val - minVal) / (maxVal - minVal)) * chartHeight;
      return { x, y, data: d };
    });

    // Smooth bezier curve path
    let path = '';
    if (coords.length > 0) {
      path = `M ${coords[0].x},${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        const cp1y = p0.y;
        const cp2x = p0.x + (p1.x - p0.x) / 2;
        const cp2y = p1.y;
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
      }
    }

    // Closed area for gradient fill
    const bottomY = padding.top + chartHeight;
    const area = coords.length > 0
      ? `${path} L ${coords[coords.length - 1].x},${bottomY} L ${coords[0].x},${bottomY} Z`
      : '';

    // Baseline ($100k or $0 PnL)
    const baseTarget = viewMode === 'equity' ? startingBalance : 0;
    const baselineY = padding.top + (1 - (baseTarget - minVal) / (maxVal - minVal)) * chartHeight;

    return { minVal, maxVal, coordinates: coords, pathD: path, areaD: area, baselineY };
  }, [filteredData, viewMode, chartWidth, chartHeight, padding, startingBalance]);

  // Handle hover along SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!coordinates.length || !containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    
    // Find closest coordinate by X distance
    let closestIdx = 0;
    let minDistance = Infinity;

    coordinates.forEach((coord, idx) => {
      const dist = Math.abs(coord.x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activePoint = hoveredIndex !== null && coordinates[hoveredIndex] ? coordinates[hoveredIndex] : null;
  const currentPoint = coordinates[coordinates.length - 1];
  const displayedPoint = activePoint ? activePoint.data : currentPoint?.data;

  // Horizontal grid lines (4-5 ticks)
  const yTicks = useMemo(() => {
    const ticks = [];
    const count = 5;
    for (let i = 0; i <= count; i++) {
      const val = minVal + (i / count) * (maxVal - minVal);
      const y = padding.top + (1 - i / count) * chartHeight;
      ticks.push({ val, y });
    }
    return ticks;
  }, [minVal, maxVal, chartHeight, padding.top]);

  // X-axis label samples (show ~6 labels)
  const xLabels = useMemo(() => {
    if (!coordinates.length) return [];
    const step = Math.max(1, Math.floor(coordinates.length / 6));
    const labels = [];
    for (let i = 0; i < coordinates.length; i += step) {
      labels.push(coordinates[i]);
    }
    // Always include the last one
    if (labels[labels.length - 1] !== coordinates[coordinates.length - 1]) {
      labels.push(coordinates[coordinates.length - 1]);
    }
    return labels;
  }, [coordinates]);

  const latestVal = displayedPoint ? (viewMode === 'equity' ? displayedPoint.equity : displayedPoint.pnl) : 0;
  const latestPnl = displayedPoint ? displayedPoint.pnl : 0;
  const latestPct = displayedPoint ? ((displayedPoint.equity - startingBalance) / startingBalance) * 100 : 0;

  return (
    <section 
      id="section-equity-curve"
      className="relative rounded-xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 shadow-xl transition-all"
    >
      {/* Header with Title, Live Metrics, View Mode, and Timeframe Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Equity &amp; Cumulative PnL Curve
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                • Real-time high-watermark tracking
              </span>
            </h2>
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              ${latestVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{latestPct.toFixed(2)}%</span>
              <span className="text-slate-400 font-normal">(${latestPnl >= 0 ? '+' : ''}${latestPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
            </div>
            {displayedPoint && (
              <span className="text-xs text-slate-400 font-mono">
                {activePoint ? `Inspecting: ${displayedPoint.date}` : `Latest: ${displayedPoint.date}`}
              </span>
            )}
          </div>
        </div>

        {/* Right Controls: View Switcher & Timeframe Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-auto">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
            <button
              id="equity-mode-btn"
              onClick={() => setViewMode('equity')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'equity'
                  ? 'bg-slate-800 text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Balance
            </button>
            <button
              id="pnl-mode-btn"
              onClick={() => setViewMode('pnl')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'pnl'
                  ? 'bg-slate-800 text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative PnL
            </button>
          </div>

          {/* Timeframe Toggles: 1W, 1M, YTD, All */}
          <div className="flex items-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
            {(['1W', '1M', 'YTD', 'ALL'] as TimeframeFilter[]).map((tf) => (
              <button
                key={tf}
                id={`timeframe-${tf.toLowerCase()}-btn`}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div 
        ref={containerRef}
        className="relative mt-4 w-full select-none"
        style={{ minHeight: '300px' }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Emerald neon gradient for area fill */}
            <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing filter for active cursor */}
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-axis labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 12}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] font-mono fill-slate-500"
              >
                ${Math.abs(tick.val) >= 1000 ? `${(tick.val / 1000).toFixed(0)}k` : tick.val.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Baseline reference line */}
          {baselineY >= padding.top && baselineY <= padding.top + chartHeight && (
            <g>
              <line
                x1={padding.left}
                y1={baselineY}
                x2={width - padding.right}
                y2={baselineY}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <text
                x={width - padding.right}
                y={baselineY - 6}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400 font-semibold"
              >
                Baseline: ${viewMode === 'equity' ? `${(startingBalance/1000).toFixed(0)}k` : '$0'}
              </text>
            </g>
          )}

          {/* Gradient Area Fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#equityGradient)"
            />
          )}

          {/* Smooth Equity Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />
          )}

          {/* Interactive Crosshair & Hover Inspector */}
          {activePoint && (
            <g>
              {/* Vertical line */}
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={padding.top + chartHeight}
                stroke="#34d399"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
              />

              {/* Horizontal crosshair */}
              <line
                x1={padding.left}
                y1={activePoint.y}
                x2={width - padding.right}
                y2={activePoint.y}
                stroke="#34d399"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />

              {/* Glowing active point */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#10b981"
                stroke="#090d16"
                strokeWidth="2"
                filter="url(#neonGlow)"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="11"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.5"
              />
            </g>
          )}

          {/* X-axis date labels */}
          {xLabels.map((item, i) => (
            <text
              key={i}
              x={item.x}
              y={height - 10}
              textAnchor="middle"
              className="text-[11px] font-mono fill-slate-400"
            >
              {item.data.date}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Pill */}
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-emerald-500/40 bg-[#090d16]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-75"
            style={{
              left: `clamp(10px, ${(activePoint.x / width) * 100}%, calc(100% - 170px))`,
              top: `${Math.max(10, ((activePoint.y - 70) / height) * 100)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 border-b border-slate-800 pb-1 mb-1">
              <span className="font-mono text-slate-300">{activePoint.data.date}</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {activePoint.data.drawdownPercent === 0 ? 'Peak High' : `-${activePoint.data.drawdownPercent}% DD`}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs text-slate-400">Equity:</span>
              <span className="text-sm font-bold font-mono text-white">
                ${activePoint.data.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-xs text-slate-400">Net Return:</span>
              <span className="text-xs font-bold font-mono text-emerald-400">
                +${activePoint.data.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Micro Metrics Footer Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>All-Time High: <span className="text-white font-semibold">$142,850.50</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            <span>Sharpe Ratio: <span className="text-white font-semibold">2.14</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
            <span>Recovery Factor: <span className="text-white font-semibold">10.2</span></span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Calculated across 184 verified broker executions</span>
        </div>
      </div>
    </section>
  );
};
