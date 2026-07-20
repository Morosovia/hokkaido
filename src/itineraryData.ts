import { DayItinerary, MapCoordinate } from "./types";

// Geographical positions on our beautiful stylized minimalist Hokkaido SVG Map
export const COORDS: Record<string, MapCoordinate> = {
  tpe: { name: "台北桃園機場", lat: 25.0797, lng: 121.2342, x: 5, y: 95 },
  cts: { name: "新千歲機場", lat: 42.7752, lng: 141.6923, x: 42, y: 72 },
  sapporo_mercure: { name: "札幌美居酒店", lat: 43.0555, lng: 141.3562, x: 35, y: 68 },
  tanukikoji: { name: "狸小路商店街", lat: 43.0569, lng: 141.3501, x: 34, y: 67 },
  susukino: { name: "薄野", lat: 43.0556, lng: 141.3537, x: 36, y: 68 },
  rumoi: { name: "留萌", lat: 43.9392, lng: 141.6444, x: 38, y: 45 },
  soya_cape: { name: "宗谷岬", lat: 45.5228, lng: 141.9366, x: 50, y: 12 },
  soya_hills: { name: "宗谷丘陵", lat: 45.4984, lng: 141.9567, x: 51, y: 14 },
  wakkanai: { name: "稚內市區", lat: 45.4156, lng: 141.6731, x: 45, y: 15 },
  wakkanai_meguma: { name: "稚內MEGUMAめぐま飯店", lat: 45.3995, lng: 141.7371, x: 47, y: 16 },
  rebun_island: { name: "禮文島 (香深港)", lat: 45.3023, lng: 141.0449, x: 33, y: 15 },
  noshappu: { name: "野寒布岬", lat: 45.4485, lng: 141.6416, x: 44, y: 13 },
  asahikawa: { name: "旭川", lat: 43.7706, lng: 142.3648, x: 50, y: 52 },
  otokoyama: { name: "男山酒造", lat: 43.7891, lng: 142.4087, x: 51, y: 50 },
  shikisai_no_oka: { name: "美瑛四季彩之丘", lat: 43.5284, lng: 142.4278, x: 54, y: 58 },
  new_furano_prince: { name: "新富良野王子大飯店", lat: 43.3235, lng: 142.3551, x: 53, y: 64 },
  farm_tomita: { name: "富田農場", lat: 43.5407, lng: 142.4424, x: 54, y: 62 },
  takushinkan: { name: "前田真三拓真館", lat: 43.5352, lng: 142.4594, x: 56, y: 60 },
  ningle_terrace: { name: "精靈露臺", lat: 43.3231, lng: 142.3547, x: 53, y: 65 },
  blue_pond: { name: "白金青池", lat: 43.4934, lng: 142.6139, x: 58, y: 59 },
  hokkaido_shrine: { name: "北海道神宮", lat: 43.0538, lng: 141.3075, x: 33, y: 68 },
  suwa_shrine: { name: "諏訪神社", lat: 43.0784, lng: 141.3582, x: 35, y: 66 },
  clock_tower: { name: "時計台", lat: 43.0626, lng: 141.3536, x: 35, y: 67 },
  odori_park: { name: "大通公園", lat: 43.0599, lng: 141.3473, x: 34, y: 68 },
  nixe: { name: "登別尼克斯海洋公園", lat: 42.4519, lng: 141.1718, x: 36, y: 82 },
  fruit_picking: { name: "壯瞥町季節採果", lat: 42.5639, lng: 140.8878, x: 31, y: 80 },
  toya_observation: { name: "洞爺湖展望台", lat: 42.6131, lng: 140.7961, x: 28, y: 80 },
  toya_cruise: { name: "洞爺湖汽船", lat: 42.5676, lng: 140.8542, x: 29, y: 81 },
  toya_manseikaku: { name: "洞爺萬世閣溫泉飯店", lat: 42.5663, lng: 140.8576, x: 30, y: 81 },
  onuma_park: { name: "大小沼國定公園", lat: 42.0121, lng: 140.6698, x: 19, y: 88 },
  goryokaku: { name: "五稜郭公園", lat: 41.7969, lng: 140.7569, x: 20, y: 92 },
  hakodate_cableway: { name: "函館山纜車", lat: 41.7611, lng: 140.7134, x: 18, y: 93 },
  hakodate_international: { name: "函館國際飯店", lat: 41.7719, lng: 140.7231, x: 19, y: 93 },
  hakodate_morning_market: { name: "函館朝市", lat: 41.7733, lng: 140.7264, x: 20, y: 93 },
  motomachi_area: { name: "元町歷史街區", lat: 41.7644, lng: 140.7126, x: 19, y: 94 },
  red_brick_warehouses: { name: "金森紅磚倉庫", lat: 41.7686, lng: 140.7188, x: 19, y: 93 },
  trappistine_monastery: { name: "女子修道院", lat: 41.7946, lng: 140.8228, x: 22, y: 92 },
  lucky_pierrot: { name: "幸運小丑漢堡", lat: 41.7853, lng: 140.7516, x: 20, y: 93 },
  hkd_airport: { name: "函館機場", lat: 41.7700, lng: 140.8163, x: 22, y: 93 }
};

