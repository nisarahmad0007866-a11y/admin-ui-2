import { createFileRoute, Link } from "@tanstack/react-router";
import { useHalls } from "@/hooks/use-store";
import { formatINR, hallTypeLabel, store } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, Users, Power, Trash2, Pencil, Eye } from "@/components/icons";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/halls/")({
  component: HallsListPage,
});

function HallsListPage() {
  const halls = useHalls();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "wedding" | "lawn" | "banquet" | "inactive">("all");
  const filters = ["all", "wedding", "lawn", "banquet", "inactive"] as const;

  const filtered = useMemo(() => {
    return halls.filter(h => {
      if (filter === "inactive" && h.active) return false;
      if (filter !== "all" && filter !== "inactive" && h.type !== filter) return false;
      if (q && !`${h.name} ${h.city} ${h.ownerName}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [halls, q, filter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Halls"
        description="Add, edit, activate or remove halls."
        actions={
          <Link to="/dashboard/halls/new">
            <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" />Add hall</span>
          </Link>
        }
      />

      <div className="mb-5 flex flex-col items-stretch gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, city or owner…" className="pl-9 h-10" />
        </div>
        <div className="overflow-x-auto">
          <div className="inline-flex h-9 w-max items-center rounded-lg bg-muted p-1 text-muted-foreground">
            {filters.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ${filter === value ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
              >
                {value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <div className="text-lg font-semibold mb-2">No halls found</div>
          <p className="text-sm text-muted-foreground mb-6">Try a different search, or add your first hall.</p>
          <Link to="/dashboard/halls/new">
            <span className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" />Add hall</span>
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map(h => {
          const cover = h.indoorImages[0] || h.outdoorImages[0];
          return (
            <div key={h.id} className="overflow-hidden rounded-lg border bg-card flex flex-col">
              <div className="aspect-[16/10] bg-muted relative">
                {cover ? (
                  <img src={cover.replace("w=1200", "w=640")} alt={h.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">{hallTypeLabel(h.type)}</span>
                  {!h.active && <span className="inline-flex items-center rounded-md border bg-background/95 px-2.5 py-0.5 text-xs font-semibold">Inactive</span>}
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="text-base font-semibold mb-1 truncate">{h.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{h.address}, {h.city}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{h.guests}</span>
                  <span>Day {formatINR(h.priceDay)}</span>
                  <span>Night {formatINR(h.priceNight)}</span>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Link to="/dashboard/halls/$hallId" params={{ hallId: h.id }} className="flex-1 min-w-[100px]">
                    <span className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent"><Eye className="h-3.5 w-3.5" />View</span>
                  </Link>
                  <Link to="/dashboard/halls/$hallId/edit" params={{ hallId: h.id }}>
                    <span className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></span>
                  </Link>
                  <button className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent" onClick={() => { store.toggleActive(h.id); toast.success(h.active ? "Deactivated" : "Activated"); }}>
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <button className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-medium text-destructive hover:bg-accent" onClick={() => { if (window.confirm(`Delete ${h.name}? This will remove its bookings too.`)) { store.deleteHall(h.id); toast.success("Hall deleted"); } }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
