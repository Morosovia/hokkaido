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

  // Filter out meals/hotels from activities to show scenic / airport waypoints only
  const getDayWaypoints = (dayData: DayItinerary) => {
    return dayData.activities.filter((act) => {
      const isMeal = act.icon === "meal" || 
                     act.title.includes("午餐") || 
                     act.title.includes("晚餐") || 
                     act.title.includes("早餐") || 
                     act.title.includes("拉麵") || 
                     act.title.includes("燒肉") || 
                     act.title.includes("螃蟹") || 
                     act.title.includes("蟹本家") || 
                     act.title.includes("湯咖哩") || 
                     act.title.includes("食堂") ||
                     act.title.includes("小丑漢堡") ||
                     act.title.includes("下午茶") ||
                     act.description?.includes("吃");
      const isHotel = act.icon === "hotel" && (act.title.includes("入住") || act.title.includes("飯店") || act.title.includes("Hotel"));
      
      return !isMeal && !isHotel;
    });
  };

  const activeWaypoints = getDayWaypoints(activeDay);

  const getWaypointKey = (wp: any): string | null => {
    if (!wp.coordinates) {
      const found = Object.entries(COORDS).find(([_, val]) => {
        return wp.title.includes(val.name) || (wp.locationName && wp.locationName.includes(val.name));
      });
      return found ? found[0] : null;
    }
    const found = Object.entries(COORDS).find(([_, val]) => {
      return val.name === wp.coordinates.name || 
             (Math.abs(val.lat - wp.coordinates.lat) < 0.01 && Math.abs(val.lng - wp.coordinates.lng) < 0.01);
    });
    return found ? found[0] : null;
  };

  const getDayPathPoints = (dayData: DayItinerary) => {
    const waypoints = getDayWaypoints(dayData);
    const points: { x: number; y: number; key: string; name: string; labelPos: string }[] = [];
    
    waypoints.forEach((wp) => {
      const key = getWaypointKey(wp);
      if (key) {
        if (points.length === 0 || points[points.length - 1].key !== key) {
          const coords = getCoords(key);
          points.push({ x: coords.x, y: coords.y, key, name: coords.name, labelPos: coords.labelPos });
        }
      }
    });
    return points;
  };

  const activePoints = getDayPathPoints(activeDay);
  const activeColor = DAY_COLORS[(activeDay.day - 1) % DAY_COLORS.length];

  // Map label offset and text anchors
  const getLabelOffset = (pos: string) => {
    switch (pos) {
      case "t": return { dx: 0, dy: -14, textAnchor: "middle" };
      case "b": return { dx: 0, dy: 18, textAnchor: "middle" };
      case "l": return { dx: -12, dy: 3, textAnchor: "end" };
      case "r": return { dx: 12, dy: 3, textAnchor: "start" };
      case "tr": return { dx: 10, dy: -10, textAnchor: "start" };
      case "tl": return { dx: -10, dy: -10, textAnchor: "end" };
      case "br": return { dx: 10, dy: 12, textAnchor: "start" };
      case "bl": return { dx: -10, dy: 12, textAnchor: "end" };
      default: return { dx: 0, dy: 16, textAnchor: "middle" };
    }
  };

  // Google map route redirect
  const getGoogleMapsRouteLink = () => {
    const mappableWaypoints = activeWaypoints.filter(wp => wp.locationName || wp.coordinates);
    if (mappableWaypoints.length === 0) return null;
    const origin = mappableWaypoints[0].locationName || mappableWaypoints[0].title;
    const destination =
      mappableWaypoints[mappableWaypoints.length - 1].locationName || mappableWaypoints[mappableWaypoints.length - 1].title;

    let waypointsParam = "";
    if (mappableWaypoints.length > 2) {
      const mids = mappableWaypoints.slice(1, -1);
      waypointsParam = mids
        .map((w) => encodeURIComponent(w.locationName || w.title))
        .join("|");
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}${
      waypointsParam ? `&waypoints=${waypointsParam}` : ""
    }&travelmode=driving`;
  };

  const routeLink = getGoogleMapsRouteLink();

  // Compute all days' lines to display full network if toggle is active
  const allLinesData = React.useMemo(() => {
    return allDays.map((d) => {
      const points = getDayPathPoints(d);
      const color = DAY_COLORS[(d.day - 1) % DAY_COLORS.length];
      return { day: d.day, points, color };
    });
  }, [allDays]);

  // Unique list of all stations in the active lines for labels/dots rendering
  const activeStations = React.useMemo(() => {
    const stations: Record<string, { x: number; y: number; name: string; labelPos: string; days: number[] }> = {};
    const daysToScan = showAllLines ? allDays : [activeDay];

    daysToScan.forEach((d) => {
      const pts = getDayPathPoints(d);
      pts.forEach((p) => {
        if (!stations[p.key]) {
          stations[p.key] = { x: p.x, y: p.y, name: p.name, labelPos: p.labelPos, days: [] };
        }
        if (!stations[p.key].days.includes(d.day)) {
          stations[p.key].days.push(d.day);
        }
      });
    });
    return Object.entries(stations);
  }, [showAllLines, activeDay, allDays]);

  // Format list of days to display in the labels. E.g. (D2-5) or (D1) or (D1/10)
  const formatDayRange = (days: number[]) => {
    if (days.length === 0) return "";
    const sorted = [...days].sort((a, b) => a - b);
    const isConsecutive = sorted.every((d, idx) => idx === 0 || d === sorted[idx - 1] + 1);
    if (isConsecutive && sorted.length > 1) {
      return `D${sorted[0]}-${sorted[sorted.length - 1]}`;
    } else {
      return `D${sorted.join("/")}`;
    }
  };

  // GPU-Accelerated centering transform calculation for dynamic bounding box zooming
  const transformStyle = React.useMemo(() => {
    if (showAllLines || activePoints.length === 0) {
      return {
        transform: "translate(0px, 0px) scale(1)",
        transformOrigin: "0 0",
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    // Get active path boundaries
    const xs = activePoints.map((p) => p.x);
    const ys = activePoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const dx = maxX - minX;
    const dy = maxY - minY;

    // Minimum dimensions to avoid zooming in too tight or dividing by zero
    const finalDx = dx || 110;
    const finalDy = dy || 90;

    // Center of the active points
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Screen dimensions: 600 width, 340 height
    // Calculate scale factors, reserving 90px horizontal margin & 70px vertical margin for labels
    const scaleX = (600 - 90) / finalDx;
    const scaleY = (340 - 70) / finalDy;
    
    // Choose the minimum scale factor to fit everything comfortably
    let scale = Math.min(scaleX, scaleY);
    
    // Cap the scale between 1x and 2.8x to preserve elegant schematic readability
    scale = Math.max(1.0, Math.min(2.8, scale));

    // Calculate translation coordinates to center the bounding box exactly on (300, 170)
    const tx = 300 - centerX * scale;
    const ty = 170 - centerY * scale;

    return {
      transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(2)})`,
      transformOrigin: "0 0",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    };
  }, [showAllLines, activePoints]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-xs" id="map-container">
      {/* Header section (Compact & Responsive) */}
      <div className="px-4 py-2.5 bg-white border-b border-stone-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
          <h3 className="text-xs sm:text-sm font-bold text-stone-800 tracking-tight">
            第 {activeDay.day} 天捷運路網
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Taipei Metro Network Toggle */}
          <button
            onClick={() => setShowAllLines(!showAllLines)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              showAllLines
                ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
            }`}
          >
            <ZoomIn className="w-3 h-3" />
            {showAllLines ? "僅看今日焦點" : "看全體路線網"}
          </button>

          {routeLink && (
            <a
              href={routeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
              id="google-maps-btn"
            >
              開啟 google map
            </a>
          )}
        </div>
      </div>

      {/* 第一個 DIV: Taipei Metro (Subway) Schematic relative position map with focal zoom */}
      <div className="relative bg-stone-100/40 border-b border-stone-200 p-2 overflow-hidden flex items-center justify-center h-[230px] xs:h-[260px] sm:h-[300px] shrink-0 select-none">
        {/* Background Grid Lines to make it look like schematic drafting paper */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none" />

        <svg
          viewBox="0 0 600 340"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full"
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

        {/* Legend Overlay at the bottom of the map */}
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

      {/* 第二個 DIV: Main linear path list (Only text sequence) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white" id="route-timeline-viewport">
        {activeWaypoints.length > 0 ? (
          <div className="relative pl-4 py-1">
            {/* Elegant vertical connection line */}
            <div className="absolute left-[5px] top-3 bottom-3 w-px border-l border-stone-200" />

            <div className="space-y-3">
              {activeWaypoints.map((wp, index) => {
                const isFirst = index === 0;
                const isLast = index === activeWaypoints.length - 1;
                const displayName = wp.locationName || wp.title;
                const isAviation = wp.icon === "flight" || 
                                   wp.title.includes("起飛") || 
                                   wp.title.includes("抵達") || 
                                   wp.title.includes("機場") || 
                                   wp.title.includes("降落") || 
                                   wp.title.includes("飛往") || 
                                   wp.title.includes("班機");

                return (
                  <div key={`wp-item-${index}`} className="relative flex items-center justify-between group gap-4">
                    <div className="flex items-center gap-2">
                      {/* Round Bullet Node */}
                      <div 
                        className={`absolute left-[3px] w-1.5 h-1.5 rounded-full ${
                          isFirst
                            ? "bg-stone-900"
                            : isLast
                            ? "bg-rose-600"
                            : "bg-orange-500"
                        }`}
                      />

                      {/* Display name with step number */}
                      <div className="flex items-center gap-1.5 pl-3">
                        <span className="text-[11px] font-bold text-stone-400 font-mono">
                          {index + 1}.
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-stone-700">
                          {displayName}
                        </span>
                      </div>

                      {/* ONLY display time for aviation/flights (as requested) */}
                      {isAviation && wp.time && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100/50 px-1.5 py-0.5 rounded-sm font-mono">
                          <Clock className="w-3 h-3" />
                          {wp.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Compass className="w-8 h-8 text-stone-300 stroke-[1.5] mb-2" />
            <p className="text-xs font-medium text-stone-600">
              本日無特定行程景點路徑
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
