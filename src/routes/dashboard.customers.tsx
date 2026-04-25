import { createFileRoute, Link } from "@tanstack/react-router";
import { useBookings, useHalls } from "@/hooks/use-store";
import { formatINR } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search } from "@/components/icons";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/customers")({
  component: CustomersPage,
});

interface Customer {
  email: string;
  name: string;
  phone: string;
  bookings: number;
  totalSpend: number;
  lastBookingId: string;
}

function CustomersPage() {
  const bookings = useBookings();
  const halls = useHalls();
  const [q, setQ] = useState("");

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach(b => {
      const key = b.customerEmail.toLowerCase();
      const ex = map.get(key);
      if (ex) {
        ex.bookings += 1;
        if (b.status === "confirmed" || b.status === "completed") ex.totalSpend += b.amount;
      } else {
        map.set(key, {
          email: b.customerEmail, name: b.customerName, phone: b.customerPhone,
          bookings: 1,
          totalSpend: (b.status === "confirmed" || b.status === "completed") ? b.amount : 0,
          lastBookingId: b.id,
        });
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const filtered = customers.filter(c =>
    !q || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Customers"
        description="Look up any customer to help with their bookings."
      />

      <Card className="p-3 sm:p-4 mb-5">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, email or phone…" className="pl-9 h-10" />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">No customers yet.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const lastBooking = bookings.find(b => b.id === c.lastBookingId);
            const lastHall = lastBooking ? halls.find(h => h.id === lastBooking.hallId) : undefined;
            return (
              <Link key={c.email} to="/dashboard/bookings/$bookingId" params={{ bookingId: c.lastBookingId }}>
                <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-semibold">
                      {c.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.bookings} booking{c.bookings > 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1.5">
                    <div className="flex items-center gap-2 truncate"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{c.email}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" /><span>{c.phone}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between text-xs">
                    <span className="text-muted-foreground">Total spend</span>
                    <span className="font-medium">{formatINR(c.totalSpend)}</span>
                  </div>
                  {lastHall && <div className="text-xs text-muted-foreground mt-1">Last: {lastHall.name}</div>}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
