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
      <div className="p-4 sm:p-6 lg:p-10 max-w-2xl mx-auto">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b">
            <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center shrink-0">
              <KeyRound className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Hall onboarded</h2>
              <p className="text-xs text-muted-foreground">"{issued.name}" is live. Share these credentials with the owner securely.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className="rounded border bg-muted/30 p-3.5">
              <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium mb-1.5">Owner ID</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-semibold tabular-nums">{issued.ownerId}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copy(issued.ownerId, "Owner ID")}><Copy className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="rounded border bg-muted/30 p-3.5">
              <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium mb-1.5">Owner PIN</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-semibold tabular-nums">{issued.ownerPin}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copy(issued.ownerPin, "PIN")}><Copy className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/dashboard/halls/$hallId" params={{ hallId: issued.hallId }} className="flex-1">
              <Button className="w-full">View hall</Button>
            </Link>
            <Link to="/dashboard/halls" className="flex-1"><Button variant="outline" className="w-full">Back to halls</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24">
      <Link to="/dashboard/halls" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to halls
      </Link>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Add hall</h1>
        <p className="text-sm text-muted-foreground mt-1">Owner ID & PIN are generated on save.</p>
      </div>
      <HallForm
        mode="create"
        onSaved={(hall) => setIssued({ ownerId: hall.ownerId, ownerPin: hall.ownerPin, hallId: hall.id, name: hall.name })}
        onCancel={() => navigate({ to: "/dashboard/halls" })}
      />
    </div>
  );
}
