import { insertError } from "@/app/actions";
import { updateAppointment } from "@/app/api/paymongo/webhook/actions";
import { useUserData } from "@/stores/useUserStore";
import { combineDateTime, formatWordDate } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AppointmentType } from "@/utils/types";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  List,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconExclamationCircle, IconHistory, IconInfoCircle } from "@tabler/icons-react";
import { isError } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ScheduleType = {
  scheduleDate: string;
  scheduleTime: string;
};

type Props = {
  appointmentData: AppointmentType;
  serverTime: string;
};

const Summary = ({ appointmentData, serverTime }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [rescheduleModalOpened, { open: openRescheduleModal, close: closeRescheduleModal }] =
    useDisclosure(false);
  const [
    rescheduleInfoModalOpened,
    { open: openRescheduleInfoModal, close: closeRescheduleInfoModal },
  ] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState(appointmentData.appointment_schedule);
  const [isRescheduled, setIsRescheduled] = useState(appointmentData.appointment_is_rescheduled);

  const appointmentDetails = appointmentData.appointment_detail;

  const isRescheduleDisabled = useMemo(() => {
    const currentDate = moment(serverTime);
    const appointmentDate = moment(schedule);
    const hasRescheduled = isRescheduled;

    const isDecember = appointmentDate.month() === 11;
    const isLessThan3Days = appointmentDate.diff(currentDate, "days") < 3;

    return isDecember || isLessThan3Days || hasRescheduled;
  }, [schedule, isRescheduled, serverTime]);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ScheduleType>({
    defaultValues: {
      scheduleDate: "",
      scheduleTime: "",
    },
  });

  const timeOptions = Array.from({ length: 20 }, (_, i) => {
    const hour = 10 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const ampmHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? "PM" : "AM";
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${ampmHour}:${minute} ${period}`,
    };
  });

  const rescheduleModal = () => (
    <Modal
      opened={rescheduleModalOpened}
      onClose={closeRescheduleModal}
      title="Reschedule"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md" p="xs">
          <Controller
            name="scheduleDate"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <DatePickerInput
                label="Date"
                placeholder="Pick a date"
                {...field}
                error={errors.scheduleDate?.message}
                value={field.value || null}
                required
                minDate={new Date()}
              />
            )}
          />
          <Controller
            name="scheduleTime"
            control={control}
            rules={{ required: "Time is required" }}
            render={({ field }) => (
              <Select
                label="Time"
                placeholder="Pick a time"
                data={timeOptions}
                {...field}
                error={errors.scheduleTime?.message}
                searchable
                required
              />
            )}
          />
          <Flex gap="xs" align="center" justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                reset();
                closeRescheduleModal();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );

  const rescheduleInfoModal = () => (
    <Modal
      opened={rescheduleInfoModalOpened}
      onClose={closeRescheduleInfoModal}
      title={
        <Group>
          <IconHistory size={16} color="#228be6" />
          <Text fw={700}>RESCHEDULING</Text>
        </Group>
      }
      centered
    >
      <List spacing="lg" size="md" withPadding pr="xl" mt="xs">
        <List.Item>
          <b>Rescheduling is allowed only once</b> if done <b>at least 3 days before</b> the
          appointment. Rescheduling <b>less than 3 days</b> before requires a <b>new reservation</b>
          .
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
    </Modal>
  );

  const onSubmit = async (data: ScheduleType) => {
    if (!userData) throw new Error("Missing userData.");
    try {
      setIsLoading(true);
      const { scheduleDate, scheduleTime } = data;

      updateAppointment(supabaseClient, {
        appointmentData: {
          appointment_schedule: String(
            combineDateTime(new Date(scheduleDate), scheduleTime).toISOString(),
          ),
          appointment_is_rescheduled: true,
        },
        appointmentId: appointmentData.appointment_id,
      });
      setSchedule(String(combineDateTime(new Date(scheduleDate), scheduleTime).toISOString()));
      setIsRescheduled(true);
      closeRescheduleModal();
      notifications.show({
        message: "Schedule successfully updated.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "onSubmit",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper p="xl" shadow="xl" withBorder style={{ borderTop: 0 }}>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Summary
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
          label={`Schedule${isRescheduled ? " (Rescheduled)" : ""}`}
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
            <strong>Date:</strong> {formatWordDate(new Date(schedule))}
          </Text>
          <Text>
            <strong>Time:</strong> {moment(schedule).format("h:mm A")}
          </Text>
          {rescheduleModal()}
          {rescheduleInfoModal()}
          {appointmentData.appointment_status === "SCHEDULED" ? (
            <Flex align="center" gap="xs">
              <Button fullWidth onClick={openRescheduleModal} disabled={isRescheduleDisabled}>
                Reschedule
              </Button>
              <ActionIcon onClick={openRescheduleInfoModal} variant="light">
                <IconInfoCircle size={16} />
              </ActionIcon>
            </Flex>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Summary;
