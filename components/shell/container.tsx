import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[var(--container-max)] px-gutter ${className ?? ""}`}>{children}</div>;
}
