"use client";

import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { IconArrowLeft, IconHome, IconSearch, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error404Page = () => {
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
                ${theme.colors.cyan[0]} 0%,
                ${theme.colors.yellow[0]} 50%,
                ${theme.colors.pink[0]} 100%
              )`,
        display: "flex",
        alignItems: "center",
      })}
    >
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl">
          {/* 404 */}
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
            ${theme.colors.cyan[4]},
            ${theme.colors.pink[4]},
            ${theme.colors.yellow[3]}
          )`
                : `linear-gradient(
            135deg,
            ${theme.colors.cyan[5]},
            ${theme.colors.pink[5]},
            ${theme.colors.yellow[4]}
          )`,

              backgroundClip: "text",
              WebkitBackgroundClip: "text",

              color: "transparent",
              WebkitTextFillColor: "transparent",

              // 🚑 prevents repaint glitch on theme switch
              willChange: "background",
            })}
          >
            404
          </Text>

          {/* Header */}
          <Stack align="center" gap="md" mb="xl">
            <Group gap="xs">
              <ThemeIcon size={40} radius="xl" variant={isDark ? "filled" : "light"} color="pink">
                <IconSearch size={22} />
              </ThemeIcon>

              <Title
                order={1}
                ta="center"
                style={(theme) => ({
                  fontSize: 48,
                  fontWeight: 800,
                  color: isDark ? theme.colors.cyan[3] : theme.colors.cyan[8],
                })}
              >
                Page Not Found
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
              Oops! Looks like this page got a fresh coat of polish and moved somewhere new.
              Let&apos;s get you back on track!
            </Text>
          </Stack>

          {/* Actions */}
          <Group gap="md" mb="xl">
            <Button
              size="lg"
              radius="xl"
              leftSection={<IconArrowLeft size={20} />}
              onClick={() => router.back()}
              variant="gradient"
              gradient={{ from: "cyan", to: "teal", deg: 135 }}
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
              gradient={{ from: "pink", to: "red", deg: 135 }}
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

          {/* Fun Message */}
          <Box
            p="xl"
            style={(theme) => ({
              background: isDark ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.pink[2]}`,
            })}
          >
            <Group gap="xs" justify="center">
              <IconSparkles size={24} color="var(--mantine-color-pink-5)" />

              <Text
                size="lg"
                fw={600}
                ta="center"
                style={(theme) => ({
                  background: `linear-gradient(
                    135deg,
                    ${theme.colors.cyan[5]} 0%,
                    ${theme.colors.pink[5]} 100%
                  )`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                })}
              >
                Don&apos;t worry, your nails can still look fabulous! Book an appointment today! 💅
              </Text>

              <IconSparkles size={24} color="var(--mantine-color-cyan-5)" />
            </Group>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Error404Page;
