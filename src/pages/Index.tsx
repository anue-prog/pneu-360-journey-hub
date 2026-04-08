import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ServicesFullscreen from "@/components/home/ServicesFullscreen";
import ReifenFullscreen from "@/components/home/ReifenFullscreen";
import FelgenFullscreen from "@/components/home/FelgenFullscreen";
import UeberUns from "@/components/home/UeberUns";
import ReviewsSection from "@/components/home/ReviewsSection";
import ProcessSection from "@/components/home/ProcessSection";
import LocationsTeaser from "@/components/home/LocationsTeaser";
import ImageDivider from "@/components/home/ImageDivider";
import heroRoad from "@/assets/hero-road-dusk.webp";
import homeFelge from "@/assets/home-felge-detail.jpg";

const Index = () => {
  useEffect(() => {
    document.title = "Pneu 360 – Rundum Service ohne Termin | Oftringen & Langenthal";
  }, []);

  return (
    <>
      <Hero />
      <Marquee />
      <ServicesFullscreen />
      <ImageDivider src={heroRoad} alt="Strasse bei Dämmerung" />
      <ReifenFullscreen />
      <FelgenFullscreen />
      <ImageDivider src={homeFelge} alt="Felgen Detail" />
      <UeberUns />
      <ReviewsSection />
      <ProcessSection />
      <LocationsTeaser />
    </>
  );
};

export default Index;
