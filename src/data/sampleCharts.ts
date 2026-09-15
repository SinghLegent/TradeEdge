// High-fidelity SVG-based candlestick chart screenshots for trading journal setups

export interface ChartPreset {
  id: string;
  name: string;
  timeframe: string;
  setup: string;
  svgDataUri: string;
}

export const SAMPLE_CHART_SVGS: Record<string, string> = {
  liquidity_sweep: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#0b0f19; font-family:monospace;">
  <!-- Grid -->
  <defs>
    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#172033" stroke-width="0.8"/>
    </pattern>
    <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0b0f19"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Ticker Info Top Left -->
  <text x="25" y="35" fill="#f8fafc" font-size="16" font-weight="bold">BTC/USDT • 15m • Liquidity Sweep &amp; OB Tap</text>
  <text x="25" y="55" fill="#94a3b8" font-size="12">O: 68,450  H: 71,320  L: 68,120  C: 71,200  (+4.02%)</text>

  <!-- Asian Low Liquidity Line -->
  <line x1="40" y1="280" x2="380" y2="280" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="50" y="272" fill="#f43f5e" font-size="11" font-weight="bold">SSL (Asian Range Low) Swept 🔻</text>

  <!-- Demand Zone Box -->
  <rect x="250" y="270" width="140" height="35" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="258" y="292" fill="#60a5fa" font-size="11" font-weight="bold">15m Bullish Demand</text>

  <!-- Candles (Wicks & Bodies) -->
  <!-- Downtrend candles -->
  <line x1="80" y1="120" x2="80" y2="210" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="74" y="140" width="12" height="55" fill="#ef4444" rx="1"/>

  <line x1="120" y1="180" x2="120" y2="245" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="114" y="195" width="12" height="40" fill="#ef4444" rx="1"/>

  <line x1="160" y1="220" x2="160" y2="275" stroke="#10b981" stroke-width="1.5"/>
  <rect x="154" y="235" width="12" height="30" fill="#10b981" rx="1"/>

  <line x1="200" y1="240" x2="200" y2="285" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="194" y="250" width="12" height="30" fill="#ef4444" rx="1"/>

  <!-- Sweep candle -->
  <line x1="240" y1="255" x2="240" y2="330" stroke="#10b981" stroke-width="1.5"/>
  <rect x="234" y="260" width="12" height="35" fill="#10b981" rx="1"/>

  <line x1="280" y1="260" x2="280" y2="320" stroke="#10b981" stroke-width="1.5"/>
  <rect x="274" y="265" width="12" height="40" fill="#10b981" rx="1"/>

  <!-- Strong displacement candles upward -->
  <line x1="320" y1="240" x2="320" y2="290" stroke="#10b981" stroke-width="1.5"/>
  <rect x="314" y="245" width="12" height="40" fill="#10b981" rx="1"/>

  <line x1="360" y1="190" x2="360" y2="260" stroke="#10b981" stroke-width="1.5"/>
  <rect x="354" y="200" width="12" height="50" fill="#10b981" rx="1"/>

  <line x1="400" y1="160" x2="400" y2="225" stroke="#10b981" stroke-width="1.5"/>
  <rect x="394" y="170" width="12" height="45" fill="#10b981" rx="1"/>

  <line x1="440" y1="130" x2="440" y2="190" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="434" y="145" width="12" height="30" fill="#ef4444" rx="1"/>

  <line x1="480" y1="110" x2="480" y2="170" stroke="#10b981" stroke-width="1.5"/>
  <rect x="474" y="120" width="12" height="40" fill="#10b981" rx="1"/>

  <line x1="520" y1="80" x2="520" y2="140" stroke="#10b981" stroke-width="1.5"/>
  <rect x="514" y="90" width="12" height="45" fill="#10b981" rx="1"/>

  <line x1="560" y1="60" x2="560" y2="115" stroke="#10b981" stroke-width="1.5"/>
  <rect x="554" y="70" width="12" height="35" fill="#10b981" rx="1"/>

  <!-- Trade Execution Lines -->
  <!-- Take Profit Line -->
  <line x1="280" y1="70" x2="720" y2="70" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="630" y="58" width="125" height="24" fill="#10b981" rx="4"/>
  <text x="638" y="74" fill="#022c22" font-size="11" font-weight="bold">TP: $71,200 (+3.1R)</text>

  <!-- Entry Line -->
  <line x1="280" y1="230" x2="720" y2="230" stroke="#3b82f6" stroke-width="2"/>
  <rect x="630" y="218" width="115" height="24" fill="#3b82f6" rx="4"/>
  <text x="638" y="234" fill="#ffffff" font-size="11" font-weight="bold">ENTRY: $68,450</text>

  <!-- Stop Loss Line -->
  <line x1="280" y1="330" x2="720" y2="330" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="630" y="318" width="110" height="24" fill="#ef4444" rx="4"/>
  <text x="638" y="334" fill="#ffffff" font-size="11" font-weight="bold">SL: $67,500</text>

  <!-- Reward Shading -->
  <rect x="280" y="70" width="340" height="160" fill="url(#bullGrad)"/>

  <!-- Trade Tag Watermark -->
  <rect x="25" y="400" width="220" height="28" fill="#1e293b" rx="6" stroke="#334155"/>
  <text x="35" y="418" fill="#38bdf8" font-size="11" font-weight="bold">PRO-JOURNAL VERIFIED EXECUTION</text>
</svg>
`) }`,

  breakout: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#0b0f19; font-family:monospace;">
  <defs>
    <pattern id="grid2" width="40" height="30" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#172033" stroke-width="0.8"/>
    </pattern>
    <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0b0f19"/>
  <rect width="100%" height="100%" fill="url(#grid2)"/>

  <text x="25" y="35" fill="#f8fafc" font-size="16" font-weight="bold">EUR/USD • 1h • London Breakout &amp; Expansion</text>
  <text x="25" y="55" fill="#94a3b8" font-size="12">O: 1.0924  H: 1.0935  L: 1.0858  C: 1.0862  (-0.57%)</text>

  <!-- Asian Range Box -->
  <rect x="60" y="110" width="180" height="70" fill="#475569" fill-opacity="0.25" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
  <text x="70" y="130" fill="#cbd5e1" font-size="11" font-weight="bold">Asian Session Range (Tight)</text>

  <!-- Resistance Line -->
  <line x1="50" y1="110" x2="550" y2="110" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="440" y="102" fill="#fbbf24" font-size="11" font-weight="bold">Session High (1.0935)</text>

  <!-- Candles -->
  <line x1="90" y1="120" x2="90" y2="170" stroke="#10b981" stroke-width="1.5"/>
  <rect x="84" y="130" width="12" height="30" fill="#10b981" rx="1"/>

  <line x1="130" y1="125" x2="130" y2="165" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="124" y="135" width="12" height="25" fill="#ef4444" rx="1"/>

  <line x1="170" y1="115" x2="170" y2="160" stroke="#10b981" stroke-width="1.5"/>
  <rect x="164" y="125" width="12" height="25" fill="#10b981" rx="1"/>

  <!-- Fakeout candle -->
  <line x1="210" y1="95" x2="210" y2="165" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="204" y="115" width="12" height="35" fill="#ef4444" rx="1"/>

  <!-- Big breakdown candle at London Open -->
  <line x1="260" y1="130" x2="260" y2="240" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="254" y="145" width="12" height="85" fill="#ef4444" rx="1"/>

  <line x1="300" y1="210" x2="300" y2="280" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="294" y="225" width="12" height="50" fill="#ef4444" rx="1"/>

  <line x1="340" y1="260" x2="340" y2="330" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="334" y="270" width="12" height="50" fill="#ef4444" rx="1"/>

  <line x1="380" y1="310" x2="380" y2="370" stroke="#ef4444" stroke-width="1.5"/>
  <rect x="374" y="320" width="12" height="40" fill="#ef4444" rx="1"/>

  <!-- Entry Line (Short) -->
  <line x1="220" y1="140" x2="720" y2="140" stroke="#f97316" stroke-width="2"/>
  <rect x="620" y="128" width="130" height="24" fill="#ea580c" rx="4"/>
  <text x="628" y="144" fill="#ffffff" font-size="11" font-weight="bold">SHORT: 1.0924</text>

  <!-- Stop Loss Line -->
  <line x1="220" y1="95" x2="720" y2="95" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="620" y="83" width="125" height="24" fill="#dc2626" rx="4"/>
  <text x="628" y="99" fill="#ffffff" font-size="11" font-weight="bold">SL: 1.0945</text>

  <!-- Take Profit Line -->
  <line x1="220" y1="350" x2="720" y2="350" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="620" y="338" width="130" height="24" fill="#059669" rx="4"/>
  <text x="628" y="354" fill="#ffffff" font-size="11" font-weight="bold">TP: 1.0862 (+2.8R)</text>

  <!-- Shading -->
  <rect x="250" y="140" width="370" height="210" fill="url(#bearGrad)"/>
</svg>
`) }`,

  stock_gap: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#0b0f19; font-family:monospace;">
  <defs>
    <pattern id="grid3" width="40" height="30" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#172033" stroke-width="0.8"/>
    </pattern>
    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0b0f19"/>
  <rect width="100%" height="100%" fill="url(#grid3)"/>

  <text x="25" y="35" fill="#f8fafc" font-size="16" font-weight="bold">NVDA • 5m • Gap &amp; Go Opening Drive</text>
  <text x="25" y="55" fill="#94a3b8" font-size="12">O: 132.50  H: 137.10  L: 132.10  C: 136.80  (+3.25%)</text>

  <!-- Pre-market high -->
  <line x1="40" y1="240" x2="520" y2="240" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="50" y="232" fill="#93c5fd" font-size="11" font-weight="bold">Pre-Market High: $132.50</text>

  <!-- Candles -->
  <line x1="120" y1="280" x2="120" y2="340" stroke="#10b981" stroke-width="1.5"/>
  <rect x="114" y="295" width="12" height="35" fill="#10b981" rx="1"/>

  <!-- Market open gap candle -->
  <line x1="180" y1="210" x2="180" y2="270" stroke="#10b981" stroke-width="2"/>
  <rect x="174" y="220" width="12" height="40" fill="#10b981" rx="1"/>

  <line x1="220" y1="180" x2="220" y2="230" stroke="#10b981" stroke-width="2"/>
  <rect x="214" y="185" width="12" height="40" fill="#10b981" rx="1"/>

  <line x1="260" y1="150" x2="260" y2="200" stroke="#10b981" stroke-width="2"/>
  <rect x="254" y="155" width="12" height="40" fill="#10b981" rx="1"/>

  <line x1="300" y1="120" x2="300" y2="170" stroke="#10b981" stroke-width="2"/>
  <rect x="294" y="125" width="12" height="40" fill="#10b981" rx="1"/>

  <!-- TP, Entry, SL lines -->
  <line x1="180" y1="110" x2="720" y2="110" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="620" y="98" width="120" height="24" fill="#059669" rx="4"/>
  <text x="628" y="114" fill="#ffffff" font-size="11" font-weight="bold">TP: $136.80</text>

  <line x1="180" y1="220" x2="720" y2="220" stroke="#3b82f6" stroke-width="2"/>
  <rect x="620" y="208" width="120" height="24" fill="#2563eb" rx="4"/>
  <text x="628" y="224" fill="#ffffff" font-size="11" font-weight="bold">ENTRY: $132.50</text>

  <line x1="180" y1="270" x2="720" y2="270" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
  <rect x="620" y="258" width="120" height="24" fill="#dc2626" rx="4"/>
  <text x="628" y="274" fill="#ffffff" font-size="11" font-weight="bold">SL: $130.80</text>

  <rect x="180" y="110" width="440" height="110" fill="url(#greenGrad)"/>
</svg>
`) }`
};

export const CHART_PRESETS: ChartPreset[] = [
  {
    id: 'liquidity_sweep',
    name: 'Liquidity Sweep + Demand Tap',
    timeframe: '15m',
    setup: 'Liquidity Sweep',
    svgDataUri: SAMPLE_CHART_SVGS.liquidity_sweep
  },
  {
    id: 'breakout',
    name: 'London Open Breakout & Expansion',
    timeframe: '1h',
    setup: 'London Breakout',
    svgDataUri: SAMPLE_CHART_SVGS.breakout
  },
  {
    id: 'stock_gap',
    name: 'Gap & Go Momentum Drive',
    timeframe: '5m',
    setup: 'Gap & Go',
    svgDataUri: SAMPLE_CHART_SVGS.stock_gap
  }
];
