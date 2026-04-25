import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hall, HallType, FoodType, store, uid, genOwnerId, genOwnerPin } from "@/lib/store";
import { Plus, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Props {
  mode: "create" | "edit";
  existing?: Hall;
  onSaved: (hall: Hall) => void;
  onCancel: () => void;
}

export function HallForm({ mode, existing, onSaved, onCancel }: Props) {
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState<HallType>(existing?.type ?? "wedding");
  const [ownerName, setOwnerName] = useState(existing?.ownerName ?? "");
  const [ownerEmail, setOwnerEmail] = useState(existing?.ownerEmail ?? "");
  const [ownerNumber, setOwnerNumber] = useState(existing?.ownerNumber ?? "");
  const [supportNumber, setSupportNumber] = useState(existing?.supportNumber ?? "");
  const [guests, setGuests] = useState<number | "">(existing?.guests ?? "");
  const [priceDay, setPriceDay] = useState<number | "">(existing?.priceDay ?? "");
  const [priceNight, setPriceNight] = useState<number | "">(existing?.priceNight ?? "");
  const [foodType, setFoodType] = useState<FoodType>(existing?.foodType ?? "both");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [city, setCity] = useState(existing?.city ?? "Mumbai");
  const [policies, setPolicies] = useState(existing?.policies ?? "");
  const [facilities, setFacilities] = useState<string[]>(existing?.facilities ?? []);
  const [facilityInput, setFacilityInput] = useState("");
  const [indoorImages, setIndoorImages] = useState<string[]>(existing?.indoorImages ?? []);
  const [outdoorImages, setOutdoorImages] = useState<string[]>(existing?.outdoorImages ?? []);
  const [indoorInput, setIndoorInput] = useState("");
  const [outdoorInput, setOutdoorInput] = useState("");

  const addFacility = () => {
    const v = facilityInput.trim();
    if (!v) return;
    if (facilities.includes(v)) return;
    setFacilities([...facilities, v]);
    setFacilityInput("");
  };
  const addImage = (kind: "in" | "out") => {
    const v = (kind === "in" ? indoorInput : outdoorInput).trim();
    if (!v) return;
    const list = kind === "in" ? indoorImages : outdoorImages;
    if (list.length >= 4) { toast.error("Max 4 images"); return; }
    try { new URL(v); } catch { toast.error("Invalid URL"); return; }
    if (kind === "in") { setIndoorImages([...indoorImages, v]); setIndoorInput(""); }
    else { setOutdoorImages([...outdoorImages, v]); setOutdoorInput(""); }
  };

  const autoFetchAddress = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    toast("Fetching location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        toast.success("Location captured — refine the address manually if needed");
      },
      () => toast.error("Could not fetch location"),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || !ownerEmail || !ownerNumber || !address || !guests || !priceDay || !priceNight) {
      toast.error("Please fill all required fields");
      return;
    }
    const hall: Hall = {
      id: existing?.id ?? `h_${uid()}`,
      ownerId: existing?.ownerId ?? genOwnerId(),
      ownerPin: existing?.ownerPin ?? genOwnerPin(),
      name, type, ownerName, ownerEmail, ownerNumber,
      supportNumber: supportNumber || ownerNumber,
      guests: Number(guests),
      priceDay: Number(priceDay),
      priceNight: Number(priceNight),
      facilities, policies, foodType, address, city,
      indoorImages, outdoorImages,
      active: existing?.active ?? true,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    store.saveHall(hall);
    toast.success(mode === "create" ? "Hall created" : "Hall updated");
    onSaved(hall);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card className="p-6 space-y-5">
        <SectionTitle>Basic info</SectionTitle>
        <Grid2>
          <Field label="Hall name *"><Input value={name} onChange={e => setName(e.target.value)} placeholder="The Grand Pavilion" /></Field>
          <Field label="Hall type *">
            <Select value={type} onValueChange={(v) => setType(v as HallType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wedding">Wedding Hall</SelectItem>
                <SelectItem value="lawn">Lawn</SelectItem>
                <SelectItem value="banquet">Banquet Hall</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Capacity (guests) *"><Input type="number" min={1} value={guests} onChange={e => setGuests(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          <Field label="Food type *">
            <Select value={foodType} onValueChange={(v) => setFoodType(v as FoodType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                <SelectItem value="both">Both Veg & Non-Veg</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Grid2>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Owner & support</SectionTitle>
        <Grid2>
          <Field label="Owner name *"><Input value={ownerName} onChange={e => setOwnerName(e.target.value)} /></Field>
          <Field label="Owner email *"><Input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@example.com" /></Field>
          <Field label="Owner phone *"><Input value={ownerNumber} onChange={e => setOwnerNumber(e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Support phone"><Input value={supportNumber} onChange={e => setSupportNumber(e.target.value)} placeholder="Defaults to owner phone" /></Field>
        </Grid2>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Pricing</SectionTitle>
        <Grid2>
          <Field label="Day price (₹) *"><Input type="number" min={0} value={priceDay} onChange={e => setPriceDay(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          <Field label="Night price (₹) *"><Input type="number" min={0} value={priceNight} onChange={e => setPriceNight(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
        </Grid2>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Address</SectionTitle>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, area, landmark *" />
            <Button type="button" variant="outline" onClick={autoFetchAddress}><MapPin className="h-4 w-4 mr-2" />Auto</Button>
          </div>
          <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Facilities</SectionTitle>
        <div className="flex gap-2">
          <Input value={facilityInput} onChange={e => setFacilityInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFacility(); } }} placeholder="e.g. Valet Parking, AC, Stage" />
          <Button type="button" variant="outline" onClick={addFacility}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {facilities.map(f => (
            <Badge key={f} variant="secondary" className="pl-3 pr-1.5 py-1">
              {f}
              <button type="button" onClick={() => setFacilities(facilities.filter(x => x !== f))} className="ml-1.5 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {facilities.length === 0 && <p className="text-xs text-muted-foreground">No facilities added yet.</p>}
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Policies</SectionTitle>
        <Textarea value={policies} onChange={e => setPolicies(e.target.value)} rows={4} placeholder="Cancellation, advance, decor, music timing…" />
      </Card>

      <Card className="p-6 space-y-5">
        <SectionTitle>Photos (URLs)</SectionTitle>
        <p className="text-xs text-muted-foreground -mt-2">Up to 4 indoor and 4 outdoor images. Paste image URLs.</p>

        <div className="space-y-3">
          <div className="text-sm font-medium">Indoor ({indoorImages.length}/4)</div>
          <div className="flex gap-2">
            <Input value={indoorInput} onChange={e => setIndoorInput(e.target.value)} placeholder="https://…" />
            <Button type="button" variant="outline" onClick={() => addImage("in")}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
          <ImageThumbs images={indoorImages} onRemove={(i) => setIndoorImages(indoorImages.filter((_, idx) => idx !== i))} />
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="text-sm font-medium">Outdoor ({outdoorImages.length}/4)</div>
          <div className="flex gap-2">
            <Input value={outdoorInput} onChange={e => setOutdoorInput(e.target.value)} placeholder="https://…" />
            <Button type="button" variant="outline" onClick={() => addImage("out")}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
          <ImageThumbs images={outdoorImages} onRemove={(i) => setOutdoorImages(outdoorImages.filter((_, idx) => idx !== i))} />
        </div>
      </Card>

      <div className="flex justify-end gap-3 pb-10">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">{mode === "create" ? "Create hall" : "Save changes"}</Button>
      </div>
    </form>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-xl">{children}</h2>;
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function ImageThumbs({ images, onRemove }: { images: string[]; onRemove: (i: number) => void }) {
  if (images.length === 0) return <p className="text-xs text-muted-foreground">No images yet.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {images.map((src, i) => (
        <div key={i} className="relative group aspect-[4/3] rounded-md overflow-hidden border">
          <img src={src} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onRemove(i)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
