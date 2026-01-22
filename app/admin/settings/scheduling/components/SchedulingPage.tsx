"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { DAYS_OF_THE_WEEK } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { DaysEnum, ScheduleSlotTableRow } from "@/utils/types";
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
import { notifications } from "@mantine/notifications";
import { IconClock, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { isEqual, isError } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { v4 } from "uuid";
import { updateScheduleSlots } from "../actions";
import TimeInput from "./TimeInput";

type Props = {
  scheduleSlotData: ScheduleSlotTableRow[];
  serverTime: string;
};

const SchedulingPage = ({ scheduleSlotData, serverTime }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();

  const [initialScheduleSlot, setInitialScheduleSlot] = useState(scheduleSlotData);
  const [scheduleSlots, setScheduleSlots] = useState(scheduleSlotData);
  const [isLoading, setIsLoading] = useState(false);

  const addSlot = (schedule_slot_day: DaysEnum) => {
    const newId = v4();
    setScheduleSlots([
      ...scheduleSlots,
      {
        schedule_slot_id: newId,
        schedule_slot_day,
        schedule_slot_time: "",
        schedule_slot_note: null,
      },
    ]);
  };

  const removeSlot = (schedule_slot_id: string) => {
    setScheduleSlots(scheduleSlots.filter((slot) => slot.schedule_slot_id !== schedule_slot_id));
  };

  const updateSlot = (schedule_slot_id: string, value: string) => {
    setScheduleSlots(
      scheduleSlots.map((slot) =>
        slot.schedule_slot_id === schedule_slot_id ? { ...slot, schedule_slot_time: value } : slot,
      ),
    );
  };

  const updateNote = (schedule_slot_id: string, value: string) => {
    setScheduleSlots(
      scheduleSlots.map((slot) =>
        slot.schedule_slot_id === schedule_slot_id ? { ...slot, schedule_slot_note: value } : slot,
      ),
    );
  };

  const hasDuplicateSchedules = (slots: typeof scheduleSlots) => {
    const seen = new Set<string>();

    for (const slot of slots) {
      const key = `${slot.schedule_slot_day}-${slot.schedule_slot_time}`;
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }

    return false;
  };

  const handleSave = async () => {
    if (!userData) return;

    if (hasDuplicateSchedules(scheduleSlots)) {
      notifications.show({
        message: "Duplicate schedules are not allowed. Please check the day and time.",
        color: "red",
      });
      return;
    }

    try {
      setIsLoading(true);
      const userOffset = new Date(serverTime).getTimezoneOffset();
      const scheduleSlotsWithTZ = scheduleSlots.map((slot) => ({
        ...slot,
        schedule_slot_time: moment(slot.schedule_slot_time, "HH:mm")
          .utcOffset(-userOffset)
          .format("HH:mm:ssZ"),
      }));
      await updateScheduleSlots(supabaseClient, { scheduleSlots: scheduleSlotsWithTZ });
      setInitialScheduleSlot(scheduleSlots);

      notifications.show({
        message: "Schedule slots updated successfully.",
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
            error_function: "handleSave",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const groupedSlots = DAYS_OF_THE_WEEK.map((day) => ({
    day,
    slots: scheduleSlots.filter((slot) => slot.schedule_slot_day === day),
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

        <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* Grouped by Day */}
            {groupedSlots.map(({ day, slots }) => (
              <Paper
                key={day}
                p={{ base: "sm", xs: "xl" }}
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
                      <Flex
                        key={slot.schedule_slot_id}
                        align="center"
                        justify="center"
                        gap="md"
                        wrap="wrap"
                      >
                        <Badge variant="light" radius="xl" h={30} color="yellow">
                          {index + 1}
                        </Badge>
                        <TimeInput
                          schedule_slot_id={slot.schedule_slot_id}
                          value={slot.schedule_slot_time}
                          updateSlot={updateSlot}
                        />
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
                          value={slot.schedule_slot_note || ""}
                          onChange={(e) => {
                            updateNote(slot.schedule_slot_id, e.currentTarget.value);
                          }}
                        />

                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeSlot(slot.schedule_slot_id)}
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

            <Flex align="center" justify="flex-end">
              <Button
                size="md"
                leftSection={<IconDeviceFloppy size={18} />}
                onClick={handleSave}
                loading={isLoading}
                disabled={isEqual(initialScheduleSlot, scheduleSlots)}
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

export default SchedulingPage;
