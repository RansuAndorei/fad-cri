"use client";

import { formatDecimal, statusToColor } from "@/utils/functions";
import { PaymentTableRow } from "@/utils/types";
import { Alert, Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { toUpper } from "lodash";

type Props = {
  payment: PaymentTableRow;
};

const Payment = ({ payment }: Props) => {
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
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Payment;
