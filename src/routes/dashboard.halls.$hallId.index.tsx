import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useHalls, useBookings } from "@/hooks/use-store";
import { formatINR, hallTypeLabel, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Pencil, Power, Trash2, Phone, Mail, MapPin, Users, Utensils, Shield, KeyRound, Copy, IndianRupee,
} from "@/components/icons";
import { HallBookingCalendar } from "@/components/hall-booking-calendar";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/halls/$hallId/")({
  component: HallDetailPage,
});

function HallDetailPage() {
  const { hallId } = useParams({ from: "/dashboard/halls/$hallId/" });
  const halls = useHalls();
  const bookings = useBookings();
  const navigate = useNavigate();
  const hall = halls.find(h => h.id === hallId);

  if (!hall) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-semibold mb-3">Hall not found</h2>
        <Link to="/dashboard/halls"><Button variant="outline">Back to halls</Button></Link>
      </div>
    );
  }

  const hallBookings = bookings.filter(b => b.hallId === hall.id);
  const upcoming = hallBookings.filter(b => new Date(b.date) >= new Date(new Date().toDateString()) && (b.status === "confirmed" || b.status === "pending")).sort((a, b) => a.date.localeCompare(b.date));

  const copy = (t: string, l: string) => { navigator.clipboard.writeText(t); toast.success(`${l} copied`); };

  const deleteHall = () => {
    if (!window.confirm(`Delete ${hall.name}? This permanently removes the hall and all related bookings.`)) return;
    store.deleteHall(hall.id);
    toast.success("Deleted");
    navigate({ to: "/dashboard/halls" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <Link to="/dashboard/halls" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to halls
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground border-0">{hallTypeLabel(hall.type)}</Badge>
            {hall.active
              ? <Badge variant="outline" className="border-success/40 text-success bg-success/10">Active</Badge>
              : <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Inactive</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">{hall.name}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{hall.address}, {hall.city}</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/halls/$hallId/edit" params={{ hallId: hall.id }}>
            <Button variant="outline"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          </Link>
          <Button variant="outline" onClick={() => { store.toggleActive(hall.id); toast.success(hall.active ? "Deactivated" : "Activated"); }}>
            <Power className="h-4 w-4 mr-2" />{hall.active ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={deleteHall}>
            <Trash2 className="h-4 w-4 mr-2" />Delete
          </Button>
        </div>
      </div>

      <Card className="p-5 sm:p-6 bg-sidebar text-sidebar-foreground border-0">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-gold" />
          <span className="text-[11px] uppercase tracking-wider text-gold font-medium">Owner Credentials</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="text-[11px] text-sidebar-foreground/60 uppercase mb-1">Owner ID</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg sm:text-2xl">{hall.ownerId}</span>
              <button onClick={() => copy(hall.ownerId, "Owner ID")} className="text-sidebar-foreground/60 hover:text-gold shrink-0"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-sidebar-foreground/60 uppercase mb-1">PIN</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg sm:text-2xl text-gold">{hall.ownerPin}</span>
              <button onClick={() => copy(hall.ownerPin, "PIN")} className="text-sidebar-foreground/60 hover:text-gold shrink-0"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </Card>

      <HallBookingCalendar bookings={hallBookings} />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold mb-4">Indoor photos</h3>
          {hall.indoorImages.length === 0 ? <p className="text-sm text-muted-foreground">No indoor photos.</p> : (
            <div className="grid grid-cols-2 gap-3">
              {hall.indoorImages.map((src, i) => <img key={i} src={src.replace("w=1200", "w=640")} alt={`Indoor ${i + 1}`} loading="lazy" decoding="async" className="aspect-[4/3] object-cover rounded-md w-full" />)}
            </div>
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold mb-4">Outdoor photos</h3>
          {hall.outdoorImages.length === 0 ? <p className="text-sm text-muted-foreground">No outdoor photos.</p> : (
            <div className="grid grid-cols-2 gap-3">
              {hall.outdoorImages.map((src, i) => <img key={i} src={src.replace("w=1200", "w=640")} alt={`Outdoor ${i + 1}`} loading="lazy" decoding="async" className="aspect-[4/3] object-cover rounded-md w-full" />)}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 sm:p-6 lg:col-span-2 space-y-5">
          <h3 className="text-base font-semibold">Details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info icon={Users} label="Capacity" value={`${hall.guests} guests`} />
            <Info icon={Utensils} label="Food" value={hall.foodType === "both" ? "Veg & Non-Veg" : hall.foodType === "veg" ? "Vegetarian" : "Non-Vegetarian"} />
            <Info icon={IndianRupee} label="Day price" value={formatINR(hall.priceDay)} />
            <Info icon={IndianRupee} label="Night price" value={formatINR(hall.priceNight)} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Facilities</div>
            <div className="flex flex-wrap gap-2">
              {hall.facilities.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
              {hall.facilities.map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1"><Shield className="h-3 w-3" />Policies</div>
            <p className="text-sm leading-relaxed whitespace-pre-line">{hall.policies || "—"}</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold">Owner & Support</h3>
          <Info icon={Users} label="Owner" value={hall.ownerName} />
          <Info icon={Mail} label="Email" value={hall.ownerEmail || "—"} />
          <Info icon={Phone} label="Owner phone" value={hall.ownerNumber} />
          <Info icon={Phone} label="Support" value={hall.supportNumber} />
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h3 className="text-base font-semibold mb-4">Upcoming bookings</h3>
        {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming bookings.</p> : (
          <div className="divide-y">
            {upcoming.map(b => (
              <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }} className="flex justify-between gap-3 py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.customerName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {b.session}</div>
                </div>
                <Badge variant="outline" className={b.status === "confirmed" ? "border-success/40 text-success bg-success/10 shrink-0" : "border-warning/40 text-warning bg-warning/10 shrink-0"}>{b.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
