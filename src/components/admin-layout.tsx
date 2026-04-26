import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, CalendarCheck, Users, LogOut, Plus, Menu } from "@/components/icons";
import { auth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 250));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => {
      router.preloadRoute({ to: "/dashboard" });
      router.preloadRoute({ to: "/dashboard/halls" });
      router.preloadRoute({ to: "/dashboard/bookings" });
      router.preloadRoute({ to: "/dashboard/customers" });
    });
    return () => cancel(id as number);
  }, [router]);

  const onLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  const SidebarInner = (
    <aside className="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border">
        <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
          <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="text-[13px] font-semibold tracking-tight leading-none">
          BookMyHall
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium mt-1">Admin</div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(item => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-3 border-t border-sidebar-border space-y-1">
        <Link to="/dashboard/halls/new" onClick={() => setOpen(false)}>
          <Button size="sm" className="w-full h-8 text-[13px] font-medium">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Hall
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={onLogout} className="w-full h-8 justify-start text-[13px] text-muted-foreground hover:text-foreground">
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
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
          <div className="text-sm font-semibold tracking-tight">BookMyHall <span className="text-muted-foreground text-[10px] uppercase tracking-[0.14em] ml-1 font-medium">Admin</span></div>
          <div className="w-9" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
