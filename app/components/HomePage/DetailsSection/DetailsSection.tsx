"use client";

import { AspectRatio, Box, Card, Container, SimpleGrid, Text, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import classes from "./DetailsSection.module.css";

const data = [
  {
    title: "FAQs",
    image: "/images/faqs.png",
    description:
      "Find answers to frequently asked questions about our services, appointments, and policies. Get the information you need to make your experience smooth and enjoyable.",
    link: "/faqs",
  },
  {
    title: "Guidelines",
    image: "/images/guidelines.jpg",
    description:
      "Learn our studio guidelines to ensure a safe, comfortable, and seamless experience for everyone. Follow our tips to make the most out of your visit.",
    link: "/guidelines",
  },
  {
    title: "Reservation",
    image: "/images/reservation.jpg",
    description:
      "Reserve your preferred time slots quickly and securely online. Manage your appointments with ease and avoid any scheduling conflicts with our streamlined system.",
    link: "/reservation",
  },
];

const DetailsSection = () => {
  const cards = data.map((article) => (
    <Card
      key={article.title}
      p="md"
      radius="md"
      component={Link}
      href={article.link}
      className={classes.card}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Box
          style={{
            position: "relative",
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
          }}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Box>
      </AspectRatio>
      <Title order={4} my="lg" mb="xs">
        {article.title}
      </Title>
      <Text>{article.description}</Text>
    </Card>
  ));

  return (
    <Container py={80} fluid maw={1600}>
      <Title mb={24}>Helpful Information</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 0, sm: "md" }}>
        {cards}
      </SimpleGrid>
    </Container>
  );
};

export default DetailsSection;
