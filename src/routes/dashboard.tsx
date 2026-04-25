import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { auth, store } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    store.init();
    if (typeof window !== "undefined" && !auth.isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
