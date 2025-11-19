import Hero from "@/components/Hero";
import TrySearchingFor from "@/components/TrySearchingFor";
import PopularProperties from "@/components/PopularProperties";
import Cities from "@/components/Cities";
import Testimonial from "@/components/Testimonial";
import PartnersCTA from "@/components/PartnersCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrySearchingFor />
      <PopularProperties />
      <Cities />
      <PartnersCTA />
    </main>
  );
}
