import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useHalls, useBookings } from "@/hooks/use-store";
import { formatINR, hallTypeLabel, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Pencil, Power, Trash2, Phone, Mail, MapPin, Users, Utensils, Shield, KeyRound, Copy, IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        <h2 className="font-serif text-3xl mb-3">Hall not found</h2>
        <Link to="/dashboard/halls"><Button variant="outline">Back to halls</Button></Link>
      </div>
    );
  }

  const hallBookings = bookings.filter(b => b.hallId === hall.id);
  const upcoming = hallBookings.filter(b => new Date(b.date) >= new Date(new Date().toDateString()) && (b.status === "confirmed" || b.status === "pending")).sort((a, b) => a.date.localeCompare(b.date));
  const allDates = hallBookings.filter(b => b.status !== "rejected").map(b => ({ date: new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" }), session: b.session, status: b.status }));

  const copy = (t: string, l: string) => { navigator.clipboard.writeText(t); toast.success(`${l} copied`); };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
      <Link to="/dashboard/halls" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to halls
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground border-0">{hallTypeLabel(hall.type)}</Badge>
            {hall.active
              ? <Badge variant="outline" className="border-success/40 text-success bg-success/10">Active</Badge>
              : <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Inactive</Badge>}
          </div>
          <h1 className="font-serif text-4xl">{hall.name}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5" />{hall.address}, {hall.city}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/halls/$hallId/edit" params={{ hallId: hall.id }}>
            <Button variant="outline"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          </Link>
          <Button variant="outline" onClick={() => { store.toggleActive(hall.id); toast.success(hall.active ? "Deactivated" : "Activated"); }}>
            <Power className="h-4 w-4 mr-2" />{hall.active ? "Deactivate" : "Activate"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{hall.name}"?</AlertDialogTitle>
                <AlertDialogDescription>This permanently removes the hall and all related bookings.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { store.deleteHall(hall.id); toast.success("Deleted"); navigate({ to: "/dashboard/halls" }); }} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Owner credentials */}
      <Card className="p-6 bg-sidebar text-sidebar-foreground border-0">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-gold" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold">Owner Credentials</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-sidebar-foreground/60 uppercase mb-1">Owner ID (8-digit)</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl">{hall.ownerId}</span>
              <button onClick={() => copy(hall.ownerId, "Owner ID")} className="text-sidebar-foreground/60 hover:text-gold"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
          <div>
            <div className="text-xs text-sidebar-foreground/60 uppercase mb-1">PIN (4-digit)</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl text-gold">{hall.ownerPin}</span>
              <button onClick={() => copy(hall.ownerPin, "PIN")} className="text-sidebar-foreground/60 hover:text-gold"><Copy className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </Card>

      {/* Photos */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-serif text-xl mb-4">Indoor photos</h3>
          {hall.indoorImages.length === 0 ? <p className="text-sm text-muted-foreground">No indoor photos.</p> : (
            <div className="grid grid-cols-2 gap-3">
              {hall.indoorImages.map((src, i) => <img key={i} src={src} alt={`Indoor ${i+1}`} className="aspect-[4/3] object-cover rounded-md w-full" />)}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-serif text-xl mb-4">Outdoor photos</h3>
          {hall.outdoorImages.length === 0 ? <p className="text-sm text-muted-foreground">No outdoor photos.</p> : (
            <div className="grid grid-cols-2 gap-3">
              {hall.outdoorImages.map((src, i) => <img key={i} src={src} alt={`Outdoor ${i+1}`} className="aspect-[4/3] object-cover rounded-md w-full" />)}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-5">
          <h3 className="font-serif text-xl">Details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info icon={Users} label="Capacity" value={`${hall.guests} guests`} />
            <Info icon={Utensils} label="Food" value={hall.foodType === "both" ? "Veg & Non-Veg" : hall.foodType === "veg" ? "Vegetarian" : "Non-Vegetarian"} />
            <Info icon={IndianRupee} label="Day price" value={formatINR(hall.priceDay)} />
            <Info icon={IndianRupee} label="Night price" value={formatINR(hall.priceNight)} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Facilities</div>
            <div className="flex flex-wrap gap-2">
              {hall.facilities.map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1"><Shield className="h-3 w-3" />Policies</div>
            <p className="text-sm leading-relaxed">{hall.policies}</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-serif text-xl">Owner & Support</h3>
          <Info icon={Users} label="Owner" value={hall.ownerName} />
          <Info icon={Mail} label="Email" value={hall.ownerEmail} />
          <Info icon={Phone} label="Owner phone" value={hall.ownerNumber} />
          <Info icon={Phone} label="Support" value={hall.supportNumber} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-serif text-xl mb-4">Upcoming bookings</h3>
          {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming bookings.</p> : (
            <div className="divide-y">
              {upcoming.map(b => (
                <Link key={b.id} to="/dashboard/bookings/$bookingId" params={{ bookingId: b.id }} className="flex justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                  <div>
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {b.session}</div>
                  </div>
                  <Badge variant="outline" className={b.status === "confirmed" ? "border-success/40 text-success bg-success/10" : "border-warning/40 text-warning bg-warning/10"}>{b.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-serif text-xl mb-4">Date availability</h3>
          {allDates.length === 0 ? <p className="text-sm text-muted-foreground">All dates available.</p> : (
            <div className="space-y-2">
              {allDates.map((d, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
                  <span>{d.date} <span className="text-muted-foreground">({d.session})</span></span>
                  <Badge variant="outline" className={d.status === "confirmed" ? "border-destructive/40 text-destructive bg-destructive/5" : "border-warning/40 text-warning bg-warning/5"}>
                    {d.status === "confirmed" ? "Booked" : "Hold"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
