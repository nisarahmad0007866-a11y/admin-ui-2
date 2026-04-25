import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useBookings, useHalls } from "@/hooks/use-store";
import { formatINR, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar, Users, Building2, Check, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/bookings/$bookingId")({
  component: BookingDetailPage,
});

function BookingDetailPage() {
  const { bookingId } = useParams({ from: "/dashboard/bookings/$bookingId" });
  const b = useBookings().find(x => x.id === bookingId);
  const halls = useHalls();
  const hall = b ? halls.find(h => h.id === b.hallId) : undefined;

  if (!b) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-serif text-3xl mb-3">Booking not found</h2>
        <Link to="/dashboard/bookings"><Button variant="outline">Back</Button></Link>
      </div>
    );
  }

  const setStatus = (s: typeof b.status, msg: string) => { store.setBookingStatus(b.id, s); toast.success(msg); };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
      <Link to="/dashboard/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Booking · #{b.id.slice(0, 8)}</div>
          <h1 className="font-serif text-4xl">{b.customerName}</h1>
          <div className="text-muted-foreground mt-1 text-sm">Created {new Date(b.createdAt).toLocaleString("en-IN")}</div>
        </div>
        <StatusBadge status={b.status} large />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-serif text-xl">Customer</h3>
          <Row icon={Users} label="Name" value={b.customerName} />
          <Row icon={Mail} label="Email" value={b.customerEmail} />
          <Row icon={Phone} label="Phone" value={b.customerPhone} />
          {b.notes && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Notes</div>
              <p className="text-sm">{b.notes}</p>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-serif text-xl">Booking</h3>
          <Row icon={Building2} label="Hall" value={hall?.name ?? "—"} link={hall ? { to: "/dashboard/halls/$hallId" as const, params: { hallId: hall.id } } : undefined} />
          <Row icon={Calendar} label="Date & Session" value={`${new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "full" })} · ${b.session}`} />
          <Row icon={Users} label="Guests" value={`${b.guests}`} />
          <Row icon={Calendar} label="Amount" value={formatINR(b.amount)} />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-serif text-xl mb-4">Manage status</h3>
        <div className="flex flex-wrap gap-3">
          {b.status !== "confirmed" && (
            <Button onClick={() => setStatus("confirmed", "Booking confirmed")} className="bg-success hover:bg-success/90 text-white">
              <Check className="h-4 w-4 mr-2" /> Confirm
            </Button>
          )}
          {b.status !== "rejected" && (
            <Button variant="outline" onClick={() => setStatus("rejected", "Booking rejected")} className="text-destructive border-destructive/40 hover:bg-destructive/10">
              <X className="h-4 w-4 mr-2" /> Reject
            </Button>
          )}
          {b.status !== "completed" && (
            <Button variant="outline" onClick={() => setStatus("completed", "Marked completed")}>
              <CheckCheck className="h-4 w-4 mr-2" /> Mark completed
            </Button>
          )}
          {b.status !== "pending" && (
            <Button variant="ghost" onClick={() => setStatus("pending", "Reset to pending")}>
              Reset to pending
            </Button>
          )}
        </div>
      </Card>

      {hall && (
        <Card className="p-6">
          <h3 className="font-serif text-xl mb-4">Customer support</h3>
          <p className="text-sm text-muted-foreground mb-4">For help, share these contacts with the customer:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Row icon={Phone} label="Hall support" value={hall.supportNumber} />
            <Row icon={Phone} label="Owner direct" value={hall.ownerNumber} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value, link }: { icon: any; label: string; value: string; link?: { to: "/dashboard/halls/$hallId"; params: { hallId: string } } }) {
  const inner = (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
  if (link) return <Link to={link.to} params={link.params} className="block hover:bg-muted/40 -mx-2 px-2 py-1 rounded-md">{inner}</Link>;
  return inner;
}

function StatusBadge({ status, large }: { status: string; large?: boolean }) {
  const map: Record<string, string> = {
    pending: "border-warning/40 text-warning bg-warning/10",
    confirmed: "border-success/40 text-success bg-success/10",
    rejected: "border-destructive/40 text-destructive bg-destructive/10",
    completed: "border-info/40 text-info bg-info/10",
  };
  return <Badge variant="outline" className={`${map[status]} ${large ? "text-sm px-3 py-1" : ""}`}>{status}</Badge>;
}
