import { insertError } from "@/app/actions";
import { fetchBlockedSchedules } from "@/app/admin/schedule/calendar/actions";
import { useUserData } from "@/stores/useUserStore";
import { formatWordDate, isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { BookingFormValues, ScheduleSlotTableRow } from "@/utils/types";
import { Alert, Loader, Paper, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { toUpper } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getDateAppointments } from "../actions";

type Props = {
  scheduleSlot: ScheduleSlotTableRow[];
  maxScheduleDate: string;
  serverTime: string;
};

const Schedule = ({ scheduleSlot, maxScheduleDate, serverTime }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<BookingFormValues>();

  const watchDate = watch("scheduleDate");
  const availableSlot = watch("availableSlot") || [];
  const watchNote = watch("scheduleNote");

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

      const dayName = momentDate.format("dddd");

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

      setValue("availableSlot", availableSlot);

      if (availableSlot.length > 0) {
        setValue("scheduleDate", value);
      } else {
        setValue("scheduleDate", "");
        setValue("availableSlot", []);
        notifications.show({
          message: `${formatWordDate(new Date(value))} is fully booked. Please select another date.`,
          color: "orange",
        });
      }
    } catch (e) {
      setValue("scheduleDate", "");
      setValue("availableSlot", []);
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
    <Paper p={{ base: "lg", xs: "xl" }} shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Schedule
        </Title>

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
              maxDate={maxScheduleDate}
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
                setValue("scheduleNote", selectedSlot?.note ?? null, { shouldDirty: true });
              }}
            />
          )}
        />

        {watchNote && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            title="Additional Information"
            color="cyan"
            radius="md"
            variant="light"
          >
            {watchNote}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default Schedule;
