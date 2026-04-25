import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Hall, HallType, FoodType, store, uid, genOwnerId, genOwnerPin } from "@/lib/store";
import { Plus, X, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Props {
  mode: "create" | "edit";
  existing?: Hall;
  onSaved: (hall: Hall) => void;
  onCancel: () => void;
}

const HALL_TYPES: { value: HallType; label: string }[] = [
  { value: "wedding", label: "Wedding Hall" },
  { value: "lawn", label: "Lawn" },
  { value: "banquet", label: "Banquet Hall" },
];

const FOOD_TYPES: { value: FoodType; label: string }[] = [
  { value: "veg", label: "Veg only" },
  { value: "non-veg", label: "Non-Veg only" },
  { value: "both", label: "Veg & Non-Veg" },
];

const COMMON_FACILITIES = ["Parking", "AC", "Stage", "DJ", "WiFi", "Bridal Room", "Power Backup", "Catering Kitchen"];

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

  const toggleFacility = (f: string) => {
    setFacilities(facilities.includes(f) ? facilities.filter(x => x !== f) : [...facilities, f]);
  };
  const addCustomFacility = () => {
    const v = facilityInput.trim();
    if (!v || facilities.includes(v)) { setFacilityInput(""); return; }
    setFacilities([...facilities, v]);
    setFacilityInput("");
  };
  const addImage = (kind: "in" | "out") => {
    const v = (kind === "in" ? indoorInput : outdoorInput).trim();
    if (!v) return;
    const list = kind === "in" ? indoorImages : outdoorImages;
    if (list.length >= 4) { toast.error("Max 4 photos"); return; }
    try { new URL(v); } catch { toast.error("Please paste a valid image URL"); return; }
    if (kind === "in") { setIndoorImages([...indoorImages, v]); setIndoorInput(""); }
    else { setOutdoorImages([...outdoorImages, v]); setOutdoorInput(""); }
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
    if (!name || !ownerName || !ownerEmail || !ownerNumber || !address || !guests || !priceDay || !priceNight) {
      toast.error("Please fill all required fields (marked *)");
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
    <form onSubmit={submit} className="bg-card border rounded-lg">
      {/* 1. Basic */}
      <Section number={1} title="Basic information">
        <Field label="Hall name" required>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Grand Pavilion" />
        </Field>

        <Field label="Hall type" required>
          <div className="grid grid-cols-3 gap-2">
            {HALL_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`h-11 rounded-md border text-sm font-medium transition-colors ${
                  type === t.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Capacity (guests)" required>
            <Input type="number" min={1} value={guests} onChange={e => setGuests(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 500" />
          </Field>
          <Field label="Food type" required>
            <div className="grid grid-cols-3 gap-1.5">
              {FOOD_TYPES.map(f => (
                <button key={f.value} type="button" onClick={() => setFoodType(f.value)}
                  className={`h-11 rounded-md border text-xs font-medium ${foodType === f.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-muted"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      {/* 2. Owner */}
      <Section number={2} title="Owner & contact">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Owner name" required>
            <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} />
          </Field>
          <Field label="Owner email" required hint="Used for owner login">
            <Input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@example.com" />
          </Field>
          <Field label="Owner phone" required>
            <Input value={ownerNumber} onChange={e => setOwnerNumber(e.target.value)} placeholder="+91 ..." />
          </Field>
          <Field label="Support phone" hint="Customer help number (optional)">
            <Input value={supportNumber} onChange={e => setSupportNumber(e.target.value)} placeholder="Same as owner if blank" />
          </Field>
        </div>
      </Section>

      {/* 3. Pricing */}
      <Section number={3} title="Pricing">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Day price (₹)" required>
            <Input type="number" min={0} value={priceDay} onChange={e => setPriceDay(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 75000" />
          </Field>
          <Field label="Night price (₹)" required>
            <Input type="number" min={0} value={priceNight} onChange={e => setPriceNight(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 95000" />
          </Field>
        </div>
      </Section>

      {/* 4. Address */}
      <Section number={4} title="Address">
        <Field label="Street, area, landmark" required>
          <div className="flex gap-2">
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Plot 24, Linking Road, Bandra West" />
            <Button type="button" variant="outline" onClick={autoFetchAddress} className="shrink-0">
              <MapPin className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Auto-fetch</span>
            </Button>
          </div>
        </Field>
        <Field label="City">
          <Input value={city} onChange={e => setCity(e.target.value)} />
        </Field>
      </Section>

      {/* 5. Facilities */}
      <Section number={5} title="Facilities" hint="Tap to select common ones, or add your own.">
        <div className="flex flex-wrap gap-2">
          {COMMON_FACILITIES.map(f => {
            const on = facilities.includes(f);
            return (
              <button key={f} type="button" onClick={() => toggleFacility(f)}
                className={`h-9 px-3 rounded-full border text-xs font-medium ${on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-muted"}`}>
                {on ? "✓ " : "+ "}{f}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <Input value={facilityInput} onChange={e => setFacilityInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomFacility(); } }}
            placeholder="Add custom facility (press Enter)" />
          <Button type="button" variant="outline" onClick={addCustomFacility}><Plus className="h-4 w-4" /></Button>
        </div>
        {facilities.filter(f => !COMMON_FACILITIES.includes(f)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {facilities.filter(f => !COMMON_FACILITIES.includes(f)).map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-secondary text-secondary-foreground text-xs">
                {f}
                <button type="button" onClick={() => toggleFacility(f)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* 6. Policies */}
      <Section number={6} title="Policies" hint="Cancellation, advance, decor, music timings…">
        <Textarea value={policies} onChange={e => setPolicies(e.target.value)} rows={3}
          placeholder="e.g. 50% advance to confirm. Cancellation 30 days prior — full refund." />
      </Section>

      {/* 7. Photos */}
      <Section number={7} title="Photos" hint="Paste image URLs · Max 4 indoor + 4 outdoor">
        <PhotoBlock label={`Indoor (${indoorImages.length}/4)`}
          inputValue={indoorInput} onInputChange={setIndoorInput}
          onAdd={() => addImage("in")}
          images={indoorImages}
          onRemove={(i) => setIndoorImages(indoorImages.filter((_, idx) => idx !== i))} />
        <div className="h-px bg-border my-5" />
        <PhotoBlock label={`Outdoor (${outdoorImages.length}/4)`}
          inputValue={outdoorInput} onInputChange={setOutdoorInput}
          onAdd={() => addImage("out")}
          images={outdoorImages}
          onRemove={(i) => setOutdoorImages(outdoorImages.filter((_, idx) => idx !== i))} />
      </Section>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 px-6 py-4 border-t bg-card/95 backdrop-blur rounded-b-lg">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {mode === "create" ? "Owner ID & PIN will be generated on save." : "Changes apply immediately."}
        </span>
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[140px]">
            {mode === "create" ? "Save & generate ID" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({ number, title, hint, children }: { number: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="px-6 py-6 border-b last:border-b-0">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">{number}</span>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
        </div>
      </div>
      <div className="space-y-4 pl-0 sm:pl-9">{children}</div>
    </section>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PhotoBlock({ label, inputValue, onInputChange, onAdd, images, onRemove }: {
  label: string; inputValue: string; onInputChange: (v: string) => void; onAdd: () => void;
  images: string[]; onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex gap-2">
        <Input value={inputValue} onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          placeholder="https://example.com/photo.jpg" />
        <Button type="button" variant="outline" onClick={onAdd}><Plus className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Add</span></Button>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {images.map((src, i) => (
            <div key={i} className="relative group aspect-[4/3] rounded-md overflow-hidden border bg-muted">
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onRemove(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
