// Client-side store backed by localStorage. Demo only.

export type HallType = "wedding" | "lawn" | "banquet";
export type FoodType = "veg" | "non-veg" | "both";
export type BookingStatus = "pending" | "confirmed" | "rejected" | "completed";

export interface Hall {
  id: string;
  ownerId: string; // 8 digit
  ownerPin: string; // 4 digit
  name: string;
  type: HallType;
  ownerName: string;
  ownerEmail: string;
  ownerNumber: string;
  supportNumber: string;
  guests: number;
  priceDay: number;
  priceNight: number;
  facilities: string[];
  policies: string;
  foodType: FoodType;
  address: string;
  city: string;
  indoorImages: string[]; // up to 4
  outdoorImages: string[]; // up to 4
  active: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  hallId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO date
  session: "day" | "night";
  guests: number;
  amount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

const HALLS_KEY = "bmh_halls_v2";
const BOOKINGS_KEY = "bmh_bookings_v2";
const AUTH_KEY = "bmh_admin_auth_v1";
const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

let seeded = false;
let hallsCache: Hall[] | null = null;
let bookingsCache: Booking[] | null = null;

export const ADMIN_EMAIL = "admin@bookmyhall.com";
export const ADMIN_PASSWORD = "admin123";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (key === HALLS_KEY && hallsCache) return hallsCache as T;
  if (key === BOOKINGS_KEY && bookingsCache) return bookingsCache as T;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    if (key === HALLS_KEY) hallsCache = parsed as Hall[];
    if (key === BOOKINGS_KEY) bookingsCache = parsed as Booking[];
    return parsed;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  if (key === HALLS_KEY) hallsCache = value as Hall[];
  if (key === BOOKINGS_KEY) bookingsCache = value as Booking[];
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("bmh:store"));
}

export function genOwnerId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
export function genOwnerPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// ---- Seed (realistic data across multiple Indian cities) ----
const day = (n: number) => new Date(Date.now() + 86400000 * n).toISOString();

