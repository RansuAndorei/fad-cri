"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { formatDaysInOperatingHours, formatTimeInOperatingHours } from "@/utils/functions";
import { ScheduleRangeType } from "@/utils/types";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Group,
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
  IconAward,
  IconCalendar,
  IconClock,
  IconDiamond,
  IconHeart,
  IconInfoCircle,
  IconLocation,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import moment from "moment";
import Link from "next/link";

type Props = {
  scheduleList: ScheduleRangeType[];
  generalLocation: string;
  contactNumber: string;
};

const AboutPage = ({ scheduleList, generalLocation, contactNumber }: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const yearsSince2019 = moment().year() - 2019;

  const team = [
    {
      name: "Jeremy De Guzman",
      role: "Founder & Head Nail Technician",
      bio: `With ${yearsSince2019} years of experience in the nail industry, Jemy founded FadCri to bring premium nail care to Bulacan.`,
      avatar: "JD",
      color: "pink",
    },
  ];

  const values = [
    {
      icon: IconHeart,
      title: "Client First",
      description:
        "Your satisfaction and comfort are our top priorities. We listen to your needs and deliver personalized service.",
      color: "pink",
    },
    {
      icon: IconShieldCheck,
      title: "Hygiene & Safety",
      description:
        "Hospital-grade sterilization and strict safety protocols ensure a clean, safe environment for every client.",
      color: "cyan",
    },
    {
      icon: IconAward,
      title: "Excellence",
      description:
        "We use only premium products and continuously train to stay ahead of industry trends and techniques.",
      color: "yellow",
    },
    {
      icon: IconUsers,
      title: "Community",
      description:
        "Building lasting relationships with our clients and contributing positively to the Bulacan community.",
      color: "violet",
    },
  ];

  const stats = [
    { label: "Years in Business", value: `${yearsSince2019}+`, icon: IconCalendar, color: "cyan" },
    { label: "Happy Clients", value: `${yearsSince2019 * 25}+`, icon: IconHeart, color: "pink" },
    {
      label: "Services Completed",
      value: `${yearsSince2019 * 250}+`,
      icon: IconSparkles,
      color: "yellow",
    },
    {
      label: "Five Star Reviews",
      value: `${yearsSince2019 * 100}+`,
      icon: IconStar,
      color: "violet",
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
              icon={IconInfoCircle}
              badgeLabel="Our Story"
              title="About FadCri"
              description="More than just a nail salon — we're a community dedicated to helping you feel
            beautiful, confident, and pampered. Welcome to the FadCri family."
            />
          </Stack>

          {/* Stats Section */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Paper
                  key={index}
                  p="xl"
                  radius="xl"
                  shadow="md"
                  style={{
                    backdropFilter: "blur(10px)",
                    transition: "transform 0.2s ease",
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
                  <Stack align="center" gap="md">
                    <ThemeIcon size={60} radius="xl" variant="light" color={stat.color}>
                      <Icon size={32} />
                    </ThemeIcon>
                    <Box ta="center">
                      <Text fw={900} size="32px" c={stat.color}>
                        {stat.value}
                      </Text>
                      <Text size="sm" c="dimmed" fw={600} mt={4}>
                        {stat.label}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </SimpleGrid>

          {/* Our Story */}
          <Paper p={{ base: "xl", sm: 60 }} radius="xl" shadow="lg">
            <Flex align="flex-start" gap="xl" mb="xl" wrap="wrap">
              <ThemeIcon size={70} radius="xl" variant="light" color="cyan">
                <IconDiamond size={36} />
              </ThemeIcon>
              <Box style={{ flex: 1 }} miw={200}>
                <Title order={2} mb="md" c="cyan">
                  Our Story
                </Title>
                <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
                  FadCri was born from a simple dream: to create a nail salon where quality,
                  artistry, and care come together seamlessly. Founded in 2019, what started as a
                  passion project in Obando, Bulacan has grown into a beloved destination for nail
                  enthusiasts across the region.
                </Text>
              </Box>
            </Flex>

            <Divider my="xl" />

            <Stack gap="lg">
              <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
                We believe that beautiful nails are more than just an accessory — they&apos;re a
                form of self-expression and self-care. Every service we provide is crafted with
                attention to detail, using only premium products that we trust on our own nails.
              </Text>
              <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
                What sets us apart is our commitment to both artistry and nail health. We don&apos;t
                just make your nails look good; we ensure they stay strong and healthy. Our
                technicians are continuously trained in the latest techniques, from BIAB
                applications to intricate nail art, ensuring you receive nothing but the best.
              </Text>
              <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
                Today, FadCri is proud to serve hundreds of clients who trust us with their nail
                care. We&apos;ve built more than a business — we&apos;ve built a community of people
                who value quality, creativity, and the confidence that comes with beautifully
                maintained nails.
              </Text>
            </Stack>
          </Paper>

          {/* Mission & Vision */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper
              p={40}
              radius="xl"
              shadow="lg"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.cyan[isDark ? 9 : 6]} 0%, ${theme.colors.cyan[isDark ? 6 : 2]} 100%)`,
                color: "white",
              }}
            >
              <Stack gap="md">
                <ThemeIcon size={60} radius="xl" color={isDark ? "white" : "dark"} variant="light">
                  <IconTarget size={32} />
                </ThemeIcon>
                <Title order={3} c={isDark ? "white" : "dark"}>
                  Our Mission
                </Title>
                <Text
                  size="lg"
                  style={{ lineHeight: 1.7, opacity: 0.95 }}
                  c={isDark ? "white" : "dark"}
                >
                  To provide exceptional nail care services that combine artistry, quality, and
                  professionalism, making every client feel valued, beautiful, and confident.
                </Text>
              </Stack>
            </Paper>

            <Paper
              p={40}
              radius="xl"
              shadow="lg"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.yellow[isDark ? 9 : 6]} 0%, ${theme.colors.yellow[isDark ? 6 : 2]} 100%)`,
                color: "white",
              }}
            >
              <Stack gap="md">
                <ThemeIcon size={60} radius="xl" color={isDark ? "white" : "dark"} variant="light">
                  <IconTrendingUp size={32} />
                </ThemeIcon>
                <Title order={3} c={isDark ? "white" : "dark"}>
                  Our Vision
                </Title>
                <Text
                  size="lg"
                  style={{ lineHeight: 1.7, opacity: 0.95 }}
                  c={isDark ? "white" : "dark"}
                >
                  To be Bulacan&apos;s premier destination for nail care, known for our innovation,
                  excellence, and the warm, welcoming environment we create for every guest.
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>

          {/* Our Values */}
          <Paper p={{ base: "xl", sm: 60 }} radius="xl" shadow="lg">
            <Stack align="center" mb={40}>
              <Badge size="xl" radius="xl" color="violet" variant="light">
                <Group gap="xs">
                  <IconHeart size={18} />
                  <Text fw={700}>What We Stand For</Text>
                </Group>
              </Badge>
              <Title order={2} ta="center" c="cyan">
                Our Values
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Group key={index} align="flex-start" gap="lg">
                    <ThemeIcon size={60} radius="xl" variant="light" color={value.color}>
                      <Icon size={30} />
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={700} size="lg" mb={8} c="cyan">
                        {value.title}
                      </Text>
                      <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                        {value.description}
                      </Text>
                    </Box>
                  </Group>
                );
              })}
            </SimpleGrid>
          </Paper>

          {/* Meet the Team */}
          <Paper p={{ base: "xl", sm: 60 }} radius="xl" shadow="lg">
            <Stack align="center" mb={40}>
              <Badge size="xl" radius="xl" color="yellow" variant="light">
                <Group gap="xs">
                  <IconUsers size={18} />
                  <Text fw={700}>The Artists</Text>
                </Group>
              </Badge>
              <Title order={2} ta="center" c="cyan">
                Meet Our Team
              </Title>
              <Text size="lg" c="dimmed" ta="center" maw={600}>
                Talented, passionate, and dedicated professionals who bring artistry and care to
                every appointment.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xl">
              {team.map((member, index) => (
                <Paper
                  key={index}
                  p="xl"
                  radius="xl"
                  shadow="sm"
                  style={{
                    border: `4px solid ${theme.colors[member.color][0]}`,
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <Stack align="center" ta="center" gap="md">
                    <Avatar
                      size={100}
                      radius={100}
                      color={member.color}
                      styles={{
                        root: {},
                        placeholder: {
                          fontSize: 40,
                          fontWeight: 700,
                        },
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Box>
                      <Text fw={700} size="lg" c="cyan">
                        {member.name}
                      </Text>
                      <Text size="sm" c="dimmed" fw={600} mb="md">
                        {member.role}
                      </Text>
                      <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {member.bio}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>

          {/* Visit Us */}
          <Paper p={{ base: "xl", sm: 60 }} radius="xl" shadow="lg">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="lg">
                <Group>
                  <ThemeIcon size={60} radius="xl" variant="light" color="cyan">
                    <IconLocation size={32} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={700} size="lg" c="cyan">
                      Visit Our Salon
                    </Text>
                    <Text c="dimmed">We&apos;d love to see you!</Text>
                  </Box>
                </Group>

                <Stack gap="md">
                  <Group gap="md">
                    <ThemeIcon size={40} radius="xl" variant="light" color="pink">
                      <IconMapPin size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="sm" c="dimmed">
                        Location
                      </Text>
                      <Text size="md">Exact location will be sent after successful booking.</Text>
                    </Box>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon size={40} radius="xl" variant="light" color="violet">
                      <IconClock size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="sm" c="dimmed">
                        Hours
                      </Text>
                      <Hours data={scheduleList} />
                    </Box>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon size={40} radius="xl" variant="light" color="yellow">
                      <IconPhone size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="sm" c="dimmed">
                        Phone
                      </Text>
                      <Text size="md">{contactNumber}</Text>
                    </Box>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon size={40} radius="xl" variant="light" color="teal">
                      <IconMail size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="sm" c="dimmed">
                        Email
                      </Text>
                      <Text size="md">fadcri@gmail.com</Text>
                    </Box>
                  </Group>
                </Stack>
              </Stack>

              {/* Placeholder Map */}
              <Paper
                p={0}
                radius="xl"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${theme.colors.cyan[1]} 0%,
                    ${theme.colors.teal[1]} 100%
                  )`,
                  height: "100%",
                  minHeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                component={Link}
                href={`https://www.google.com/maps/search/?api=1&query=${generalLocation}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <IconMapPin size={120} style={{ color: "rgba(0, 131, 143, 0.2)" }} />
                <Box
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text fw={700} c="cyan">
                    📍 {generalLocation}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Click for directions
                  </Text>
                </Box>
              </Paper>
            </SimpleGrid>
          </Paper>

          {/* CTA Section */}
          <CTASection
            icon={IconHeart}
            title="Become Part of Our Story"
            description="Experience the FadCri difference and see why hundreds of clients trust us with their
                nail care."
          />
        </Stack>
      </Container>
    </Box>
  );
};

const Hours = ({ data }: { data: ScheduleRangeType[] }) => {
  return (
    <Stack style={{ flex: 1 }} gap="xs">
      {data?.map((range, index) => (
        <Stack key={index} gap={0}>
          <Text>{formatDaysInOperatingHours(range.days)}</Text>
          <Text c="dimmed">
            {formatTimeInOperatingHours(range.earliest_time)} —{" "}
            {formatTimeInOperatingHours(range.latest_time)}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default AboutPage;
