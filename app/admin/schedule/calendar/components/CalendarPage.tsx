"use client";

import { insertError, uploadImage } from "@/app/actions";
import { updateAppointment } from "@/app/api/paymongo/webhook/actions";
import { recheckSchedule } from "@/app/user/booking/actions";
import { useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData } from "@/stores/useUserStore";
import {
  DATE_AND_TIME_FORMAT,
  DATE_FORMAT,
  DAYS_OF_THE_WEEK,
  TIME_FORMAT,
} from "@/utils/constants";
import { combineDateTime, formatTime, isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  AppointmentStatusEnum,
  AppointmentType,
  BlockedScheduleTableRow,
  CompleteScheduleType,
  RescheduleScheduleType,
  ScheduleSlotTableRow,
  ScheduleType,
  UserTableRow,
} from "@/utils/types";
import {
  ActionIcon,
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
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconArrowRight, IconBan, IconX } from "@tabler/icons-react";
import { toUpper } from "lodash";
import moment, { Moment } from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  cancelAppointment,
  completeSchedule,
  deleteBlockedSchedule,
  fetchAppointmentDatabyAdmin,
  fetchBlockedSchedules,
  fetchSchedule,
  upsertBlockedSchedule,
} from "../actions";
import CompleteModal from "./CompleteModal";
import RescheduleModal from "./RescheduleModal";
import SummaryModal from "./SummaryModal";

type DayWithScheduleType = {
  schedule: ScheduleType[];
  day: Moment;
  isDayBlocked: boolean;
};

const scheduleStatusToColor = {
  SCHEDULED: "blue",
  COMPLETED: "green",
} as Record<AppointmentStatusEnum, string>;

type Props = {
  scheduleSlot: ScheduleSlotTableRow[];
  serverTime: string;
};

