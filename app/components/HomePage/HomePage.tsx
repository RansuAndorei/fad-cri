import { Container } from "@mantine/core";
import CarouselSection from "./CarouselSection/CarouselSection";
import DetailsSection from "./DetailsSection/DetailsSection";
import DividerSection from "./DividerSection/DividerSection";
import HeroSection from "./HeroSection/HeroSection";
import ServicesSection from "./ServicesSection/ServicesSection";
import TestimonialsSection from "./TestimonialsSection/TestimonialsSection";

const HomePage = () => {
  return (
    <Container fluid px={0}>
      <HeroSection />
      <ServicesSection />
      <DividerSection />
      <CarouselSection />
      <TestimonialsSection />
      <DetailsSection />
    </Container>
  );
};

export default HomePage;
