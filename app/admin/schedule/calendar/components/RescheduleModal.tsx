import { insertError } from "@/app/actions";
import { getDateAppointments } from "@/app/user/booking/actions";
import { useUserData } from "@/stores/useUserStore";
import { formatWordDate, isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { RescheduleScheduleType, ScheduleSlotTableRow } from "@/utils/types";
import { Alert, Button, Flex, Loader, Modal, Select, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { toUpper } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchBlockedSchedules } from "../actions";

type Props = {
  rescheduleModalOpened: boolean;
  closeRescheduleModal: () => void;
  handleReschedule: (data: RescheduleScheduleType) => void;
  serverTime: string;
  scheduleSlot: ScheduleSlotTableRow[];
  openSelectedAppointmentModal: () => void;
};

const RescheduleModal = ({
  rescheduleModalOpened,
  closeRescheduleModal,
  handleReschedule,
  serverTime,
  scheduleSlot,
  openSelectedAppointmentModal,
}: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [isLoading, setIsLoading] = useState(false);
  const [availableSlot, setAvailableSlot] = useState<
    {
      value: string;
      label: string;
      note: string | null;
    }[]
  >([]);
  const [scheduleNote, setScheduleNote] = useState<string | null>(null);

  useEffect(() => {
    if (rescheduleModalOpened) {
      reset();
    }
  }, [rescheduleModalOpened]);

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
          const formattedTime = moment(slot.schedule_slot_time, "HH:mm:ss").format("h:mm A");

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

  return (
    <Modal
      opened={rescheduleModalOpened}
      onClose={closeRescheduleModal}
      title="Reschedule"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSubmit(handleReschedule)}>
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
                minDate={moment(serverTime).format()}
                onChange={(value) => {
                  if (value) {
                    handleDateChange(value);
                  }
                }}
                disabled={isLoading}
                rightSection={isLoading ? <Loader size={14} /> : null}
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
                openSelectedAppointmentModal();
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
};

export default RescheduleModal;
