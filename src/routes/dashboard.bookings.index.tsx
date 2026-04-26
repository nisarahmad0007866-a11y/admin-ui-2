import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookings, useHalls } from "@/hooks/use-store";
import { formatINR } from "@/lib/store";
import type { Booking, Hall } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "@/components/icons";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/bookings/")({
  component: BookingsListPage,
});

function BookingsListPage() {
  const bookings = useBookings();
  const halls = useHalls();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "confirmed" | "rejected" | "completed">("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = useMemo(() => {
    return bookings
      .filter(b => tab === "all" ? true : b.status === tab)
      .filter(b => {
        if (!q) return true;
        const hall = halls.find(h => h.id === b.hallId);
        return `${b.customerName} ${b.customerEmail} ${b.customerPhone} ${hall?.name ?? ""}`.toLowerCase().includes(q.toLowerCase());
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, halls, q, tab]);

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const rows = [
      ["Booking ID", "Customer", "Email", "Phone", "Hall", "Date", "Session", "Guests", "Amount (INR)", "Status", "Notes", "Created"],
      ...filtered.map(b => {
        const hall = halls.find(h => h.id === b.hallId);
        return [
          b.id,
          b.customerName,
          b.customerEmail,
          b.customerPhone,
          hall?.name ?? "",
          new Date(b.date).toLocaleDateString("en-IN"),
          b.session,
          String(b.guests),
          String(b.amount),
          b.status,
          (b.notes ?? "").replace(/\s+/g, " "),
          new Date(b.createdAt).toLocaleDateString("en-IN"),
        ];
      }),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} bookings`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Bookings"
        description="Review, confirm or reject bookings across all halls."
        actions={
          <>
            <div className="inline-flex h-9 items-center rounded-md border bg-card p-0.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-medium ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-medium ${view === "calendar" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <CalendarIcon className="h-3.5 w-3.5" /> Calendar
              </button>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border bg-card px-3 text-xs font-medium hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </>
        }
      />

      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by customer, hall, phone…" className="pl-9 h-10" />
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="all">All <span className="ml-1.5 text-xs opacity-60">{counts.all}</span></TabsTrigger>
            <TabsTrigger value="pending">Pending <span className="ml-1.5 text-xs opacity-60">{counts.pending}</span></TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed <span className="ml-1.5 text-xs opacity-60">{counts.confirmed}</span></TabsTrigger>
            <TabsTrigger value="rejected">Rejected <span className="ml-1.5 text-xs opacity-60">{counts.rejected}</span></TabsTrigger>
            <TabsTrigger value="completed">Completed <span className="ml-1.5 text-xs opacity-60">{counts.completed}</span></TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {view === "calendar" ? (
        <CalendarView bookings={filtered} halls={halls} />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {filtered.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">No bookings.</Card>}
            {filtered.map(b => {
              const hall = halls.find(h => h.id === b.hallId);
              return (
                <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }}>
                  <Card className="p-4 active:bg-muted/40">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{b.customerName}</div>
                        <div className="text-xs text-muted-foreground truncate">{hall?.name ?? "—"}</div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {b.session}</span>
                      <span className="font-medium text-foreground tabular-nums">{formatINR(b.amount)}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Desktop table */}
          <Card className="overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Hall</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Session</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No bookings.</td></tr>
                  )}
                  {filtered.map(b => {
                    const hall = halls.find(h => h.id === b.hallId);
                    return (
                      <tr key={b.id} className="border-t hover:bg-muted/30 cursor-pointer">
                        <td className="px-4 py-3">
                          <Link to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }} className="block">
                            <div className="font-medium">{b.customerName}</div>
                            <div className="text-xs text-muted-foreground">{b.customerPhone}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3">{hall?.name ?? "—"}</td>
                        <td className="px-4 py-3">{new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                        <td className="px-4 py-3 capitalize">{b.session}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">{formatINR(b.amount)}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-warning/40 text-warning bg-warning/10",
    confirmed: "border-success/40 text-success bg-success/10",
    rejected: "border-destructive/40 text-destructive bg-destructive/10",
    completed: "border-info/40 text-info bg-info/10",
  };
  return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
}

const STATUS_DOT: Record<string, string> = {
  pending: "bg-warning",
  confirmed: "bg-success",
  rejected: "bg-destructive",
  completed: "bg-info",
};

function CalendarView({ bookings, halls }: { bookings: Booking[]; halls: Hall[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const byDay = useMemo(() => {
    const m = new Map<number, Booking[]>();
    bookings.forEach(b => {
      const d = new Date(b.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!m.has(day)) m.set(day, []);
        m.get(day)!.push(b);
      }
    });
    return m;
  }, [bookings, year, month]);

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const monthBookings = bookings.filter(b => {
    const d = new Date(b.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <Card className="p-3 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-base sm:text-lg font-semibold">{monthLabel}</div>
          <div className="text-xs text-muted-foreground">{monthBookings.length} booking{monthBookings.length === 1 ? "" : "s"} this month</div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="inline-flex h-8 items-center rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent">
            Today
          </button>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
        {weekdays.map(w => <div key={w} className="px-1.5 py-1">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((c, i) => {
          if (c.day === null) {
            return <div key={i} className="aspect-square sm:aspect-auto sm:min-h-[88px] rounded-md bg-muted/20" />;
          }
          const items = byDay.get(c.day) ?? [];
          const hasMore = items.length > 2;
          return (
            <div
              key={i}
              className={`aspect-square sm:aspect-auto sm:min-h-[88px] rounded-md border p-1 sm:p-1.5 flex flex-col gap-0.5 overflow-hidden ${isToday(c.day) ? "border-primary bg-primary/5" : "bg-card"}`}
            >
              <div className={`text-[10px] sm:text-xs font-semibold ${isToday(c.day) ? "text-primary" : "text-foreground"}`}>{c.day}</div>
              <div className="flex flex-col gap-0.5 sm:gap-1 min-h-0 flex-1">
                {/* Mobile: dots only */}
                <div className="sm:hidden flex flex-wrap gap-0.5 mt-auto">
                  {items.slice(0, 4).map(b => (
                    <span key={b.id} className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
                  ))}
                </div>
                {/* Desktop: chips */}
                <div className="hidden sm:flex flex-col gap-1">
                  {items.slice(0, 2).map(b => {
                    const hall = halls.find(h => h.id === b.hallId);
                    return (
                      <Link
                        key={b.id}
                        to="/dashboard/bookings/$bookingId"
                        params={{ bookingId: b.id }}
                        className={`text-[10px] leading-tight rounded px-1.5 py-1 truncate hover:opacity-80 text-white ${
                          b.status === "pending" ? "bg-warning" :
                          b.status === "confirmed" ? "bg-success" :
                          b.status === "rejected" ? "bg-destructive" : "bg-info"
                        }`}
                        title={`${b.customerName} · ${hall?.name ?? ""} · ${b.session}`}
                      >
                        {b.customerName}
                      </Link>
                    );
                  })}
                  {hasMore && <span className="text-[10px] text-muted-foreground px-1">+{items.length - 2} more</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-4 pt-3 border-t">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Pending</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Confirmed</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Rejected</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Completed</span>
      </div>
    </Card>
  );
}