const CalendarPage = ({ scheduleSlot, serverTime }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const { setIsLoading } = useLoadingActions();

  const [currentMonth, setCurrentMonth] = useState(moment(serverTime));
  const [days, setDays] = useState<DayWithScheduleType[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [blockedSchedules, setBlockedSchedules] = useState<BlockedScheduleTableRow[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<
    (AppointmentType & { appointment_user: UserTableRow }) | null
  >(null);

  const [
    selectedAppointmentOpened,
    { open: openSelectedAppointmentModal, close: closeSelectedAppointmentModal },
  ] = useDisclosure(false);
  const [rescheduleModalOpened, { open: openRescheduleModal, close: closeRescheduleModal }] =
    useDisclosure(false);
  const [completeModalOpened, { open: openCompleteModal, close: closeCompleteModal }] =
    useDisclosure(false);

  const shadowColor = isDark ? "0 4px 12px rgba(255,255,255,0.1)" : "0 4px 12px rgba(0,0,0,0.15)";
  const cardBgIndex = isDark ? 9 : 0;

  useEffect(() => {
    fetchScheduleInitialData();
  }, [currentMonth]);

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
        .format(DATE_AND_TIME_FORMAT);

      const endDate = currentMonth
        .clone()
        .endOf("month")
        .hour(23)
        .minute(59)
        .second(59)
        .format(DATE_AND_TIME_FORMAT);

      const [schedule, blockedData] = await Promise.all([
        fetchSchedule(supabaseClient, { startDate, endDate }),
        fetchBlockedSchedules(supabaseClient, {
          startDate: currentMonth.clone().startOf("month").format(DATE_FORMAT),
          endDate: currentMonth.clone().endOf("month").format(DATE_FORMAT),
        }),
      ]);

      setBlockedSchedules(blockedData);

      const day = startOfMonth.clone();
      while (days.length < 42) {
        const dateKey = day.format(DATE_FORMAT);
        const matchedSchedule = schedule.filter((s) =>
          moment(s.appointment_schedule).isSame(day, "day"),
        );

        const isDayBlocked = blockedData.some(
          (blocked) =>
            blocked.blocked_schedule_date === dateKey && blocked.blocked_schedule_time === null,
        );

        days.push({
          day: day.clone(),
          schedule: matchedSchedule,
          isDayBlocked,
        });
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

      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "fetchScheduleInitialData",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsFetching(false);
    }
  };

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
        const timeKey = moment(appt.appointment_schedule).format(TIME_FORMAT);
        map.set(timeKey, appt);
      }
      maps.set(day.format(DATE_FORMAT), map);
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
      openSelectedAppointmentModal();
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
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

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!userData) return;
    try {
      setIsLoading(true);
      await cancelAppointment(supabaseClient, { appointmentId });
      await fetchScheduleInitialData();
      setSelectedAppointment(null);
    } catch (e) {
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleCancelAppointment",
            error_user_id: userData.id,
          },
        });
      }
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async (data: RescheduleScheduleType) => {
    if (!userData || !selectedAppointment) return;
    try {
      setIsLoading(true);
      const { scheduleDate, scheduleTime } = data;

      const combinedDateAndTime = combineDateTime(scheduleDate, scheduleTime);

      const isStillAvailable = await recheckSchedule(supabaseClient, {
        schedule: combinedDateAndTime,
      });
      if (!isStillAvailable) {
        notifications.show({
          message: "Sorry, this schedule is no longer available. Please select a different time.",
          color: "orange",
        });
        closeRescheduleModal();
        openSelectedAppointmentModal();
        setIsLoading(false);
        return;
      }

      await updateAppointment(supabaseClient, {
        appointmentData: {
          appointment_schedule: combinedDateAndTime,
        },
        appointmentId: selectedAppointment.appointment_id,
      });
      await fetchScheduleInitialData();

      closeRescheduleModal();
      notifications.show({
        message: "Schedule successfully updated.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleReschedule",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (data: CompleteScheduleType) => {
    const { image, price } = data;
    if (!userData || !selectedAppointment || !image) return;
    try {
      setIsLoading(true);

      const { publicUrl } = await uploadImage(supabaseClient, {
        image,
        bucket: "COMPLETED_NAILS",
        fileName: image.name,
      });

      const imageData = {
        attachment_name: image.name,
        attachment_path: publicUrl,
        attachment_bucket: "COMPLETED_NAILS",
        attachment_mime_type: image.type,
        attachment_size: image.size,
      };
      await completeSchedule(supabaseClient, {
        appointmentId: selectedAppointment.appointment_id,
        price,
        imageData,
      });
      await fetchScheduleInitialData();

      closeCompleteModal();
      notifications.show({
        message: "Schedule successfully completed.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleComplete",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUpdateDateModal = (
    date: string,
    time: string | null,
    action: "enable" | "disable",
  ) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure you want to {action} this {time ? "time" : "date"}?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => handleUpdateDate(date, time, action),
      centered: true,
      confirmProps: {
        color: action === "disable" ? "red" : "green",
      },
    });

  const handleUpdateDate = async (
    date: string,
    time: string | null,
    action: "enable" | "disable",
  ) => {
    if (!userData) return;
    try {
      setIsLoading(true);

      if (action === "disable") {
        await upsertBlockedSchedule(supabaseClient, {
          day: date,
          time: time,
        });
      } else if (action === "enable") {
        await deleteBlockedSchedule(supabaseClient, {
          day: date,
          time: time,
        });
      }
      await fetchScheduleInitialData();

      notifications.show({
        message: "Schedule updated.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleDisableDay",
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
        <Modal
          opened={selectedAppointmentOpened}
          onClose={closeSelectedAppointmentModal}
          size="xl"
          centered
        >
          <Flex align="center" justify="space-between" mb="sm" wrap="wrap" gap="xs">
            <Title order={4}>
              Appointment of {selectedAppointment.appointment_user.user_first_name}{" "}
              {selectedAppointment.appointment_user.user_last_name}
            </Title>
            <Badge color={scheduleStatusToColor[selectedAppointment.appointment_status]}>
              {selectedAppointment.appointment_status}
            </Badge>
          </Flex>

          <SummaryModal
            appointmentData={selectedAppointment}
            handleCancelAppointment={handleCancelAppointment}
            openRescheduleModal={openRescheduleModal}
            closeSelectedAppointmentModal={closeSelectedAppointmentModal}
            openCompleteModal={openCompleteModal}
          />
        </Modal>
      )}

      {/* Month Header */}
      <Card withBorder radius="md" p="sm" mb="md">
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="center"
          justify={{ base: "center", sm: "space-between" }}
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

      {/* Legend */}
      <Card withBorder radius="md" p="md" mb="md">
        <Group gap="lg" wrap="wrap">
          <Group gap="xs">
            <Box
              w={16}
              h={16}
              style={(theme) => ({
                border: `1px dashed ${theme.colors.gray[4]}`,
                backgroundColor: theme.colors.gray[0],
              })}
            />
            <Text size="sm">Available</Text>
          </Group>

          <Group gap="xs">
            <Box
              w={16}
              h={16}
              style={(theme) => ({
                borderLeft: `4px solid ${theme.colors.blue[6]}`,
                backgroundColor: "white",
              })}
            />
            <Text size="sm">Scheduled</Text>
          </Group>

          <Group gap="xs">
            <Box
              w={16}
              h={16}
              style={(theme) => ({
                borderLeft: `4px solid ${theme.colors.green[6]}`,
                backgroundColor: "white",
              })}
            />
            <Text size="sm">Completed</Text>
          </Group>

          <Group gap="xs">
            <Box
              w={16}
              h={16}
              style={(theme) => ({
                border: `1px solid ${theme.colors.red[4]}`,
                backgroundColor: theme.colors.red[0],
              })}
            />
            <Text size="sm">Blocked</Text>
          </Group>
        </Group>
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
          days.map(({ day, isDayBlocked }, index) => {
            const isCurrentMonth = day.isSame(currentMonth, "month");
            let isSameDay = false;
            if (isCurrentMonth) {
              isSameDay = moment(day).isSame(serverTime, "day");
            }

            const dayKey = toUpper(day.format("dddd"));
            const dateKey = day.format(DATE_FORMAT);
            const slots = scheduleSlotByDay[dayKey] ?? [];
            const apptMap: Map<string, AppointmentType & { appointment_user: UserTableRow }> =
              appointmentMapsByDay.get(dateKey) ?? new Map();

            const blockedTimesForDate = blockedSchedules
              .filter(
                (b) => b.blocked_schedule_date === dateKey && b.blocked_schedule_time !== null,
              )
              .map((b) => b.blocked_schedule_time);

            const mergedTimes = Array.from(new Set([...slots, ...apptMap.keys()])).sort((a, b) =>
              moment(a, TIME_FORMAT).diff(moment(b, TIME_FORMAT)),
            );

            const isWithSchedule = mergedTimes.some((time) => apptMap.get(time));
            const isFutureDate = dateKey >= serverTime;

            return (
              <Grid.Col key={index} span={{ base: 7, sm: 1 }}>
                <Card
                  withBorder
                  radius="md"
                  p="xs"
                  style={(theme) => ({
                    opacity: isCurrentMonth ? (isDayBlocked ? 0.5 : 1) : 0,
                    display: !isCurrentMonth && window.innerWidth < 768 ? "none" : "flex",
                    flexDirection: "column",
                    height: "100%",
                    border: `1px solid ${
                      isSameDay
                        ? theme.colors.yellow[6]
                        : isDayBlocked
                          ? theme.colors.red[4]
                          : theme.colors.gray[4]
                    }`,
                    backgroundColor: isDayBlocked
                      ? theme.colors.red[0]
                      : isDark
                        ? "black"
                        : "white",
                    boxShadow: isSameDay
                      ? "0 0 0 2px rgba(234, 179, 8, 0.4), 0 0 12px rgba(234, 179, 8, 0.6)"
                      : "none",
                    transition: "all 0.2s ease",
                    position: "relative",
                  })}
                >
                  {/* Diagonal stripes for blocked days */}
                  {isDayBlocked && (
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(239, 68, 68, 0.05) 10px,
                          rgba(239, 68, 68, 0.05) 20px
                        )`,
                        pointerEvents: "none",
                        borderRadius: "inherit",
                      }}
                    />
                  )}

                  <Group justify="space-between" mb={4} style={{ position: "relative", zIndex: 1 }}>
                    <Text fw={600} c={isDayBlocked ? "red" : "dimmed"}>
                      {day.format("D")}
                    </Text>
                    {isDayBlocked && (
                      <Badge
                        size="xs"
                        color="red"
                        variant="filled"
                        style={{ cursor: "pointer" }}
                        onClick={() => confirmUpdateDateModal(dateKey, null, "enable")}
                      >
                        Disabled
                      </Badge>
                    )}
                    {!isDayBlocked && isFutureDate && !isWithSchedule && (
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        color="red"
                        onClick={() => confirmUpdateDateModal(dateKey, null, "disable")}
                      >
                        <IconBan size={14} />
                      </ActionIcon>
                    )}
                  </Group>

                  <Stack gap={6} mt={6} style={{ position: "relative", zIndex: 1 }}>
                    {mergedTimes.map((time) => {
                      const appointment = apptMap.get(time);
                      const isTimeBlocked = blockedTimesForDate.includes(time);

                      if (appointment) {
                        const client = appointment.appointment_user;
                        return (
                          <Card
                            key={appointment.appointment_id}
                            withBorder
                            p="xs"
                            radius="sm"
                            style={{
                              borderLeft: `4px solid ${theme.colors[scheduleStatusToColor[appointment.appointment_status]][6]}`,
                              cursor: isCurrentMonth ? "pointer" : "default",
                              transition: "all 0.2s ease",
                            }}
                            onClick={() => {
                              if (!isCurrentMonth) return;
                              handleAppointmentClick(appointment.appointment_id, client);
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
                            <Text size="sm" fw={500} lineClamp={1}>
                              {client.user_first_name} {client.user_last_name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatTime(new Date(appointment.appointment_schedule))}
                            </Text>
                          </Card>
                        );
                      }

                      if (isTimeBlocked) {
                        return (
                          <Card
                            key={time}
                            withBorder
                            p="xs"
                            radius="sm"
                            style={(theme) => ({
                              borderColor: theme.colors.red[4],
                              backgroundColor: theme.colors.red[0],
                              opacity: 0.6,
                              cursor: "pointer",
                            })}
                            onClick={() => confirmUpdateDateModal(dateKey, time, "enable")}
                          >
                            <Group gap={4} align="center">
                              <IconX size={12} color={theme.colors.red[6]} />
                              <Text size="xs" c="red" style={{ textDecoration: "line-through" }}>
                                {moment(time, TIME_FORMAT).format("hh:mm A")}
                              </Text>
                            </Group>
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
                          style={{
                            borderStyle: "dashed",
                            cursor:
                              isCurrentMonth && !isDayBlocked && isFutureDate
                                ? "pointer"
                                : "default",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (isDayBlocked || !isFutureDate) return;
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = shadowColor;
                          }}
                          onMouseLeave={(e) => {
                            if (isDayBlocked || !isFutureDate) return;
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                          }}
                          onClick={() => {
                            if (!isDayBlocked && isFutureDate) {
                              confirmUpdateDateModal(dateKey, time, "disable");
                            }
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            {moment(time, TIME_FORMAT).format("hh:mm A")}
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

      {/* Reschedule Modal */}
      <RescheduleModal
        rescheduleModalOpened={rescheduleModalOpened}
        closeRescheduleModal={closeRescheduleModal}
        handleReschedule={handleReschedule}
        serverTime={serverTime}
        scheduleSlot={scheduleSlot}
        openSelectedAppointmentModal={openSelectedAppointmentModal}
      />

      {/* Complete Modal */}
      <CompleteModal
        completeModalOpened={completeModalOpened}
        closeCompleteModal={closeCompleteModal}
        handleComplete={handleComplete}
        openSelectedAppointmentModal={openSelectedAppointmentModal}
      />
    </Box>
  );
};

export default CalendarPage;
