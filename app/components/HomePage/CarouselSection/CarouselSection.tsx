"use client";

import { Carousel } from "@mantine/carousel";
import { Box, Button, Container, Paper, Text, Title } from "@mantine/core";

const data = [
  {
    image: "/images/carousel-1.jpg",
    title: "Donec turpis",
    category: "Cras",
    textColor: "black",
    buttonColor: ["blue", "cyan"],
  },
  {
    image: "/images/carousel-2.jpg",
    title: "Aliquam orci massa",
    category: "Aliquam",
    textColor: "white",
    buttonColor: ["red", "orange"],
  },
  {
    image: "/images/carousel-3.jpg",
    title: "Ut cursus nisi vitae",
    category: "Nulla",
    textColor: "white",
    buttonColor: ["green", "lime"],
  },
  {
    image: "/images/carousel-4.jpg",
    title: "Suspendisse ac orci",
    category: "Quisque",
    textColor: "black",
    buttonColor: ["pink", "grape"],
  },
  {
    image: "/images/carousel-5.jpg",
    title: "Maecenas suscipit",
    category: "Vestibulum",
    textColor: "black",
    buttonColor: ["red", "pink"],
  },
];

type CardProps = {
  image: string;
  title: string;
  category: string;
  textColor: string;
  buttonColor: string[];
};

const Card = ({ image, title, category, textColor, buttonColor }: CardProps) => {
  return (
    <Paper
      shadow="md"
      p="xl"
      style={{
        backgroundImage: `url(${image})`,
        height: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundSize: "cover",
        backgroundPosition: "center",
        userSelect: "none",
      }}
    >
      <Box>
        <Text
          style={{
            color: textColor,
            textTransform: "uppercase",
          }}
        >
          {category}
        </Text>
        <Title
          style={{
            color: textColor,
          }}
        >
          {title}
        </Title>
      </Box>
      <Button variant="gradient" gradient={{ from: buttonColor[0], to: buttonColor[1], deg: 90 }}>
        View
      </Button>
    </Paper>
  );
};

const CarouselSection = () => {
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Container py={80} fluid maw={1200}>
      <Title mb={24}>Ut non vulputate massa</Title>
      <Carousel
        slideSize={{ base: "100%", sm: "50%", md: "50%", lg: "33.33%" }}
        slideGap={2}
        emblaOptions={{ align: "start", slidesToScroll: 1, loop: true, dragFree: true }}
        controlSize={50}
      >
        {slides}
      </Carousel>
    </Container>
  );
};

export default CarouselSection;
