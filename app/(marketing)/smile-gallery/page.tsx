import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = {
  title: "Smile Gallery | Park Place Dental",
  description: "Before-and-after smile gallery from Park Place Dental — coming soon.",
};

export default function SmileGalleryPage() {
  return <RouteStub title="Smile Gallery" />;
}
