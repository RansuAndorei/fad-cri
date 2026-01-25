"use client";

import { insertError } from "@/app/actions";
import OAuth from "@/app/components/OAuth/OAuth";
import { SMALL_SCREEN } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { LogInFormValues } from "@/utils/types";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { signInUser } from "../actions";
import { isAppError } from "@/utils/functions";

const LoginPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const router = useRouter();
  const smallScreen = useMediaQuery(SMALL_SCREEN);
  const { colorScheme } = useMantineColorScheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const isFromBooking = searchParams.get("booking");
  const isDark = colorScheme === "dark";
  const overlayColor = isDark ? 85 : 256;

  const formMethods = useForm<LogInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (isFromBooking) {
      notifications.clean();
      notifications.show({
        title: "Note!",
        color: "cyan",
        message: "To book an appointment, you need to log in or create an account first.",
      });
    }
  }, [isFromBooking]);

  const handleLogin = async (data: LogInFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await signInUser(supabaseClient, {
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          notifications.show({
            message: "Invalid login credentials.",
            color: "red",
          });
          setIsLoading(false);
          return;
        } else if (error.message.toLowerCase().includes("authapierror: email not confirmed")) {
          notifications.show({
            message:
              "You need to verify your email first before proceeding to formsly. If you don't received the verification email, you can try to sign up again",
            color: "orange",
            autoClose: false,
          });
          setIsLoading(false);
          return;
        } else throw error;
      }

      notifications.show({
        message: "Sign in successful.",
        color: "green",
      });

      router.push("/user/onboarding");
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      setIsLoading(false);
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleLogin",
          },
        });
      }
    }
  };

  return (
    <Flex style={{ height: "100%" }}>
      {!smallScreen ? (
        <Box pos="relative" style={{ flex: 2 }}>
          <Image
            alt="background"
            fill
            src="/images/login.jpg"
            style={{ objectFit: "cover" }}
            priority
          />

          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              backgroundColor: `rgba(${overlayColor}, ${overlayColor}, ${overlayColor}, 0.2)`,
              zIndex: 1,
            }}
          />
        </Box>
      ) : null}

      <Box style={{ flex: 1 }} miw={375}>
        <Container style={{ height: "100%" }} p={{ base: 50, sm: 150, md: "xl", lg: 60, xl: 90 }}>
          <Title>Log In to your Account</Title>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack mt="xl" gap="md">
              <TextInput
                label="Email Address"
                placeholder="Type your email"
                type="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email field cannot be empty",
                  validate: (value) => validator.isEmail(value) || "Email is invalid.",
                })}
              />
              <PasswordInput
                label="Password"
                placeholder="Type your password"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password field cannot be empty",
                })}
              />
              <Flex align="center" justify="flex-end">
                <Link href="/forgot-password" style={{ textDecoration: "none" }}>
                  <Text c="blue" fz={14}>
                    Forgot Password
                  </Text>
                </Link>
              </Flex>
              <Button mt="xl" h={40} radius={10} type="submit" loading={isLoading}>
                Log In
              </Button>

              <OAuth />

              <Center>
                <Text fz={14} c="dimmed">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" style={{ textDecoration: "none" }} color="blue">
                    Sign Up
                  </Link>
                </Text>
              </Center>
            </Stack>
          </form>
        </Container>
      </Box>
    </Flex>
  );
};

export default LoginPage;
