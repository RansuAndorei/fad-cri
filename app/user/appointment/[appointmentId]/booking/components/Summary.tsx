import { FINGER_LABEL } from "@/utils/constants";
import { useNailBoxStyle } from "@/utils/functions";
import { BookingFormValues } from "@/utils/types";
import { Box, Divider, Group, Image, Paper, Stack, Text, Title } from "@mantine/core";
import { useFormContext } from "react-hook-form";

const Summary = () => {
  const { getValues } = useFormContext<BookingFormValues>();
  const values = getValues();
  const getNailBoxStyle = useNailBoxStyle();

  const renderNailImages = (hand: "inspoLeft" | "inspoRight") => {
    return values[hand]?.map((file, index) => {
      const label = hand === "inspoLeft" ? FINGER_LABEL[index] : FINGER_LABEL[4 - index];

      return (
        <Stack key={`${hand}-${index}`} gap={4} align="center">
          <Box style={getNailBoxStyle(label)}>
            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt={label}
                width="100%"
                height="100%"
                fit="cover"
              />
            ) : (
              <Text size="xs" c="gray">
                None
              </Text>
            )}
          </Box>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
        </Stack>
      );
    });
  };

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Booking Summary
        </Title>

        <Divider
          label="Appointment Details"
          labelPosition="right"
          styles={{
            label: {
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <Stack gap="xs">
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
        </Stack>

        <Divider
          label="Nail Design (Left Hand)"
          labelPosition="right"
          styles={{
            label: {
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <Group gap="xs" wrap="wrap">
          {renderNailImages("inspoLeft")}
        </Group>

        <Divider
          label="Nail Design (Right Hand)"
          labelPosition="right"
          mt="md"
          styles={{
            label: {
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <Group gap="xs" wrap="wrap">
          {renderNailImages("inspoRight")}
        </Group>

        <Divider
          label="Schedule"
          labelPosition="right"
          styles={{
            label: {
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        <Stack gap="xs">
          <Text>
            <strong>Date:</strong>{" "}
            {values.scheduleDate ? new Date(values.scheduleDate).toLocaleDateString() : "-"}
          </Text>
          <Text>
            <strong>Time:</strong>{" "}
            {values.scheduleTime
              ? (() => {
                  const [hourStr, minute] = values.scheduleTime.split(":");
                  const hour = parseInt(hourStr, 10);
                  const period = hour >= 12 ? "PM" : "AM";
                  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                  return `${displayHour}:${minute} ${period}`;
                })()
              : "-"}
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Summary;
