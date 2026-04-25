import { createFileRoute, Link } from "@tanstack/react-router";
import { useHalls } from "@/hooks/use-store";
import { formatINR, hallTypeLabel, store } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, Users, Power, Trash2, Pencil, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/halls/")({
  component: HallsListPage,
});

function HallsListPage() {
  const halls = useHalls();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "wedding" | "lawn" | "banquet" | "inactive">("all");

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
            <Button size="sm" className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-1.5" />Add hall</Button>
          </Link>
        }
      />

      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, city or owner…" className="pl-9 h-10" />
        </div>
        <Tabs value={filter} onValueChange={v => setFilter(v as typeof filter)} className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="wedding">Wedding</TabsTrigger>
            <TabsTrigger value="lawn">Lawn</TabsTrigger>
            <TabsTrigger value="banquet">Banquet</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-lg font-semibold mb-2">No halls found</div>
          <p className="text-sm text-muted-foreground mb-6">Try a different search, or add your first hall.</p>
          <Link to="/dashboard/halls/new">
            <Button><Plus className="h-4 w-4 mr-2" />Add hall</Button>
          </Link>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map(h => {
          const cover = h.indoorImages[0] || h.outdoorImages[0];
          return (
            <Card key={h.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[16/10] bg-muted relative">
                {cover ? (
                  <img src={cover} alt={h.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground border-0">{hallTypeLabel(h.type)}</Badge>
                  {!h.active && <Badge variant="outline" className="bg-background/95">Inactive</Badge>}
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
                    <Button variant="outline" size="sm" className="w-full"><Eye className="h-3.5 w-3.5 mr-1" />View</Button>
                  </Link>
                  <Link to="/dashboard/halls/$hallId/edit" params={{ hallId: h.id }}>
                    <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => { store.toggleActive(h.id); toast.success(h.active ? "Deactivated" : "Activated"); }}>
                    <Power className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this hall?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove "{h.name}" and all its bookings. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { store.deleteHall(h.id); toast.success("Hall deleted"); }} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
