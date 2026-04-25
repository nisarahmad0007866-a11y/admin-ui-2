import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookings, useHalls } from "@/hooks/use-store";
import { formatINR } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/bookings/")({
  component: BookingsListPage,
});

function BookingsListPage() {
  const bookings = useBookings();
  const halls = useHalls();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "confirmed" | "rejected" | "completed">("all");

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

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Operations</div>
        <h1 className="font-serif text-4xl">Bookings</h1>
        <p className="text-muted-foreground mt-1">Review, confirm or reject bookings across all halls.</p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by customer, hall, phone…" className="pl-10 h-10" />
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All <span className="ml-1.5 text-xs opacity-60">{counts.all}</span></TabsTrigger>
            <TabsTrigger value="pending">Pending <span className="ml-1.5 text-xs opacity-60">{counts.pending}</span></TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed <span className="ml-1.5 text-xs opacity-60">{counts.confirmed}</span></TabsTrigger>
            <TabsTrigger value="rejected">Rejected <span className="ml-1.5 text-xs opacity-60">{counts.rejected}</span></TabsTrigger>
            <TabsTrigger value="completed">Completed <span className="ml-1.5 text-xs opacity-60">{counts.completed}</span></TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <Card className="overflow-hidden">
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
                    <td className="px-4 py-3 text-right font-medium">{formatINR(b.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
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
