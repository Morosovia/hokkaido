import React from "react";
import { DayItinerary } from "../types";
import { Clock, Compass, ZoomIn } from "lucide-react";
import { COORDS } from "../itineraryData";

interface TravelMapProps {
  activeDay: DayItinerary;
  allDays: DayItinerary[];
}

// Color scheme for each of the 10 days
const DAY_COLORS = [
  "#f59e0b", // Day 1: Amber
  "#10b981", // Day 2: Emerald
  "#06b6d4", // Day 3: Cyan
  "#3b82f6", // Day 4: Blue
  "#8b5cf6", // Day 5: Purple
  "#ec4899", // Day 6: Pink
  "#ef4444", // Day 7: Red
  "#14b8a6", // Day 8: Teal
  "#6366f1", // Day 9: Indigo
  "#84cc16", // Day 10: Lime
];

// 2D Schematic coordinates mimicking Taipei Metro (Subway) style with straight lines and 45-degree alignments
const SCHEMATIC_COORDS: Record<string, { x: number; y: number; labelPos: "t" | "b" | "l" | "r" | "tl" | "tr" | "bl" | "br"; name: string }> = {
  // Airports / Gateway
  tpe: { x: 5, y: 88, labelPos: "b", name: "桃園機場" },
  cts: { x: 18, y: 70, labelPos: "t", name: "新千歲機場" },

  // Sapporo City (Generously spaced out to prevent overlap)
  hokkaido_shrine: { x: 30, y: 55, labelPos: "t", name: "北海道神宮" },
  suwa_shrine: { x: 38, y: 55, labelPos: "t", name: "諏訪神社" },
  clock_tower: { x: 48, y: 55, labelPos: "t", name: "時計台" },
  odori_park: { x: 38, y: 65, labelPos: "b", name: "大通公園" },
  sapporo_mercure: { x: 48, y: 65, labelPos: "br", name: "札幌美居" },
  tanukikoji: { x: 28, y: 65, labelPos: "l", name: "狸小路" },
  susukino: { x: 58, y: 65, labelPos: "r", name: "薄野" },

  // Northern Route (Rumoi, Wakkanai, Rebun, Soya)
  rumoi: { x: 28, y: 40, labelPos: "l", name: "留萌" },
  wakkanai: { x: 38, y: 25, labelPos: "l", name: "稚內" },
  rebun_island: { x: 28, y: 25, labelPos: "t", name: "禮文島" },
  noshappu: { x: 38, y: 15, labelPos: "t", name: "野寒布岬" },
  wakkanai_meguma: { x: 48, y: 25, labelPos: "r", name: "稚內MEGUMA" },
  soya_cape: { x: 48, y: 15, labelPos: "t", name: "宗谷岬" },
  soya_hills: { x: 58, y: 15, labelPos: "r", name: "宗谷丘陵" },

  // Central/Eastern Route (Asahikawa, Furano, Biei) - shifted left closer to Sapporo for readability & shorter D6 segment
  asahikawa: { x: 50, y: 35, labelPos: "t", name: "旭川" },
  otokoyama: { x: 56, y: 35, labelPos: "t", name: "男山酒造" },
  shikisai_no_oka: { x: 62, y: 35, labelPos: "t", name: "四季彩之丘" },
  farm_tomita: { x: 68, y: 35, labelPos: "t", name: "富田農場" },
  blue_pond: { x: 68, y: 25, labelPos: "r", name: "白金青池" },
  takushinkan: { x: 68, y: 45, labelPos: "r", name: "拓真館" },
  new_furano_prince: { x: 62, y: 45, labelPos: "b", name: "新富良野" },
  ningle_terrace: { x: 56, y: 45, labelPos: "b", name: "精靈露臺" },

  // Southern Route (Toya, Noboribetsu, Hakodate)
  toya_manseikaku: { x: 30, y: 78, labelPos: "b", name: "洞爺萬世閣" },
  nixe: { x: 18, y: 78, labelPos: "l", name: "登別尼克斯" },
  fruit_picking: { x: 40, y: 78, labelPos: "t", name: "壯瞥採果" },
  toya_observation: { x: 50, y: 78, labelPos: "t", name: "洞爺湖展望" },
  toya_cruise: { x: 50, y: 88, labelPos: "b", name: "洞爺湖汽船" },
  onuma_park: { x: 60, y: 78, labelPos: "t", name: "大沼公園" },
  goryokaku: { x: 70, y: 78, labelPos: "t", name: "五稜郭" },
  hakodate_cableway: { x: 80, y: 78, labelPos: "t", name: "函館山纜車" },
  hakodate_international: { x: 80, y: 88, labelPos: "r", name: "函館國際" },
  hakodate_morning_market: { x: 70, y: 88, labelPos: "b", name: "函館朝市" },
  motomachi_area: { x: 60, y: 88, labelPos: "b", name: "元町歷史" },
  red_brick_warehouses: { x: 50, y: 88, labelPos: "b", name: "紅磚倉庫" },
  trappistine_monastery: { x: 40, y: 88, labelPos: "b", name: "修道院" },
  lucky_pierrot: { x: 30, y: 88, labelPos: "b", name: "小丑漢堡" },
  hkd_airport: { x: 18, y: 88, labelPos: "b", name: "函館機場" },
};

