import { formatWordDate } from "@/utils/functions";
import { AppointmentType } from "@/utils/types";
import { Divider, Paper, Stack, Text } from "@mantine/core";
import moment from "moment";

type Props = {
  appointmentData: AppointmentType;
};

const SummaryModal = ({ appointmentData }: Props) => {
  const appointmentDetails = appointmentData.appointment_detail;

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
