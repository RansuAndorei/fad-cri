"use client";

import { checkIfEmailExists } from "@/api/get";
import { insertError, signUpUser } from "@/api/post";
import DownloadButton from "@/app/components/DownloadButton/DownloadButton";
import OAuth from "@/app/components/OAuth/OAuth";
import { SMALL_SCREEN } from "@/utils/constants";
import { Database } from "@/utils/database";
import { SignUpFormValues } from "@/utils/types";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { isError } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import validator from "validator";
import PasswordInputWithStrengthMeter from "./PasswordInputWithStrengthMeter";

const SignUpPage = () => {
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();
  const pathname = usePathname();
  const smallScreen = useMediaQuery(SMALL_SCREEN);

  const [isLoading, setIsLoading] = useState(false);

  const signUpFormMethods = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAndCondition: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signUpFormMethods;

  const handleSignUp = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      const isEmailExists = await checkIfEmailExists(supabaseClient, {
        email: data.email,
      });
      if (isEmailExists) {
        notifications.show({
          message: "Email already registered and onboarded.",
          color: "orange",
          autoClose: false,
        });
        setIsLoading(false);
        return;
      }

      const { data: newUserData, customError } = await signUpUser(supabaseClient, {
        email: data.email,
        password: data.password,
      });
      if (customError) throw customError;

      notifications.show({
        message: "Confirmation email sent. Please check your email inbox to proceed.",
        color: "green",
        autoClose: false,
      });
      router.push(`/sign-up/success?confirmationId=${newUserData.user?.id}&email=${data.email}`);
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableRow: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleSignUp",
          },
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Flex style={{ height: "100%" }}>
      {!smallScreen ? (
        <Box pos="relative" style={{ flex: 2 }}>
          <Image alt="background" fill src={"/background.jpg"} objectFit="cover" />
        </Box>
      ) : null}

      <Box style={{ flex: 1 }} miw={375}>
        <Container style={{ height: "100%" }} p={{ base: 50, sm: 150, md: "xl", lg: 60, xl: 90 }}>
          <Title>Sign Up to your Account</Title>
          <form onSubmit={handleSubmit(handleSignUp)}>
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
              <FormProvider {...signUpFormMethods}>
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
              <Checkbox
                label="I Accept the Terms and Conditions"
                styles={{
                  root: { cursor: "pointer" },
                  label: { cursor: "pointer" },
                  input: { cursor: "pointer" },
                }}
                error={errors.termsAndCondition?.message}
                {...register("termsAndCondition", {
                  required: "You must accept the terms and conditions.",
                })}
              />
              <Button mt="xl" h={40} radius={10} type="submit" loading={isLoading}>
                Sign Up
              </Button>

              <OAuth />

              <Center>
                <Text fz={14} c="dimmed">
                  Already have an account?{" "}
                  <Link href="/log-in" style={{ textDecoration: "none" }} color="blue">
                    Log In
                  </Link>
                </Text>
              </Center>

              <DownloadButton />
            </Stack>
          </form>
        </Container>
      </Box>
    </Flex>
  );
};

export default SignUpPage;
