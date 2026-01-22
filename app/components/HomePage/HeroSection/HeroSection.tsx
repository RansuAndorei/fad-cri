"use client";

import { Box, Button, Text, Title, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";

const HeroSection = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const overlayColor = isDark ? 85 : 256;

  return (
    <Box
      style={{
        position: "relative",
        height: 610,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(/images/background.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(${overlayColor}, ${overlayColor}, ${overlayColor}, 0.4)`,
          zIndex: 1,
        }}
      />

      <Box style={{ zIndex: 2 }}>
        <Text size="xl" mb={8}>
          WELCOME TO FADCRI
        </Text>
        <Title mb={20}>We craft nails that are worth every cent.</Title>
        <Button component={Link} href="/user/booking-info">
          Book an Appointment
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
