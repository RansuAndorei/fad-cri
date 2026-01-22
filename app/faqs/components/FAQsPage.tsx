"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { FEATURE_BACKGROUND_COLORS } from "@/utils/constants";
import {
  formatDaysInOperatingHours,
  formatPeso,
  formatTimeInOperatingHours,
} from "@/utils/functions";
import { ScheduleRangeType } from "@/utils/types";
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
  IconCurrencyPeso,
  IconHeart,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconPalette,
  IconPhone,
  IconQuestionMark,
  IconSparkles,
} from "@tabler/icons-react";

type FAQ = {
  category: string;
  icon: typeof IconSparkles;
  color: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

type Props = {
  scheduleList: ScheduleRangeType[];
  generalLocation: string;
  contactNumber: string;
  maxScheduleDateMonth: number;
  bookingFee: number;
};

const FAQsPage = ({
  scheduleList,
  generalLocation,
  contactNumber,
  maxScheduleDateMonth,
  bookingFee,
}: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const faqs: FAQ[] = [
    {
      category: "General Information",
      icon: IconInfoCircle,
      color: "cyan",
      questions: [
        {
          question: "What services does FadCri offer?",
          answer:
            "FadCri specializes in professional nail services. All services are performed by our skilled nail technicians in a clean, relaxing environment. Visit the Services page for more details",
        },
        {
          question: "Where is FadCri located?",
          answer: `We are located in ${generalLocation}. The exact address and directions will be sent to you after your booking is successfully confirmed.`,
        },
        {
          question: "What are your operating hours?",
          answer: `We are open ${scheduleList.map((sched) => `${formatDaysInOperatingHours(sched.days)} at ${formatTimeInOperatingHours(sched.earliest_time)} - ${formatTimeInOperatingHours(sched.latest_time)}`).join(", ")}. Appointments are available throughout the day. Walk-ins are welcome subject to availability, but we highly recommend booking in advance.`,
        },
        {
          question: "Do I need to book an appointment?",
          answer:
            "Yes, we highly recommend booking an appointment through our website to secure your preferred time slot. This ensures we can provide you with our full attention and the best service possible.",
        },
      ],
    },
    {
      category: "Booking & Appointments",
      icon: IconCalendar,
      color: "yellow",
      questions: [
        {
          question: "How do I book an appointment?",
          answer:
            'Simply click the "Book an Appointment" button on our website, select your preferred service type, choose an available date and time slot, and complete your booking.',
        },
        {
          question: "How far in advance can I book?",
          answer: `You can book appointments up to ${maxScheduleDateMonth} months in advance. This allows you to plan ahead and secure your preferred dates, especially during busy seasons.`,
        },
        {
          question: "Can I reschedule my appointment?",
          answer:
            "Yes, you can reschedule your appointment through your account dashboard. Please note that changes made less than 24 hours before your appointment may be subject to fees.",
        },
        {
          question: "What if I'm running late?",
          answer:
            "Please contact us as soon as possible if you're running late. We have a 10-minute grace period. Beyond that, we may need to reschedule your appointment to accommodate other clients.",
        },
        {
          question: "Do you accept walk-ins?",
          answer:
            "Walk-ins are welcome when we have availability, but appointments are prioritized. We recommend booking ahead to guarantee your spot and avoid waiting times.",
        },
      ],
    },
    {
      category: "Pricing & Payment",
      icon: IconCurrencyPeso,
      color: "teal",
      questions: [
        {
          question: "How much do your services cost?",
          answer:
            "Pricing varies by service type. You can view detailed pricing for each service on the services page. Our prices are competitive and reflect our commitment to quality and hygiene.",
        },
        {
          question: "Is there a booking fee?",
          answer: `Yes, there is a booking fee of ${formatPeso(bookingFee)} to secure your appointment. This fee goes toward your total service cost and is non-refundable if you cancel.`,
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept cash, GCash, and major credit/debit cards. Payment is required at the time of service. The booking fee is paid online during reservation.",
        },
        {
          question: "Are there late fees?",
          answer:
            "Yes, late fees apply based on how late you cancel or fail to show up for your appointment. Check our cancellation policy for specific fee amounts.",
        },
        {
          question: "Do you offer discounts or packages?",
          answer:
            "We occasionally offer special promotions and package deals. Follow us on social media or check our website regularly for current offers and discounts.",
        },
      ],
    },
    {
      category: "Services & Nail Care",
      icon: IconPalette,
      color: "pink",
      questions: [
        {
          question: "What's the difference between Gel Polish and regular polish?",
          answer:
            "Gel Polish is cured under UV/LED light, providing a chip-resistant, glossy finish that lasts 2-3 weeks. Regular polish air-dries and typically lasts 5-7 days. Gel Polish is more durable and maintains its shine throughout wear.",
        },
        {
          question: "How long do gel nails last?",
          answer:
            "With proper care, gel manicures typically last 2-3 weeks without chipping. The longevity depends on your nail growth rate, daily activities, and how well you care for your nails.",
        },
        {
          question: "What is BIAB?",
          answer:
            "BIAB (Builder in a Bottle) is a soak-off hard gel that strengthens and protects your natural nails. It's perfect for those looking to grow their nails or repair damaged nails while still having a beautiful manicure.",
        },
        {
          question: "Can I bring my own nail polish?",
          answer:
            "Yes, you're welcome to bring your own nail polish! However, we cannot guarantee the longevity or quality of products not from our salon. We use premium, professional-grade products for best results.",
        },
        {
          question: "How should I prepare for my appointment?",
          answer:
            "Come with clean, dry nails. Remove any existing polish if possible. Avoid trimming your cuticles beforehand - we'll take care of that. Keep your hands moisturized in the days leading up to your appointment.",
        },
      ],
    },
    {
      category: "Health & Safety",
      icon: IconHeart,
      color: "red",
      questions: [
        {
          question: "How do you ensure hygiene and safety?",
          answer:
            "We follow strict sanitation protocols. All tools are sterilized between clients, we use disposable files and buffers, and our technicians wash and sanitize hands before each service. Your health and safety are our top priorities.",
        },
        {
          question: "Are your products safe?",
          answer:
            "Absolutely! We only use high-quality, reputable nail care brands that meet safety standards. All our products are regularly checked and replaced to ensure freshness and quality.",
        },
        {
          question: "What if I have allergies or sensitive skin?",
          answer:
            "Please inform us about any allergies or skin sensitivities when booking or upon arrival. We can recommend suitable products or services and perform patch tests if needed.",
        },
        {
          question: "Do you sanitize your tools?",
          answer:
            "Yes! All metal tools are sterilized in a hospital-grade autoclave. Disposable items like files and buffers are used once and discarded. Our workstations are thoroughly cleaned and sanitized between each client.",
        },
      ],
    },
    {
      category: "Contact & Support",
      icon: IconMail,
      color: "violet",
      questions: [
        {
          question: "How can I contact FadCri?",
          answer: `You can reach us via phone at ${contactNumber}, email us through our website contact form, or visit us directly at our salon. We typically respond to inquiries within 24 hours.`,
        },
        {
          question: "Can I leave feedback or reviews?",
          answer:
            "We love hearing from our clients! You can leave reviews on our Facebook page or Google Business listing. Your feedback helps us improve and helps others discover our services.",
        },
        {
          question: "What if I have a complaint?",
          answer:
            "We're committed to your satisfaction. If you have any concerns, please contact us immediately. We'll work with you to resolve any issues and ensure you have a positive experience.",
        },
        {
          question: "Do you have a loyalty program?",
          answer:
            "Stay tuned! We're working on a rewards program for our regular clients. Follow us on social media for announcements about exclusive perks and benefits.",
        },
      ],
    },
  ];

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
                  {generalLocation}
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
            {faqs.map((category, index) => {
              const Icon = category.icon;
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
                      <Text size="sm">{category.questions.length} questions answered</Text>
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
                        "&[data-active]": {
                          borderColor: "var(--mantine-color-cyan-5)",
                          borderWidth: 2,
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
                    {category.questions.map((faq, index) => (
                      <Accordion.Item key={index} value={`${category.category}-${index}`}>
                        <Accordion.Control>{faq.question}</Accordion.Control>
                        <Accordion.Panel>
                          <Text c={isDark ? "white" : "dimmed"}>{faq.answer}</Text>
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
