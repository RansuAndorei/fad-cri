import { Container } from "@mantine/core";
import CarouselSection from "./CarouselSection/CarouselSection";
import DetailsSection from "./DetailsSection/DetailsSection";
import DividerSection from "./DividerSection/DividerSection";
import HeroSection from "./HeroSection/HeroSection";
import ServicesSection from "./ServicesSection/ServicesSection";
import TestimonialsSection from "./TestimonialsSection/TestimonialsSection";

type Props = {
  serviceList: string[];
};

const HomePage = ({ serviceList }: Props) => {
  return (
    <Container fluid px={0}>
      <HeroSection />
      <ServicesSection serviceList={serviceList} />
      <DividerSection />
      <CarouselSection />
      <TestimonialsSection />
      <DetailsSection />
    </Container>
  );
};

export default HomePage;