export const itineraries: DayItinerary[] = [
  {
    day: 1,
    date: "8月16日",
    weekday: "日",
    summary: "抵達新千歲機場，專車前往札幌，漫步狸小路",
    meals: { breakfast: "自理", lunch: "機上", dinner: "自理 (推薦狸小路拉麵/成吉思汗烤肉)" },
    accommodation: "札幌美居酒店 (Mercure Hotel Sapporo)",
    activities: [
      {
        time: "07:30",
        title: "台北桃園機場 (TPE) 集合",
        description: "於第一航廈星宇航空櫃檯辦理登機手續，搭乘星宇航空 JX850 班機。",
        icon: "flight",
        locationName: "台北桃園機場",
        coordinates: COORDS.tpe,
        googleMapsQuery: "Taiwan Taoyuan International Airport"
      },
      {
        time: "10:05",
        title: "星宇航空 JX850 起飛",
        description: "起飛前往北海道新千歲機場，航程約 4 小時 5 分鐘，於機上享用精緻午餐。",
        icon: "flight",
        duration: "航程 4h 5m"
      },
      {
        time: "15:10",
        title: "抵達新千歲機場 (CTS)",
        description: "降落新千歲機場。專車接機司機已在入境大廳等候，準備載運大夥前往札幌市區。",
        icon: "transport",
        locationName: "新千歲機場",
        coordinates: COORDS.cts,
        googleMapsQuery: "New Chitose Airport",
        duration: "車程 1 小時"
      },
      {
        time: "17:00",
        title: "入住 札幌美居酒店",
        description: "辦理入住。美居酒店坐落於薄野中心，位置極佳，客房位於高樓層(5~12樓)，視野寬廣舒適。",
        icon: "hotel",
        locationName: "札幌美居酒店",
        coordinates: COORDS.sapporo_mercure,
        googleMapsQuery: "Mercure Hotel Sapporo"
      },
      {
        time: "18:30",
        title: "自由夜訪狸小路或薄野",
        description: "徒步前往熱鬧的狸小路商店街或薄野不夜城，自由採購藥妝、品嚐當地的成吉思汗烤羊肉或札幌拉麵。",
        icon: "shopping",
        locationName: "狸小路商店街",
        coordinates: COORDS.tanukikoji,
        googleMapsQuery: "Tanukikoji Shopping Street"
      }
    ]
  },
  {
    day: 2,
    date: "8月17日",
    weekday: "一",
    summary: "北上沿海大長征，宗谷岬日本最北端，眺望白色貝殼路",
    meals: { breakfast: "飯店內享用", lunch: "自理 (推薦留萌或稚內海鮮)", dinner: "飯店內溫泉宴席" },
    accommodation: "稚內MEGUMA溫泉飯店 (Wakkanai Meguma Hotel) 或同級",
    activities: [
      {
        time: "08:30",
        title: "札幌出發北上長征",
        description: "專車沿日本海黃金路線北上。中途停靠留萌（Rumoi）休息，欣賞沿海風光。",
        icon: "transport",
        locationName: "留萌",
        coordinates: COORDS.rumoi,
        googleMapsQuery: "Rumoi, Hokkaido",
        duration: "總車程約 5.5 小時"
      },
      {
        time: "14:30",
        title: "宗谷岬「日本最北端之地」紀念碑",
        description: "抵達北緯45度31分的日本領土最北端！在此合影留念，並可購買最北端抵達證明書。",
        icon: "sight",
        locationName: "宗谷岬",
        coordinates: COORDS.soya_cape,
        googleMapsQuery: "Cape Soya",
        duration: "停留 45 分鐘"
      },
      {
        time: "15:30",
        title: "宗谷丘陵：白色貝殼路 & 風力發電風車",
        description: "欣賞冰河遺跡形成的平緩波浪狀丘陵，漫步在鋪滿白扇貝殼的夢幻白色道路上，巨大的風力發電機排開極為壯觀。",
        icon: "sight",
        locationName: "宗谷丘陵",
        coordinates: COORDS.soya_hills,
        googleMapsQuery: "Soya Hills",
        duration: "停留 1 小時"
      },
      {
        time: "17:30",
        title: "入住 稚內MEGUMA溫泉飯店",
        description: "入住面海的稚內溫泉飯店。晚上享用豐盛的宗谷海鮮溫泉宴席，並在極北溫泉池放鬆身心。",
        icon: "hotel",
        locationName: "稚內MEGUMAめぐま飯店",
        coordinates: COORDS.wakkanai_meguma,
        googleMapsQuery: "Wakkanai Meguma Hotel"
      }
    ]
  },
  {
    day: 3,
    date: "8月18日",
    weekday: "二",
    summary: "乘渡輪遠征神秘禮文島，野寒布岬唯美落日",
    meals: { breakfast: "飯店內享用", lunch: "自理 (推薦禮文島島旬海鮮飯)", dinner: "飯店內溫泉宴席" },
    accommodation: "稚內MEGUMA溫泉飯店 (Wakkanai Meguma Hotel) 或同級",
    activities: [
      {
        time: "06:00",
        title: "稚內港渡輪碼頭集合",
        description: "早起前往碼頭，準備搭乘渡輪遠征日本最北端離島。",
        icon: "transport",
        locationName: "稚內港",
        googleMapsQuery: "Wakkanai Port Ferry Terminal"
      },
      {
        time: "06:30",
        title: "搭乘 Heartland Ferry 前往禮文島",
        description: "乘坐舒適大型渡輪橫渡日本海，航程約1小時55分鐘，眺望海面上的利尻富士火山。",
        icon: "transport",
        duration: "渡輪航程 1h 55m"
      },
      {
        time: "08:25",
        title: "抵達禮文島 (香深港)",
        description: "登陸「花之浮島」禮文島。搭乘專車遊覽最北岬角、澄海岬，欣賞北方孤島的特有高山花卉與絕壁海景。",
        icon: "sight",
        locationName: "禮文島 (香深港)",
        coordinates: COORDS.rebun_island,
        googleMapsQuery: "Kafuka Port Rebun Island",
        duration: "島上停留約 6 小時"
      },
      {
        time: "14:20",
        title: "搭乘渡輪返回稚內港",
        description: "揮別禮文島，搭乘下午渡輪返回北海道本土，於16:15抵達稚內港。",
        icon: "transport",
        duration: "渡輪航程 1h 55m"
      },
      {
        time: "16:15",
        title: "野寒布岬欣賞日落 (Noshappu)",
        description: "抵達野寒布岬，其名在阿伊努語中意為「海角邊緣」。這裡矗立著紅白相間的稚內燈塔，是觀賞夕陽沉入日本海、遠眺利尻富士的絕佳位置。",
        icon: "sight",
        locationName: "野寒布岬",
        coordinates: COORDS.noshappu,
        googleMapsQuery: "Cape Noshappu",
        duration: "停留 45 分鐘"
      },
      {
        time: "18:00",
        title: "返回 稚內MEGUMA溫泉飯店",
        description: "回到溫馨的飯店，續住第二晚。今晚繼續享用精緻的北國溫泉料理，泡湯消除一天的海風疲憊。",
        icon: "hotel",
        locationName: "稚內MEGUMAめぐま飯店",
        coordinates: COORDS.wakkanai_meguma
      }
    ]
  },
  {
    day: 4,
    date: "8月19日",
    weekday: "三",
    summary: "南下旭川，品味男山美酒，陶醉美瑛七彩花海",
    meals: { breakfast: "飯店內享用", lunch: "自理 (推薦旭川拉麵村)", dinner: "飯店內豪華自助餐" },
    accommodation: "新富良野王子大飯店 (New Furano Prince Hotel) 或同級",
    activities: [
      {
        time: "08:30",
        title: "出發南下旭川",
        description: "專車離開稚內南下往旭川，沿途欣賞田園景致與高山溪谷。",
        icon: "transport",
        locationName: "旭川",
        coordinates: COORDS.asahikawa,
        googleMapsQuery: "Asahikawa, Hokkaido",
        duration: "車程約 3.5 小時"
      },
      {
        time: "12:00",
        title: "男山酒造資料館",
        description: "擁有350年歷史的旭川名酒「男山」。館內展示歷史釀酒道具與文獻，並可品嚐到以大雪山泉水釀造的甘冽清酒。",
        icon: "sight",
        locationName: "男山酒造",
        coordinates: COORDS.otokoyama,
        googleMapsQuery: "Otokoyama Sake Brewery Museum",
        duration: "停留 1 小時"
      },
      {
        time: "14:30",
        title: "美瑛四季彩之丘 (搭乘遊園車)",
        description: "美瑛代表性景致！數十公頃的大地鋪滿繽紛如彩虹般的花卉。搭乘遊園牽引車巡遊花田，色彩繽紛極為壯觀。",
        icon: "sight",
        locationName: "美瑛四季彩之丘",
        coordinates: COORDS.shikisai_no_oka,
        googleMapsQuery: "Shikisai-no-oka",
        duration: "停留 1.5 小時"
      },
      {
        time: "17:30",
        title: "入住 新富良野王子大飯店",
        description: "辦理入住。此飯店坐落於壯麗森林中，擁有天然「紫彩之湯」溫泉。晚餐在飯店享用集結北海道在地食材的豪華自助百匯。",
        icon: "hotel",
        locationName: "新富良野王子大飯店",
        coordinates: COORDS.new_furano_prince,
        googleMapsQuery: "New Furano Prince Hotel"
      }
    ]
  },
  {
    day: 5,
    date: "8月20日",
    weekday: "四",
    summary: "富良野深度花香之旅，浪漫精靈森林露臺",
    meals: { breakfast: "飯店內享用", lunch: "自理", dinner: "飯店內豪華自助餐" },
    accommodation: "新富良野王子大飯店 (New Furano Prince Hotel) 或同級",
    activities: [
      {
        time: "09:00",
        title: "富田農場 (Farm Tomita)",
        description: "北海道最著名的薰衣草農場。在此品嚐招牌薰衣草霜淇淋，香甜微涼，是不可錯過的夏日美味！",
        icon: "sight",
        locationName: "富田農場",
        coordinates: COORDS.farm_tomita,
        googleMapsQuery: "Farm Tomita",
        duration: "停留 2 小時"
      },
      {
        time: "11:00",
        title: "DIY 製作專屬薰衣草抱枕",
        description: "在富田農場的工作坊中，親手把乾燥薰衣草花粒塞入枕心，縫製一個專屬自己的香氣抱枕，把北海道的回憶帶回家。",
        icon: "shopping",
        duration: "體驗 1 小時"
      },
      {
        time: "13:30",
        title: "前田真三拓真館",
        description: "由廢棄小學改建，展示已故日本著名風景攝影師前田真三的傑作。他用鏡頭讓美瑛丘陵在世界上聲名大噪。",
        icon: "sight",
        locationName: "前田真三拓真館",
        coordinates: COORDS.takushinkan,
        googleMapsQuery: "Takushinkan Museum",
        duration: "停留 1 小時"
      },
      {
        time: "15:30",
        title: "精靈露臺 (Ningle Terrace)",
        description: "就在飯店旁的森林中。一間間木屋手工藝鋪隱匿在參天大樹間，沿著木棧道散步，黃昏燈火亮起時宛如童話中的精靈村落。",
        icon: "sight",
        locationName: "精靈露臺",
        coordinates: COORDS.ningle_terrace,
        googleMapsQuery: "Ningle Terrace",
        duration: "停留 1.5 小時"
      },
      {
        time: "17:30",
        title: "返回 新富良野王子大飯店",
        description: "續住第二晚。傍晚再次沉浸在精靈露臺的浪漫氛圍中，接著享受「紫彩之湯」與高水準的自助晚餐。",
        icon: "hotel",
        locationName: "新富良野王子大飯店",
        coordinates: COORDS.new_furano_prince
      }
    ]
  },
  {
    day: 6,
    date: "8月21日",
    weekday: "五",
    summary: "夢幻白金青池，重返札幌神宮與大通公園",
    meals: { breakfast: "飯店內享用", lunch: "自理 (推薦札幌湯咖哩)", dinner: "自理 (推薦薄野拉麵橫丁)" },
    accommodation: "札幌美居酒店 (Mercure Hotel Sapporo) 或同級",
    activities: [
      {
        time: "09:00",
        title: "白金青池 (Shirogane Blue Pond)",
        description: "因十勝岳火山泥流防護工程偶然形成的池塘。水中含有高濃度微粒，在陽光折射下呈現奇幻的蒂芙尼藍，枯落的落葉松矗立其中，美如仙境。",
        icon: "sight",
        locationName: "白金青池",
        coordinates: COORDS.blue_pond,
        googleMapsQuery: "Shirogane Blue Pond",
        duration: "停留 1 小時"
      },
      {
        time: "10:30",
        title: "專車返回札幌市區",
        description: "告別富良野與美瑛，乘專車返回札幌。",
        icon: "transport",
        duration: "車程約 2.5 小時"
      },
      {
        time: "13:30",
        title: "北海道神宮參拜",
        description: "北海道總鎮守。神社林木參天，古木蓊鬱，在此參拜保佑旅途平安，並可購買可愛的拉拉熊繪馬與護身符。",
        icon: "sight",
        locationName: "北海道神宮",
        coordinates: COORDS.hokkaido_shrine,
        googleMapsQuery: "Hokkaido Shrine",
        duration: "停留 1 小時"
      },
      {
        time: "15:00",
        title: "諏訪神社 & 途經時計台",
        description: "造訪以七彩「花手水」著稱的諏訪神社，極其精美。途中會經過札幌地標「時計台（舊札幌農學校演武場）」。",
        icon: "sight",
        locationName: "諏訪神社",
        coordinates: COORDS.suwa_shrine,
        googleMapsQuery: "Sapporo Suwa Shrine",
        duration: "停留 45 分鐘"
      },
      {
        time: "16:00",
        title: "大通公園散步 & 狸小路自由購物",
        description: "漫步大通公園看電視塔，之後可回到狸小路商店街進行第二輪的大採購與藥妝補貨，晚餐自由探索特色居酒屋。",
        icon: "shopping",
        locationName: "大通公園",
        coordinates: COORDS.odori_park,
        googleMapsQuery: "Odori Park"
      },
      {
        time: "18:00",
        title: "入住 札幌美居酒店",
        description: "重返札幌美居酒店辦理入住，今晚自由探索札幌不夜城的夜生活。",
        icon: "hotel",
        locationName: "札幌美居酒店",
        coordinates: COORDS.sapporo_mercure
      }
    ]
  },
  {
    day: 7,
    date: "8月22日",
    weekday: "六",
    summary: "童話尼克斯城堡，洞爺湖乘汽船巡禮",
    meals: { breakfast: "飯店內享用", lunch: "尼克斯日式壽喜燒", dinner: "飯店內溫泉宴席" },
    accommodation: "洞爺萬世閣溫泉飯店 (Toya Manseikaku Hotel) 或同級",
    activities: [
      {
        time: "08:30",
        title: "札幌出發前往登別",
        description: "專車往南行駛，前往著名的溫泉之鄉登別。",
        icon: "transport",
        duration: "車程約 1.5 小時"
      },
      {
        time: "10:00",
        title: "登別尼克斯海洋公園",
        description: "以北歐城堡為造型的巨大水族館！近距離觀看國王企鵝在大街上搖擺散步、海豚與海獅的精彩表演。中午在園區享用日式壽喜燒午餐。",
        icon: "sight",
        locationName: "登別尼克斯海洋公園",
        coordinates: COORDS.nixe,
        googleMapsQuery: "Noboribetsu Marine Park Nixe",
        duration: "停留 3 小時 (含午餐)"
      },
      {
        time: "13:30",
        title: "壯瞥町季節採果體驗",
        description: "前往洞爺湖畔的壯瞥町觀光果園。北海道夏季盛產櫻桃、水蜜桃或藍莓，體驗親手採摘新鮮現吃、鮮甜無比！",
        icon: "sight",
        locationName: "壯瞥町季節採果",
        coordinates: COORDS.fruit_picking,
        googleMapsQuery: "Sobetsu Fruit Picking",
        duration: "停留 1 小時"
      },
      {
        time: "15:00",
        title: "洞爺湖展望台 (Silo Viewpoint)",
        description: "俯瞰圓形火山口湖——洞爺湖全景的絕佳視角。中島、有珠山與昭和新山盡收眼底，風景美不勝收。",
        icon: "sight",
        locationName: "洞爺湖展望台",
        coordinates: COORDS.toya_observation,
        googleMapsQuery: "Silo Observatory",
        duration: "停留 45 分鐘"
      },
      {
        time: "16:00",
        title: "搭乘洞爺湖汽船遊湖",
        description: "登上中世紀古堡造型的雙體汽船「Espoir」，航行於波光粼粼的湖面上，涼風徐徐極為愜意。",
        icon: "transport",
        locationName: "洞爺湖汽船",
        coordinates: COORDS.toya_cruise,
        googleMapsQuery: "Lake Toya Cruise Ferry Terminal",
        duration: "航程約 50 分鐘"
      },
      {
        time: "17:30",
        title: "入住 洞爺萬世閣溫泉飯店",
        description: "辦理入住。此豪華溫泉大飯店面朝洞爺湖，頂樓設有露天星空溫泉池。晚上可一邊泡湯，一邊欣賞洞爺湖著名的夏夜花火大會（如期舉行）。",
        icon: "hotel",
        locationName: "洞爺萬世閣溫泉飯店",
        coordinates: COORDS.toya_manseikaku,
        googleMapsQuery: "Toya Manseikaku Hotel Lakeside Terrace"
      }
    ]
  },
  {
    day: 8,
    date: "8月23日",
    weekday: "日",
    summary: "大小沼綠意盎然，五稜郭登塔，函館百萬夜景",
    meals: { breakfast: "飯店內享用", lunch: "自理", dinner: "自理 (推薦函館鹽味拉麵)" },
    accommodation: "函館國際飯店 (Hakodate International Hotel) 或同級",
    activities: [
      {
        time: "08:30",
        title: "出發往函館",
        description: "專車沿西南海岸線南下，前往北海道歷史港都函館。",
        icon: "transport",
        duration: "車程約 2 小時"
      },
      {
        time: "10:30",
        title: "大沼、小沼國定公園",
        description: "由駒之岳火山噴發形成的湖泊，湖中分布百餘座小島。漫步於橫跨島嶼間的小橋，四周被蓊鬱的白樺樹圍繞，美如水墨畫。",
        icon: "sight",
        locationName: "大小沼國定公園",
        coordinates: COORDS.onuma_park,
        googleMapsQuery: "Onuma Quasi-National Park",
        duration: "停留 1.5 小時"
      },
      {
        time: "13:00",
        title: "五稜郭公園 & 登五稜郭塔",
        description: "日本首座西式星形要塞。登上107公尺高的五稜郭塔，完美俯瞰大地上巨大的綠色五角星城堡，並了解幕末箱館戰爭的傳奇故事。",
        icon: "sight",
        locationName: "五稜郭公園",
        coordinates: COORDS.goryokaku,
        googleMapsQuery: "Goryokaku Tower",
        duration: "停留 1.5 小時"
      },
      {
        time: "15:00",
        title: "入住 函館國際飯店",
        description: "入住極富盛名的港口酒店，其溫泉可眺望函館港灣，早餐更是全日本排名頂尖的海鮮自助百匯。",
        icon: "hotel",
        locationName: "函館國際飯店",
        coordinates: COORDS.hakodate_international,
        googleMapsQuery: "Hakodate International Hotel"
      },
      {
        time: "18:00",
        title: "搭乘函館山纜車 欣賞百萬夜景",
        description: "乘大型空中纜車直達函館山頂。隨著暮色漸濃，兩側港灣夾峙下的函館市區燈火齊亮，呈現出舉世聞名的「百萬璀璨雙弧線夜景」。",
        icon: "transport",
        locationName: "函館山纜車",
        coordinates: COORDS.hakodate_cableway,
        googleMapsQuery: "Mount Hakodate Ropeway",
        duration: "停留 1.5 小時"
      }
    ]
  },
  {
    day: 9,
    date: "8月24日",
    weekday: "一",
    summary: "函館朝市鮮味，元町異國風情，紅磚倉庫漫步",
    meals: { breakfast: "飯店內享用 (超澎湃海鮮丼自助)", lunch: "自理 (推薦倉庫內漢堡排)", dinner: "自理" },
    accommodation: "函館國際飯店 (Hakodate International Hotel) 或同級",
    activities: [
      {
        time: "08:30",
        title: "函館朝市探索",
        description: "就在飯店旁！北海道最具代表性的海鮮市場，可以體驗「釣活烏賊」現切刺身，或自由品嚐海膽、帝王蟹腳與烤扇貝。",
        icon: "sight",
        locationName: "函館朝市",
        coordinates: COORDS.hakodate_morning_market,
        googleMapsQuery: "Hakodate Morning Market",
        duration: "停留 2 小時"
      },
      {
        time: "10:30",
        title: "漫步元町歷史街區",
        description: "沿著著名的斜坡「八幡坂」步行向上，眺望筆直通往大海的港口美景。參觀舊函館區公會堂、元町天主堂等19世紀遺留下來的精美西洋建築群。",
        icon: "sight",
        locationName: "元町歷史街區",
        coordinates: COORDS.motomachi_area,
        googleMapsQuery: "Motomachi, Hakodate",
        duration: "停留 2 小時"
      },
      {
        time: "13:30",
        title: "金森紅磚倉庫群",
        description: "由幕末運河倉庫改建而成的時尚購物區。紅磚外觀極具懷舊氣息，裡面進駐許多甜點名店（如Snaffle's起司蛋糕）、手工藝品店與特色餐廳，非常適合午後漫步購物。",
        icon: "shopping",
        locationName: "金森紅磚倉庫",
        coordinates: COORDS.red_brick_warehouses,
        googleMapsQuery: "Kanemori Red Brick Warehouses",
        duration: "自由活動 3 小時"
      },
      {
        time: "18:00",
        title: "返回 函館國際飯店",
        description: "續住第二晚。晚上可在港口邊散步，或再次享受飯店舒適的天然溫泉與港灣夜景。",
        icon: "hotel",
        locationName: "函館國際飯店",
        coordinates: COORDS.hakodate_international
      }
    ]
  },
  {
    day: 10,
    date: "8月25日",
    weekday: "二",
    summary: "神聖修道院，美味小丑漢堡，滿載而歸搭機返台",
    meals: { breakfast: "飯店內享用 (頂級朝市海鮮丼)", lunch: "小丑漢堡或鹽味拉麵", dinner: "機上套餐" },
    accommodation: "溫馨的家 (Sweet Home)",
    activities: [
      {
        time: "09:30",
        title: "女子修道院參拜 (Trappistine)",
        description: "日本第一家女子修道院。歐風紅磚哥德式建築坐落在優雅的花園中。在此必嚐全北海道公認最濃郁、最好吃的純鮮奶冰淇淋！",
        icon: "sight",
        locationName: "女子修道院",
        coordinates: COORDS.trappistine_monastery,
        googleMapsQuery: "Trappistine Monastery",
        duration: "停留 1 小時"
      },
      {
        time: "11:30",
        title: "午餐：幸運小丑漢堡 (Lucky Pierrot)",
        description: "函館限定、全日本排名第一的地方漢堡！招牌「中華炸雞漢堡」表皮微脆、醬汁酸甜，搭配馬鈴薯泥，是函館的代表美味。",
        icon: "meal",
        locationName: "幸運小丑漢堡",
        coordinates: COORDS.lucky_pierrot,
        googleMapsQuery: "Lucky Pierrot Goryokaku"
      },
      {
        time: "14:30",
        title: "前往 函館機場 (HKD)",
        description: "專車前往函館機場，辦理行李託運與登機手續，並在機場免稅店進行最後的北海道名產（白色戀人、六花亭、薯條三兄弟）大掃貨。",
        icon: "transport",
        locationName: "函館機場",
        coordinates: COORDS.hkd_airport,
        googleMapsQuery: "Hakodate Airport",
        duration: "車程 20 分鐘"
      },
      {
        time: "17:45",
        title: "星宇航空 JX861 起飛",
        description: "搭乘星宇航空客機返回台北桃園，機上提供精緻餐食與機上娛樂系統。",
        icon: "flight",
        duration: "航程 4h 10m"
      },
      {
        time: "20:55",
        title: "抵達 台北桃園機場 (TPE)",
        description: "班機降落桃園機場。提取行李後解散，帶著滿滿十天的北國美麗回憶回到溫馨的家！",
        icon: "flight"
      }
    ]
  }
];
