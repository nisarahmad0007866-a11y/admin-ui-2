import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Hall, HallType, FoodType, store, uid, genOwnerId, genOwnerPin } from "@/lib/store";
import {
  Plus, X, MapPin, Upload, Image as ImageIcon, Building2, Trees, Sparkles,
  Leaf, Drumstick, UtensilsCrossed, Car, Snowflake, Mic2, Music, Wifi,
  Heart, Zap, ChefHat, User, Phone, Mail, Headset, Users, Sun, Moon,
  Home, MapPinned,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  mode: "create" | "edit";
  existing?: Hall;
  onSaved: (hall: Hall) => void;
  onCancel: () => void;
}

const HALL_TYPES: { value: HallType; label: string; desc: string; Icon: typeof Building2 }[] = [
  { value: "wedding", label: "Wedding Hall", desc: "Indoor · décor ready", Icon: Sparkles },
  { value: "lawn",    label: "Lawn",        desc: "Open-air · large capacity", Icon: Trees },
  { value: "banquet", label: "Banquet Hall", desc: "Corporate · formal events", Icon: Building2 },
];

const FOOD_TYPES: { value: FoodType; label: string; Icon: typeof Leaf }[] = [
  { value: "veg",     label: "Veg only",     Icon: Leaf },
  { value: "non-veg", label: "Non-Veg only", Icon: Drumstick },
  { value: "both",    label: "Veg & Non-Veg", Icon: UtensilsCrossed },
];

