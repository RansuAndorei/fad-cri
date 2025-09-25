import { BookingFormValues } from "@/utils/types";
import { Paper, Select, Stack, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Controller, useFormContext } from "react-hook-form";

const Schedule = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

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

  return (
    <Paper p="xl" shadow="xl" withBorder>
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
      </Stack>
    </Paper>
  );
};

export default Schedule;
