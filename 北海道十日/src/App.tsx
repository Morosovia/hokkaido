import { useState, useEffect } from "react";
import { itineraries } from "./itineraryData";
import { ItineraryTimeline } from "./components/ItineraryTimeline";
import { TravelMap } from "./components/TravelMap";
import { ExpenseTracker } from "./components/ExpenseTracker";
import {
  CalendarDays,
  Map,
  Wallet,
  Wifi,
  Battery,
  CloudSun,
  MapPin,
  Compass,
  Coins,
  ChevronRight,
  Info
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"itinerary" | "map" | "expense">("itinerary");
  const [activeDayIndex, setActiveDayIndex] = useState<number>(1); // Default to Day 1, 0 is Overview
  const [currentTime, setCurrentTime] = useState<string>("09:41");

  // Keep phone clock updated
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeDay = itineraries[activeDayIndex > 0 ? activeDayIndex - 1 : 0];

  return (
    <div className="h-screen w-screen sm:h-auto sm:w-auto sm:min-h-screen bg-stone-100 flex flex-col items-center justify-center sm:py-6 sm:px-4 font-sans select-none overflow-hidden" id="app-wrapper">
      {/* App Branding & Desktop Background Details (Visible only on desktop sizes) */}
      <div className="hidden lg:flex flex-col absolute left-12 top-12 max-w-sm pointer-events-none">
        <div className="flex items-center gap-2 text-rose-600 mb-2">
          <Compass className="w-6 h-6 animate-[spin_30s_linear_infinite]" />
          <span className="font-display font-bold text-lg tracking-wider uppercase">HOKKAIDO 10D</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-tight">
          北海道十日遊<br />
          手機版旅行小工具
        </h1>
        <p className="text-stone-500 text-xs mt-3 leading-relaxed">
          專為手機瀏覽設計的日系極簡旅遊面板。包含即時時間軸行程、精美互動 SVG 地圖與多設備同步雲端記帳本。
        </p>
        <div className="mt-6 p-4 bg-white/60 border border-stone-200/80 rounded-2xl flex flex-col gap-2.5 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>雲端資料庫：已連接 Express 服務</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>多台手機同步：支援 5 秒自動背景更新</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            <span>Google Map：支援每日專屬導航</span>
          </div>
        </div>
      </div>

      {/* Modern Mock Smartphone Shell Container */}
      <div className="w-full h-full sm:h-[840px] sm:max-w-[420px] bg-white sm:rounded-[44px] sm:border-[10px] sm:border-stone-900 sm:shadow-2xl overflow-hidden flex flex-col relative" id="phone-shell">
        
        {/* Phone Top Notch / Dynamic Island (Visible only on styled device framing) */}
        <div className="hidden sm:flex shrink-0 h-10 bg-stone-950 items-center justify-between px-6 text-white text-xs select-none z-50">
          {/* Time Display */}
          <span className="font-semibold font-mono tracking-wider">{currentTime}</span>
          
          {/* Ear Speaker & Camera Notch Block */}
          <div className="w-24 h-4.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-900/65 mr-1" />
            <div className="w-10 h-1 bg-stone-800/85 rounded-full" />
          </div>

          {/* Phone Status Indicators */}
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-stone-300" />
            <span className="text-[10px] font-mono tracking-tighter">5G</span>
            <Battery className="w-4 h-4 text-stone-300" />
          </div>
        </div>

        {/* Mobile-friendly Header bar (Internal App Interface) */}
        <div className="bg-stone-50 border-b border-stone-200/80 px-4 py-3 shrink-0 flex items-center justify-between z-30" id="app-header-bar">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-rose-600 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-stone-900 leading-none">北海道・十日之夏</h2>
              <span className="text-[9px] text-stone-400 font-mono tracking-wider uppercase">Aug 16 - Aug 25</span>
            </div>
          </div>

          {/* Day selection preview */}
          <div className="text-right">
            <span className="text-[10px] font-semibold text-stone-400 font-mono">
              {activeDayIndex === 0 ? "OVERVIEW" : `DAY ${activeDayIndex} / 10`}
            </span>
            <p className="text-xs font-bold text-stone-800 mt-0.5">
              {activeDayIndex === 0 ? "行程總覽" : `8/${15 + activeDayIndex} (${activeDay.weekday})`}
            </p>
          </div>
        </div>

        {/* Main Scrollable Workspace Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-stone-50" id="app-main-view-viewport">
          
          {/* Conditionally render tabs with seamless feel */}
          {activeTab === "itinerary" && (
            <div className="flex-1 overflow-hidden">
              <ItineraryTimeline
                allDays={itineraries}
                activeDayIndex={activeDayIndex}
                onSelectDay={(idx) => {
                  setActiveDayIndex(idx);
                }}
              />
            </div>
          )}

          {activeTab === "map" && (
            <div className="flex-1 overflow-hidden p-2 flex flex-col gap-1.5">
              <TravelMap
                activeDay={activeDay}
                allDays={itineraries}
              />
              
              {/* Daily location selector on Map Tab */}
              <div className="bg-white border border-stone-200 p-2.5 rounded-2xl shadow-xs shrink-0">
                <div className="grid grid-cols-5 gap-1.5">
                  {itineraries.map((d) => (
                    <button
                      key={`map-day-select-${d.day}`}
                      onClick={() => setActiveDayIndex(d.day)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        activeDayIndex === d.day
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/60"
                      }`}
                    >
                      D{d.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "expense" && (
            <div className="flex-1 overflow-hidden p-4 flex flex-col">
              <ExpenseTracker currentDay={activeDayIndex > 0 ? activeDayIndex : 1} />
            </div>
          )}
        </div>

        {/* Interactive App Bottom Navigation Bar (Sleek Native Feeling) */}
        <div className="bg-white border-t border-stone-200 py-2 px-3 shrink-0 flex items-center justify-around z-30" id="app-bottom-nav">
          {/* Itinerary Tab Trigger */}
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "itinerary" ? "text-rose-600" : "text-stone-400 hover:text-stone-600"
            }`}
            id="nav-itinerary-btn"
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">每日行程</span>
          </button>

          {/* Map Tab Trigger */}
          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "map" ? "text-rose-600" : "text-stone-400 hover:text-stone-600"
            }`}
            id="nav-map-btn"
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">地圖軌跡</span>
          </button>

          {/* Expense Tab Trigger */}
          <button
            onClick={() => setActiveTab("expense")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "expense" ? "text-rose-600" : "text-stone-400 hover:text-stone-600"
            }`}
            id="nav-expense-btn"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">雲端記帳</span>
          </button>
        </div>

        {/* Bottom Home Indicator Line (Visible only on styled smartphone layout) */}
        <div className="hidden sm:block shrink-0 h-4 bg-white relative">
          <div className="w-32 h-1 bg-stone-300 rounded-full absolute left-1/2 -translate-x-1/2 bottom-1.5" />
        </div>

      </div>

      {/* Helpful Instructions Modal/Footer on Desktop screens */}
      <div className="mt-5 max-w-sm text-center text-stone-400 text-[10px] hidden sm:block">
        <p>💡 在電腦端預覽時，我們將小工具包裝於一個精緻的虛擬手機框架內。</p>
        <p className="mt-1">若使用手機直接開啟網頁，將自動轉為 full-screen 原生 App 體驗！</p>
      </div>
    </div>
  );
}
