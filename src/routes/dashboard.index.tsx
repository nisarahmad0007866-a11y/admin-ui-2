import { createFileRoute, Link } from "@tanstack/react-router";
import { useHalls, useBookings } from "@/hooks/use-store";
import { formatINR, hallTypeLabel } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Building2, CalendarCheck, Clock, IndianRupee, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const halls = useHalls();
  const bookings = useBookings();

  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "confirmed");
  const revenue = bookings.filter(b => b.status === "confirmed" || b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const activeHalls = halls.filter(h => h.active).length;

  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  const stats = [
    { label: "Active Halls", value: `${activeHalls}/${halls.length}`, icon: Building2, accent: "text-info" },
    { label: "Pending Bookings", value: pending.length, icon: Clock, accent: "text-warning" },
    { label: "Confirmed Bookings", value: confirmed.length, icon: CalendarCheck, accent: "text-success" },
    { label: "Revenue (Booked)", value: formatINR(revenue), icon: IndianRupee, accent: "text-gold" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Console</div>
          <h1 className="font-serif text-4xl">Overview</h1>
          <p className="text-muted-foreground mt-1">A real-time snapshot of halls, bookings and revenue.</p>
        </div>
        <Link to="/dashboard/halls/new" className="inline-flex h-10 items-center rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90">
          + Add new hall
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div className="font-serif text-3xl">{s.value}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl">Recent bookings</h2>
            <Link to="/dashboard/bookings" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y">
            {recent.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No bookings yet.</div>}
            {recent.map(b => {
              const hall = halls.find(h => h.id === b.hallId);
              return (
                <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.customerName}</div>
                    <div className="text-xs text-muted-foreground truncate">{hall?.name ?? "—"} · {new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {b.session}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium">{formatINR(b.amount)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-2xl mb-5">Halls</h2>
          <div className="space-y-3">
            {halls.slice(0, 5).map(h => (
              <Link key={h.id} to="/dashboard/halls/$hallId" params={{ hallId: h.id }} className="flex items-center justify-between gap-3 -mx-2 px-2 py-2 rounded-md hover:bg-muted/40">
                <div className="min-w-0">
                  <div className="font-medium truncate">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{hallTypeLabel(h.type)}</div>
                </div>
                {h.active
                  ? <Badge variant="outline" className="border-success/40 text-success bg-success/5"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>
                  : <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>}
              </Link>
            ))}
          </div>
          <Link to="/dashboard/halls" className="text-sm text-primary hover:underline mt-4 inline-flex items-center gap-1">
            Manage halls <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
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
