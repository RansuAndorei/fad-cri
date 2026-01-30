"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { LATE_FEES_LABEL } from "@/utils/constants";
import { formatPeso } from "@/utils/functions";
import {
  Alert,
  Badge,
  Box,
  Container,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconChecklist,
  IconClipboardList,
  IconCurrencyPeso,
  IconHeartHandshake,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconWallet,
  IconX,
} from "@tabler/icons-react";

type Props = {
  contactNumber: string;
  bookingFee: number;
  lateFee1: number;
  lateFee2: number;
  lateFee3: number;
  lateFee4: number;
  email: string;
};

const GuidelinesPage = ({
  contactNumber,
  bookingFee,
  lateFee1,
  lateFee2,
  lateFee3,
  lateFee4,
  email,
}: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const policies = [
    {
      icon: IconCalendar,
      title: "Booking & Appointments",
      color: "cyan",
      points: [
        "Book appointments online by pc or phone",
        "Arrive 5-10 minutes early for check-in",
        "10-minute grace period for late arrivals",
        "Appointments are confirmed via web application",
        "Walk-ins welcome based on availability",
      ],
    },
    {
      icon: IconCurrencyPeso,
      title: "Payment & Fees",
      color: "yellow",
      points: [
        `${formatPeso(bookingFee)} booking fee required to secure appointment`,
        "Booking fee applies to total service cost",
        "Accept cash and GCash",
        "Payment due at time of service",
        "Prices subject to change without notice",
      ],
    },
    {
      icon: IconX,
      title: "Cancellation Policy",
      color: "red",
      points: [
        "Rescheduling is allowed only once.",
        "No-show: Booking fee forfeited",
        "Emergency exceptions considered case-by-case",
      ],
    },
    {
      icon: IconShieldCheck,
      title: "Health & Safety",
      color: "green",
      points: [
        "All tools sterilized in hospital-grade autoclave",
        "Disposable files and buffers used per client",
        "Workstations sanitized between appointments",
        "Premium products from trusted brands",
        "Notify us of allergies or sensitivities",
      ],
    },
  ];

  const donts = [
    "Do not pick or peel gel polish",
    "Avoid excessive water exposure in first 24 hours",
    "Do not use nails as tools",
    "Avoid harsh chemicals without gloves",
    "Do not skip appointments for fills/maintenance",
    "Avoid DIY removal of gel or extensions",
  ];

  const dos = [
    "Moisturize hands and cuticles daily",
    "Wear gloves when cleaning or washing dishes",
    "File nails in one direction only",
    "Apply cuticle oil regularly",
    "Book fills/maintenance every 2-3 weeks",
    "Return for professional removal",
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
          <Stack align="center" gap="xl">
            <HeroSection
              icon={IconClipboardList}
              badgeLabel="Important Information"
              title="Client Guidelines"
              description="Everything you need to know about our policies, preparation tips, and how to care for
            your beautiful nails. Please read carefully before your appointment."
            />

            {/* Important Notice */}
            <Alert
              variant="light"
              color="yellow"
              radius="lg"
              title="Please Read Carefully"
              icon={<IconAlertCircle size={24} />}
              styles={{
                root: {
                  border: `2px solid ${theme.colors.yellow[6]}`,
                },
                title: {
                  fontSize: 18,
                  fontWeight: 700,
                },
                message: {
                  fontSize: 16,
                },
              }}
            >
              By booking an appointment with FadCri, you agree to follow our policies and
              guidelines. These ensure a smooth experience for all clients and help us maintain our
              high standards of service.
            </Alert>
          </Stack>

          {/* Policies Grid */}
          <Paper p={{ base: "xl", xs: 60 }} radius="xl" shadow="lg">
            <Stack align="center" mb={40}>
              <Badge size="xl" radius="xl" color="violet" variant="light">
                <Group gap="xs">
                  <IconChecklist size={18} />
                  <Text fw={700}>Our Policies</Text>
                </Group>
              </Badge>
              <Title order={2} ta="center" c="cyan">
                Salon Policies
              </Title>
              <Text size="lg" c="dimmed" ta="center" maw={700}>
                Important policies to ensure a great experience for everyone
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {policies.map((policy, index) => {
                const Icon = policy.icon;
                return (
                  <Paper
                    key={index}
                    p="xl"
                    radius="xl"
                    shadow="sm"
                    style={{
                      border: `2px solid ${
                        policy.color === "cyan"
                          ? theme.colors.cyan[1]
                          : policy.color === "yellow"
                            ? theme.colors.yellow[1]
                            : policy.color === "red"
                              ? theme.colors.red[1]
                              : theme.colors.green[1]
                      }`,
                    }}
                  >
                    <Group mb="md">
                      <ThemeIcon size={50} radius="xl" variant="light" color={policy.color}>
                        <Icon size={26} />
                      </ThemeIcon>
                      <Text fw={700} size="lg" c="cyan" style={{ flex: 1 }}>
                        {policy.title}
                      </Text>
                    </Group>
                    <List
                      spacing="xs"
                      size="sm"
                      icon={
                        <ThemeIcon size={20} radius="xl" variant="light" color={policy.color}>
                          <IconCheck size={12} />
                        </ThemeIcon>
                      }
                    >
                      {policy.points.map((point, idx) => (
                        <List.Item key={idx}>{point}</List.Item>
                      ))}
                    </List>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </Paper>

          {/* Cancellation Fee Breakdown */}
          <Paper p={{ base: "xl", xs: 60 }} radius="xl" shadow="lg">
            <Stack align="center" mb={40}>
              <Badge size="xl" radius="xl" color="red" variant="light">
                <Group gap="xs">
                  <IconWallet size={18} />
                  <Text fw={700}>Fee Structure</Text>
                </Group>
              </Badge>
              <Title order={2} ta="center" c="cyan">
                Late Fees
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
              <Paper
                p="xl"
                radius="xl"
                style={{
                  background: theme.colors.yellow[5],
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)";
                }}
              >
                <Stack align="center" ta="center" gap="md">
                  <ThemeIcon size={60} radius="xl" color="white" variant="light">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Text fw={800} size="xl" c="white">
                    {LATE_FEES_LABEL[0]}
                  </Text>
                  <Text opacity={0.9} c="white">
                    {formatPeso(lateFee1)}
                  </Text>
                </Stack>
              </Paper>

              <Paper
                p="xl"
                radius="xl"
                style={{
                  background: theme.colors.orange[5],
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)";
                }}
              >
                <Stack align="center" ta="center" gap="md">
                  <ThemeIcon size={60} radius="xl" color="white" variant="light">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Text fw={800} size="xl" c="white">
                    {LATE_FEES_LABEL[1]}
                  </Text>
                  <Text opacity={0.9} c="white">
                    {formatPeso(lateFee2)}
                  </Text>
                </Stack>
              </Paper>

              <Paper
                p="xl"
                radius="xl"
                style={{
                  background: theme.colors.red[5],
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)";
                }}
              >
                <Stack align="center" ta="center" gap="md">
                  <ThemeIcon size={60} radius="xl" color="white" variant="light">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Text fw={800} size="xl" c="white">
                    {LATE_FEES_LABEL[2]}
                  </Text>
                  <Text opacity={0.9} c="white">
                    {formatPeso(lateFee3)}
                  </Text>
                </Stack>
              </Paper>

              <Paper
                p="xl"
                radius="xl"
                style={{
                  background: theme.colors.dark[5],
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)";
                }}
              >
                <Stack align="center" ta="center" gap="md">
                  <ThemeIcon size={60} radius="xl" color="white" variant="light">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Text fw={800} size="xl" c="white">
                    {LATE_FEES_LABEL[3]}
                  </Text>
                  <Text opacity={0.9} c="white">
                    {formatPeso(lateFee4)}
                  </Text>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Paper>

          {/* Do's and Don'ts */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* Do's */}
            <Paper p={40} radius="xl" shadow="lg">
              <Stack gap="lg">
                <Group>
                  <ThemeIcon size={60} radius="xl" variant="light" color="green">
                    <IconCheck size={32} />
                  </ThemeIcon>
                  <Box>
                    <Title order={3} c="cyan">
                      Do&apos;s
                    </Title>
                    <Text c="dimmed">Best practices for nail care</Text>
                  </Box>
                </Group>

                <List
                  spacing="md"
                  icon={
                    <ThemeIcon size={24} radius="xl" variant="light" color="green">
                      <IconCheck size={14} />
                    </ThemeIcon>
                  }
                >
                  {dos.map((item, idx) => (
                    <List.Item key={idx}>
                      <Text size="md">{item}</Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </Paper>

            {/* Don'ts */}
            <Paper p={40} radius="xl" shadow="lg">
              <Stack gap="lg">
                <Group>
                  <ThemeIcon size={60} radius="xl" variant="light" color="red">
                    <IconX size={32} />
                  </ThemeIcon>
                  <Box>
                    <Title order={3} c="cyan">
                      Don&apos;ts
                    </Title>
                    <Text c="dimmed">Things to avoid</Text>
                  </Box>
                </Group>

                <List
                  spacing="md"
                  icon={
                    <ThemeIcon size={24} radius="xl" variant="light" color="red">
                      <IconX size={14} />
                    </ThemeIcon>
                  }
                >
                  {donts.map((item, idx) => (
                    <List.Item key={idx}>
                      <Text size="md">{item}</Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </Paper>
          </SimpleGrid>

          {/* Contact for Questions */}
          <Paper p={{ base: "xl", xs: 60 }} radius="xl" shadow="lg">
            <Stack align="center" gap="lg">
              <ThemeIcon size={80} radius="xl" variant="light" color="cyan">
                <IconHeartHandshake size={40} />
              </ThemeIcon>

              <Box ta="center">
                <Title order={2} mb="sm" c="cyan">
                  Have Questions?
                </Title>
                <Text size="lg" c="dimmed" maw={600}>
                  If you have any questions about our policies or need clarification on anything,
                  we&apos;re here to help!
                </Text>
              </Box>

              <Group gap="lg">
                <Group gap="xs">
                  <ThemeIcon size={40} radius="xl" variant="light" color="pink">
                    <IconPhone size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" fw={600}>
                      Call Us
                    </Text>
                    <Text fw={700}>{contactNumber}</Text>
                  </Box>
                </Group>

                <Group gap="xs">
                  <ThemeIcon size={40} radius="xl" variant="light" color="violet">
                    <IconMail size={20} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed" fw={600}>
                      Email Us
                    </Text>
                    <Text fw={700}>{email}</Text>
                  </Box>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {/* CTA Section */}
          <CTASection
            icon={IconSparkles}
            title="Ready to Book Your Appointment?"
            description="Now that you know our policies, let's get you scheduled for beautiful nails!"
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default GuidelinesPage;
