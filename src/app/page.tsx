import Hero from "@/components/Hero";
import PopularProperties from "@/components/PopularProperties";
import Cities from "@/components/Cities";
import Testimonial from "@/components/Testimonial";
import PartnersCTA from "@/components/PartnersCTA";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <PopularProperties />
      <Cities />
      <Testimonial />
      <PartnersCTA />
    </main>
  );
}
