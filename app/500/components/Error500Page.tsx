"use client";

import {
  Box,
  Button,
  Container,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBug,
  IconHome,
  IconSparkles,
  IconTools,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error500Page = () => {
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  return (
    <Box
      style={(theme) => ({
        minHeight: "100vh",
        background: isDark
          ? `linear-gradient(
                180deg,
                ${theme.colors.dark[8]} 0%,
                ${theme.colors.dark[7]} 50%,
                ${theme.colors.dark[6]} 100%
              )`
          : `linear-gradient(
                180deg,
                ${theme.colors.red[0]} 0%,
                ${theme.colors.orange[0]} 50%,
                ${theme.colors.yellow[0]} 100%
              )`,
        display: "flex",
        alignItems: "center",
      })}
    >
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl">
          {/* 500 Display */}
          <Text
            ta="center"
            style={(theme) => ({
              fontSize: 180,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.05em",

              backgroundImage: isDark
                ? `linear-gradient(
            135deg,
            ${theme.colors.red[4]},
            ${theme.colors.orange[4]},
            ${theme.colors.yellow[3]}
          )`
                : `linear-gradient(
            135deg,
            ${theme.colors.red[6]},
            ${theme.colors.orange[5]},
            ${theme.colors.yellow[4]}
          )`,

              backgroundClip: "text",
              WebkitBackgroundClip: "text",

              color: "transparent",
              WebkitTextFillColor: "transparent",

              // prevents repaint glitch on theme switch
              willChange: "background",
            })}
          >
            500
          </Text>

          {/* Header */}
          <Stack align="center" gap="md" mb="xl">
            <Group gap="xs">
              <ThemeIcon size={40} radius="xl" variant={isDark ? "filled" : "light"} color="red">
                <IconAlertTriangle size={22} />
              </ThemeIcon>

              <Title
                order={1}
                ta="center"
                style={(theme) => ({
                  fontSize: 48,
                  fontWeight: 800,
                  color: isDark ? theme.colors.red[4] : theme.colors.red[8],
                })}
              >
                Server Error
              </Title>
            </Group>

            <Text
              size="xl"
              ta="center"
              maw={600}
              style={(theme) => ({
                lineHeight: 1.7,
                color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
              })}
            >
              Oops! Something went wrong on our end. Don&apos;t worry, it&apos;s not you, it&apos;s
              us. Our team has been notified and we&apos;re working on a fix!
            </Text>
          </Stack>

          {/* Action Buttons */}
          <Group gap="md" mb="xl">
            <Button
              size="lg"
              radius="xl"
              leftSection={<IconArrowLeft size={20} />}
              onClick={() => router.back()}
              variant="gradient"
              gradient={{ from: "orange", to: "red", deg: 135 }}
              styles={{
                root: {
                  padding: "12px 32px",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                },
              }}
            >
              Go Back
            </Button>

            <Button
              component={Link}
              href="/"
              size="lg"
              radius="xl"
              leftSection={<IconHome size={20} />}
              variant="gradient"
              gradient={{ from: "yellow", to: "orange", deg: 135 }}
              styles={{
                root: {
                  padding: "12px 32px",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                },
              }}
            >
              Home Page
            </Button>
          </Group>

          {/* Troubleshooting Tips */}
          <Paper
            p="xl"
            radius="xl"
            w="100%"
            maw={700}
            style={(theme) => ({
              background: isDark ? theme.colors.dark[6] : "rgba(255, 255, 255, 0.9)",
              border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.orange[2]}`,
            })}
          >
            <Stack gap="md">
              <Group>
                <ThemeIcon size={50} radius="xl" variant="light" color="orange">
                  <IconTools size={26} />
                </ThemeIcon>
                <Box>
                  <Text
                    fw={700}
                    size="lg"
                    style={(theme) => ({
                      color: isDark ? theme.colors.orange[4] : theme.colors.orange[8],
                    })}
                  >
                    What you can try:
                  </Text>
                  <Text
                    size="sm"
                    style={(theme) => ({
                      color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                    })}
                  >
                    While we fix this issue
                  </Text>
                </Box>
              </Group>

              <List
                spacing="sm"
                size="md"
                icon={
                  <ThemeIcon size={24} radius="xl" variant="light" color="orange">
                    <IconBug size={14} />
                  </ThemeIcon>
                }
                style={(theme) => ({
                  color: isDark ? theme.colors.gray[4] : theme.colors.gray[7],
                })}
              >
                <List.Item>Refresh the page or try again in a few moments</List.Item>
                <List.Item>Clear your browser cache and cookies</List.Item>
                <List.Item>Try accessing the page from a different browser</List.Item>
                <List.Item>Check your internet connection</List.Item>
              </List>
            </Stack>
          </Paper>

          {/* Fun Message */}
          <Box
            p="xl"
            style={(theme) => ({
              background: isDark ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.orange[2]}`,
            })}
          >
            <Group gap="xs" justify="center">
              <IconSparkles size={24} color="var(--mantine-color-orange-5)" />

              <Text
                size="lg"
                fw={600}
                ta="center"
                style={(theme) => ({
                  background: `linear-gradient(
                    135deg,
                    ${theme.colors.orange[5]} 0%,
                    ${theme.colors.red[5]} 100%
                  )`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                })}
              >
                Even the best manicures need a little touch-up sometimes! We&apos;ll have this fixed
                soon. 💅
              </Text>

              <IconSparkles size={24} color="var(--mantine-color-red-5)" />
            </Group>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Error500Page;
