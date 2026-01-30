"use client";

import { insertError } from "@/app/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconLock,
  IconMail,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sendResetPasswordEmail } from "../actions";

const ForgotPasswordPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendResetPasswordEmail(supabaseClient, email);
      notifications.show({
        message: "Please check your email inbox.",
        color: "green",
        withCloseButton: true,
        autoClose: false,
      });

      setIsSuccess(true);
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleResetPassword",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      style={(theme) => ({
        minHeight: "50vh",
        background: `linear-gradient(135deg, ${
          theme.colors.cyan[isDark ? 3 : 0]
        } 0%, ${theme.colors.yellow[isDark ? 9 : 0]} 100%)`,

        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <Container size="xs" py={80}>
        <Stack align="center" gap="xl">
          {/* Logo/Icon */}
          <Box
            style={{
              animation: "fadeInDown 0.6s ease-out",
            }}
          >
            <ThemeIcon
              size={80}
              radius="xl"
              variant="gradient"
              gradient={{ from: "cyan", to: "yellow", deg: 135 }}
              style={{
                boxShadow: "0 8px 32px rgba(0, 188, 212, 0.3)",
              }}
            >
              <IconLock size={40} />
            </ThemeIcon>
          </Box>

          {/* Main Card */}
          <Paper
            p={40}
            radius="xl"
            shadow="xl"
            w="100%"
            style={(theme) => ({
              background: isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isDark ? theme.colors.dark[4] : "rgba(255, 255, 255, 0.5)"}`,
              animation: "fadeInUp 0.6s ease-out 0.2s both",
            })}
          >
            {!isSuccess ? (
              <Stack gap="lg">
                {/* Header */}
                <Stack gap="xs" ta="center">
                  <Title
                    order={1}
                    style={(theme) => ({
                      fontSize: 32,
                      fontWeight: 800,
                      background: `linear-gradient(
                        135deg,
                        ${theme.colors.cyan[5]} 0%,
                        ${theme.colors.yellow[5]} 100%
                      )`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    })}
                  >
                    Forgot Password?
                  </Title>
                  <Text
                    size="sm"
                    style={(theme) => ({
                      color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                    })}
                  >
                    No worries! Enter your email and we&apos;ll send you reset instructions.
                  </Text>
                </Stack>

                <Stack gap="md">
                  {error && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      color="red"
                      radius="md"
                      variant="light"
                      styles={{
                        root: {
                          animation: "shake 0.5s ease-in-out",
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <TextInput
                    label="Email Address"
                    placeholder="your.email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    leftSection={<IconMail size={18} />}
                    size="md"
                    radius="md"
                    required
                    styles={(theme) => ({
                      input: {
                        borderWidth: 2,
                        transition: "all 0.2s ease",
                        "&:focus": {
                          borderColor: theme.colors.cyan[5],
                          boxShadow: `0 0 0 3px ${
                            isDark ? "rgba(0, 188, 212, 0.2)" : "rgba(0, 188, 212, 0.1)"
                          }`,
                        },
                      },
                    })}
                  />

                  <Button
                    type="submit"
                    size="md"
                    radius="md"
                    fullWidth
                    loading={isLoading}
                    leftSection={!isLoading && <IconMail size={18} />}
                    styles={(theme) => ({
                      root: {
                        background: `linear-gradient(
                            135deg,
                            ${theme.colors.cyan[5]} 0%,
                            ${theme.colors.yellow[5]} 100%
                          )`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(0, 188, 212, 0.3)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      },
                    })}
                    onClick={handleResetPassword}
                  >
                    Send Reset Link
                  </Button>
                </Stack>

                <Group justify="center" gap="xs">
                  <IconArrowLeft size={16} />
                  <Anchor
                    component={Link}
                    href="/log-in"
                    size="sm"
                    fw={600}
                    style={(theme) => ({
                      color: isDark ? theme.colors.cyan[4] : theme.colors.cyan[7],
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    })}
                  >
                    Back to Login
                  </Anchor>
                </Group>
              </Stack>
            ) : (
              <Stack gap="lg" align="center" ta="center">
                <Box
                  style={{
                    animation: "scaleIn 0.5s ease-out",
                  }}
                >
                  <ThemeIcon
                    size={80}
                    radius="xl"
                    variant="light"
                    color="green"
                    style={{
                      boxShadow: "0 8px 32px rgba(76, 175, 80, 0.2)",
                    }}
                  >
                    <IconCheck size={40} />
                  </ThemeIcon>
                </Box>

                <Stack gap="xs">
                  <Title
                    order={2}
                    style={(theme) => ({
                      color: isDark ? theme.colors.green[4] : theme.colors.green[7],
                    })}
                  >
                    Check Your Email!
                  </Title>
                  <Text
                    size="sm"
                    style={(theme) => ({
                      color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                    })}
                  >
                    We&apos;ve sent password reset instructions to:
                  </Text>
                  <Text
                    fw={600}
                    style={(theme) => ({
                      color: isDark ? theme.colors.cyan[4] : theme.colors.cyan[7],
                    })}
                  >
                    {email}
                  </Text>
                </Stack>

                <Box
                  p="md"
                  style={(theme) => ({
                    background: isDark ? "rgba(0, 188, 212, 0.1)" : "rgba(0, 188, 212, 0.05)",
                    borderRadius: theme.radius.md,
                    border: `1px solid ${isDark ? theme.colors.cyan[9] : theme.colors.cyan[2]}`,
                  })}
                >
                  <Stack gap="xs">
                    <Group gap="xs" justify="center">
                      <IconSparkles size={16} />
                      <Text size="sm" fw={600}>
                        What&apos;s next?
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Click the link in the email to reset your password. The link expires in 1
                      hour.
                    </Text>
                  </Stack>
                </Box>

                <Stack gap="sm" w="100%">
                  <Button
                    component={Link}
                    href="/log-in"
                    variant="light"
                    size="md"
                    radius="md"
                    fullWidth
                    leftSection={<IconArrowLeft size={18} />}
                  >
                    Back to Login
                  </Button>

                  <Text size="xs" c="dimmed" ta="center">
                    Didn&apos;t receive the email?{" "}
                    <Anchor
                      component="button"
                      type="button"
                      size="xs"
                      onClick={() => setIsSuccess(false)}
                      style={(theme) => ({
                        color: isDark ? theme.colors.cyan[4] : theme.colors.cyan[7],
                      })}
                    >
                      Try again
                    </Anchor>
                  </Text>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
