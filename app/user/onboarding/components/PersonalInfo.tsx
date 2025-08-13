import { GENDER_OPTION } from "@/utils/constants";
import { OnboardingFormValues } from "@/utils/types";
import { Paper, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useFormContext } from "react-hook-form";

const PersonalInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Personal Info
        </Title>

        <Controller
          name="user_gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <Select
              label="Gender"
              placeholder="Select gender"
              data={GENDER_OPTION}
              {...field}
              error={errors.user_gender?.message}
              withAsterisk
            />
          )}
        />
        <Controller
          name="user_birth_date"
          control={control}
          rules={{ required: "Birth date is required" }}
          render={({ field }) => (
            <DateInput
              label="Birth Date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              {...field}
              error={errors.user_birth_date?.message}
              withAsterisk
            />
          )}
        />
        <TextInput
          label="Phone Number"
          leftSection={<Text size="sm">+63</Text>}
          placeholder="9XXXXXXXXXX"
          maxLength={10}
          required
          {...register("user_phone_number", {
            required: "Phone Number is required",
            validate: {
              isValidContactNumber: (value) => {
                if (!value) return true;
                const regex = /^9\d{9}$/;
                return regex.test(value as string) || "Invalid contact number";
              },
            },
          })}
          error={errors.user_phone_number?.message}
        />
      </Stack>
    </Paper>
  );
};

export default PersonalInfo;
