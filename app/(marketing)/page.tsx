import { Comfort } from "@/components/sections/comfort";
import { CtaFooter } from "@/components/sections/cta-footer";
import { FirstVisit } from "@/components/sections/first-visit";
import { Hero } from "@/components/sections/hero";
import { Insurance } from "@/components/sections/insurance";
import { Location } from "@/components/sections/location";
import { MeetDentist } from "@/components/sections/meet-dentist";
import { Services } from "@/components/sections/services";
import { Team } from "@/components/sections/team";
import { TrustStrip } from "@/components/sections/trust-strip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Comfort />
      <FirstVisit />
      <Services />
      <MeetDentist />
      <Team />
      <Insurance />
      <Location />
      <CtaFooter />
    </>
  );
}