// Map normalized coord to visual SVG dimension (600x340)
const getCoords = (key: string) => {
  const cfg = SCHEMATIC_COORDS[key];
  if (!cfg) return { x: 300, y: 170, labelPos: "b" as const, name: "" };
  return {
    x: cfg.x * 5.8 + 20,
    y: cfg.y * 3.2 + 15,
    labelPos: cfg.labelPos,
    name: cfg.name,
  };
};

export const TravelMap: React.FC<TravelMapProps> = ({ activeDay, allDays }) => {
  const [showAllLines, setShowAllLines] = React.useState(false);

  // Drag-to-scroll refs and state for horizontal scrolling
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftState = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftState.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // multiplier for scrolling speed
    scrollRef.current.scrollLeft = scrollLeftState.current - walk;
  };

  // Smoothly center the map when active day or showAllLines view changes
  React.useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      if (scrollWidth > clientWidth) {
        container.scrollTo({
          left: (scrollWidth - clientWidth) / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeDay.day, showAllLines]);

  // Filter out meals/hotels from activities to show scenic / airport waypoints only
  const getDayWaypoints = (dayData: DayItinerary) => {
    return dayData.activities.filter((act) => {
      // airports always included
      if (act.schematicId === "tpe" || act.schematicId === "cts" || act.schematicId === "hkd_airport") return true;
      // skip meals, hotel, transfers from drawing track
      if (act.type === "meal" || act.type === "hotel" || act.type === "transfer") return false;
      return !!act.schematicId;
    });
  };

  // 1. Calculate active day points
  const activeWaypoints = getDayWaypoints(activeDay);
  const activePoints = activeWaypoints
    .map((w) => getCoords(w.schematicId!))
    .filter((p) => p.name !== "");

  // 2. Gather active day stations
  const activeStations = Object.entries(SCHEMATIC_COORDS)
    .map(([key, raw]) => {
      // Find all days that visit this schematic node
      const visitingDays = allDays
        .filter((d) => getDayWaypoints(d).some((act) => act.schematicId === key))
        .map((d) => d.day);
      
      return [key, {
        ...getCoords(key),
        days: visitingDays
      }] as const;
    })
    .filter(([_, data]) => data.days.length > 0 && data.name !== "");

  // 3. Generate all days lines path data for full map view
  const allLinesData = allDays.map((d) => {
    const waypoints = getDayWaypoints(d);
    const points = waypoints.map((w) => getCoords(w.schematicId!)).filter((p) => p.name !== "");
    const color = DAY_COLORS[(d.day - 1) % DAY_COLORS.length];
    return { day: d.day, points, color };
  });

  const activeColor = DAY_COLORS[(activeDay.day - 1) % DAY_COLORS.length];

  // Map automatic focal center calculations based on active points bounds to auto-pan and zoom today's track
  const getTransformProps = () => {
    if (showAllLines || activePoints.length === 0) {
      return { x: 0, y: 0, scale: 1.0 }; // Default overview zoom
    }

    // Get active segment bounding box in 600x340 coordinate space
    const xs = activePoints.map((p) => p.x);
    const ys = activePoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    // Bounding box size
    const dx = maxX - minX;
    const dy = maxY - minY;

    // Target viewport size is 600x340. Define zoom scale.
    // Cap zoom scale between 1.15x and 1.8x to prevent excessive zoom-in on single spots or giant gaps
    let scale = 1.45;
    if (dx > 0 || dy > 0) {
      const scaleX = 480 / Math.max(dx, 1);
      const scaleY = 260 / Math.max(dy, 1);
      scale = Math.min(scaleX, scaleY);
      scale = Math.max(1.15, Math.min(1.8, scale));
    }

    // Center shift vector relative to SVG's viewport center (300, 170)
    const tx = 300 - midX * scale;
    const ty = 170 - midY * scale;

    return { x: tx, y: ty, scale };
  };

  const transform = getTransformProps();
  const transformStyle = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    transformOrigin: "0px 0px",
    transition: "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.0)",
  };

  const getLabelOffset = (pos: string) => {
    switch (pos) {
      case "t": return { dx: 0, dy: -12, textAnchor: "middle" as const };
      case "b": return { dx: 0, dy: 16, textAnchor: "middle" as const };
      case "l": return { dx: -10, dy: 3, textAnchor: "end" as const };
      case "r": return { dx: 10, dy: 3, textAnchor: "start" as const };
      case "tl": return { dx: -8, dy: -8, textAnchor: "end" as const };
      case "tr": return { dx: 8, dy: -8, textAnchor: "start" as const };
      case "bl": return { dx: -8, dy: 12, textAnchor: "end" as const };
      case "br": return { dx: 8, dy: 12, textAnchor: "start" as const };
      default: return { dx: 0, dy: 12, textAnchor: "middle" as const };
    }
  };

  // Combine overlapping days into ranges like D1 or D2-5
  const formatDayRange = (days: number[]) => {
    if (days.length === 0) return "";
    const sorted = [...days].sort((a, b) => a - b);
    
    // Check if contiguous sequence
    let isContiguous = true;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        isContiguous = false;
        break;
      }
    }

    if (isContiguous && sorted.length > 1) {
      return `D${sorted[0]}-${sorted[sorted.length - 1]}`;
    }
    return sorted.map(d => `D${d}`).join(",");
  };

  return (
    <div className="flex flex-col h-full bg-stone-50" id="map-container">
      {/* Map Control Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200 bg-white shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-rose-50 text-rose-500">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-800">全體路線圖 (捷運風格)</h3>
            <p className="text-[9px] text-stone-400">
              {showAllLines ? "完整 10 天路線一覽" : `當日焦點：第 ${activeDay.day} 天 (${activeDay.title})`}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/40 shrink-0">
          <button
            onClick={() => setShowAllLines(false)}
            className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${
              !showAllLines
                ? "bg-white text-stone-800 shadow-xs"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            單日焦點
          </button>
          <button
            onClick={() => setShowAllLines(true)}
            className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${
              showAllLines
                ? "bg-white text-stone-800 shadow-xs"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            完整路網
          </button>
        </div>
      </div>

      {/* 第一個 DIV: Taipei Metro (Subway) Schematic relative position map with focal zoom and drag-to-scroll */}
      <div className="relative bg-stone-100/40 border-b border-stone-200 flex flex-col h-[280px] xs:h-[310px] sm:h-[350px] shrink-0 select-none overflow-hidden" id="map-inner-wrapper">
        
        {/* Scrollable Map Viewport */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex-1 overflow-x-auto touch-pan-x flex items-center justify-start p-3 relative cursor-grab active:cursor-grabbing"
          id="map-scroll-viewport"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Background Grid Lines to make it look like schematic drafting paper */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none" />

          <svg
            viewBox="0 0 600 340"
            className="h-full w-auto shrink-0"
            style={{ aspectRatio: "600 / 340" }}
          >
            {/* We wrap everything inside a <g> and apply GPU-accelerated centering & zooming */}
            <g style={transformStyle}>
              {/* 1. Metro Tracks (Behind nodes) */}
              {showAllLines ? (
                // Draw all days' paths with faded line for non-active days
                allLinesData.map((line) => {
                  const linePathD = line.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                  const isCurrentDay = line.day === activeDay.day;
                  if (!linePathD) return null;
                  return (
                    <g key={`full-line-${line.day}`}>
                      {/* Base thick solid line */}
                      <path
                        d={linePathD}
                        fill="none"
                        stroke="#e4e4e7" // zinc-200
                        strokeWidth={isCurrentDay ? 8.5 : 5.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isCurrentDay ? 1.0 : 0.4}
                      />
                      {/* Dash line colored overlay */}
                      <path
                        d={linePathD}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={isCurrentDay ? 4.5 : 3.0}
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isCurrentDay ? 1.0 : 0.45}
                      />
                    </g>
                  );
                })
              ) : (
                // Draw only today's track in high visibility
                activePoints.length > 1 && (
                  (() => {
                    const linePathD = activePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                    return (
                      <g>
                        {/* Base thick solid track */}
                        <path
                          d={linePathD}
                          fill="none"
                          stroke="#e2e8f0" // slate-200
                          strokeWidth={8.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Dash line colored overlay */}
                        <path
                          d={linePathD}
                          fill="none"
                          stroke={activeColor}
                          strokeWidth={4.5}
                          strokeDasharray="5 4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    );
                  })()
                )
              )}

              {/* 2. Station Nodes & Suffix Labels (In front of tracks) */}
              {activeStations.map(([key, data]) => {
                const isTodayStation = data.days.includes(activeDay.day);
                const textProps = getLabelOffset(data.labelPos);
                
                // Color for the specific node. If it belongs to active day, use activeColor, otherwise its first day's color.
                const nodeColor = isTodayStation ? activeColor : (DAY_COLORS[(data.days[0] - 1) % DAY_COLORS.length] || "#a8a29e");

                // Suffix day information, e.g. (D1) or (D2-5)
                const rangeStr = formatDayRange(data.days);

                return (
                  <g 
                    key={`metro-node-${key}`} 
                    className={`transition-opacity duration-200 ${
                      showAllLines && !isTodayStation ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {/* Outer station ring */}
                    <circle
                      cx={data.x}
                      cy={data.y}
                      r={isTodayStation ? 8.5 : 6.5}
                      fill={nodeColor}
                    />
                    {/* White inner center */}
                    <circle
                      cx={data.x}
                      cy={data.y}
                      r={isTodayStation ? 5.0 : 3.8}
                      fill="#ffffff"
                    />
                    {/* Center core spot */}
                    <circle
                      cx={data.x}
                      cy={data.y}
                      r={isTodayStation ? 2.2 : 1.6}
                      fill={nodeColor}
                    />

                    {/* Text Label background protection shadow */}
                    <text
                      x={data.x + textProps.dx}
                      y={data.y + textProps.dy}
                      textAnchor={textProps.textAnchor}
                      className="text-[9px] font-bold fill-white stroke-white stroke-[4px] select-none"
                    >
                      {data.name}
                    </text>
                    {/* Actual Station Text Label with Day suffix */}
                    <text
                      x={data.x + textProps.dx}
                      y={data.y + textProps.dy}
                      textAnchor={textProps.textAnchor}
                      className="text-[9.5px] select-none"
                    >
                      {/* Station Name */}
                      <tspan className={isTodayStation ? "font-black fill-stone-900" : "font-semibold fill-stone-500"}>
                        {data.name}
                      </tspan>
                      {/* Suffix like (D1) or (D2-5) */}
                      <tspan className={`font-mono text-[8px] font-semibold ml-0.5 ${isTodayStation ? "fill-rose-600" : "fill-stone-400"}`}>
                        {` (${rangeStr})`}
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Legend Row at the bottom of the map view (Static, non-absolute, so it never overlaps the SVG content) */}
        <div className="bg-white border-t border-stone-200 px-3 py-2.5 flex justify-between items-center text-[10px] font-medium text-stone-500 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full">
            {showAllLines ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-stone-700">捷運路網：</span>
                {allDays.slice(0, 10).map((d) => (
                  <span key={`legend-color-${d.day}`} className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DAY_COLORS[(d.day - 1) % DAY_COLORS.length] }} />
                    <span className={d.day === activeDay.day ? "font-bold text-rose-600" : ""}>D{d.day}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
                <span>
                  <strong className="text-stone-800">今日焦點：第 {activeDay.day} 天 </strong>
                  (可左右拖移或縮放，點選下方天數卡片切換)
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 第二個 DIV: Simple Horizontal Step Bar (今日主要站點序列) */}
      <div className="flex-1 bg-white p-3 flex flex-col justify-center min-h-[95px] overflow-hidden">
        <div className="text-[10px] font-bold text-stone-500 mb-2 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>今日主要路線</span>
        </div>
        
        <div className="flex items-center w-full overflow-x-auto py-1 scrollbar-none" id="step-scroller">
          {activePoints.length === 0 ? (
            <div className="text-[10px] text-stone-400 italic py-2">本日無特選定點線路行程 (例如自由活動/返程)</div>
          ) : (
            <div className="flex items-center gap-1 px-1 min-w-full">
              {activePoints.map((pt, index) => {
                const isLast = index === activePoints.length - 1;
                return (
                  <React.Fragment key={`step-${pt.name}-${index}`}>
                    {/* Station item */}
                    <div className="flex flex-col items-center shrink-0">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border"
                        style={{ 
                          backgroundColor: activeColor + "15",
                          borderColor: activeColor,
                          color: activeColor 
                        }}
                      >
                        {index + 1}
                      </div>
                      <span className="text-[10px] font-bold text-stone-800 mt-1 max-w-[55px] truncate text-center">
                        {pt.name}
                      </span>
                    </div>

                    {/* Connecting line */}
                    {!isLast && (
                      <div className="flex-1 min-w-[15px] h-[2px] bg-stone-200 -mt-4 relative">
                        <div 
                          className="absolute inset-0 bg-stone-300"
                          style={{ backgroundColor: activeColor, opacity: 0.5 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   ORIGINAL LAYOUT CODE BACKUP (In case you regret the change and want to revert):
   ============================================================================
   To revert, replace the "第一個 DIV: ... map-inner-wrapper" structure above with this:

      <div className="relative bg-stone-100/40 border-b border-stone-200 p-2 overflow-hidden flex items-center justify-center h-[230px] xs:h-[260px] sm:h-[300px] shrink-0 select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none" />

        <svg
          viewBox="0 0 600 340"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full"
        >
          <g style={transformStyle}>
            {...[Svg child elements as rendered in the current code]...}
          </g>
        </svg>

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-stone-200/60 text-[9px] font-medium text-stone-500 shadow-2xs pointer-events-none">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            {showAllLines ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-stone-700">捷運路網：</span>
                {allDays.slice(0, 10).map((d) => (
                  <span key={`legend-color-${d.day}`} className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DAY_COLORS[(d.day - 1) % DAY_COLORS.length] }} />
                    <span className={d.day === activeDay.day ? "font-bold text-rose-600" : ""}>D{d.day}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
                <span>
                  <strong className="text-stone-800">今日焦點：第 {activeDay.day} 天 </strong>
                  (已著重放大，點選下方天數卡片切換)
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
============================================================================ */
