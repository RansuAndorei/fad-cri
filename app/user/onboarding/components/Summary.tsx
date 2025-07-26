"use client";

import { mobileNumberFormatter } from "@/utils/functions";
import { Avatar, Divider, Flex, Group, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconCake,
  IconGenderBigender,
  IconGenderFemale,
  IconGenderMale,
  IconPhone,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { capitalize } from "lodash";
import { useFormContext } from "react-hook-form";
import { OnboardingFormValues } from "./OnboardingPage";

const Summary = () => {
  const { watch } = useFormContext<OnboardingFormValues>();

  const {
    user_first_name,
    user_last_name,
    user_email,
    user_phone_number,
    user_gender,
    user_birth_date,
    user_avatar,
  } = watch();

  const genderIcon = {
    MALE: <IconGenderMale size={16} color="gray" />,
    FEMALE: <IconGenderFemale size={16} color="gray" />,
    OTHER: <IconGenderBigender size={16} color="gray" />,
  }[user_gender ?? "OTHER"];

  const avatarUrl = user_avatar
    ? typeof user_avatar === "string"
      ? user_avatar
      : URL.createObjectURL(user_avatar)
    : null;

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Review Your Details
        </Title>

        <Group>
          <Avatar src={avatarUrl} radius={100} size="xl" alt="Avatar Preview" />
          <Stack gap={0}>
            <Text fw={500}>
              {user_first_name} {user_last_name}
            </Text>
            <Text c="dimmed" size="sm">
              {user_email}
            </Text>
          </Stack>
        </Group>

        <Divider my="sm" />

        <Stack gap="xs">
          {user_phone_number && (
            <Flex gap="sm" align="center">
              <IconPhone size={16} color="gray" />
              <Text w={80} c="dimmed">
                Phone:
              </Text>
              <Text>{mobileNumberFormatter(user_phone_number)}</Text>
            </Flex>
          )}

          {user_gender && (
            <Flex gap="sm" align="center">
              {genderIcon}
              <Text w={80} c="dimmed">
                Gender:
              </Text>
              <Text>{capitalize(user_gender)}</Text>
            </Flex>
          )}

          {user_birth_date && (
            <Flex gap="sm" align="center">
              <IconCake size={16} color="gray" />
              <Text w={80} c="dimmed">
                Birthdate:
              </Text>
              <Text>{dayjs(user_birth_date).format("MMMM D, YYYY")}</Text>
            </Flex>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Summary;
