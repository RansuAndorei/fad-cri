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
import { fetchAppointmentDatabyAdmin, fetchSchedule } from "../actions";
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { setIsLoading } = useLoadingActions();

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [days, setDays] = useState<DayWithScheduleType[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<
    (AppointmentType & { appointment_user: UserTableRow }) | null
  >(null);
  const [opened, { open, close }] = useDisclosure(false);

  const shadowColor =
    colorScheme === "light" ? "0 4px 12px rgba(0,0,0,0.15)" : "0 4px 12px rgba(255,255,255,0.1)";
  const cardBgIndex = colorScheme === "light" ? 0 : 9;

  useEffect(() => {
    const fetchScheduleInitialData = async () => {
      if (!userData) return;

      try {
        setIsFetching(true);

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

        const schedule = await fetchSchedule(supabaseClient, {
          startDate,
          endDate,
        });

        const day = startOfMonth.clone();
        while (days.length < 42) {
          const matchedSchedule = schedule.filter((s) =>
            moment(s.appointment_schedule).isSame(day, "day"),
          );
          days.push({ day: day.clone(), schedule: matchedSchedule });
          day.add(1, "day");
        }

        let removeCount = 0;
        if (days.slice(-7).every(({ day }) => !day.isSame(currentMonth, "month"))) removeCount = 7;
        if (days.slice(-14, -7).every(({ day }) => !day.isSame(currentMonth, "month")))
          removeCount = 14;

        setDays(removeCount ? days.slice(0, -removeCount) : days);
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
              error_user_email: userData.email,
              error_user_id: userData.id,
            },
          });
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchScheduleInitialData();
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

    for (const { day, schedule } of days) {
      const map = new Map<string, ScheduleType>();
      for (const appt of schedule) {
        const timeKey = moment(appt.appointment_schedule).utcOffset(8).format("HH:mm:ss+08");
        map.set(timeKey, appt);
      }
      maps.set(day.format("YYYY-MM-DD"), map);
    }

    return maps;
  }, [days]);

  const handleMonthChange = (dir: "prev" | "next") => {
    setCurrentMonth((prev) =>
      dir === "prev" ? prev.clone().subtract(1, "month") : prev.clone().add(1, "month"),
    );
  };

  const handleAppointmentClick = async (appointmentId: string, user: UserTableRow) => {
    if (!userData) return;

    try {
      setIsLoading(true);
      const appointmentData = await fetchAppointmentDatabyAdmin(supabaseClient, { appointmentId });
      setSelectedAppointment({
        ...appointmentData,
        appointment_user: user,
      });
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
    <Box>
      {selectedAppointment && (
        <Modal opened={opened} onClose={close} size="xl" centered>
          <Flex align="center" justify="space-between" mb="sm" wrap="wrap" gap="xs">
            <Title order={4}>
              Appointment of {selectedAppointment.appointment_user.user_first_name}{" "}
              {selectedAppointment.appointment_user.user_last_name}
            </Title>
            <Badge>{selectedAppointment.appointment_status}</Badge>
          </Flex>

          <SummaryModal appointmentData={selectedAppointment} />
        </Modal>
      )}

      {/* Month Header */}
      <Card withBorder radius="md" p="sm">
        <Flex
          direction={{ base: "column", sm: "row" }} // column on mobile, row on desktop
          align="center"
          justify={{ base: "center", sm: "space-between" }} // centered on mobile, spread on desktop
          gap="sm"
        >
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => handleMonthChange("prev")}
            disabled={isFetching}
            miw={150}
          >
            Previous
          </Button>

          <Flex align="center" justify="center" miw={250}>
            <Title order={3}>{currentMonth.format("MMMM YYYY")}</Title>
          </Flex>

          <Button
            variant="light"
            rightSection={<IconArrowRight size={16} />}
            onClick={() => handleMonthChange("next")}
            disabled={isFetching}
            miw={150}
          >
            Next
          </Button>
        </Flex>
      </Card>

      {/* Day Headers */}
      <Grid columns={7} gutter="xs" mt="xl" visibleFrom="sm" mb="xs">
        {DAYS_OF_THE_WEEK.map((day) => (
          <Grid.Col key={day} span={1}>
            <Text ta="center" fw={600} c="dimmed">
              {day}
            </Text>
          </Grid.Col>
        ))}
      </Grid>

      {/* Calendar */}
      <Grid columns={7} gutter="xs">
        {isFetching &&
          Array.from({ length: 14 }).map((_, i) => (
            <Grid.Col key={i} span={{ base: 7, sm: 1 }}>
              <Skeleton height={160} />
            </Grid.Col>
          ))}

        {!isFetching &&
          days.map(({ day }, index) => {
            const isCurrentMonth = day.isSame(currentMonth, "month");
            const dayKey = toUpper(day.format("dddd"));
            const slots = scheduleSlotByDay[dayKey] ?? [];
            const apptMap = appointmentMapsByDay.get(day.format("YYYY-MM-DD")) ?? new Map();

            const mergedTimes = Array.from(new Set([...slots, ...apptMap.keys()])).sort((a, b) =>
              moment(a, "HH:mm:ssZ").diff(moment(b, "HH:mm:ssZ")),
            );

            return (
              <Grid.Col key={index} span={{ base: 7, sm: 1 }}>
                <Card
                  withBorder
                  radius="md"
                  p="xs"
                  style={{
                    opacity: isCurrentMonth ? 1 : 0,
                    display: !isCurrentMonth && window.innerWidth < 768 ? "none" : "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Text fw={600} c={"dimmed"}>
                    {day.format("D")}
                  </Text>

                  <Stack gap={6} mt={6}>
                    {mergedTimes.map((time) => {
                      const appointment = apptMap.get(time);

                      if (appointment) {
                        const client = appointment.appointment_user;

                        return (
                          <Card
                            key={appointment.appointment_id}
                            withBorder
                            p="xs"
                            radius="sm"
                            className="hover-card"
                            style={{
                              borderLeft: `4px solid ${theme.colors.blue[6]}`,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleAppointmentClick(appointment.appointment_id, client)
                            }
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)";
                              e.currentTarget.style.boxShadow = shadowColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                            }}
                          >
                            <Text size="sm" fw={500} lineClamp={1}>
                              {client.user_first_name} {client.user_last_name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatTime(new Date(appointment.appointment_schedule))}
                            </Text>
                          </Card>
                        );
                      }

                      return (
                        <Card
                          key={time}
                          withBorder
                          p="xs"
                          radius="sm"
                          bg={theme.colors.gray[cardBgIndex]}
                          style={{ borderStyle: "dashed", cursor: "pointer" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = shadowColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            {moment(time, "HH:mm:ssZ").format("hh:mm A")}
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
