"use client";

import { insertError } from "@/app/actions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Button,
  Center,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmailResendTimer } from "../../actions";
import { resendEmail } from "../actions";
import { isAppError } from "@/utils/functions";

const SignUpSuccessPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchResendData = async () => {
      try {
        setIsFetching(true);
        if (!emailQuery || typeof emailQuery !== "string") throw new Error();
        const data = await getEmailResendTimer(supabaseClient, { email: emailQuery });

        setTimer(data);
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
              error_function: "fetchResendData",
            },
          });
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchResendData();
  }, [emailQuery]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      if (!emailQuery || typeof emailQuery !== "string") throw new Error();

      const { error } = await supabaseClient.auth.resend({
        type: "signup",
        email: emailQuery,
      });
      if (error) throw error;

      await resendEmail(supabaseClient, { email: emailQuery });
      setTimer(60);

      notifications.show({
        message: "Confirmation email sent. Please check your email inbox to proceed.",
        color: "green",
      });
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
            error_function: "handleResend",
          },
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container h="100%" p={24}>
      <Center mt={65}>
        <Paper px={{ base: 32, sm: 64 }} py={32} w={493} shadow="sm" radius="md">
          <Flex w="100%" justify="center" direction="column" align="center" ta="center" gap={16}>
            <ThemeIcon size={84}>
              <IconMail size={84} />
            </ThemeIcon>

            <Title size={20}>Check your mailbox</Title>
            <Text c="dimmed">
              We have sent you a confirmation email to complete your registration. To proceed, click
              the link provided in the email. If you don&apos;t see it in your inbox, please check
              your spam folder.
            </Text>
            <Stack gap="xs">
              <Button
                h={38}
                fullWidth
                variant="light"
                onClick={handleResend}
                loading={isResending || isFetching}
                disabled={Boolean(timer)}
              >
                Resend Email Verification {timer ? timer : ""}
              </Button>
              <Link href={"/"} style={{ textDecoration: "none", width: "100%" }}>
                <Button h={38} fullWidth>
                  Return to Home Page
                </Button>
              </Link>
            </Stack>
          </Flex>
        </Paper>
      </Center>
    </Container>
  );
};

export default SignUpSuccessPage;
