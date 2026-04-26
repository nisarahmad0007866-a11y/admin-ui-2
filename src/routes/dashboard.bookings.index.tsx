import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookings, useHalls } from "@/hooks/use-store";
import { formatINR } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Search, Download } from "@/components/icons";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/bookings/")({
  component: BookingsListPage,
});

const filters = ["all", "pending", "confirmed", "rejected", "completed"] as const;

type Filter = (typeof filters)[number];

function BookingsListPage() {
  const bookings = useBookings();
  const halls = useHalls();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Filter>("all");

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
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border bg-card px-3 text-xs font-medium hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        }
      />

      <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5 rounded-lg border bg-card">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by customer, hall, phone…" className="pl-9 h-10" />
        </div>
        <div className="overflow-x-auto">
          <div className="inline-flex h-9 w-max items-center rounded-lg bg-muted p-1 text-muted-foreground">
            {filters.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium capitalize ${tab === value ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
              >
                {value} <span className="ml-1.5 text-xs opacity-60">{counts[value]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sm:hidden space-y-2">
        {filtered.length === 0 && <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No bookings.</div>}
        {filtered.map(b => {
          const hall = halls.find(h => h.id === b.hallId);
          return (
            <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }}>
              <div className="rounded-lg border bg-card p-4 active:bg-muted/40">
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
              </div>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card hidden sm:block">
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
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? ""}`}>{status}</span>;
}
