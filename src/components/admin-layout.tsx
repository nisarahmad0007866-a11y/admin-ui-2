import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, CalendarCheck, Users, LogOut, Plus, Menu } from "lucide-react";
import { auth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/dashboard" | "/dashboard/halls" | "/dashboard/bookings" | "/dashboard/customers";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};
const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/halls", label: "Halls", icon: Building2 },
  { to: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/dashboard/customers", label: "Customers", icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  const SidebarInner = (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md bg-gold flex items-center justify-center">
          <Building2 className="h-4 w-4 text-gold-foreground" />
        </div>
        <div className="text-sm font-semibold tracking-tight leading-none">
          BookMyHall
          <div className="text-[9px] uppercase tracking-[0.22em] text-sidebar-foreground/45 font-medium mt-1">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(item => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-gold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <Link to="/dashboard/halls/new" onClick={() => setOpen(false)}>
          <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-medium">
            <Plus className="h-4 w-4 mr-2" /> Add Hall
          </Button>
        </Link>
        <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">{SidebarInner}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative h-full">{SidebarInner}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b bg-card">
          <button onClick={() => setOpen(true)} aria-label="Menu" className="p-2 -ml-2">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-base font-semibold tracking-tight">BookMyHall <span className="text-gold text-[10px] uppercase tracking-widest ml-1 font-medium">Admin</span></div>
          <div className="w-9" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
