import { formatPeso, formatWordDate } from "@/utils/functions";
import { AppointmentType } from "@/utils/types";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCalendarClock,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconTool,
} from "@tabler/icons-react";
import { toUpper } from "lodash";
import moment from "moment";

type Props = {
  appointmentData: AppointmentType;
  handleCancelAppointment: (appointmentId: string) => void;
  openRescheduleModal: () => void;
  closeSelectedAppointmentModal: () => void;
  openCompleteModal: () => void;
};

const SummaryModal = ({
  appointmentData,
  handleCancelAppointment,
  openRescheduleModal,
  closeSelectedAppointmentModal,
  openCompleteModal,
}: Props) => {
  const appointmentDetails = appointmentData.appointment_detail;
  const appointmentCompletion = appointmentData.appointment_completion;

  const confirmCancelModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure you want to cancel this appointment?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => handleCancelAppointment(appointmentData.appointment_id),
      centered: true,
      confirmProps: {
        color: "red",
      },
    });

  return (
    <Paper p={{ base: "xs", xs: "sm" }}>
      <Stack gap="xs">
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
                : "Not Fad Cri's Work"}
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
              <UnstyledButton
                onClick={() =>
                  window.open(appointmentDetails.appointment_nail_design?.attachment_path, "_blank")
                }
                style={{ display: "inline-block" }}
              >
                <Image
                  src={appointmentDetails.appointment_nail_design.attachment_path}
                  alt="Nail Inspiration"
                  radius="md"
                  height={200}
                  fit="contain"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              </UnstyledButton>

              <Badge color="yellow.9" variant="light">
                Uploaded Nail Design Inspiration
              </Badge>
            </Stack>
          </Card>
        ) : null}
        {/* Schedule Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            {`Schedule${appointmentData.appointment_is_rescheduled ? " (Rescheduled)" : ""}`}
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
        {/* Payment Card */}
        <Card shadow="sm" radius="md" p="md" withBorder>
          <Title order={5} mb={8} c="cyan">
            Payment
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Payment Method:</strong> {toUpper(appointmentData.payment.payment_method)}
            </Text>
            <Text>
              <strong>Paid Amount:</strong>{" "}
              {formatPeso(appointmentData.payment.payment_amount / 100)}
            </Text>
          </Stack>
        </Card>
        {/* Completion Card */}
        {appointmentData.appointment_status === "COMPLETED" && appointmentCompletion ? (
          <Card shadow="sm" radius="md" p="md" withBorder>
            <Title order={5} mb={8} c="cyan">
              Completion
            </Title>
            <Stack align="center" gap={6}>
              <UnstyledButton
                onClick={() =>
                  window.open(
                    appointmentCompletion.appointment_completion_image.attachment_path,
                    "_blank",
                  )
                }
                style={{ display: "inline-block" }}
              >
                <Image
                  src={appointmentCompletion.appointment_completion_image}
                  alt="Completed Nails"
                  radius="md"
                  height={200}
                  fit="contain"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              </UnstyledButton>

              <Badge color="yellow.9" variant="light">
                Completed Nail Design
              </Badge>
            </Stack>
            <Text>
              <strong>Price:</strong>{" "}
              {formatPeso(appointmentCompletion.appointment_completion_price)}
            </Text>
          </Card>
        ) : null}
        {appointmentData.appointment_status === "SCHEDULED" ? (
          <Accordion variant="separated">
            <Accordion.Item value="action">
              <Accordion.Control icon={<IconTool size={16} color="#15AABF" />}>
                <Title c="cyan" order={4}>
                  Actions
                </Title>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Button
                    leftSection={<IconCircleCheck size={16} />}
                    variant="gradient"
                    gradient={{ from: "green", to: "lime", deg: 45 }}
                    onClick={() => {
                      closeSelectedAppointmentModal();
                      openCompleteModal();
                    }}
                  >
                    Complete
                  </Button>
                  <Button
                    leftSection={<IconCalendarClock size={16} />}
                    variant="gradient"
                    gradient={{ from: "orange", to: "yellow", deg: 45 }}
                    onClick={() => {
                      closeSelectedAppointmentModal();
                      openRescheduleModal();
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    leftSection={<IconCircleX size={16} />}
                    variant="gradient"
                    gradient={{ from: "red", to: "pink", deg: 45 }}
                    onClick={confirmCancelModal}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default SummaryModal;
