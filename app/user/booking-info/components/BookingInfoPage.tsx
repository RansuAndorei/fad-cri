"use client";
import { Button, Checkbox, Container, Group, List, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertTriangle,
  IconExclamationCircle,
  IconHistory,
  IconPin,
  IconSparkles,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookingInfoPage = () => {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleProceed = () => {
    sessionStorage.setItem("bookingInfoAgreed", "true");
    if (agreed) router.push("/user/booking");
  };

  return (
    <Container size="md" py="xl">
      <Group mb="md" wrap="nowrap">
        <IconSparkles color="#fab005" />
        <Title order={2}>Before You Book: Policy and Guidelines</Title>
      </Group>
      <Paper withBorder p="lg" radius="md" shadow="lg">
        <Stack gap="md">
          <Group>
            <IconPin color="#fa5252" size={16} />
            <Text fw={700}>APPOINTMENT & RESERVATIONS</Text>
          </Group>
          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              A <b>reservation fee of ₱300.00 EACH</b> (or <b>₱500.00 EACH for December slots</b>){" "}
              <b>is required to secure your slot</b>. This <b>fee is non-refundable</b>, but{" "}
              <b>deductible from your total bill after service</b>, provided there are no lates,
              cancellations, or rescheduling.
            </List.Item>
            <List.Item>
              A <b>10-minute grace period</b> is given.{" "}
              <b>Failure to arrive within this window is considered late</b>, and the reservation
              fee <b>will no longer be deductible</b>.
            </List.Item>
            <List.Item>
              <b>Late Fee:</b> 11–20 minutes late: <b>₱300.00 additional fee</b>
            </List.Item>
            <List.Item>
              <b>No Show:</b> After 30 minutes, your appointment{" "}
              <b>will be cancelled automatically</b> and a{" "}
              <b>cancellation fee equal to your total bill</b> must be paid.
            </List.Item>
            <List.Item>
              For arrivals after 30 minutes, the appointment is <b>subject to approval</b> and the
              following <b>late fees</b> apply:
              <List spacing="xs" size="sm" listStyleType="disc" pl="md">
                <List.Item>
                  <b>₱500.00 (30–40 minutes late)</b>
                </List.Item>
                <List.Item>
                  <b>₱1000.00 (41 minutes to 1 hour late)</b>
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              <b>NO RESERVATION, NO APPOINTMENT. FIRST TO RESERVE BASIS.</b>
            </List.Item>
          </List>

          <Group mt="md">
            <IconHistory size={16} color="#228be6" />
            <Text fw={700}>RESCHEDULING</Text>
          </Group>
          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              <b>Rescheduling is allowed only once</b> if done <b>at least 3 days before</b> the
              appointment. Rescheduling <b>less than 3 days</b> before requires a{" "}
              <b>new reservation</b>.
            </List.Item>
            <List.Item>
              A <b>rescheduled appointment is no longer deductible</b>, as it will{" "}
              <b>serve as your rescheduling fee</b>.
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <IconExclamationCircle size={16} color="#fa5252" />
                <b>No rescheduling is allowed for December.</b> Please <b>book another slot</b> if
                needed.
              </Group>
            </List.Item>
          </List>

          <Group mt="md">
            <IconAlertTriangle color="#fd7e14" size={16} />
            <Text fw={700}> SQUEEZE-IN REQUESTS</Text>
          </Group>
          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              <b>Squeeze-in slots are limited and subject to approval</b>.
            </List.Item>
            <List.Item>Only within working hours (10:00 AM – 7:00 PM).</List.Item>
            <List.Item>
              <b>Additional fee: ₱1000.00</b>
            </List.Item>
          </List>

          <Checkbox
            label="I have read and understood the policies above. I agree to comply with the terms."
            checked={agreed}
            onChange={(event) => setAgreed(event.currentTarget.checked)}
            mt="lg"
          />
          <Button onClick={handleProceed} disabled={!agreed} fullWidth>
            Proceed to Booking
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BookingInfoPage;
