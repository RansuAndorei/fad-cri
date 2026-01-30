"use client";

import { insertError } from "@/app/actions";
import PasswordInputWithStrengthMeter from "@/app/sign-up/components/PasswordInputWithStrengthMeter";
import { useUserData } from "@/stores/useUserStore";
import { isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { SignUpFormValues } from "@/utils/types";
import {
  Box,
  Button,
  Container,
  Paper,
  PasswordInput,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { resetPassword } from "../actions";

const ResetPasswordPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const router = useRouter();
  const userData = useUserData();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formMethods = useForm<SignUpFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const handleResetPassword = async (data: SignUpFormValues) => {
    if (!userData) {
      notifications.show({
        message: "Unauthorized submission.",
        color: "red",
      });
      router.push("/log-in");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await resetPassword(supabaseClient, data.password);

      if (error?.message?.toLowerCase().includes("old password")) {
        notifications.show({
          message: "New password should be different from the old password.",
          color: "orange",
        });
        return;
      }

      notifications.show({
        message: "Password updated.",
        color: "green",
      });
      setIsSuccess(true);
      router.push("/user/booking-info");
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
            error_user_email: userData.email,
            error_user_id: userData.id,
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
                boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
              }}
            >
              <IconShieldCheck size={40} />
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
                        ${theme.colors.teal[5]} 0%,
                        ${theme.colors.green[5]} 100%
                      )`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    })}
                  >
                    Reset Password
                  </Title>
                  <Text
                    size="sm"
                    style={(theme) => ({
                      color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                    })}
                  >
                    Choose a strong password to secure your account.
                  </Text>
                </Stack>

                {/* Form */}
                <form onSubmit={handleSubmit(handleResetPassword)}>
                  <Stack gap="md">
                    <FormProvider {...formMethods}>
                      <PasswordInputWithStrengthMeter />
                    </FormProvider>
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword", {
                        required: "Confirm password field cannot be empty",
                        validate: (value, formValues) =>
                          value === formValues.password || "Your password does not match.",
                      })}
                    />

                    <Button mt="xl" h={40} radius={10} type="submit" loading={isLoading}>
                      Reset Password
                    </Button>
                  </Stack>
                </form>
              </Stack>
            ) : (
              /* Success State */
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
                    Password Reset!
                  </Title>
                  <Text
                    size="sm"
                    style={(theme) => ({
                      color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                    })}
                  >
                    Your password has been successfully reset.
                  </Text>
                </Stack>

                <Paper
                  p="md"
                  radius="md"
                  w="100%"
                  style={(theme) => ({
                    background: isDark ? "rgba(76, 175, 80, 0.1)" : "rgba(76, 175, 80, 0.05)",
                    border: `1px solid ${isDark ? theme.colors.green[9] : theme.colors.green[2]}`,
                  })}
                >
                  <Text size="sm" c="dimmed">
                    Redirecting to booking page...
                  </Text>
                  <Progress
                    value={100}
                    color="green"
                    size="xs"
                    radius="xl"
                    striped
                    animated
                    mt="sm"
                  />
                </Paper>

                <Button
                  component={Link}
                  href="/login"
                  variant="light"
                  color="green"
                  size="md"
                  radius="md"
                  fullWidth
                >
                  Go to Login Now
                </Button>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
