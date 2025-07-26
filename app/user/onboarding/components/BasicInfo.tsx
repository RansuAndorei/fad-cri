import { Paper, Stack, TextInput, Title } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { OnboardingFormValues } from "./OnboardingPage";

const BasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Basic Info
        </Title>

        <TextInput
          label="First Name"
          placeholder="Jane"
          {...register("user_first_name", { required: "First name is required" })}
          error={errors.user_first_name?.message}
          withAsterisk
        />
        <TextInput
          label="Last Name"
          placeholder="Doe"
          {...register("user_last_name", { required: "Last name is required" })}
          error={errors.user_last_name?.message}
          withAsterisk
        />
        <TextInput
          label="Email"
          placeholder="email@example.com"
          {...register("user_email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
          })}
          error={errors.user_email?.message}
          withAsterisk
          readOnly
          variant="filled"
        />
      </Stack>
    </Paper>
  );
};

export default BasicInfo;
