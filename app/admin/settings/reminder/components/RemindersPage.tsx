"use client";

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
import { IconBell, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import ReminderEditor from "./ReminderEditor";

const RemindersPage = () => {
  const theme = useMantineTheme();

  const [reminders, setReminders] = useState([
    { id: 1, order: 1, value: "Come with clean, polish-free nails." },
    { id: 2, order: 2, value: "Sanitize your hands upon arrival." },
    {
      id: 3,
      order: 3,
      value:
        "Please do not cut, trim, file, or shape your nails beforehand — I will handle everything.",
    },
  ]);

  const [saved, setSaved] = useState(false);

  const addReminder = () => {
    setReminders([...reminders, { id: Date.now(), order: reminders.length + 1, value: "" }]);
  };

  const updateReminder = (id: number, value: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const removeReminder = (id: number) => {
    setReminders(reminders.filter((r) => r.id !== id).map((r, i) => ({ ...r, order: i + 1 })));
  };

  const moveUp = (id: number) => {
    const index = reminders.findIndex((r) => r.id === id);
    if (index > 0) {
      const next = [...reminders];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      setReminders(next.map((r, i) => ({ ...r, order: i + 1 })));
    }
  };

  const moveDown = (id: number) => {
    const index = reminders.findIndex((r) => r.id === id);
    if (index < reminders.length - 1) {
      const next = [...reminders];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      setReminders(next.map((r, i) => ({ ...r, order: i + 1 })));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

        <Paper p="xl" shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* Info Card */}
            <Paper
              p="md"
              radius="lg"
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
              p="md"
              radius="lg"
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
                p="lg"
                radius="lg"
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
                p="xl"
                radius="lg"
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
              <Button size="md" leftSection={<IconDeviceFloppy size={18} />} onClick={handleSave}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RemindersPage;
