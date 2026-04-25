import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { auth, store } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      store.init();
      if (!auth.isLoggedIn()) throw redirect({ to: "/" });
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
