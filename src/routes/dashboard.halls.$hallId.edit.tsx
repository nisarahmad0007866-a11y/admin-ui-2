import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { HallForm } from "@/components/hall-form";
import { useHalls } from "@/hooks/use-store";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/halls/$hallId/edit")({
  component: EditHallPage,
});

function EditHallPage() {
  const { hallId } = useParams({ from: "/dashboard/halls/$hallId/edit" });
  const navigate = useNavigate();
  const hall = useHalls().find(h => h.id === hallId);

  if (!hall) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-serif text-3xl mb-3">Hall not found</h2>
        <Link to="/dashboard/halls"><Button variant="outline">Back to halls</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <Link to="/dashboard/halls/$hallId" params={{ hallId: hall.id }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to hall
      </Link>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Edit</div>
        <h1 className="font-serif text-4xl">{hall.name}</h1>
      </div>
      <HallForm
        mode="edit"
        existing={hall}
        onSaved={(saved) => navigate({ to: "/dashboard/halls/$hallId", params: { hallId: saved.id } })}
        onCancel={() => navigate({ to: "/dashboard/halls/$hallId", params: { hallId: hall.id } })}
      />
    </div>
  );
}
