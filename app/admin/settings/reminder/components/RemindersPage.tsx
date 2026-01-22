"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBell, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { isEqualWith, isError } from "lodash";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { v4 } from "uuid";
import { insertReminders } from "../actions";
import ReminderEditor from "./ReminderEditor";

type Props = {
  reminderList: { id: string; order: number; value: string }[];
};

const RemindersPage = ({ reminderList }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();

  const [initialReminders, setInitialReminders] =
    useState<{ id: string; order: number; value: string; error?: string }[]>(reminderList);
  const [reminders, setReminders] =
    useState<{ id: string; order: number; value: string; error?: string }[]>(reminderList);
  const [isLoading, setIsLoading] = useState(false);

  const addReminder = () => {
    setReminders([...reminders, { id: v4(), order: reminders.length + 1, value: "" }]);
  };

  const updateReminder = (id: string, value: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id).map((r, i) => ({ ...r, order: i + 1 })));
  };

  const moveUp = (id: string) => {
    const index = reminders.findIndex((r) => r.id === id);
    if (index > 0) {
      const next = [...reminders];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      setReminders(next.map((r, i) => ({ ...r, order: i + 1 })));
    }
  };

  const moveDown = (id: string) => {
    const index = reminders.findIndex((r) => r.id === id);
    if (index < reminders.length - 1) {
      const next = [...reminders];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      setReminders(next.map((r, i) => ({ ...r, order: i + 1 })));
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    if (!reminders.length) {
      notifications.show({
        message: "At least 1 reminder is required.",
        color: "orange",
      });
      setIsLoading(false);
      return;
    }

    let hasError = false;
    const seenValues = new Set<string>();

    const validatedReminders = reminders.map((r) => {
      let error = "";

      if (!r.value) {
        error = "Reminder cannot be empty";
        hasError = true;
      } else if (seenValues.has(r.value)) {
        error = "Duplicate reminder";
        hasError = true;
      } else {
        seenValues.add(r.value);
      }

      return { ...r, error };
    });
    setReminders(validatedReminders);

    if (hasError) {
      notifications.show({
        message: "Please fix errors before saving.",
        color: "orange",
      });
      return;
    }
    try {
      setIsLoading(true);
      await insertReminders(supabaseClient, { reminders: validatedReminders });
      setInitialReminders(validatedReminders);

      notifications.show({
        message: "Reminders updated successfully.",
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
            error_function: "handleSaveReminders",
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
    <Container p={0} maw={1024} h="100%">
      <Stack>
        <Group>
          <Box>
            <Title order={2}> Customer Reminders</Title>
            <Text c="dimmed">Manage messages shown to clients before booking</Text>
          </Box>
        </Group>

        <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* Info Card */}
            <Paper
              p={{ base: "sm", xs: "md" }}
              radius="md"
              shadow="sm"
              style={{
                border: `2px solid ${theme.colors.yellow[2]}`,
                backgroundColor: theme.colors.yellow[0],
              }}
            >
              <Group>
                <IconBell size={20} color={theme.colors.yellow[7]} />
                <Text size="sm" fw={500} c="yellow.8">
                  These reminders will be displayed to customers during the booking process
                </Text>
              </Group>
            </Paper>
            {/* List Card */}
            <Paper
              p={{ base: "sm", xs: "md" }}
              radius="md"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
            >
              <Group justify="space-between">
                <Box>
                  <Text fw={600} size="lg" c="cyan.8">
                    Reminder List
                  </Text>
                  <Text size="sm" c="dimmed">
                    {reminders.length} reminder
                    {reminders.length !== 1 ? "s" : ""} configured
                  </Text>
                </Box>
              </Group>
            </Paper>
            {reminders.map((reminder, index) => (
              <Paper
                key={reminder.id}
                p={{ base: "sm", xs: "lg" }}
                radius="md"
                shadow="sm"
                style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
              >
                <Group align="flex-start">
                  <Badge size="lg" variant="light" color="cyan" miw={50}>
                    #{reminder.order}
                  </Badge>

                  <Box flex={1}>
                    <Text size="sm" c="dimmed" mb={8}>
                      Reminder {reminder.order}
                    </Text>
                    <ReminderEditor
                      value={reminder.value}
                      onChange={(value) => updateReminder(reminder.id, value)}
                    />
                    {reminder.error ? <Text c="red">{reminder.error}</Text> : null}
                  </Box>
                </Group>

                <Divider my="sm" />

                <Group justify="space-between">
                  <Group>
                    <Button
                      size="xs"
                      variant="subtle"
                      disabled={index === 0}
                      onClick={() => moveUp(reminder.id)}
                    >
                      Move Up
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      disabled={index === reminders.length - 1}
                      onClick={() => moveDown(reminder.id)}
                    >
                      Move Down
                    </Button>
                  </Group>

                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeReminder(reminder.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            {/* Empty State */}
            {reminders.length === 0 && (
              <Paper
                p={{ base: "sm", xs: "xl" }}
                radius="md"
                shadow="sm"
                style={{
                  border: `2px dashed ${theme.colors.cyan[2]}`,
                  textAlign: "center",
                }}
              >
                <IconBell
                  size={48}
                  color={theme.colors.cyan[2]}
                  style={{ margin: "0 auto 16px" }}
                />
                <Text c="dimmed" size="lg" mb="md">
                  No reminders yet
                </Text>

                <Button
                  leftSection={<IconPlus size={18} />}
                  onClick={addReminder}
                  variant="light"
                  color="cyan"
                  radius="md"
                >
                  Add Your First Reminder
                </Button>
              </Paper>
            )}

            {reminders.length > 0 ? (
              <Button leftSection={<IconPlus size={18} />} onClick={addReminder} variant="light">
                Add Reminder
              </Button>
            ) : null}
            <Flex align="center" justify="flex-end">
              <Button
                size="md"
                leftSection={<IconDeviceFloppy size={18} />}
                onClick={handleSave}
                loading={isLoading}
                disabled={isEqualWith(reminders, initialReminders, (_objVal, _othVal, key) => {
                  if (key === "error") return true;
                })}
              >
                Save
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RemindersPage;
