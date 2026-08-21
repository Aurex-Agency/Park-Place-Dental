import type { Metadata } from "next";
import { RouteStub } from "@/components/ui/route-stub";

export const metadata: Metadata = {
  title: "New Patients | Park Place Dental",
  description: "What to expect as a new patient at Park Place Dental — coming soon.",
};

export default function NewPatientsPage() {
  return <RouteStub title="New Patients" />;
}
