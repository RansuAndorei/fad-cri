import { FINGER_LABEL } from "@/utils/constants";
import { formatWordDate, useNailBoxStyle } from "@/utils/functions";
import { AppointmentNailDesignTableRow, AppointmentType } from "@/utils/types";
import { Box, Divider, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { toUpper } from "lodash";
import moment from "moment";

type Props = {
  appointmentData: AppointmentType;
};

const SummaryModal = ({ appointmentData }: Props) => {
  const getNailBoxStyle = useNailBoxStyle();

  const appointmentDetails = appointmentData.appointment_detail;
  const nailInspo = appointmentDetails.appointment_nail_design;

  const renderNailImages = (hand: "LEFT" | "RIGHT", values: AppointmentNailDesignTableRow[]) => {
    return (hand === "LEFT" ? FINGER_LABEL : [...FINGER_LABEL].reverse()).map((finger, index) => {
      const file = values.find(
        (value) =>
          value.appointment_nail_design_hand === toUpper(hand) &&
          value.appointment_nail_design_finger === toUpper(finger) &&
          value.appointment_nail_design,
      )?.appointment_nail_design;

      return (
        <Stack key={`${hand}-${index}`} gap={4} align="center">
          <Box style={getNailBoxStyle(finger)}>
            {file ? (
              <Image src={file} alt={finger} width="100%" height="100%" fit="cover" />
            ) : (
              <Text size="xs" c="gray">
                None
              </Text>
            )}
          </Box>
          <Text size="xs" c="dimmed">
            {finger}
          </Text>
        </Stack>
      );
    });
  };

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
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
            <strong>Type:</strong> {appointmentDetails.appointment_detail_type}
          </Text>
          <Text>
            <strong>Removal:</strong>{" "}
            {appointmentDetails.appointment_detail_is_with_removal
              ? "With Removal"
              : "Without Removal"}
          </Text>
          {appointmentDetails.appointment_detail_is_with_removal && (
            <Text>
              <strong>Removal Type:</strong>{" "}
              {appointmentDetails.appointment_detail_is_removal_done_by_fad_cri
                ? "Fad Cri's Work"
                : "Not Fad Cri’s Work"}
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
          {renderNailImages("LEFT", nailInspo)}
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
          {renderNailImages("RIGHT", nailInspo)}
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
            <strong>Date:</strong> {formatWordDate(new Date(appointmentData.appointment_schedule))}
          </Text>
          <Text>
            <strong>Time:</strong> {moment(appointmentData.appointment_schedule).format("h:mm A")}
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SummaryModal;
