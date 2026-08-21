import type { Metadata } from "next";
import { SwapButton } from "@/components/motion";
import { RouteStub } from "@/components/ui/route-stub";
import { practice } from "@/content/practice";

export const metadata: Metadata = {
  title: "Emergency Dentist | Park Place Dental",
  description: "Dealing with a dental emergency in Booneville, Mississippi? Call Park Place Dental directly.",
};

export default function EmergencyDentistPage() {
  return (
    <RouteStub
      title="Dental Emergency?"
      note="If you're in pain or dealing with an urgent dental issue, call us directly — don't wait on a form."
    >
      <div className="mt-8">
        <SwapButton variant="danger" href={practice.nap.phoneHref}>
          {`Call ${practice.nap.phone}`}
        </SwapButton>
      </div>
    </RouteStub>
  );
}
