"use client";

import {
  Box,
  Flex,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";

const data = [
  {
    name: "Marilene R.",
    review:
      "Proin porta sapien ut ex tincidunt vehicula. Sed fermentum pellentesque turpis, nec bibendum lectus scelerisque eget.",
  },
  {
    name: "Luanna R.",
    review: "Mauris ac fringilla ex. Nunc vitae dui id quam blandit dignissim.",
  },
  {
    name: "Christa D.",
    review:
      "Donec luctus purus accumsan euismod molestie. Donec ut iaculis nisi. Suspendisse potenti. Quisque tristique nunc magna.",
  },
];

const TestimonialsSection = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";

  const gradientColor = isDark
    ? [theme.colors.cyan[9], theme.colors.gray[8]]
    : [theme.colors.cyan[1], theme.colors.gray[1]];

  const fiveStar = () => (
    <Flex align="center" justify="center">
      {Array.from({ length: 5 }, (_, i) => (
        <IconStarFilled color={theme.colors.yellow[isDark ? 9 : 6]} size={24} key={i} />
      ))}
    </Flex>
  );

  return (
    <Box
      style={{
        background: `linear-gradient(to bottom, ${gradientColor[0]}, ${gradientColor[1]})`,
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <Title order={2} mb={40}>
        What Our Clients Say
      </Title>
      <Flex justify="center" gap="xl" wrap="wrap">
        {data.map(({ name, review }, index) => (
          <Stack key={index} maw={600} gap="xs">
            <Flex align="center" justify="center">
              {fiveStar()}
            </Flex>
            <Text>{review}</Text>
            <Title order={3}>- {name}</Title>
          </Stack>
        ))}
      </Flex>
    </Box>
  );
};

export default TestimonialsSection;
