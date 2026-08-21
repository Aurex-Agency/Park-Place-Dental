import type { Metadata } from "next";
import { SwapButton } from "@/components/motion";
import { RouteStub } from "@/components/ui/route-stub";
import { practice } from "@/content/practice";

export const metadata: Metadata = {
  title: "Contact | Park Place Dental",
  description: "Contact Park Place Dental in Booneville, Mississippi.",
};

export default function ContactPage() {
  return (
    <RouteStub
      title="Contact"
      note="The appointment request form is coming in a later phase. For now, the fastest way to reach us is by phone."
    >
      <div className="mt-8 flex flex-col items-center gap-4">
        <SwapButton variant="primary" href={practice.nap.phoneHref}>
          {`Call ${practice.nap.phone}`}
        </SwapButton>
        <p className="max-w-[50ch] text-small text-ink/60">{practice.bookingDisclaimer}</p>
      </div>
    </RouteStub>
  );
}
