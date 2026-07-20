import React from "react";
import { DayItinerary, Activity } from "../types";
import {
  MapPin,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Car,
  ShoppingBag,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

interface ItineraryTimelineProps {
  allDays: DayItinerary[];
  activeDayIndex: number; // 0 for Overview, 1-10 for Days
  onSelectDay: (index: number) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  allDays,
  activeDayIndex,
  onSelectDay
}) => {
  // Map icons
  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case "flight":
        return <Plane className="w-4 h-4 text-rose-600" />;
      case "hotel":
        return <Hotel className="w-4 h-4 text-indigo-600" />;
      case "meal":
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case "sight":
        return <Camera className="w-4 h-4 text-emerald-600" />;
      case "transport":
        return <Car className="w-4 h-4 text-blue-600" />;
      case "shopping":
        return <ShoppingBag className="w-4 h-4 text-purple-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-stone-600" />;
    }
  };

  const currentDay = activeDayIndex > 0 ? allDays[activeDayIndex - 1] : null;

  return (
    <div className="flex flex-col h-full bg-white" id="itinerary-timeline">
      {/* Horizontal Scrollable Day Tab Bar */}
      <div className="sticky top-0 bg-white z-10 border-b border-stone-200 px-1 pt-2 pb-1">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-3 py-1.5" id="day-tabs-container">
          {/* Overview Tab */}
          <button
            onClick={() => onSelectDay(0)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeDayIndex === 0
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60"
            }`}
          >
            行程總覽
          </button>

          {/* Days Tabs */}
          {allDays.map((d) => (
            <button
              key={`tab-day-${d.day}`}
              onClick={() => onSelectDay(d.day)}
              className={`px-4 py-1.5 rounded-xl text-xs flex flex-col items-center min-w-[72px] whitespace-nowrap transition-all cursor-pointer border ${
                activeDayIndex === d.day
                  ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/60"
              }`}
            >
              <span className="font-mono text-[10px] uppercase opacity-70">
                Day {d.day}
              </span>
              <span className="font-semibold mt-0.5">
                8/{15 + d.day} ({d.weekday})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" id="itinerary-content-pane">
        {/* OVERVIEW MODE */}
        {activeDayIndex === 0 && (
          <div className="space-y-4 animate-fade-in" id="overview-view">
            <div className="bg-gradient-to-tr from-stone-50 to-stone-100 p-4 border border-stone-200 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest font-mono">
                Hokkaido 10 Days Itinerary
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                北海道極簡深度十日
              </h2>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                帶您遠征日本最北端「宗谷岬」、深入絕美花卉之島「禮文島」、漫步七彩斑斕「美瑛四季彩之丘」，並於「函館山」俯瞰璀璨百萬夜景。
              </p>
            </div>

            {/* General Highlights List */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-stone-400 font-mono tracking-wider uppercase">
                每日日程提要
              </h3>
              {allDays.map((d) => (
                <div
                  key={`ov-card-${d.day}`}
                  onClick={() => onSelectDay(d.day)}
                  className="p-3 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50/50 rounded-xl shadow-xs transition-all cursor-pointer flex gap-3.5 items-start"
                >
                  <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-xl shrink-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-mono text-stone-400 font-bold">
                      DAY
                    </span>
                    <span className="text-sm font-bold text-stone-900 leading-none">
                      {d.day.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-950 font-mono">
                        8/{15 + d.day} ({d.weekday})
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium truncate max-w-[120px]">
                        🏨 {d.accommodation.split("或")[0]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-800 font-medium mt-1 truncate">
                      {d.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm">
                        B: {d.meals.breakfast.slice(0, 4)}..
                      </span>
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm">
                        L: {d.meals.lunch.slice(0, 4)}..
                      </span>
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm">
                        D: {d.meals.dinner.slice(0, 4)}..
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAILY TIMELINE MODE */}
        {currentDay && (
          <div className="space-y-4 animate-fade-in" id={`day-${currentDay.day}-view`}>
            {/* Day Header Banner removed per user request */}

            {/* Accommodation & Meals quick info panel */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Hotel Block */}
              <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <Hotel className="w-3.5 h-3.5 text-indigo-500" />
                  <span>入住飯店 Accommodation</span>
                </div>
                <p className="text-xs font-bold text-stone-900 mt-1.5 leading-tight">
                  {currentDay.accommodation}
                </p>
              </div>

              {/* Meals Block */}
              <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <Utensils className="w-3.5 h-3.5 text-orange-500" />
                  <span>餐食安排 Meals</span>
                </div>
                <div className="mt-1.5 space-y-1 text-[10px] text-stone-700 font-medium">
                  <p>
                    <span className="text-stone-400">早：</span>
                    {currentDay.meals.breakfast}
                  </p>
                  <p>
                    <span className="text-stone-400">午：</span>
                    {currentDay.meals.lunch}
                  </p>
                  <p>
                    <span className="text-stone-400">晚：</span>
                    {currentDay.meals.dinner}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Activities List */}
            <div className="relative pl-4 space-y-5" id="timeline-stack">
              {/* Vertical line through timeline */}
              <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-stone-200 pointer-events-none" />

              {currentDay.activities.map((act, index) => {
                const mapStopIndex = currentDay.activities
                  .slice(0, index + 1)
                  .filter((a) => a.coordinates !== undefined).length;
                const hasCoordinates = act.coordinates !== undefined;

                return (
                  <div
                    key={`act-${index}`}
                    className="relative flex gap-4 items-start"
                  >
                    {/* Time Indicator & Icon Bullet */}
                    <div className="flex flex-col items-center shrink-0">
                      {/* Timeline dot circle containing category icon */}
                      <div className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center shadow-xs relative z-10">
                        {getActivityIcon(act.icon)}
                      </div>
                      <span className="text-[10px] font-bold font-mono text-stone-500 mt-1.5">
                        {act.time}
                      </span>
                    </div>

                    {/* Timeline Activity card */}
                    <div className="flex-1 bg-white border border-stone-200 hover:border-stone-300 rounded-xl p-3.5 shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-stone-900">
                            {act.title}
                          </h4>

                          {/* Stop number badge (matching map marker indices!) */}
                          {hasCoordinates && (
                            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                              地圖點 {mapStopIndex}
                            </span>
                          )}

                          {/* Duration label */}
                          {act.duration && (
                            <span className="inline-flex items-center gap-0.5 bg-stone-100 text-stone-600 text-[9px] font-medium px-1.5 py-0.5 rounded-sm font-mono">
                              <Clock className="w-2.5 h-2.5" />
                              {act.duration}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed">
                          {act.description}
                        </p>

                        {/* Location footer link */}
                        {act.locationName && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="truncate">{act.locationName}</span>
                          </div>
                        )}
                      </div>

                      {/* Google Maps External Deep Link Button */}
                      {act.locationName && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            act.googleMapsQuery || act.locationName
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-end sm:self-auto inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-lg text-stone-700 text-[10px] font-medium transition-colors cursor-pointer shrink-0"
                          title="在 Google Maps 中搜尋"
                        >
                          <span>導航</span>
                          <ArrowUpRight className="w-3 h-3 text-stone-400" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
