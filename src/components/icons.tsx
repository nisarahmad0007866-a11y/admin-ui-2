import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function icon(name: string, paths: ReactNode) {
  const Component = ({ className, size = 24, ...props }: IconProps) => (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {paths}
    </svg>
  );
  Component.displayName = name;
  return Component;
}

export const ArrowLeft = icon("ArrowLeft", <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>);
export const ArrowRight = icon("ArrowRight", <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>);
export const Building2 = icon("Building2", <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M4 22h16" /><path d="M10 6h.01M14 6h.01M10 10h.01M14 10h.01M10 14h.01M14 14h.01" /></>);
export const Calendar = icon("Calendar", <><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></>);
export const CalendarCheck = icon("CalendarCheck", <><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></>);
export const ChevronLeft = icon("ChevronLeft", <path d="m15 18-6-6 6-6" />);
export const ChevronRight = icon("ChevronRight", <path d="m9 18 6-6-6-6" />);
export const Download = icon("Download", <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>);
export const List = icon("List", <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></>);
export const TrendingUp = icon("TrendingUp", <><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></>);
export const Car = icon("Car", <><path d="M5 17h14l-1.5-5.5A2 2 0 0 0 15.6 10H8.4a2 2 0 0 0-1.9 1.5L5 17Z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M5 14h14" /></>);
export const Check = icon("Check", <path d="m20 6-11 11-5-5" />);
export const CheckCheck = icon("CheckCheck", <><path d="m18 6-9 9-4-4" /><path d="m22 10-8.5 8.5L12 17" /></>);
export const CheckCircle2 = icon("CheckCircle2", <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>);
export const ChefHat = icon("ChefHat", <><path d="M6 13.8A5 5 0 0 1 8 4a5 5 0 0 1 8 0 5 5 0 0 1 2 9.8V21H6Z" /><path d="M6 17h12" /></>);
export const Clock = icon("Clock", <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const Copy = icon("Copy", <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 16V6a2 2 0 0 1 2-2h10" /></>);
export const Drumstick = icon("Drumstick", <><path d="M15.6 3.4a5 5 0 0 1 5 5c0 3.4-3.5 6.6-6.6 6.6H11l-4.5 4.5a2.1 2.1 0 0 1-3-3L8 12V9.9c0-3 3.1-6.5 7.6-6.5Z" /><path d="M5 19l-1 1" /></>);
export const Eye = icon("Eye", <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>);
export const Headset = icon("Headset", <><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><path d="M4 13h3v5H4zM17 13h3v5h-3z" /><path d="M17 18a5 5 0 0 1-5 3h-1" /></>);
export const Heart = icon("Heart", <path d="M20.8 5.6a5.4 5.4 0 0 0-7.6 0L12 6.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />);
export const Home = icon("Home", <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10" /><path d="M10 21v-6h4v6" /></>);
export const Image = icon("Image", <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="m21 16-5-5L6 19" /></>);
export const IndianRupee = icon("IndianRupee", <><path d="M6 3h12M6 8h12M6 13h4a5 5 0 0 0 0-10" /><path d="m6 13 8 8" /></>);
export const KeyRound = icon("KeyRound", <><circle cx="7.5" cy="14.5" r="4.5" /><path d="M11 11 21 1" /><path d="m16 6 2 2" /><path d="m18.5 3.5 2 2" /></>);
export const LayoutDashboard = icon("LayoutDashboard", <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>);
export const Leaf = icon("Leaf", <><path d="M20 3C11 3 5 9 5 18c8 0 14-6 15-15Z" /><path d="M5 18c4-5 8-8 15-15" /></>);
export const Lock = icon("Lock", <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>);
export const LogOut = icon("LogOut", <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>);
export const Mail = icon("Mail", <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const MapPin = icon("MapPin", <><path d="M12 22s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></>);
export const MapPinned = icon("MapPinned", <><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /><path d="M12 8s3-2.2 3-5a3 3 0 0 0-6 0c0 2.8 3 5 3 5Z" /></>);
export const Menu = icon("Menu", <><path d="M4 6h16M4 12h16M4 18h16" /></>);
export const Mic2 = icon("Mic2", <><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M19 10a7 7 0 0 1-14 0M12 17v4M8 21h8" /></>);
export const Moon = icon("Moon", <path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z" />);
export const Music = icon("Music", <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>);
export const Pencil = icon("Pencil", <><path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5Z" /><path d="m15 5 4 4" /></>);
export const Phone = icon("Phone", <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.5 1.7L8 9.5a16 16 0 0 0 6.5 6.5l1.1-1.1a2 2 0 0 1 1.7-.5l3 .5a2 2 0 0 1 1.7 2Z" />);
export const Plus = icon("Plus", <><path d="M12 5v14M5 12h14" /></>);
export const Power = icon("Power", <><path d="M12 2v10" /><path d="M18.4 6.6a9 9 0 1 1-12.8 0" /></>);
export const Search = icon("Search", <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
export const Shield = icon("Shield", <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />);
export const ShieldCheck = icon("ShieldCheck", <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>);
export const Snowflake = icon("Snowflake", <><path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9" /></>);
export const Sparkles = icon("Sparkles", <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" /><path d="M5 3v4M3 5h4M19 17v4M17 19h4" /></>);
export const Sun = icon("Sun", <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const Trash2 = icon("Trash2", <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 15H6L5 6" /><path d="M10 11v6M14 11v6" /></>);
export const Trees = icon("Trees", <><path d="M7 21v-4" /><path d="M5 17h4l-2-4 3 1-3-6-3 6 3-1Z" /><path d="M16 21v-5" /><path d="M13 16h6l-3-5 4 1-4-8-4 8 4-1Z" /></>);
export const Upload = icon("Upload", <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8 12 3 7 8" /><path d="M12 3v12" /></>);
export const User = icon("User", <><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>);
export const Users = icon("Users", <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></>);
export const Utensils = icon("Utensils", <><path d="M4 2v8a3 3 0 0 0 6 0V2" /><path d="M7 2v20" /><path d="M20 2v20" /><path d="M14 2h6v9h-6Z" /></>);
export const UtensilsCrossed = icon("UtensilsCrossed", <><path d="m16 2-4 4 6 6 4-4" /><path d="m2 22 8-8" /><path d="M7 2v5a3 3 0 0 0 3 3h1" /><path d="m14 14 8 8" /></>);
export const Wifi = icon("Wifi", <><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8.5 16a5 5 0 0 1 7 0" /><path d="M12 20h.01" /></>);
export const X = icon("X", <><path d="M18 6 6 18M6 6l12 12" /></>);
export const XCircle = icon("XCircle", <><circle cx="12" cy="12" r="9" /><path d="M15 9 9 15M9 9l6 6" /></>);
export const Zap = icon("Zap", <path d="M13 2 3 14h8l-1 8 11-14h-8Z" />);