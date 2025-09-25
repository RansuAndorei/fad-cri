"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { formatDecimal } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { BookingFormValues } from "@/utils/types";
import {
  Alert,
  Button,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { isError } from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getBookingFee } from "../actions";

type PaymentMethod = "gcash" | "card";

const Payment = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [method, setMethod] = useState<PaymentMethod>("gcash");
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingFee, setBookingFee] = useState(0);

  const { getValues } = useFormContext<BookingFormValues>();

  useEffect(() => {
    (async () => {
      if (!userData) return;
      try {
        setIsFetchingFee(true);
        const data = await getBookingFee(supabaseClient);
        setBookingFee(data);
      } catch (e) {
        notifications.show({
          message: "Something went wrong. Please try again later.",
          color: "red",
        });
        if (isError(e)) {
          await insertError(supabaseClient, {
            errorTableInsert: {
              error_message: e.message,
              error_url: pathname,
              error_function: "getBookingFee",
              error_user_email: userData.email,
              error_user_id: userData.id,
            },
          });
        }
      } finally {
        setIsFetchingFee(false);
      }
    })();
  }, [userData]);

  const handlePay = async () => {
    if (isLoading || isFetchingFee || !userData) return;
    setIsLoading(true);
    try {
      const bookingData = getValues();

      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingFee * 100, // PayMongo expects centavos (500.00 = 50000)
          method,
          bookingData,
          userId: userData.id,
          userEmail: userData.email,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed with status ${res.status}: ${errorText}`);
      }
      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url; // Redirect to PayMongo checkout
      }
    } catch (e) {
      console.log(e);
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handlePay",
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
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <LoadingOverlay visible={isFetchingFee} />
        <Title c="dimmed" order={3}>
          Payment
        </Title>

        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Please Note"
          color="cyan"
          radius="md"
          variant="light"
        >
          Once you proceed to payment, the details can no longer be edited. Your appointment will
          only be confirmed after the payment is successfully received.
        </Alert>
        <Stack>
          <Title order={5}>Choose Payment Method</Title>
          <Radio.Group value={method} onChange={(val) => setMethod(val as PaymentMethod)}>
            <Stack>
              <Radio value="gcash" label="GCash" />
              <Radio value="card" label="Credit/Debit Card" />
            </Stack>
          </Radio.Group>

          <Group justify="space-between" mt="lg">
            <Text fw={500}>Amount to Pay (Booking Fee)</Text>
            <Text fw={700}>₱{formatDecimal(bookingFee)}</Text>
          </Group>

          <Button
            mt="md"
            fullWidth
            onClick={handlePay}
            disabled={isFetchingFee}
            leftSection={isLoading ? <Loader size="xs" color={"white"} /> : null}
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Payment;
