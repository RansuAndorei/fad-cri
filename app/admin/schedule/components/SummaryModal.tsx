import { formatWordDate } from "@/utils/functions";
import { AppointmentType } from "@/utils/types";
import { Alert, Anchor, Badge, Card, Image, Paper, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import moment from "moment";

type Props = {
  appointmentData: AppointmentType;
};

const SummaryModal = ({ appointmentData }: Props) => {
  const appointmentDetails = appointmentData.appointment_detail;

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        {/* Appointment Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            Appointment Details
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Type:</strong> {appointmentDetails.appointment_detail_type}
            </Text>
            <Text>
              <strong>Removal:</strong>{" "}
              {appointmentDetails.appointment_detail_is_with_removal
                ? "With Removal"
                : "Without Removal"}
            </Text>
            <Text>
              <strong>Removal Type:</strong>{" "}
              {appointmentDetails.appointment_detail_is_removal_done_by_fad_cri
                ? "Fad Cri's Work"
                : "Not Fad Cri’s Work"}
            </Text>
            <Text>
              <strong>Reconstruction:</strong>{" "}
              {appointmentDetails.appointment_detail_is_with_reconstruction
                ? "With Reconstruction"
                : "Without Reconstruction"}
            </Text>
          </Stack>
        </Card>

        {/* Nail Inspiration Card */}
        {appointmentDetails.appointment_nail_design?.attachment_path ? (
          <Card shadow="sm" radius="md" p="md" withBorder>
            <Title order={5} mb={8} c="cyan">
              Nail Design Inspiration
            </Title>
            <Stack align="center" gap={6}>
              <Anchor
                href={appointmentDetails.appointment_nail_design.attachment_path}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={appointmentDetails.appointment_nail_design.attachment_path}
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
        ) : null}

        {/* Schedule Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            Schedule
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Date:</strong>{" "}
              {formatWordDate(new Date(appointmentData.appointment_schedule))}
            </Text>
            <Text>
              <strong>Time:</strong> {moment(appointmentData.appointment_schedule).format("h:mm A")}
            </Text>
            {appointmentData.appointment_schedule_note ? (
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Additional Information"
                color="cyan"
                radius="md"
                variant="light"
                mt="xs"
              >
                {appointmentData.appointment_schedule_note}
              </Alert>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Paper>
  );
};

export default SummaryModal;
