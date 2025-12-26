"use client";

import { insertError } from "@/app/actions";
import { useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData } from "@/stores/useUserStore";
import { DAYS_OF_THE_WEEK } from "@/utils/constants";
import { formatTime } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AppointmentType, ScheduleSlotTableRow, ScheduleType, UserTableRow } from "@/utils/types";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { isError, toUpper } from "lodash";
import moment, { Moment } from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAppointmentDatabyAdmin, getSchedule } from "../action";
import SummaryModal from "./SummaryModal";

type DayWithScheduleType = {
  schedule: ScheduleType[];
  day: Moment;
};

type Props = {
  scheduleSlot: ScheduleSlotTableRow[];
};

const SchedulePage = ({ scheduleSlot }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();
  const { colors } = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { setIsLoading } = useLoadingActions();

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [days, setDays] = useState<DayWithScheduleType[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<
    (AppointmentType & { appointment_user: UserTableRow }) | null
  >(null);

  const [opened, { open, close }] = useDisclosure(false);

  const cardColor = colorScheme === "light" ? 0 : 9;
  const textColor = colorScheme === "light" ? 3 : 9;
  const shadowColor =
    colorScheme === "light" ? "0 4px 12px rgba(0,0,0,0.15)" : "0 4px 12px rgba(255,255,255,0.1)";

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsFetching(true);
      try {
        const days: DayWithScheduleType[] = [];

        const startOfMonth = currentMonth.clone().startOf("month").startOf("week");
        const startDate = currentMonth
          .clone()
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ssZ");
        const endDate = currentMonth
          .clone()
          .endOf("month")
          .hour(23)
          .minute(59)
          .second(59)
          .format("YYYY-MM-DD HH:mm:ssZ");

        const day = startOfMonth.clone();
        const schedule = await getSchedule(supabaseClient, { startDate, endDate });

        while (days.length < 42) {
          const matchedSchedule = schedule.filter((s) =>
            moment(s.appointment_schedule).isSame(day, "day"),
          );
          days.push({ day: day.clone(), schedule: matchedSchedule });
          day.add(1, "day");
        }

        if (
          days
            .slice(days.length - 7, days.length)
            .every(({ day }) => !day.isSame(currentMonth, "month"))
        ) {
          setDays(days.slice(0, days.length - 7));
        } else {
          setDays(days);
        }
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
              error_function: "fetchSchedule",
              error_user_email: userData?.email,
              error_user_id: userData?.id,
            },
          });
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchSchedule();
  }, [currentMonth]);

  const scheduleSlotByDay = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const slot of scheduleSlot) {
      const dayKey = slot.schedule_slot_day;
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(slot.schedule_slot_time);
    }
    return grouped;
  }, [scheduleSlot]);

  const appointmentMapsByDay = useMemo(() => {
    const maps = new Map<string, Map<string, ScheduleType>>();
    for (const { day, schedule: scheduleForDay } of days) {
      const dayKey = day.format("YYYY-MM-DD");
      const map = new Map<string, ScheduleType>();
      for (const appt of scheduleForDay) {
        const apptTime = moment(appt.appointment_schedule).utcOffset(8).format("HH:mm:ss+08");
        map.set(apptTime, appt);
      }
      maps.set(dayKey, map);
    }
    return maps;
  }, [days]);

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      direction === "prev" ? prev.clone().subtract(1, "month") : prev.clone().add(1, "month"),
    );
  };

  const handleAppointmentClick = async (appointmentId: string, user: UserTableRow) => {
    try {
      setIsLoading(true);
      const appointmentData = await getAppointmentDatabyAdmin(supabaseClient, {
        appointmentId,
      });
      setSelectedAppointment({ ...appointmentData, appointment_user: user });
      open();
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
            error_function: "handleAppointmentClick",
            error_user_email: userData?.email,
            error_user_id: userData?.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box h="100%">
      {selectedAppointment ? (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Flex align="center" justify="center" gap="sm">
              <Title
                order={4}
              >{`Appointment of ${[selectedAppointment.appointment_user.user_first_name, selectedAppointment.appointment_user.user_last_name].join(" ")}`}</Title>
              <Badge
                color={selectedAppointment.appointment_status === "SCHEDULED" ? "blue" : "green"}
              >
                {selectedAppointment.appointment_status}
              </Badge>
            </Flex>
          }
          size="xl"
        >
          <SummaryModal appointmentData={selectedAppointment} />
        </Modal>
      ) : null}
      <Flex align="center" gap="sm" wrap="wrap">
        <Button
          variant="subtle"
          onClick={() => handleMonthChange("prev")}
          leftSection={<IconArrowLeft size={14} />}
          disabled={isFetching}
        >
          Previous
        </Button>
        <Flex align="center" justify="center" w="190">
          <Title order={2}>{currentMonth.format("MMMM YYYY")}</Title>
        </Flex>
        <Button
          variant="subtle"
          onClick={() => handleMonthChange("next")}
          rightSection={<IconArrowRight size={14} />}
          disabled={isFetching}
        >
          Next
        </Button>
      </Flex>

      <Grid columns={7} gutter="xs" mt="md" align="stretch">
        {DAYS_OF_THE_WEEK.map((day) => (
          <Grid.Col key={day} span={1}>
            <Card
              withBorder
              padding="sm"
              radius="md"
              style={{ border: `solid 1px ${colors.cyan[6]}` }}
            >
              <Flex align="center" justify="center">
                <Text fw="bold">{day}</Text>
              </Flex>
            </Card>
          </Grid.Col>
        ))}

        {isFetching
          ? DAYS_OF_THE_WEEK.map(() =>
              [...Array(3).keys()].map((index) => (
                <Grid.Col key={index} span={1}>
                  <Skeleton height={150} />
                </Grid.Col>
              )),
            )
          : null}

        {!isFetching &&
          days.map(({ day }, index) => {
            const isCurrentMonth = day.isSame(currentMonth, "month");

            const dayKey = toUpper(day.format("dddd"));
            const scheduleSlotForTheDay = scheduleSlotByDay[dayKey] ?? [];
            const apptMap = appointmentMapsByDay.get(day.format("YYYY-MM-DD")) ?? new Map();

            const allTimesSet = new Set([...scheduleSlotForTheDay, ...Array.from(apptMap.keys())]);

            const mergedSchedule = Array.from(allTimesSet)
              .sort((a, b) => moment(a, "HH:mm:ssZ").diff(moment(b, "HH:mm:ssZ")))
              .map((time) => ({
                schedule_slot_time: time,
                appointment: (apptMap.get(time) as ScheduleType) || null,
              }));
            return (
              <Grid.Col key={index} span={1}>
                <Card
                  withBorder
                  padding="sm"
                  radius="md"
                  style={{
                    opacity: isCurrentMonth ? 1 : 0,
                    height: "100%",
                  }}
                >
                  <Text fw={500}>{day.format("D")}</Text>

                  <Stack gap="xs" mt="xs">
                    {mergedSchedule.map(({ schedule_slot_time, appointment }) => {
                      if (appointment) {
                        const client = appointment.appointment_user;
                        const statusColor =
                          appointment.appointment_status === "SCHEDULED" ? "blue" : "green";

                        return (
                          <Card
                            key={appointment.appointment_id}
                            radius="md"
                            withBorder
                            style={{
                              borderColor: colors[statusColor][6],
                              backgroundColor: colors[statusColor][cardColor],
                              cursor: "pointer",
                              transition: "transform 0.1s ease, box-shadow 0.1s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)";
                              e.currentTarget.style.boxShadow = shadowColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                            }}
                            onClick={() => {
                              handleAppointmentClick(
                                appointment.appointment_id,
                                appointment.appointment_user,
                              );
                            }}
                          >
                            <Group justify="space-between">
                              <Text fw={500}>
                                {[client.user_first_name, client.user_last_name].join(" ")}
                              </Text>
                            </Group>
                            <Text size="sm" c={colors["dark"][textColor]}>
                              {formatTime(new Date(appointment.appointment_schedule))}
                            </Text>
                          </Card>
                        );
                      }

                      return (
                        <Card
                          key={schedule_slot_time}
                          radius="md"
                          style={{
                            backgroundColor: colors.gray[cardColor],
                            cursor: "pointer",
                            transition: "transform 0.1s ease, box-shadow 0.1s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = shadowColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                          }}
                        >
                          <Text size="sm" c="dimmed">
                            {moment(schedule_slot_time, "HH:mm:ssZ").format("hh:mm A")}
                          </Text>
                        </Card>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
      </Grid>
    </Box>
  );
};

export default SchedulePage;
