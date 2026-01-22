"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { DAYS_OF_THE_WEEK } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendar,
  IconCalendarBolt,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconInfoCircle,
} from "@tabler/icons-react";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { fetchAppointmentPerMonth, fetchScheduleSlot } from "../actions";

type TimeSlot = {
  time: string;
  available: boolean;
  appointmentId?: string;
  note?: string;
};

type DaySchedule = {
  day: Moment;
  slots: TimeSlot[];
};

type Props = {
  maxScheduleDateMonth: number;
};

const ReservationPage = ({ maxScheduleDateMonth }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const maxMonth = moment().add(maxScheduleDateMonth, "months");

  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ time: string; note?: string } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchSchedule = async () => {
    try {
      setIsFetching(true);

      const schedules: DaySchedule[] = [];
      const startOfMonth = currentMonth.clone().startOf("month").startOf("week");
      const endOfMonth = currentMonth.clone().endOf("month").endOf("week");
      const day = startOfMonth.clone();

      const slotsData = await fetchScheduleSlot(supabaseClient);
      const appointmentsData = await fetchAppointmentPerMonth(supabaseClient, {
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString(),
      });

      while (day.isSameOrBefore(endOfMonth, "day")) {
        const isCurrentMonth = day.isSame(currentMonth, "month");
        const isPast = day.isBefore(moment(), "day");

        const dayName = day.format("dddd").toUpperCase();

        const daySlots = slotsData?.filter((s) => s.schedule_slot_day === dayName) || [];

        const bookedTimes =
          appointmentsData
            ?.filter((a) => moment(a.appointment_schedule).isSame(day, "day"))
            .map((a) => moment(a.appointment_schedule).format("HH:mm")) || [];

        const slots: TimeSlot[] =
          isCurrentMonth && !isPast
            ? daySlots.map((s) => {
                const slotTimeHHmm = moment(s.schedule_slot_time, "HH:mm:ssZ").format("HH:mm");
                return {
                  time: s.schedule_slot_time,
                  available: !bookedTimes.includes(slotTimeHHmm),
                  appointmentId: undefined,
                  note: s.schedule_slot_note || "",
                };
              })
            : [];

        schedules.push({ day: day.clone(), slots });
        day.add(1, "day");
      }

      let removeCount = 0;
      if (schedules.slice(-7).every(({ day }) => !day.isSame(currentMonth, "month")))
        removeCount = 7;
      if (schedules.slice(-14, -7).every(({ day }) => !day.isSame(currentMonth, "month")))
        removeCount = 14;

      setDays(removeCount ? schedules.slice(0, -removeCount) : schedules);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [currentMonth]);

  const handleMonthChange = (direction: "prev" | "next") => {
    setSelectedDate(null);
    setCurrentMonth((prev) =>
      direction === "prev" ? prev.clone().subtract(1, "month") : prev.clone().add(1, "month"),
    );
  };

  const handleDateSelect = (day: Moment) => {
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string, note?: string) => {
    setSelectedTime({ time, note });
  };

  const selectedDaySlots = useMemo(() => {
    if (!selectedDate) return [];
    const daySchedule = days.find((d) => d.day.isSame(selectedDate, "day"));
    return daySchedule?.slots || [];
  }, [selectedDate, days]);

  const getSlotColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;

    if (percentage === 0) return "gray";
    if (percentage <= 24) return "red";
    if (percentage <= 49) return "orange";
    if (percentage <= 74) return "yellow";
    return "green";
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${
          theme.colors.cyan[isDark ? 3 : 0]
        } 0%, ${theme.colors.yellow[isDark ? 9 : 0]} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container size="xl" py={80}>
        <Stack gap={50}>
          {/* Hero Section */}
          <Stack align="center">
            <HeroSection
              icon={IconCalendar}
              badgeLabel="Book Appointment"
              title="Make a Reservation"
              description="Choose your service, pick a date and time, and book your appointment in just a few
            simple steps."
            />
          </Stack>

          {/* Calendar Section */}
          <Paper p={{ base: "xl", sm: 60 }} radius="xl" shadow="lg">
            <Box>
              <Stack align="center" mb={40}>
                <Title order={2} c="cyan">
                  Pick Date & Time
                </Title>
                <Text c="dimmed" ta="center">
                  Choose your preferred appointment slot
                </Text>
              </Stack>

              {/* Calendar Month Navigation */}
              <Card withBorder radius="md" mb="lg">
                <Grid gutter="xs" justify="center" align="center" style={{ textAlign: "center" }}>
                  <Grid.Col
                    span={{ base: 12, xs: 12, sm: 12, md: 4 }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="light"
                      leftSection={<IconChevronLeft size={16} />}
                      onClick={() => handleMonthChange("prev")}
                      disabled={isFetching || currentMonth.isSame(moment(), "month")}
                      style={{ minWidth: 200 }}
                    >
                      Previous
                    </Button>
                  </Grid.Col>

                  <Grid.Col
                    span={{ base: 12, xs: 12, sm: 12, md: 4 }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Title order={3}>{currentMonth.format("MMMM YYYY")}</Title>
                  </Grid.Col>

                  <Grid.Col
                    span={{ base: 12, xs: 12, sm: 12, md: 4 }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="light"
                      rightSection={<IconChevronRight size={16} />}
                      onClick={() => handleMonthChange("next")}
                      disabled={isFetching || currentMonth.isSame(maxMonth, "month")}
                      style={{ minWidth: 200 }}
                    >
                      Next
                    </Button>
                  </Grid.Col>
                </Grid>
              </Card>

              {/* Day Headers */}
              <Grid columns={7} gutter="xs" mb="xs" visibleFrom="sm">
                {DAYS_OF_THE_WEEK.map((day) => (
                  <Grid.Col key={day} span={1}>
                    <Text ta="center" fw={600} c="dimmed">
                      {day}
                    </Text>
                  </Grid.Col>
                ))}
              </Grid>

              {/* Calendar Grid */}
              <Grid columns={7} gutter="xs" mb="xl">
                {isFetching &&
                  Array.from({ length: 35 }).map((_, i) => (
                    <Grid.Col key={i} span={{ base: 7, sm: 1 }}>
                      <Skeleton height={80} />
                    </Grid.Col>
                  ))}

                {!isFetching &&
                  days.map(({ day, slots }, index) => {
                    const isCurrentMonth = day.isSame(currentMonth, "month");
                    const isPast = day.isBefore(moment(), "day");
                    const isSelected = selectedDate?.isSame(day, "day");
                    const hasSlots = slots.length > 0;
                    const availableSlots = slots.filter((s) => s.available).length;

                    return (
                      <Grid.Col key={index} span={{ base: 7, sm: 1 }}>
                        <Card
                          withBorder
                          radius="md"
                          p="sm"
                          style={{
                            opacity: isCurrentMonth && !isPast ? 1 : 0.3,
                            display: !isCurrentMonth && window.innerWidth < 768 ? "none" : "block",
                            cursor: hasSlots && !isPast ? "pointer" : "not-allowed",
                            border: isSelected
                              ? `3px solid ${theme.colors.cyan[5]}`
                              : `1px solid ${theme.colors.gray[3]}`,
                            background: isSelected
                              ? "rgba(0, 188, 212, 0.1)"
                              : isDark
                                ? theme.colors["dark"][7]
                                : "white",
                          }}
                          onClick={() => hasSlots && !isPast && handleDateSelect(day)}
                        >
                          <Stack gap={4}>
                            <Text fw={600} ta="center" c="cyan">
                              {day.format("D")}
                            </Text>
                            {hasSlots && (
                              <Badge
                                size="xs"
                                color={getSlotColor(availableSlots, slots.length)}
                                variant="light"
                                fullWidth
                                style={{ cursor: "pointer" }}
                              >
                                {availableSlots} slots
                              </Badge>
                            )}
                          </Stack>
                        </Card>
                      </Grid.Col>
                    );
                  })}
              </Grid>

              {/* Time Slots */}
              {selectedDate && (
                <Box>
                  <Divider mb="lg" />
                  <Title order={4} mb="md" c="cyan">
                    Available Times for {selectedDate.format("MMMM D, YYYY")}
                  </Title>

                  {selectedDaySlots.length === 0 ? (
                    <Alert icon={<IconAlertCircle />} color="yellow">
                      No available time slots for this date. Please select another date.
                    </Alert>
                  ) : (
                    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm">
                      {selectedDaySlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime?.time === slot.time ? "filled" : "light"}
                          color={slot.available ? "cyan" : "gray"}
                          disabled={!slot.available}
                          onClick={() => slot.available && handleTimeSelect(slot.time, slot.note)}
                          leftSection={<IconClock size={16} />}
                          styles={{
                            root: {
                              height: 50,
                            },
                          }}
                        >
                          {moment(slot.time, "HH:mm:ssZ").format("h:mm A")}
                        </Button>
                      ))}
                    </SimpleGrid>
                  )}

                  {selectedTime?.note ? (
                    <Alert
                      icon={<IconInfoCircle size={16} />}
                      title="Additional Information"
                      color="yellow"
                      radius="md"
                      variant="light"
                      mt="sm"
                    >
                      {selectedTime.note}
                    </Alert>
                  ) : null}
                </Box>
              )}
            </Box>
          </Paper>

          {/* CTA Section */}
          <CTASection
            icon={IconCalendarBolt}
            title="Let's get your nails scheduled!"
            description="Spotted the perfect slot? Let’s lock in your gorgeous nails!"
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default ReservationPage;
