import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "BookMyHall — Admin Sign In" },
      { name: "description", content: "Admin panel for BookMyHall — manage halls, bookings and owners." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn()) navigate({ to: "/dashboard" });
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (auth.login(email, password)) {
      toast.success("Signed in");
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/40 border-r">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="text-[13px] font-semibold tracking-tight">
            BookMyHall
            <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Admin</span>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl xl:text-[2.25rem] font-semibold tracking-tight leading-[1.2] mb-3 text-foreground">
            Operations console for venue partners.
          </h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Onboard halls, issue owner credentials, review bookings and
            support customers — from one workspace.
          </p>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Authorised personnel only · v1.0
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-[13px] font-semibold tracking-tight">
              BookMyHall
              <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">Admin</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight mb-1">Sign in to admin</h2>
            <p className="text-sm text-muted-foreground">Use your administrator credentials.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email address</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9 h-10" required autoComplete="email" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-9 h-10" required autoComplete="current-password" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 font-medium">
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div className="rounded border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-0.5">Demo credentials</div>
              <div className="font-mono text-[11px] text-foreground/80">{ADMIN_EMAIL} · {ADMIN_PASSWORD}</div>
            </div>
          </form>

          <p className="mt-10 text-[11px] text-muted-foreground text-center">
            © 2026 BookMyHall · Internal use only
          </p>
        </div>
      </div>
    </div>
  );
}
