"use client";

import { Box, Button, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/navigation";

const DividerSection = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const gradientColor = isDark
    ? [theme.colors.cyan[9], theme.colors.gray[8]]
    : [theme.colors.cyan[1], theme.colors.gray[1]];

  return (
    <Box
      style={{
        background: `linear-gradient(to bottom, ${gradientColor[0]}, ${gradientColor[1]})`,
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <Title order={2} mb={20}>
        Phasellus maximus ultrices dolor.
      </Title>
      <Button variant="outline" onClick={() => router.push("/user/booking-info")}>
        Book an Appointment
      </Button>
    </Box>
  );
};

export default DividerSection;
