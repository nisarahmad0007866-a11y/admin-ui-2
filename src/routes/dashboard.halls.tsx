import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/halls")({
  component: HallsLayout,
});

function HallsLayout() {
  const path = useRouterState({ select: s => s.location.pathname });
  // Render outlet only — children handle their own headers
  return <Outlet />;
}

// keep Link import to ensure tree-shaking doesn't drop typing
void Link;
