import { AspectRatio, Box, Card, Container, Image, SimpleGrid, Text, Title } from "@mantine/core";
import classes from "./DetailsSection.module.css";

const data = [
  {
    title: "FAQs",
    image: "/images/faqs.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie tellus et justo gravida vulputate. In hac habitasse platea dictumst. Vestibulum sed suscipit tellus. Etiam id turpis neque.",
  },
  {
    title: "Guidelines",
    image: "/images/guidelines.jpg",
    description:
      "Nulla maximus aliquam libero, a facilisis ipsum commodo et. Phasellus feugiat nec leo ut ullamcorper. Vestibulum placerat ipsum tellus, quis dictum enim egestas vitae.",
  },
  {
    title: "Reservation",
    image: "/images/reservation.jpg",
    description:
      "Morbi volutpat blandit ullamcorper. Integer odio orci, finibus sit amet enim ac, vulputate consectetur nisi. Donec vitae leo at magna tempor ornare.",
  },
];

const DetailsSection = () => {
  const cards = data.map((article) => (
    <Card key={article.title} p="md" radius="md" component="a" href="#" className={classes.card}>
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
      <Title mb={24}>Aliquam malesuada</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 0, sm: "md" }}>
        {cards}
      </SimpleGrid>
    </Container>
  );
};

export default DetailsSection;
