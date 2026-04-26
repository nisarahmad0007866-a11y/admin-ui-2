import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Booking } from "@/lib/store";
import { formatINR } from "@/lib/store";
import { Calendar, ChevronLeft, ChevronRight } from "@/components/icons";

const STATUS_STYLES: Record<string, string> = {
  pending: "border-warning/30 bg-warning/10 text-warning",
  confirmed: "border-success/30 bg-success/10 text-success",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
  completed: "border-info/30 bg-info/10 text-info",
};

const STATUS_DOTS: Record<string, string> = {
  pending: "bg-warning",
  confirmed: "bg-success",
  rejected: "bg-destructive",
  completed: "bg-info",
};

export function HallBookingCalendar({ bookings }: { bookings: Booking[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const byDay = useMemo(() => {
    const map = new Map<number, Booking[]>();
    bookings.forEach(booking => {
      const d = new Date(booking.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      const day = d.getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(booking);
    });
    for (const list of map.values()) list.sort((a, b) => a.date.localeCompare(b.date));
    return map;
  }, [bookings, month, year]);

  useEffect(() => {
    const firstBookedDay = [...byDay.keys()].sort((a, b) => a - b)[0] ?? null;
    setSelectedDay(firstBookedDay);
  }, [byDay]);

  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedBookings = selectedDay ? byDay.get(selectedDay) ?? [] : [];
  const monthBookingCount = [...byDay.values()].reduce((sum, list) => sum + list.length, 0);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <section className="rounded-lg border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <h3 className="text-base font-semibold truncate">Booking calendar</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{monthBookingCount} booking{monthBookingCount === 1 ? "" : "s"} · {monthLabel}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="inline-flex h-8 items-center rounded-md border bg-background px-2.5 text-xs font-medium hover:bg-accent"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
        {weekdays.map(day => <div key={day} className="px-1 py-1 text-center">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((day, index) => {
          if (!day) return <div key={index} className="aspect-square sm:min-h-[82px] rounded-md bg-muted/20" />;
          const items = byDay.get(day) ?? [];
          const active = selectedDay === day;
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedDay(day)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") setSelectedDay(day);
              }}
              className={`aspect-square sm:aspect-auto sm:min-h-[82px] rounded-md border p-1 sm:p-1.5 flex flex-col overflow-hidden cursor-pointer transition-colors ${
                active ? "border-primary bg-primary/5" : isToday(day) ? "border-primary/50 bg-primary/5" : "bg-card hover:bg-accent/40"
              }`}
            >
              <div className={`text-[11px] sm:text-xs font-semibold ${active || isToday(day) ? "text-primary" : "text-foreground"}`}>{day}</div>
              <div className="sm:hidden mt-auto flex flex-wrap gap-0.5">
                {items.slice(0, 4).map(item => <span key={item.id} className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[item.status]}`} />)}
              </div>
              <div className="hidden sm:flex flex-col gap-1 mt-1">
                {items.slice(0, 2).map(item => (
                  <Link
                    key={item.id}
                    to="/dashboard/bookings/$bookingId"
                    params={{ bookingId: item.id }}
                    onClick={event => event.stopPropagation()}
                    className={`rounded border px-1.5 py-1 text-[10px] leading-tight truncate ${STATUS_STYLES[item.status]}`}
                  >
                    {item.customerName}
                  </Link>
                ))}
                {items.length > 2 && <span className="px-1 text-[10px] text-muted-foreground">+{items.length - 2} more</span>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBookings.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-2">
          {selectedBookings.map(booking => (
            <Link
              key={booking.id}
              to="/dashboard/bookings/$bookingId"
              params={{ bookingId: booking.id }}
              className="flex items-start justify-between gap-3 rounded-md border bg-background p-3 hover:bg-accent/50"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{booking.customerName}</div>
                <div className="text-xs text-muted-foreground capitalize">{booking.session} · {booking.guests} guests</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold tabular-nums">{formatINR(booking.amount)}</div>
                <span className={`mt-1 inline-flex rounded border px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-4 pt-3 border-t">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" />Pending</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Confirmed</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Rejected</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" />Completed</span>
      </div>
    </section>
  );
}