const SEED_HALLS: Hall[] = [
  {
    id: "h_grand_pavilion", ownerId: "10293847", ownerPin: "4821",
    name: "The Grand Pavilion", type: "wedding",
    ownerName: "Rajesh Kapoor", ownerEmail: "rajesh.kapoor@grandpavilion.in",
    ownerNumber: "+91 98201 23456", supportNumber: "+91 22 2645 8800",
    guests: 800, priceDay: 185000, priceNight: 245000,
    facilities: ["Valet Parking", "Central AC", "LED Stage", "Bridal Room", "DJ", "Catering Kitchen", "Power Backup"],
    policies: "50% advance to confirm. Cancellation 30 days prior — full refund, 15 days — 50% refund. Outside catering not permitted; in-house menu starts at ₹1,250/plate.",
    foodType: "both",
    address: "Plot 24, Linking Road, Bandra West",
    city: "Mumbai",
    indoorImages: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200",
    ],
    outdoorImages: ["https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200"],
    active: true, createdAt: day(-180),
  },
  {
    id: "h_emerald_lawns", ownerId: "55829103", ownerPin: "9012",
    name: "Emerald Lawns & Resort", type: "lawn",
    ownerName: "Priya Mehta", ownerEmail: "priya@emeraldlawns.in",
    ownerNumber: "+91 99300 11122", supportNumber: "+91 22 4040 7700",
    guests: 1200, priceDay: 120000, priceNight: 165000,
    facilities: ["Open Lawn", "Parking 200+ cars", "Power Backup", "Stage", "Restrooms", "Mandap Setup"],
    policies: "Music permitted till 10 PM as per BMC norms. Décor only by empanelled vendors. ₹50,000 refundable security deposit.",
    foodType: "veg",
    address: "Survey 47, Sector 18, Powai", city: "Mumbai",
    indoorImages: [],
    outdoorImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200",
    ],
    active: true, createdAt: day(-120),
  },
  {
    id: "h_royal_banquet", ownerId: "77418263", ownerPin: "3344",
    name: "Royal Banquet Hall", type: "banquet",
    ownerName: "Imran Sheikh", ownerEmail: "imran@royalbanquet.co.in",
    ownerNumber: "+91 98112 88990", supportNumber: "+91 11 4567 2300",
    guests: 350, priceDay: 75000, priceNight: 95000,
    facilities: ["Central AC", "Projector", "Sound System", "Parking", "WiFi", "Conference Setup"],
    policies: "25% advance confirms booking. Damages billed at actuals. GST 18% extra on all invoices.",
    foodType: "non-veg",
    address: "B-44, MG Road, Andheri East", city: "Mumbai",
    indoorImages: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200"],
    outdoorImages: [],
    active: false, createdAt: day(-90),
  },
  {
    id: "h_heritage_haveli", ownerId: "31827465", ownerPin: "7102",
    name: "Heritage Haveli", type: "wedding",
    ownerName: "Vikramaditya Singh", ownerEmail: "contact@heritagehaveli.com",
    ownerNumber: "+91 94140 22113", supportNumber: "+91 141 401 8800",
    guests: 600, priceDay: 165000, priceNight: 215000,
    facilities: ["Heritage Courtyard", "AC Indoor Hall", "Valet Parking", "Bridal Suite", "Pool", "Décor Team"],
    policies: "Booking confirmed against 40% advance via NEFT. Cancellation as per signed agreement. Pet-friendly venue.",
    foodType: "both",
    address: "Civil Lines, Near City Palace", city: "Jaipur",
    indoorImages: ["https://images.unsplash.com/photo-1604609177225-c1b2afca8b29?w=1200"],
    outdoorImages: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"],
    active: true, createdAt: day(-220),
  },
  {
    id: "h_lakeside_garden", ownerId: "60214978", ownerPin: "5588",
    name: "Lakeside Garden Resort", type: "lawn",
    ownerName: "Aditya Iyengar", ownerEmail: "bookings@lakesidegarden.in",
    ownerNumber: "+91 80471 33221", supportNumber: "+91 80 4112 9900",
    guests: 950, priceDay: 95000, priceNight: 135000,
    facilities: ["Lakefront View", "Open Mandap", "Parking", "Power Backup", "Cottage Stay", "Boating"],
    policies: "Day events end by 4 PM. Night events end by 11 PM as per state norms. Outside DJ permitted with prior intimation.",
    foodType: "both",
    address: "Hennur Bagalur Road, Off NH-44", city: "Bengaluru",
    indoorImages: [],
    outdoorImages: [
      "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200",
    ],
    active: true, createdAt: day(-65),
  },
  {
    id: "h_taj_convention", ownerId: "82934501", ownerPin: "2266",
    name: "Taj Convention Centre", type: "banquet",
    ownerName: "Meera Krishnan", ownerEmail: "meera@tajconvention.in",
    ownerNumber: "+91 98410 65544", supportNumber: "+91 44 2811 7000",
    guests: 500, priceDay: 145000, priceNight: 175000,
    facilities: ["Central AC", "LED Wall", "Translation Booth", "Valet Parking", "WiFi", "Business Lounge"],
    policies: "Corporate billing with PO accepted. 15% advance for repeat clients. F&B minimums apply.",
    foodType: "both",
    address: "Anna Salai, Mount Road", city: "Chennai",
    indoorImages: ["https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200"],
    outdoorImages: [],
    active: true, createdAt: day(-45),
  },
  {
    id: "h_marigold_garden", ownerId: "44103982", ownerPin: "8421",
    name: "Marigold Garden Hall", type: "wedding",
    ownerName: "Suresh Patel", ownerEmail: "marigoldhall@gmail.com",
    ownerNumber: "+91 99876 22334", supportNumber: "+91 79 2685 4400",
    guests: 450, priceDay: 85000, priceNight: 115000,
    facilities: ["AC", "Stage", "Parking 80 cars", "Bridal Room", "DJ"],
    policies: "Pure vegetarian venue. Jain food on request with 7-day notice. ₹25,000 advance to block date.",
    foodType: "veg",
    address: "Satellite Road, Near ISKCON", city: "Ahmedabad",
    indoorImages: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200"],
    outdoorImages: [],
    active: true, createdAt: day(-30),
  },
  {
    id: "h_seaside_villa", ownerId: "73625841", ownerPin: "1199",
    name: "Seaside Villa Banquets", type: "banquet",
    ownerName: "Fernandes D'Souza", ownerEmail: "events@seasidevilla.in",
    ownerNumber: "+91 98220 78912", supportNumber: "+91 832 245 6677",
    guests: 250, priceDay: 65000, priceNight: 85000,
    facilities: ["Sea View Deck", "AC Hall", "Parking", "Bar Counter", "Live Cooking"],
    policies: "Beach permits arranged for additional ₹15,000. Music till 9:30 PM only (CRZ regulations).",
    foodType: "non-veg",
    address: "Candolim Beach Road", city: "Goa",
    indoorImages: [],
    outdoorImages: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],
    active: true, createdAt: day(-15),
  },
];

