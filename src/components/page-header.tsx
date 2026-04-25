import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Standard admin page header — clean, sans-serif, professional.
 * Replaces magazine-style "eyebrow + serif" headers across the app.
 */
export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
