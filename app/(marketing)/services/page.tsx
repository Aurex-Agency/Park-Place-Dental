import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = {
  title: "Services | Park Place Dental",
  description: "Dental services offered at Park Place Dental in Booneville, Mississippi — coming soon.",
};

export default function ServicesPage() {
  return <RouteStub title="Services" />;
}
