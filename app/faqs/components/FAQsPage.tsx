"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { FAQS_DATA, FEATURE_BACKGROUND_COLORS } from "@/utils/constants";
import {
  formatDaysInOperatingHours,
  formatPeso,
  formatTimeInOperatingHours,
} from "@/utils/functions";
import { FAQCategoryEnum, FAQType, ScheduleRangeType } from "@/utils/types";
import {
  Accordion,
  Box,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendar,
  IconChevronDown,
  IconClock,
  IconMapPin,
  IconPhone,
  IconQuestionMark,
} from "@tabler/icons-react";

type Props = {
  scheduleList: ScheduleRangeType[];
  specificAddress: string;
  contactNumber: string;
  maxScheduleDateMonth: number;
  bookingFee: number;
  faqList: FAQType[];
};

const FAQsPage = ({
  scheduleList,
  specificAddress,
  contactNumber,
  maxScheduleDateMonth,
  bookingFee,
  faqList,
}: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const variables: Record<string, string | number> = {
    SPECIFIC_ADDRESS: specificAddress,
    SCHEDULE_LIST: scheduleList
      .map(
        (sched) =>
          `${formatDaysInOperatingHours(sched.days)} at ${formatTimeInOperatingHours(sched.earliest_time)} - ${formatTimeInOperatingHours(sched.latest_time)}`,
      )
      .join(", "),
    MAX_SCHEDULE_MONTH: maxScheduleDateMonth,
    BOOKING_FEE: formatPeso(bookingFee),
    CONTACT_NUMBER: contactNumber,
  };

  const interpolateString = (template: string) => {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => {
      if (key in variables) {
        return String(variables[key]);
      }
      return `\${${key}}`;
    });
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
      <Container size="lg" py={80}>
        <Stack gap={50}>
          {/* Hero Section */}
          <Stack align="center">
            <HeroSection
              icon={IconQuestionMark}
              badgeLabel="Help Center"
              title="Frequently Asked Questions"
              description="Find answers to common questions about FadCri's nail services, booking process, and
            policies."
            />
          </Stack>

          {/* Quick Stats */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            <Paper
              p="xl"
              radius="xl"
              shadow="sm"
              style={{
                border: `2px solid ${theme.colors.cyan[1]}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Stack align="center" gap="xs">
                <ThemeIcon size={60} radius="xl" variant="light" color="cyan">
                  <IconClock size={32} />
                </ThemeIcon>
                <Hours data={scheduleList} />
              </Stack>
            </Paper>

            <Paper
              p="xl"
              radius="xl"
              shadow="sm"
              style={{
                border: `2px solid ${theme.colors.yellow[1]}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Stack align="center" gap="xs">
                <ThemeIcon size={60} radius="xl" variant="light" color="yellow">
                  <IconCalendar size={32} />
                </ThemeIcon>
                <Text fw={700} size="lg" c="yellow">
                  {maxScheduleDateMonth} months
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Book Ahead
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="xl"
              radius="xl"
              shadow="sm"
              style={{
                border: `2px solid ${theme.colors.green[1]}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Stack align="center" gap="xs">
                <ThemeIcon size={60} radius="xl" variant="light" color="teal">
                  <IconMapPin size={32} />
                </ThemeIcon>
                <Text fw={700} size="lg" c="teal">
                  {specificAddress}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Visit Us
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="xl"
              radius="xl"
              shadow="sm"
              style={{
                border: `2px solid ${theme.colors.pink[1]}`,
                backdropFilter: "blur(10px)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Stack align="center" gap="xs">
                <ThemeIcon size={60} radius="xl" variant="light" color="pink">
                  <IconPhone size={32} />
                </ThemeIcon>
                <Text fw={700} size="lg" c="pink">
                  {contactNumber}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Call Us
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>

          {/* FAQ Accordion by Category */}
          <Stack gap="xl">
            {faqList.map((category, index) => {
              const Icon = FAQS_DATA[category.id as FAQCategoryEnum].icon;

              return (
                <Paper
                  key={category.category}
                  p="xl"
                  radius="xl"
                  shadow="md"
                  style={{
                    border: `2px solid ${theme.colors[FEATURE_BACKGROUND_COLORS[index % FEATURE_BACKGROUND_COLORS.length]]}`,
                  }}
                >
                  <Group mb="xl" gap="md">
                    <ThemeIcon size={50} radius="xl" variant="light" color={category.color}>
                      <Icon size={28} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={700} size="xl" c="cyan">
                        {category.category}
                      </Text>
                      <Text size="sm">{category.faqList.length} questions answered</Text>
                    </Box>
                  </Group>

                  <Accordion
                    variant="separated"
                    radius="lg"
                    chevron={<IconChevronDown size={20} />}
                    styles={{
                      item: {
                        border: `1px solid ${theme.colors.gray[3]}`,
                        marginBottom: 12,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "var(--mantine-color-cyan-5)",
                          transform: "translateX(4px)",
                        },
                      },
                      control: {
                        padding: "20px 24px",
                        "&:hover": {
                          backgroundColor: "var(--mantine-color-cyan-0)",
                        },
                      },
                      label: {
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--mantine-color-cyan-8)",
                      },
                      content: {
                        padding: "16px 24px 24px",
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "var(--mantine-color-gray-7)",
                      },
                      chevron: {
                        color: "var(--mantine-color-cyan-5)",
                      },
                    }}
                  >
                    {category.faqList.map((faq, index) => (
                      <Accordion.Item key={index} value={`${category.category}-${index}`}>
                        <Accordion.Control>{faq.question}</Accordion.Control>
                        <Accordion.Panel>
                          <Text c={isDark ? "white" : "dimmed"}>
                            {interpolateString(faq.answer)}
                          </Text>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Paper>
              );
            })}
          </Stack>

          {/* CTA Section */}
          <CTASection
            icon={IconAlertCircle}
            title="Still Have Questions?"
            description="We're here to help! Contact us anytime and we'll get back to you soon."
          />
        </Stack>
      </Container>
    </Box>
  );
};

const Hours = ({ data }: { data: ScheduleRangeType[] }) => {
  return (
    <Stack style={{ flex: 1 }} gap="sm">
      {data?.map((range, index) => (
        <Stack key={index} gap="xs">
          <Text fw={700} size="lg" c="cyan" ta="center">
            {formatDaysInOperatingHours(range.days)}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {formatTimeInOperatingHours(range.earliest_time)} —{" "}
            {formatTimeInOperatingHours(range.latest_time)}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default FAQsPage;
