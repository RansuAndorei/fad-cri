import { formatWordDate } from "@/utils/functions";
import { BookingFormValues } from "@/utils/types";
import { Alert, Anchor, Badge, Card, Image, Paper, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

const Summary = () => {
  const { getValues } = useFormContext<BookingFormValues>();
  const values = getValues();

  return (
    <Paper p="xl" shadow="xl" withBorder radius="md">
      <Stack gap="lg">
        <Title c="dimmed" order={3}>
          Booking Summary
        </Title>

        {/* Appointment Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            Appointment Details
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Type:</strong> {values.type || "-"}
            </Text>
            <Text>
              <strong>Removal:</strong>{" "}
              {values.removal === "with" ? "With Removal" : "Without Removal"}
            </Text>
            {values.removal === "with" && (
              <Text>
                <strong>Removal Type:</strong>{" "}
                {values.removalType === "fad" ? "Fad Cri's Work" : "Not Fad Cri’s Work"}
              </Text>
            )}
            <Text>
              <strong>Reconstruction:</strong>{" "}
              {values.reconstruction === "with" ? "With Reconstruction" : "Without Reconstruction"}
            </Text>
          </Stack>
        </Card>

        {/* Nail Inspiration Card */}
        {values.inspo && (
          <Card shadow="sm" radius="md" p="md" withBorder>
            <Title order={5} mb={8} c="cyan">
              Nail Design Inspiration
            </Title>
            <Stack align="center" gap={6}>
              <Anchor
                href={URL.createObjectURL(values.inspo)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={URL.createObjectURL(values.inspo)}
                  alt="Nail Inspiration"
                  radius="md"
                  height={200}
                  fit="contain"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              </Anchor>

              <Badge color="yellow.9" variant="light">
                Uploaded Nail Design Inspiration
              </Badge>
            </Stack>
          </Card>
        )}

        {/* Schedule Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            Schedule
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Date:</strong> {formatWordDate(new Date(values.scheduleDate))}
            </Text>
            <Text>
              <strong>Time:</strong> {values.scheduleTime}
            </Text>
            {values.scheduleNote ? (
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Additional Information"
                color="cyan"
                radius="md"
                variant="light"
                mt="xs"
              >
                {values.scheduleNote}
              </Alert>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Paper>
  );
};

export default Summary;
