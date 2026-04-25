import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HallForm } from "@/components/hall-form";
import { ArrowLeft, Copy, KeyRound } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/halls/new")({
  component: NewHallPage,
});

function NewHallPage() {
  const navigate = useNavigate();
  const [issued, setIssued] = useState<{ ownerId: string; ownerPin: string; hallId: string; name: string } | null>(null);

  if (issued) {
    const copy = (text: string, label: string) => {
      navigator.clipboard.writeText(text); toast.success(`${label} copied`);
    };
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-success" />
          </div>
          <h2 className="font-serif text-3xl mb-2">Hall added</h2>
          <p className="text-muted-foreground mb-6">"{issued.name}" is now in the system. Share these credentials with the owner.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6 text-left">
            <div className="rounded-md border bg-muted/40 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Owner ID</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl text-primary">{issued.ownerId}</span>
                <Button variant="ghost" size="sm" onClick={() => copy(issued.ownerId, "Owner ID")}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="rounded-md border bg-muted/40 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Owner PIN</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl text-gold">{issued.ownerPin}</span>
                <Button variant="ghost" size="sm" onClick={() => copy(issued.ownerPin, "PIN")}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/dashboard/halls/$hallId" params={{ hallId: issued.hallId }}>
              <Button>View hall</Button>
            </Link>
            <Link to="/dashboard/halls"><Button variant="outline">Back to halls</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <Link to="/dashboard/halls" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to halls
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Hall</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill the 7 sections below. Owner ID & PIN are generated on save.</p>
      </div>
      <HallForm
        mode="create"
        onSaved={(hall) => setIssued({ ownerId: hall.ownerId, ownerPin: hall.ownerPin, hallId: hall.id, name: hall.name })}
        onCancel={() => navigate({ to: "/dashboard/halls" })}
      />
    </div>
  );
}
