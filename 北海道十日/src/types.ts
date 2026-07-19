export interface Expense {
  id: string;
  day: number;
  title: string;
  amount: number;
  currency: string;
  category: "交通" | "餐飲" | "景點/門票" | "購物" | "其他";
  note?: string;
  timestamp: number;
  createdBy: string;
}

export interface MapCoordinate {
  name: string;
  lat: number;  // For Google Maps link coordinates
  lng: number;  // For Google Maps link coordinates
  x: number;    // SVG visual X coordinate (0-100)
  y: number;    // SVG visual Y coordinate (0-100)
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  icon: "flight" | "hotel" | "meal" | "sight" | "transport" | "shopping" | "other";
  locationName?: string;
  duration?: string; // e.g. "停留 1 小時" or "車程 2 小時"
  googleMapsQuery?: string; // Query string to search in Google Maps
  coordinates?: MapCoordinate;
}

export interface DayItinerary {
  day: number;
  date: string;
  weekday: string;
  summary: string;
  activities: Activity[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  accommodation: string;
}
