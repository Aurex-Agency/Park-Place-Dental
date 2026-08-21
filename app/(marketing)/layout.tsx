import type { ReactNode } from "react";
import { Shell } from "@/components/shell/shell";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
