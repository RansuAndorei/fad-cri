import { BookingFormValues } from "@/utils/types";
import { Alert, Badge, Card, Image, Paper, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

const Summary = () => {
  const { getValues } = useFormContext<BookingFormValues>();
  const values = getValues();

  const formattedDate = values.scheduleDate
    ? new Date(values.scheduleDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <Paper p="xl" shadow="xl" withBorder radius="md">
      <Stack gap="lg">
        <Title c="dimmed" order={3}>
          Booking Summary
        </Title>

        {/* Appointment Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8}>
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
            <Title order={5} mb={8}>
              Nail Design Inspiration
            </Title>
            <Stack align="center" gap={6}>
              <Image
                src={URL.createObjectURL(values.inspo)}
                alt="Nail Inspiration"
                radius="md"
                height={200}
                fit="contain"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
              <Badge color="cyan" variant="light">
                Uploaded Nail Design Inspiration
              </Badge>
            </Stack>
          </Card>
        )}

        {/* Schedule Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8}>
            Schedule
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Date:</strong> {formattedDate}
            </Text>
            <Text>
              <strong>Time:</strong> {values.scheduleTime}
            </Text>
            {values.scheduleNote && (
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
            )}
          </Stack>
        </Card>
      </Stack>
    </Paper>
  );
};

export default Summary;
