"use client";

import { insertError, uploadImage } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { combineDateTime, formatDecimal } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AttachmentTableInsert, BookingFormValues, PaymentMethod } from "@/utils/types";
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
import { IconAlertCircle } from "@tabler/icons-react";
import { isError } from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getBookingFee, recheckSchedule } from "../actions";

type Props = {
  handleStepChange: (nextStep: number) => Promise<void>;
};

const Payment = ({ handleStepChange }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [method, setMethod] = useState<PaymentMethod>("gcash");
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingFee, setBookingFee] = useState(0);

  const { getValues, setValue } = useFormContext<BookingFormValues>();

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
      const inspo = bookingData.inspo;

      const isStillAvailable = await recheckSchedule(supabaseClient, {
        schedule: combineDateTime(new Date(bookingData.scheduleDate), bookingData.scheduleTime),
      });
      if (!isStillAvailable) {
        notifications.show({
          message: "Sorry, this schedule is no longer available. Please select a different time.",
          color: "orange",
        });
        setValue("scheduleDate", "");
        setValue("scheduleTime", "");
        handleStepChange(2);
        setIsLoading(false);
        return;
      }

      let inspoData: AttachmentTableInsert | null = null;
      if (inspo) {
        const { publicUrl } = await uploadImage(supabaseClient, {
          image: inspo,
          bucket: "NAIL_INSPO",
          fileName: inspo.name,
        });

        inspoData = {
          attachment_name: inspo.name,
          attachment_path: publicUrl,
          attachment_bucket: "NAIL_INSPO",
          attachment_mime_type: inspo.type,
          attachment_size: inspo.size,
        };
      }

      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingFee * 100,
          method,
          bookingData,
          inspoData,
          userId: userData.id,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed with status ${res.status}: ${errorText}`);
      }
      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
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
            error_function: "handlePay",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Paper p={{ base: "lg", xs: "xl" }} shadow="xl" withBorder>
      <Stack gap="md">
        <LoadingOverlay visible={isFetchingFee} />
        <Title c="dimmed" order={3}>
          Payment
        </Title>

        <Alert
          icon={<IconAlertCircle size={16} />}
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
