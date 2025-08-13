import { BookingFormValues } from "@/utils/types";
import { Paper, Radio, Select, Stack, Title } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { Controller, useFormContext } from "react-hook-form";

const appointmentTypes = [
  "Gel Polish",
  "Structured Gel Polish",
  "BIAB",
  "Polygel Overlay",
  "Gel-X Extension",
];

const useStyles = createStyles(() => ({
  radio: {
    input: {
      cursor: "pointer",
    },
    label: {
      cursor: "pointer",
    },
  },
}));

const AppointmentType = () => {
  const { classes } = useStyles();

  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<BookingFormValues>();

  const removal = watch("removal");

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Appointment Type
        </Title>

        <Controller
          name="type"
          control={control}
          rules={{ required: "Type of Appointment is required" }}
          render={({ field }) => (
            <Select
              label="Type of Appointment"
              data={appointmentTypes}
              placeholder="Choose type"
              {...field}
              error={errors.type?.message}
              required
              searchable
            />
          )}
        />
        <Controller
          name="removal"
          control={control}
          rules={{ required: "Removal is required" }}
          render={({ field }) => (
            <Radio.Group
              label="Removal"
              {...field}
              required
              error={errors.removal?.message}
              styles={{
                error: {
                  marginTop: 8,
                },
              }}
            >
              <Stack mt="sm">
                <Radio value="with" label="With Removal" classNames={{ root: classes.radio }} />
                <Radio
                  value="without"
                  label="Without Removal"
                  classNames={{ root: classes.radio }}
                />
              </Stack>
            </Radio.Group>
          )}
        />
        {removal === "with" && (
          <Controller
            name="removalType"
            control={control}
            rules={{ required: "Removal Type is required" }}
            render={({ field }) => (
              <Radio.Group
                label="Was it done by Fad Cri?"
                {...field}
                required
                error={errors.removalType?.message}
                styles={{
                  error: {
                    marginTop: 8,
                  },
                }}
              >
                <Stack mt="sm">
                  <Radio value="fad" label="Fad Cri's Work" classNames={{ root: classes.radio }} />
                  <Radio
                    value="not_fad"
                    label="Not Fad Cri's Work"
                    classNames={{ root: classes.radio }}
                  />
                </Stack>
              </Radio.Group>
            )}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default AppointmentType;
