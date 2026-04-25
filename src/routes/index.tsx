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
    setTimeout(() => {
      if (auth.login(email, password)) {
        toast.success("Welcome back, Admin");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gold flex items-center justify-center">
            <Building2 className="h-5 w-5 text-sidebar" />
          </div>
          <div>
            <div className="font-serif text-xl">BookMyHall</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Admin Console</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Operations</div>
          <h1 className="font-serif text-5xl leading-[1.05] mb-6">
            Manage every hall.<br />Confirm every booking.
          </h1>
          <p className="text-sidebar-foreground/70 leading-relaxed">
            A single, professional console to add halls, issue owner credentials,
            review bookings and support customers — all in one place.
          </p>
        </div>

        <div className="text-xs text-sidebar-foreground/50 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-gold" />
          Authorised personnel only · v1.0
        </div>

        <div aria-hidden className="absolute -right-32 -bottom-32 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-serif text-xl">BookMyHall</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Console</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl mb-2">Sign in</h2>
            <p className="text-sm text-muted-foreground">Use your admin email and password to continue.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 font-medium">
              {loading ? "Signing in…" : "Sign in to console"}
            </Button>

            <div className="rounded-md border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Demo credentials</div>
              <div>Email: <span className="font-mono">{ADMIN_EMAIL}</span></div>
              <div>Password: <span className="font-mono">{ADMIN_PASSWORD}</span></div>
            </div>
          </form>

          <p className="mt-8 text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:text-foreground">© {new Date().getFullYear()} BookMyHall · Admin Panel</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
