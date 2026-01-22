"use client";

import { insertError } from "@/app/actions";
import { getBookingFee } from "@/app/user/booking/actions";
import { useUserData } from "@/stores/useUserStore";
import { formatDecimal, statusToColor } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { PaymentMethod, PaymentTableRow } from "@/utils/types";
import {
  Alert,
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { isError, toUpper } from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  appointmentId: string;
  payment: PaymentTableRow;
};

const Payment = ({ appointmentId, payment }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const userData = useUserData();
  const pathname = usePathname();

  const [method, setMethod] = useState<PaymentMethod>("gcash");
  const [bookingFee, setBookingFee] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFetchingFee, setIsFetchingFee] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const paymentStatusAlert = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "PENDING":
        return (
          <Alert
            icon={<IconInfoCircle size={16} />}
            title="Payment Pending"
            color="blue"
            radius="md"
          >
            Your appointment is not final until payment is completed.
          </Alert>
        );
      case "FAILED":
        return (
          <Alert icon={<IconX size={16} />} title="Payment Failed" color="red" radius="md">
            Your payment could not be processed. Please try again.
          </Alert>
        );
      case "PAID":
        return (
          <Alert
            icon={<IconCheck size={16} />}
            title="Payment Successful"
            color="green"
            radius="md"
          >
            Your appointment has been confirmed!
          </Alert>
        );
      default:
        return null;
    }
  };

  const handlePay = async () => {
    if (isLoading || isFetchingFee || !userData) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/payments/retry-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingFee * 100,
          method,
          appointmentId,
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

  const renderPaymentModal = () => (
    <Modal
      opened={opened}
      onClose={close}
      title="Retry Payment"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <form>
        <Stack p="xs">
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
          <Flex gap="xs" align="center" justify="flex-end">
            <Button variant="light" onClick={close} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              disabled={isFetchingFee}
              leftSection={isLoading ? <Loader size="xs" color={"white"} /> : null}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );

  return (
    <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" withBorder style={{ borderTop: 0 }}>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Payment
        </Title>

        {paymentStatusAlert(payment.payment_status)}

        <Stack>
          <Group justify="space-between" mt="lg">
            <Text fw={500}>Payment Method</Text>
            <Text fw={700}>{toUpper(payment.payment_method)}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Amount to Pay (Booking Fee)</Text>
            <Text fw={700}>₱{formatDecimal(payment.payment_amount / 100)}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={500}>Status</Text>
            <Badge color={statusToColor(payment.payment_status)}>{payment.payment_status}</Badge>
          </Group>
          {["CANCELLED", "FAILED"].includes(payment.payment_status) ? (
            <Button onClick={open}>Retry Payment</Button>
          ) : null}
          {renderPaymentModal()}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Payment;