const COMMON_FACILITIES: { name: string; Icon: typeof Car }[] = [
  { name: "Parking",          Icon: Car },
  { name: "AC",               Icon: Snowflake },
  { name: "Stage",            Icon: Mic2 },
  { name: "DJ",               Icon: Music },
  { name: "WiFi",             Icon: Wifi },
  { name: "Bridal Room",      Icon: Heart },
  { name: "Power Backup",     Icon: Zap },
  { name: "Catering Kitchen", Icon: ChefHat },
];

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

  const toggleFacility = (f: string) => {
    setFacilities(facilities.includes(f) ? facilities.filter(x => x !== f) : [...facilities, f]);
  };
  const addCustomFacility = () => {
    const v = facilityInput.trim();
    if (!v || facilities.includes(v)) { setFacilityInput(""); return; }
    setFacilities([...facilities, v]);
    setFacilityInput("");
  };

  const autoFetchAddress = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    toast("Fetching location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        toast.success("Location captured — refine if needed");
      },
      () => toast.error("Could not fetch location"),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || !ownerNumber || !address || !guests || !priceDay || !priceNight) {
      toast.error("Please fill all required fields (marked *)");
      return;
    }
    const hall: Hall = {
      id: existing?.id ?? `h_${uid()}`,
      ownerId: existing?.ownerId ?? genOwnerId(),
      ownerPin: existing?.ownerPin ?? genOwnerPin(),
      name, type, ownerName,
      ownerEmail: ownerEmail.trim(),
      ownerNumber,
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
    <form onSubmit={submit} className="bg-card border rounded-lg shadow-sm">
      {/* 1. Basic */}
      <Section number={1} title="Basic information" subtitle="What is this venue and who is it for?">
        <Field label="Hall name" required Icon={Home}>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Grand Pavilion" className="h-11" />
        </Field>

        <Field label="Hall type" required>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {HALL_TYPES.map(t => {
              const on = type === t.value;
              return (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={`group flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    on ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                  }`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-md ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <t.Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{t.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{t.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Capacity (guests)" required Icon={Users}>
            <Input type="number" min={1} value={guests} onChange={e => setGuests(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 500" className="h-11" />
          </Field>
          <Field label="Food preference" required>
            <div className="grid grid-cols-3 gap-2">
              {FOOD_TYPES.map(f => {
                const on = foodType === f.value;
                return (
                  <button key={f.value} type="button" onClick={() => setFoodType(f.value)}
                    className={`flex flex-col items-center justify-center gap-1 h-16 rounded-md border-2 transition-all ${
                      on ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                    }`}>
                    <f.Icon className={`h-4 w-4 ${on ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-[11px] font-medium leading-none text-center px-1">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </Section>

      {/* 2. Owner */}
      <Section number={2} title="Owner & contact" subtitle="Login credentials will be issued to the owner.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Owner name" required Icon={User}>
            <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Full name" className="h-11" />
          </Field>
          <Field label="Owner phone" required Icon={Phone}>
            <Input value={ownerNumber} onChange={e => setOwnerNumber(e.target.value)} placeholder="+91 98765 43210" className="h-11" />
          </Field>
          <Field label="Owner email" hint="Optional — for receipts & updates" Icon={Mail}>
            <Input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@example.com" className="h-11" />
          </Field>
          <Field label="Support phone" hint="Customer-facing helpline (optional)" Icon={Headset}>
            <Input value={supportNumber} onChange={e => setSupportNumber(e.target.value)} placeholder="Same as owner if blank" className="h-11" />
          </Field>
        </div>
      </Section>

      {/* 3. Pricing */}
      <Section number={3} title="Pricing" subtitle="Per-event price for day & night sessions.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Day price" required Icon={Sun}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <Input type="number" min={0} value={priceDay} onChange={e => setPriceDay(e.target.value === "" ? "" : Number(e.target.value))} placeholder="75,000" className="h-11 pl-7" />
            </div>
          </Field>
          <Field label="Night price" required Icon={Moon}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <Input type="number" min={0} value={priceNight} onChange={e => setPriceNight(e.target.value === "" ? "" : Number(e.target.value))} placeholder="95,000" className="h-11 pl-7" />
            </div>
          </Field>
        </div>
      </Section>

      {/* 4. Address */}
      <Section number={4} title="Address" subtitle="Where customers will visit.">
        <Field label="Street, area, landmark" required Icon={MapPinned}>
          <div className="flex gap-2">
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Plot 24, Linking Road, Bandra West" className="h-11" />
            <Button type="button" variant="outline" onClick={autoFetchAddress} className="shrink-0 h-11">
              <MapPin className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Use my location</span>
            </Button>
          </div>
        </Field>
        <Field label="City">
          <Input value={city} onChange={e => setCity(e.target.value)} className="h-11" />
        </Field>
      </Section>

      {/* 5. Facilities */}
      <Section number={5} title="Facilities" subtitle="Tap the icons to add — or type a custom one.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COMMON_FACILITIES.map(({ name: f, Icon }) => {
            const on = facilities.includes(f);
            return (
              <button key={f} type="button" onClick={() => toggleFacility(f)}
                className={`flex items-center gap-2 px-3 h-11 rounded-md border-2 text-sm font-medium transition-all ${
                  on ? "border-primary bg-primary/5 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}>
                <Icon className={`h-4 w-4 ${on ? "text-primary" : ""}`} />
                <span className="truncate">{f}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <Input value={facilityInput} onChange={e => setFacilityInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomFacility(); } }}
            placeholder="Add custom facility (e.g. Swimming Pool)" className="h-11" />
          <Button type="button" variant="outline" onClick={addCustomFacility} className="h-11"><Plus className="h-4 w-4" /></Button>
        </div>
        {facilities.filter(f => !COMMON_FACILITIES.some(c => c.name === f)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {facilities.filter(f => !COMMON_FACILITIES.some(c => c.name === f)).map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {f}
                <button type="button" onClick={() => toggleFacility(f)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* 6. Policies */}
      <Section number={6} title="Policies" subtitle="Cancellation, advance, decor, music timings…">
        <Textarea value={policies} onChange={e => setPolicies(e.target.value)} rows={4}
          placeholder="e.g. 50% advance to confirm. Cancellation 30 days prior — full refund. Music allowed till 10 PM." />
      </Section>

      {/* 7. Photos */}
      <Section number={7} title="Photos" subtitle="Upload from device or paste image URL · Max 4 indoor + 4 outdoor">
        <PhotoBlock
          label="Indoor"
          Icon={Building2}
          images={indoorImages}
          onAdd={(url) => setIndoorImages([...indoorImages, url])}
          onRemove={(i) => setIndoorImages(indoorImages.filter((_, idx) => idx !== i))}
        />
        <div className="h-px bg-border my-5" />
        <PhotoBlock
          label="Outdoor"
          Icon={Trees}
          images={outdoorImages}
          onAdd={(url) => setOutdoorImages([...outdoorImages, url])}
          onRemove={(i) => setOutdoorImages(outdoorImages.filter((_, idx) => idx !== i))}
        />
      </Section>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 px-6 py-4 border-t bg-card/95 backdrop-blur rounded-b-lg">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {mode === "create" ? "Owner ID & PIN will be generated on save." : "Changes apply immediately."}
        </span>
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[160px]">
            {mode === "create" ? "Save & generate ID" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({ number, title, subtitle, children }: { number: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="px-4 sm:px-6 py-5 sm:py-6 border-b last:border-b-0">
      <div className="flex items-start gap-3 mb-5">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">{number}</span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required, hint, Icon, children }: { label: string; required?: boolean; hint?: string; Icon?: typeof User; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PhotoBlock({ label, Icon, images, onAdd, onRemove }: {
  label: string; Icon: typeof Building2; images: string[];
  onAdd: (url: string) => void; onRemove: (i: number) => void;
}) {
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const max = 4;

  const handleUrl = () => {
    const v = url.trim();
    if (!v) return;
    if (images.length >= max) { toast.error(`Max ${max} photos`); return; }
    try { new URL(v); } catch { toast.error("Please paste a valid image URL"); return; }
    onAdd(v); setUrl("");
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    if (remaining <= 0) { toast.error(`Max ${max} photos`); return; }
    Array.from(files).slice(0, remaining).forEach(file => {
      if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
      if (file.size > 2 * 1024 * 1024) { toast.error(`${file.name} is over 2 MB`); return; }
      const reader = new FileReader();
      reader.onload = () => onAdd(String(reader.result));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{images.length}/{max}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {images.map((src, i) => (
          <div key={i} className="relative group aspect-[4/3] rounded-md overflow-hidden border bg-muted">
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onRemove(i)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="aspect-[4/3] rounded-md border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Upload</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleUrl(); } }}
            placeholder="…or paste image URL"
            className="h-10 pl-9 text-sm" />
        </div>
        <Button type="button" variant="outline" onClick={handleUrl} className="h-10"><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
