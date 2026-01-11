import { BookingFormValues } from "@/utils/types";
import { Paper, Radio, Select, Stack, Title } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  appointmentTypeOptions: string[];
};

const AppointmentType = ({ appointmentTypeOptions }: Props) => {
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
          Appointment Details
        </Title>

        <Controller
          name="type"
          control={control}
          rules={{ required: "Type of Appointment is required" }}
          render={({ field }) => (
            <Select
              label="Type of Appointment"
              data={appointmentTypeOptions}
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
                <Radio value="with" label="With Removal" />
                <Radio value="without" label="Without Removal" />
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
                  <Radio value="fad" label="Fad Cri's Work" />
                  <Radio value="not_fad" label="Not Fad Cri's Work" />
                </Stack>
              </Radio.Group>
            )}
          />
        )}
        <Controller
          name="reconstruction"
          control={control}
          rules={{ required: "Reconstruction is required." }}
          render={({ field }) => (
            <Radio.Group
              label="Reconstruction"
              {...field}
              required
              error={errors.recon?.message}
              styles={{
                error: {
                  marginTop: 8,
                },
              }}
            >
              <Stack mt="sm">
                <Radio value="with" label="With Reconstruction" />
                <Radio value="without" label="Without Reconstruction" />
              </Stack>
            </Radio.Group>
          )}
        />
      </Stack>
    </Paper>
  );
};

export default AppointmentType;
