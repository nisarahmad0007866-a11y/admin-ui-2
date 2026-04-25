import { createFileRoute, Link } from "@tanstack/react-router";
import { useHalls, useBookings } from "@/hooks/use-store";
import { formatINR, hallTypeLabel } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Building2, CalendarCheck, Clock, IndianRupee, ArrowRight, CheckCircle2, XCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Overview"
        description="Snapshot of halls, bookings and revenue."
        actions={
          <Link to="/dashboard/halls/new">
            <Button size="sm" className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-1.5" />Add hall</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.accent} shrink-0`} />
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{s.value}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent bookings</h2>
            <Link to="/dashboard/bookings" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y">
            {recent.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No bookings yet.</div>}
            {recent.map(b => {
              const hall = halls.find(h => h.id === b.hallId);
              return (
                <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }} className="flex items-center justify-between gap-2 py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-sm">{b.customerName}</div>
                    <div className="text-xs text-muted-foreground truncate">{hall?.name ?? "—"} · {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-medium tabular-nums">{formatINR(b.amount)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-base font-semibold mb-4">Halls</h2>
          <div className="space-y-1">
            {halls.slice(0, 5).map(h => (
              <Link key={h.id} to="/dashboard/halls/$hallId" params={{ hallId: h.id }} className="flex items-center justify-between gap-3 -mx-2 px-2 py-2 rounded-md hover:bg-muted/40">
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{hallTypeLabel(h.type)}</div>
                </div>
                {h.active
                  ? <Badge variant="outline" className="border-success/40 text-success bg-success/5 shrink-0"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>
                  : <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground shrink-0"><XCircle className="h-3 w-3 mr-1" />Off</Badge>}
              </Link>
            ))}
          </div>
          <Link to="/dashboard/halls" className="text-xs text-primary hover:underline mt-4 inline-flex items-center gap-1">
            Manage halls <ArrowRight className="h-3 w-3" />
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
