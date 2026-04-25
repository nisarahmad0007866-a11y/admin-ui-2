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

const HALLS_KEY = "bmh_halls_v1";
const BOOKINGS_KEY = "bmh_bookings_v1";
const AUTH_KEY = "bmh_admin_auth_v1";

export const ADMIN_EMAIL = "admin@bookmyhall.com";
export const ADMIN_PASSWORD = "admin123";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
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

// ---- Seed ----
const SEED_HALLS: Hall[] = [
  {
    id: "h_seed_1",
    ownerId: "10293847",
    ownerPin: "4821",
    name: "The Grand Pavilion",
    type: "wedding",
    ownerName: "Rajesh Kapoor",
    ownerEmail: "rajesh@grandpavilion.com",
    ownerNumber: "+91 98201 23456",
    supportNumber: "+91 98765 43210",
    guests: 800,
    priceDay: 185000,
    priceNight: 245000,
    facilities: ["Valet Parking", "AC", "Stage", "Bridal Room", "DJ", "Catering Kitchen"],
    policies: "50% advance to confirm. Cancellation 30 days prior — full refund. No outside catering.",
    foodType: "both",
    address: "Plot 24, Linking Road, Bandra West",
    city: "Mumbai",
    indoorImages: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200",
    ],
    outdoorImages: [
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200",
    ],
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "h_seed_2",
    ownerId: "55829103",
    ownerPin: "9012",
    name: "Emerald Lawns",
    type: "lawn",
    ownerName: "Priya Mehta",
    ownerEmail: "priya@emeraldlawns.in",
    ownerNumber: "+91 99300 11122",
    supportNumber: "+91 99300 11199",
    guests: 1200,
    priceDay: 120000,
    priceNight: 165000,
    facilities: ["Open Lawn", "Parking", "Power Backup", "Stage", "Restrooms"],
    policies: "Music allowed till 10 PM as per local norms. Decor by approved vendors only.",
    foodType: "veg",
    address: "Sector 18, Powai",
    city: "Mumbai",
    indoorImages: [],
    outdoorImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200",
    ],
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "h_seed_3",
    ownerId: "77418263",
    ownerPin: "3344",
    name: "Royal Banquet Hall",
    type: "banquet",
    ownerName: "Imran Sheikh",
    ownerEmail: "imran@royalbanquet.com",
    ownerNumber: "+91 98112 88990",
    supportNumber: "+91 98112 88991",
    guests: 350,
    priceDay: 75000,
    priceNight: 95000,
    facilities: ["AC", "Projector", "Sound System", "Parking", "WiFi"],
    policies: "Booking confirmed on receipt of 25% advance. Damages billed separately.",
    foodType: "non-veg",
    address: "MG Road, Andheri East",
    city: "Mumbai",
    indoorImages: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
    ],
    outdoorImages: [],
    active: false,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: "b_seed_1", hallId: "h_seed_1", customerName: "Anita Sharma",
    customerEmail: "anita@example.com", customerPhone: "+91 98765 11122",
    date: new Date(Date.now() + 86400000 * 14).toISOString(), session: "night",
    guests: 600, amount: 245000, status: "confirmed", notes: "Wedding reception",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "b_seed_2", hallId: "h_seed_1", customerName: "Vikram Joshi",
    customerEmail: "vikram@example.com", customerPhone: "+91 90909 33344",
    date: new Date(Date.now() + 86400000 * 21).toISOString(), session: "day",
    guests: 400, amount: 185000, status: "pending", notes: "Engagement ceremony",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "b_seed_3", hallId: "h_seed_2", customerName: "Sana Khan",
    customerEmail: "sana@example.com", customerPhone: "+91 88990 55667",
    date: new Date(Date.now() + 86400000 * 7).toISOString(), session: "night",
    guests: 900, amount: 165000, status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "b_seed_4", hallId: "h_seed_3", customerName: "Rohit Mehra",
    customerEmail: "rohit@example.com", customerPhone: "+91 77665 44332",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), session: "day",
    guests: 200, amount: 75000, status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "b_seed_5", hallId: "h_seed_2", customerName: "Pooja Iyer",
    customerEmail: "pooja@example.com", customerPhone: "+91 96655 22113",
    date: new Date(Date.now() + 86400000 * 4).toISOString(), session: "day",
    guests: 500, amount: 120000, status: "rejected", notes: "Date unavailable",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

function ensureSeed() {
  if (typeof window === "undefined") return;
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
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function hallTypeLabel(t: HallType) {
  return t === "wedding" ? "Wedding Hall" : t === "lawn" ? "Lawn" : "Banquet Hall";
}
