"use client";

import OAuth from "@/app/components/OAuth/OAuth";
import { SMALL_SCREEN } from "@/utils/constants";
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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  const smallScreen = useMediaQuery(SMALL_SCREEN);

  return (
    <Flex style={{ height: "100%" }}>
      {!smallScreen ? (
        <Box pos="relative" style={{ flex: 2 }}>
          <Image alt="background" fill src={"/images/background-2.jpg"} objectFit="cover" />
        </Box>
      ) : null}

      <Box style={{ flex: 1 }} miw={375}>
        <Container style={{ height: "100%" }} p={{ base: 50, sm: 150, md: "xl", lg: 60, xl: 90 }}>
          <Title>Log In to your Account</Title>
          <Stack mt="xl" gap="md">
            <TextInput label="Email Address" placeholder="Type your email" type="email" />
            <PasswordInput label="Password" placeholder="Type your password" />
            <Flex align="center" justify="flex-end">
              <Link href="/forgot-password" style={{ textDecoration: "none" }}>
                <Text c="blue" fz={14}>
                  Forgot Password
                </Text>
              </Link>
            </Flex>
            <Button mt="xl" h={40} radius={10}>
              Log In
            </Button>

            <OAuth />

            <Center>
              <Text fz={14} c="dimmed">
                Don’t have an account?{" "}
                <Link href="/sign-up" style={{ textDecoration: "none" }} color="blue">
                  Sign Up
                </Link>
              </Text>
            </Center>
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
};

export default LoginPage;
