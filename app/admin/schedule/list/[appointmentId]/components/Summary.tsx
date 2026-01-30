import { insertError } from "@/app/actions";
import { updateAppointment } from "@/app/api/paymongo/webhook/actions";
import { getDateAppointments, recheckSchedule } from "@/app/user/booking/actions";
import { useUserData } from "@/stores/useUserStore";
import { combineDateTime, formatWordDate, isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AppointmentType, RescheduleScheduleType, ScheduleSlotTableRow } from "@/utils/types";
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Image,
  List,
  Loader,
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
import { toUpper } from "lodash";
import moment from "moment";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchBlockedSchedules } from "../../../calendar/actions";
import { TIME_FORMAT } from "@/utils/constants";

type Props = {
  appointmentData: AppointmentType;
  serverTime: string;
  scheduleSlot: ScheduleSlotTableRow[];
  maxScheduleDateMonth: number;
};

const Summary = ({ appointmentData, serverTime, scheduleSlot, maxScheduleDateMonth }: Props) => {
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
  const [availableSlot, setAvailableSlot] = useState<
    {
      value: string;
      label: string;
      note: string | null;
    }[]
  >([]);
  const [scheduleNote, setScheduleNote] = useState<string | null>(null);

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
    setValue,
    watch,
  } = useForm<RescheduleScheduleType>({
    defaultValues: {
      scheduleDate: "",
      scheduleTime: "",
    },
  });

  const watchDate = watch("scheduleDate");

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
                {...field}
                label="Date"
                placeholder="Pick a date"
                error={errors.scheduleDate?.message}
                required
                value={field.value || null}
                minDate={moment(serverTime).add(1, "day").format()}
                onChange={(value) => {
                  if (value) {
                    handleDateChange(value);
                  }
                }}
                disabled={isLoading}
                rightSection={isLoading ? <Loader size={14} /> : null}
                maxDate={moment(serverTime).add(maxScheduleDateMonth, "months").format()}
              />
            )}
          />
          <Controller
            name="scheduleTime"
            control={control}
            rules={{ required: "Time is required" }}
            render={({ field }) => (
              <Select
                {...field}
                label="Time"
                placeholder="Pick a time"
                data={availableSlot}
                error={errors.scheduleTime?.message}
                searchable
                required
                disabled={!Boolean(watchDate) || isLoading}
                value={field.value || null}
                rightSection={isLoading ? <Loader size={14} /> : null}
                onChange={(value) => {
                  field.onChange(value);
                  const selectedSlot = availableSlot.find((slot) => slot.value === value);
                  setScheduleNote(selectedSlot?.note || null);
                }}
              />
            )}
          />
          {scheduleNote ? (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Additional Information"
              color="cyan"
              radius="md"
              variant="light"
              mt="xs"
            >
              {scheduleNote}
            </Alert>
          ) : null}

          <Flex gap="xs" align="center" justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                reset();
                closeRescheduleModal();
                setScheduleNote(null);
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

  const handleDateChange = async (value: string) => {
    if (!userData) return;
    try {
      setIsLoading(true);
      const momentDate = moment(value);
      const endOfDay = momentDate.clone().endOf("day").toISOString();

      const [appointmentList, blockedSchedule] = await Promise.all([
        getDateAppointments(supabaseClient, { date: value }),
        fetchBlockedSchedules(supabaseClient, {
          startDate: endOfDay,
          endDate: endOfDay,
        }),
      ]);

      const dayName = moment(value).format("dddd");
      const scheduleSlotForTheDay = scheduleSlot.filter(
        (slot) => slot.schedule_slot_day === toUpper(dayName),
      );

      const isBlocked = (slotTime: string) => {
        return blockedSchedule.some((blocked) => {
          if (blocked.blocked_schedule_date !== value) return false;
          if (!blocked.blocked_schedule_time) return true;
          return blocked.blocked_schedule_time === slotTime;
        });
      };

      const availableSlot = scheduleSlotForTheDay
        .filter((slot) => !appointmentList.includes(slot.schedule_slot_time))
        .filter((slot) => !isBlocked(slot.schedule_slot_time))
        .map((slot) => {
          const formattedTime = moment(slot.schedule_slot_time, TIME_FORMAT).format("h:mm A");

          return {
            value: formattedTime,
            label: formattedTime,
            note: slot.schedule_slot_note,
          };
        });

      setAvailableSlot(availableSlot);
      if (availableSlot.length > 0) {
        setValue("scheduleDate", value);
      } else {
        setValue("scheduleDate", "");
        setAvailableSlot([]);
        notifications.show({
          message: `${formatWordDate(new Date(value))} is fully booked. Please select another date.`,
          color: "orange",
        });
      }
    } catch (e) {
      setValue("scheduleDate", "");
      setAvailableSlot([]);
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleDateChange",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
      setValue("scheduleTime", "");
    }
  };

  const onSubmit = async (data: RescheduleScheduleType) => {
    if (!userData) return;
    try {
      setIsLoading(true);
      const { scheduleDate, scheduleTime } = data;

      const combinedDateAndTime = combineDateTime(scheduleDate, scheduleTime);

      const isStillAvailable = await recheckSchedule(supabaseClient, {
        schedule: combineDateTime(data.scheduleDate, data.scheduleTime),
      });
      if (!isStillAvailable) {
        notifications.show({
          message: "Sorry, this schedule is no longer available. Please select a different time.",
          color: "orange",
        });
        reset();
        setScheduleNote(null);
        setIsLoading(false);
        return;
      }

      await updateAppointment(supabaseClient, {
        appointmentData: {
          appointment_schedule: combinedDateAndTime,
          appointment_is_rescheduled: true,
        },
        appointmentId: appointmentData.appointment_id,
      });
      setSchedule(combinedDateAndTime);
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
      if (isAppError(e)) {
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
    <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" withBorder style={{ borderTop: 0 }}>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Summary
        </Title>

        {/* Appointment Card */}
        <Card shadow="sm" radius="md" p={{ base: "md", xs: "xl" }} withBorder>
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
          <Card shadow="sm" radius="md" p={{ base: "md", xs: "xl" }} withBorder>
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
        <Card shadow="sm" radius="md" p={{ base: "md", xs: "xl" }} withBorder>
          <Title order={5} mb={8} c="cyan">
            {`Schedule${isRescheduled ? " (Rescheduled)" : ""}`}
          </Title>
          <Stack gap={4}>
            <Text>
              <strong>Date:</strong> {formatWordDate(new Date(schedule))}
            </Text>
            <Text>
              <strong>Time:</strong> {moment(schedule).format("h:mm A")}
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
            {rescheduleModal()}
            {rescheduleInfoModal()}
            {appointmentData.appointment_status === "SCHEDULED" ? (
              <Flex align="center" gap="xs" mt="xs">
                <Button fullWidth onClick={openRescheduleModal} disabled={isRescheduleDisabled}>
                  Reschedule
                </Button>
                <ActionIcon onClick={openRescheduleInfoModal} variant="light">
                  <IconInfoCircle size={16} />
                </ActionIcon>
              </Flex>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Paper>
  );
};

export default Summary;
