"use client";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCancel,
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
      <Flex align="center" justify="space-between" wrap="wrap" mb="md">
        <Group wrap="nowrap">
          <IconSparkles color="#fab005" />
          <Title order={2}>Before You Book: Policy and Guidelines</Title>
        </Group>
        <Button variant="light" onClick={() => router.push("/user/appointment")}>
          View My Appointments
        </Button>
      </Flex>
      <Paper withBorder p="lg" radius="md" shadow="lg">
        <Stack gap="md">
          <Group>
            <IconPin color="#15aabf" size={16} />
            <Text fw={700}>APPOINTMENT & RESERVATIONS</Text>
          </Group>

          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              A <b>reservation fee of ₱500.00 is required to secure your slot</b>. This{" "}
              <b>fee is non-refundable</b>, but{" "}
              <b>deductible from your total bill after the service</b>, provided there are no late
              arrivals, cancellations, or rescheduling.
            </List.Item>

            <List.Item>
              A <b>10-minute grace period</b> is given.{" "}
              <b>Failure to arrive within this window will be considered late</b>, and the
              reservation fee <b>will no longer be deductible</b>.
            </List.Item>

            <List.Item>
              For arrivals after 10 minutes, the appointment is <b>subject to approval</b>, and the
              following <b>late fees</b> apply:
              <List spacing="xs" size="sm" listStyleType="disc" pl="md">
                <List.Item>
                  <b>₱300.00 (11–20 minutes late)</b>
                </List.Item>
                <List.Item>
                  <b>₱500.00 (21–39 minutes late)</b>
                </List.Item>
                <List.Item>
                  <b>₱1,000.00 (40 minutes to 1 hour late)</b>
                </List.Item>
                <List.Item>
                  <b>
                    ₱2,000.00 (more than 1 hour late) — if you still wish to proceed, this will be
                    subject to approval
                  </b>
                </List.Item>
              </List>
            </List.Item>

            <List.Item>
              <b>No-show or no heads-up after 30 minutes:</b> your appointment{" "}
              <b>will be cancelled automatically</b>, and a{" "}
              <b>cancellation fee equal to your total bill</b> must be paid.
            </List.Item>

            <List.Item>
              <b>NO RESERVATION, NO APPOINTMENT. FIRST-TO-RESERVE BASIS.</b>
            </List.Item>
          </List>

          <Group mt="md">
            <IconHistory size={16} color="#228be6" />
            <Text fw={700}>RESCHEDULING</Text>
          </Group>

          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              <b>Rescheduling is allowed only once</b>, provided it is done{" "}
              <b>at least 3 days before the appointment</b> and <b>within the same month only</b>.
              Rescheduling <b>less than 3 days before</b> the appointment requires a{" "}
              <b>new reservation</b>.
            </List.Item>

            <List.Item>
              A <b>rescheduled appointment is no longer deductible</b>, as the reservation fee will{" "}
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
            <IconCancel size={16} color="#fa5252" />
            <Text fw={700}>CANCELLATION</Text>
          </Group>

          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              Please note that{" "}
              <b>
                cancelled appointments require full payment. Unpaid cancelled appointments may
                result in restricted or banned booking access
              </b>
              .
            </List.Item>
          </List>

          <Group mt="md">
            <IconAlertTriangle color="#fd7e14" size={16} />
            <Text fw={700}>SQUEEZE-IN REQUESTS</Text>
          </Group>

          <List spacing="xs" size="sm" withPadding pr="xl">
            <List.Item>
              <b>Squeeze-in slots are limited and subject to approval</b>.
            </List.Item>
            <List.Item>
              <b>Additional fee: ₱1,000.00</b>
            </List.Item>
          </List>

          <Checkbox
            label="I have read and understood the policies above and agree to comply with the terms."
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