const SEED_BOOKINGS: Booking[] = [
  // Upcoming confirmed
  { id: "b_001", hallId: "h_grand_pavilion", customerName: "Anita Sharma", customerEmail: "anita.sharma@gmail.com", customerPhone: "+91 98765 11122", date: day(14), session: "night", guests: 600, amount: 245000, status: "confirmed", notes: "Wedding reception. Veg + chicken counter. Stage backdrop in white & gold.", createdAt: day(-12) },
  { id: "b_002", hallId: "h_grand_pavilion", customerName: "Vikram Joshi", customerEmail: "vikram.joshi@outlook.com", customerPhone: "+91 90909 33344", date: day(21), session: "day", guests: 400, amount: 185000, status: "pending", notes: "Engagement ceremony — needs confirmation by Friday.", createdAt: day(-1) },
  { id: "b_003", hallId: "h_emerald_lawns", customerName: "Sana Khan", customerEmail: "sana.k@yahoo.in", customerPhone: "+91 88990 55667", date: day(7), session: "night", guests: 900, amount: 165000, status: "pending", notes: "Sangeet night. Coordinator: Bharti Events.", createdAt: day(-2) },
  { id: "b_004", hallId: "h_heritage_haveli", customerName: "Riya Bansal", customerEmail: "riya.bansal@gmail.com", customerPhone: "+91 96541 88732", date: day(35), session: "night", guests: 500, amount: 215000, status: "confirmed", notes: "Destination wedding. Family flying in from Dubai — needs 20 rooms blocked separately.", createdAt: day(-22) },
  { id: "b_005", hallId: "h_lakeside_garden", customerName: "Karthik Reddy", customerEmail: "karthik.r@infosys.com", customerPhone: "+91 99020 77881", date: day(10), session: "day", guests: 700, amount: 95000, status: "confirmed", notes: "Annual company offsite. Lunch + tea-coffee, no liquor.", createdAt: day(-9) },
  { id: "b_006", hallId: "h_taj_convention", customerName: "Deloitte India Ltd.", customerEmail: "events.in@deloitte.com", customerPhone: "+91 44 6688 1100", date: day(28), session: "day", guests: 450, amount: 145000, status: "confirmed", notes: "Tech conference with simultaneous Tamil translation. PO #DEL-2026-1184.", createdAt: day(-30) },
  { id: "b_007", hallId: "h_marigold_garden", customerName: "Hetal Shah", customerEmail: "hetalshah1989@gmail.com", customerPhone: "+91 98250 44331", date: day(18), session: "night", guests: 380, amount: 115000, status: "confirmed", notes: "Jain wedding — strict no onion/garlic menu confirmed.", createdAt: day(-14) },
  { id: "b_008", hallId: "h_seaside_villa", customerName: "Joel Pereira", customerEmail: "joel.pereira@gmail.com", customerPhone: "+91 98221 33445", date: day(45), session: "night", guests: 180, amount: 85000, status: "pending", notes: "Beach wedding reception. Awaiting CRZ permit confirmation.", createdAt: day(-3) },

  // Pending review
  { id: "b_009", hallId: "h_grand_pavilion", customerName: "Pooja Iyer", customerEmail: "pooja.iyer@hcl.com", customerPhone: "+91 96655 22113", date: day(40), session: "day", guests: 500, amount: 185000, status: "pending", notes: "Corporate awards night. Needs LED screen + green room.", createdAt: day(-1) },
  { id: "b_010", hallId: "h_lakeside_garden", customerName: "Ankit Verma", customerEmail: "ankit.verma@zomato.com", customerPhone: "+91 99876 12345", date: day(56), session: "night", guests: 800, amount: 135000, status: "pending", notes: "Asked for negotiated rate — repeat client.", createdAt: day(-4) },
  { id: "b_011", hallId: "h_emerald_lawns", customerName: "Neha Kulkarni", customerEmail: "neha.kul@rediffmail.com", customerPhone: "+91 98330 99887", date: day(70), session: "day", guests: 600, amount: 120000, status: "pending", notes: "First-time enquiry through website.", createdAt: day(-2) },

  // Rejected
  { id: "b_012", hallId: "h_emerald_lawns", customerName: "Mohammed Ali", customerEmail: "ali.mohd@gmail.com", customerPhone: "+91 97334 11200", date: day(4), session: "day", guests: 1100, amount: 120000, status: "rejected", notes: "Date unavailable — already blocked for sangeet event.", createdAt: day(-5) },
  { id: "b_013", hallId: "h_grand_pavilion", customerName: "Rakesh Yadav", customerEmail: "rakesh.y@gmail.com", customerPhone: "+91 99110 88321", date: day(11), session: "night", guests: 900, amount: 245000, status: "rejected", notes: "Capacity exceeded; suggested Emerald Lawns instead.", createdAt: day(-7) },
  { id: "b_014", hallId: "h_taj_convention", customerName: "StartIndia Foundation", customerEmail: "ops@startindia.org", customerPhone: "+91 44 2855 6611", date: day(20), session: "day", guests: 600, amount: 145000, status: "rejected", notes: "Budget mismatch — declined our F&B minimums.", createdAt: day(-9) },

  // Completed past events
  { id: "b_015", hallId: "h_royal_banquet", customerName: "Rohit Mehra", customerEmail: "rohit.mehra@tcs.com", customerPhone: "+91 77665 44332", date: day(-5), session: "day", guests: 200, amount: 75000, status: "completed", notes: "Product launch. Smooth event, paid in full.", createdAt: day(-25) },
  { id: "b_016", hallId: "h_grand_pavilion", customerName: "Smita Deshmukh", customerEmail: "smita.d@gmail.com", customerPhone: "+91 98202 11332", date: day(-12), session: "night", guests: 550, amount: 245000, status: "completed", notes: "Wedding — reviewed 5★. Requested invoice via email.", createdAt: day(-50) },
  { id: "b_017", hallId: "h_heritage_haveli", customerName: "Aarav Singhania", customerEmail: "aarav.s@hotmail.com", customerPhone: "+91 94144 88221", date: day(-22), session: "day", guests: 350, amount: 165000, status: "completed", notes: "Mehendi function. Loved the courtyard décor.", createdAt: day(-75) },
  { id: "b_018", hallId: "h_lakeside_garden", customerName: "Wipro Ltd.", customerEmail: "events@wipro.com", customerPhone: "+91 80 2844 0011", date: day(-8), session: "day", guests: 650, amount: 95000, status: "completed", notes: "Team offsite + lunch. Invoice raised under PO 2026-WP-883.", createdAt: day(-40) },
  { id: "b_019", hallId: "h_marigold_garden", customerName: "Bhavna Trivedi", customerEmail: "bhavna.t@gmail.com", customerPhone: "+91 98251 99887", date: day(-30), session: "night", guests: 400, amount: 115000, status: "completed", notes: "Family function. Settled balance on event day.", createdAt: day(-60) },
  { id: "b_020", hallId: "h_seaside_villa", customerName: "Lara Mascarenhas", customerEmail: "lara.masc@gmail.com", customerPhone: "+91 98223 56789", date: day(-18), session: "night", guests: 150, amount: 85000, status: "completed", notes: "Anniversary dinner. Brought own wedding cake.", createdAt: day(-45) },
  { id: "b_021", hallId: "h_taj_convention", customerName: "Anita Sharma", customerEmail: "anita.sharma@gmail.com", customerPhone: "+91 98765 11122", date: day(-40), session: "day", guests: 300, amount: 145000, status: "completed", notes: "Repeat customer — booked Grand Pavilion later.", createdAt: day(-90) },

  // Recent confirmed
  { id: "b_022", hallId: "h_emerald_lawns", customerName: "Tanvi Rao", customerEmail: "tanvi.rao@flipkart.com", customerPhone: "+91 99019 22113", date: day(25), session: "day", guests: 750, amount: 120000, status: "confirmed", notes: "Cocktail evening. DJ Aqeel confirmed.", createdAt: day(-6) },
  { id: "b_023", hallId: "h_heritage_haveli", customerName: "Shaurya Rathore", customerEmail: "shaurya.r@gmail.com", customerPhone: "+91 94141 22778", date: day(60), session: "night", guests: 500, amount: 215000, status: "confirmed", notes: "Royal-theme wedding. Booked horse-drawn baraat through hall.", createdAt: day(-18) },
  { id: "b_024", hallId: "h_marigold_garden", customerName: "Devansh Mehta", customerEmail: "devansh.mehta@yahoo.com", customerPhone: "+91 98253 11445", date: day(50), session: "day", guests: 300, amount: 85000, status: "confirmed", notes: "Thread ceremony. Pure veg, traditional Gujarati menu.", createdAt: day(-10) },
];

