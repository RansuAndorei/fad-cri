"use client";

import { DAYS_OF_THE_WEEK } from "@/utils/constants";
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
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconClock, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import TimeInput from "./TimeInput";

const SchedulingPage = () => {
  const theme = useMantineTheme();

  const [scheduleSlots, setScheduleSlots] = useState([
    { id: 1, day: "SUNDAY", time: "12:00", additionalNote: "" },
    { id: 2, day: "SUNDAY", time: "15:00", additionalNote: "" },
    { id: 3, day: "SUNDAY", time: "18:00", additionalNote: "" },
    { id: 4, day: "MONDAY", time: "12:00", additionalNote: "" },
    { id: 5, day: "MONDAY", time: "15:00", additionalNote: "" },
    { id: 6, day: "MONDAY", time: "18:00", additionalNote: "" },
    { id: 7, day: "TUESDAY", time: "12:00", additionalNote: "" },
    { id: 8, day: "TUESDAY", time: "15:00", additionalNote: "" },
    { id: 9, day: "TUESDAY", time: "18:00", additionalNote: "" },
  ]);

  const [saved, setSaved] = useState(false);

  const addSlot = (day: string) => {
    const newId = Math.max(...scheduleSlots.map((s) => s.id)) + 1;
    setScheduleSlots([...scheduleSlots, { id: newId, day, time: "", additionalNote: "" }]);
  };

  const removeSlot = (id: number) => {
    setScheduleSlots(scheduleSlots.filter((slot) => slot.id !== id));
  };

  const updateSlot = (id: number, field: "day" | "time", value: string) => {
    setScheduleSlots(
      scheduleSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)),
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const groupedSlots = DAYS_OF_THE_WEEK.map((day) => ({
    day,
    slots: scheduleSlots.filter((slot) => slot.day === day),
  }));

  return (
    <Container p={0} maw={1024}>
      <Stack>
        {/* Header */}
        <Group>
          <Box>
            <Title order={2}>Scheduling</Title>
            <Text c="dimmed">Configure available time slots for booking</Text>
          </Box>
        </Group>

        <Paper p="xl" shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* Grouped by Day */}
            {groupedSlots.map(({ day, slots }) => (
              <Paper
                key={day}
                p="xl"
                radius="lg"
                shadow="xs"
                style={{ border: `2px solid ${theme.colors.cyan[2]}` }}
              >
                <Flex mb="md" align="center" gap="md">
                  <IconClock size={24} color={theme.colors.cyan[6]} />
                  <Badge size="lg" variant="light" color="cyan">
                    {day}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    {slots.length} slot{slots.length !== 1 ? "s" : ""}
                  </Text>
                </Flex>

                <Divider my="md" />

                {slots.length === 0 ? (
                  <Text c="dimmed" ta="center" py="md">
                    No slots for this day
                  </Text>
                ) : (
                  <Stack gap="md">
                    {slots.map((slot, index) => (
                      <Flex key={slot.id} align="center" justify="center" gap="md" wrap="wrap">
                        <Badge variant="light" radius="xl" h={30} color="yellow">
                          {index + 1}
                        </Badge>
                        <TimeInput id={slot.id} value={slot.time} updateSlot={updateSlot} />
                        <TextInput
                          styles={{
                            input: {
                              border: `2px solid ${theme.colors.cyan[2]}`,
                            },
                          }}
                          style={{ flex: 1 }}
                          size="md"
                          placeholder="Additional note"
                          miw={200}
                        />

                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeSlot(slot.id)}
                          size="lg"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Stack>
                )}
                <Button
                  mt="lg"
                  variant="light"
                  leftSection={<IconPlus size={14} />}
                  fullWidth
                  onClick={() => addSlot(day)}
                >
                  Add Slot
                </Button>
              </Paper>
            ))}

            {/* Save Button */}
            <Group justify="flex-end">
              <Button
                leftSection={<IconDeviceFloppy size={20} />}
                onClick={handleSave}
                size="md"
                radius="md"
              >
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SchedulingPage;
