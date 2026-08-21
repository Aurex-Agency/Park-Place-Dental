import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = {
  title: "About | Park Place Dental",
  description: "About Park Place Dental in Booneville, Mississippi — coming soon.",
};

export default function AboutPage() {
  return <RouteStub title="About" />;
}