function ensureSeed() {
  if (typeof window === "undefined") return;
  if (seeded) return;
  seeded = true;
  if (!localStorage.getItem(HALLS_KEY)) localStorage.setItem(HALLS_KEY, JSON.stringify(SEED_HALLS));
  if (!localStorage.getItem(BOOKINGS_KEY)) localStorage.setItem(BOOKINGS_KEY, JSON.stringify(SEED_BOOKINGS));
}

// ---- API ----
export const store = {
  init: ensureSeed,
  getHalls(): Hall[] { ensureSeed(); return read<Hall[]>(HALLS_KEY, []); },
  getHall(id: string): Hall | undefined { return this.getHalls().find(h => h.id === id); },
  saveHall(hall: Hall) {
    const list = this.getHalls();
    const idx = list.findIndex(h => h.id === hall.id);
    if (idx >= 0) list[idx] = hall; else list.unshift(hall);
    write(HALLS_KEY, list);
  },
  deleteHall(id: string) {
    write(HALLS_KEY, this.getHalls().filter(h => h.id !== id));
    write(BOOKINGS_KEY, this.getBookings().filter(b => b.hallId !== id));
  },
  toggleActive(id: string) {
    const list = this.getHalls().map(h => h.id === id ? { ...h, active: !h.active } : h);
    write(HALLS_KEY, list);
  },
  getBookings(): Booking[] { ensureSeed(); return read<Booking[]>(BOOKINGS_KEY, []); },
  getBooking(id: string) { return this.getBookings().find(b => b.id === id); },
  setBookingStatus(id: string, status: BookingStatus) {
    const list = this.getBookings().map(b => b.id === id ? { ...b, status } : b);
    write(BOOKINGS_KEY, list);
  },
};

// ---- Auth ----
export const auth = {
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "1";
  },
  login(email: string, password: string): boolean {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "1");
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};

export function formatINR(n: number) {
  return inrFormatter.format(n);
}

export function hallTypeLabel(t: HallType) {
  return t === "wedding" ? "Wedding Hall" : t === "lawn" ? "Lawn" : "Banquet Hall";
}
