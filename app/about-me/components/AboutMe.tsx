"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconAward,
  IconCalendar,
  IconClock,
  IconDiamond,
  IconHeart,
  IconMail,
  IconMapPin,
  IconPalette,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

const AboutPage = () => {
  const team = [
    {
      name: "Cristine Fadriga",
      role: "Founder & Head Nail Technician",
      bio: "With over 5 years of experience in the nail industry, Cristine founded FadCri to bring premium nail care to Bulacan.",
      avatar: "C",
      color: "pink",
    },
    {
      name: "Maria Santos",
      role: "Senior Nail Artist",
      bio: "Specializing in intricate nail art and custom designs. Maria has trained with international nail artists.",
      avatar: "M",
      color: "violet",
    },
    {
      name: "Jenny Cruz",
      role: "Nail Technician",
      bio: "Expert in gel extensions and BIAB applications. Jenny is passionate about nail health and strengthening.",
      avatar: "J",
      color: "cyan",
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
    { label: "Years in Business", value: "3+", icon: IconCalendar, color: "cyan" },
    { label: "Happy Clients", value: "500+", icon: IconHeart, color: "pink" },
    { label: "Services Completed", value: "2,000+", icon: IconSparkles, color: "yellow" },
    { label: "Five Star Reviews", value: "100+", icon: IconStar, color: "violet" },
  ];

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #e0f7fa 0%, #fff9e6 50%, #ffe0f5 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <Box
        style={{
          position: "absolute",
          top: "5%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,213,79,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container size="lg" py={80}>
        {/* Hero Section */}
        <Stack align="center" mb={80}>
          <Badge
            size="xl"
            radius="xl"
            variant="gradient"
            gradient={{ from: "cyan", to: "yellow", deg: 45 }}
            style={{ padding: "14px 28px" }}
          >
            <Group gap="xs">
              <IconSparkles size={20} />
              <Text fw={700} size="md">
                Our Story
              </Text>
            </Group>
          </Badge>

          <Title
            order={1}
            ta="center"
            style={{
              fontSize: 64,
              fontWeight: 900,
              background: "linear-gradient(135deg, #00bcd4 0%, #ffd54f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            About FadCri
          </Title>

          <Text
            size="xl"
            c="dimmed"
            ta="center"
            maw={800}
            style={{ lineHeight: 1.8, fontSize: 20 }}
          >
            More than just a nail salon — we&apos;re a community dedicated to helping you feel
            beautiful, confident, and pampered. Welcome to the FadCri family.
          </Text>
        </Stack>

        {/* Stats Section */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} mb={80} spacing="lg">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Paper
                key={index}
                p="xl"
                radius="xl"
                shadow="md"
                style={{
                  border: `2px solid ${
                    stat.color === "cyan"
                      ? "#b2ebf2"
                      : stat.color === "pink"
                        ? "#f8bbd0"
                        : stat.color === "yellow"
                          ? "#fff9c4"
                          : "#e1bee7"
                  }`,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color={stat.color}>
                    <Icon size={32} />
                  </ThemeIcon>
                  <Box ta="center">
                    <Text
                      fw={900}
                      size="32px"
                      style={{
                        background:
                          stat.color === "cyan"
                            ? "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)"
                            : stat.color === "pink"
                              ? "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)"
                              : stat.color === "yellow"
                                ? "linear-gradient(135deg, #ffd54f 0%, #ffc107 100%)"
                                : "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
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
        <Paper p={60} radius="xl" shadow="lg" mb={60} style={{ background: "white" }}>
          <Group align="flex-start" gap="xl" mb="xl">
            <ThemeIcon size={70} radius="xl" variant="light" color="cyan">
              <IconDiamond size={36} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Title order={2} mb="md" style={{ color: "#00838f" }}>
                Our Story
              </Title>
              <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
                FadCri was born from a simple dream: to create a nail salon where quality, artistry,
                and care come together seamlessly. Founded by Cristine Fadriga in 2021, what started
                as a passion project in Obando, Bulacan has grown into a beloved destination for
                nail enthusiasts across the region.
              </Text>
            </Box>
          </Group>

          <Divider my="xl" />

          <Stack gap="lg">
            <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
              We believe that beautiful nails are more than just an accessory — they&apos;re a form
              of self-expression and self-care. Every service we provide is crafted with attention
              to detail, using only premium products that we trust on our own nails.
            </Text>
            <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
              What sets us apart is our commitment to both artistry and nail health. We don&apos;t
              just make your nails look good; we ensure they stay strong and healthy. Our
              technicians are continuously trained in the latest techniques, from BIAB applications
              to intricate nail art, ensuring you receive nothing but the best.
            </Text>
            <Text size="lg" c="dimmed" style={{ lineHeight: 1.8 }}>
              Today, FadCri is proud to serve hundreds of clients who trust us with their nail care.
              We&apos;ve built more than a business — we&apos;ve built a community of people who
              value quality, creativity, and the confidence that comes with beautifully maintained
              nails.
            </Text>
          </Stack>
        </Paper>

        {/* Mission & Vision */}
        <SimpleGrid cols={{ base: 1, md: 2 }} mb={60} spacing="lg">
          <Paper
            p={40}
            radius="xl"
            shadow="lg"
            style={{
              background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
              color: "white",
            }}
          >
            <Stack gap="md">
              <ThemeIcon size={60} radius="xl" color="white" variant="light">
                <IconTarget size={32} style={{ color: "#00bcd4" }} />
              </ThemeIcon>
              <Title order={3} c="white">
                Our Mission
              </Title>
              <Text size="lg" style={{ lineHeight: 1.7, opacity: 0.95 }}>
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
              background: "linear-gradient(135deg, #ffd54f 0%, #ffc107 100%)",
              color: "white",
            }}
          >
            <Stack gap="md">
              <ThemeIcon size={60} radius="xl" color="white" variant="light">
                <IconTrendingUp size={32} style={{ color: "#ffc107" }} />
              </ThemeIcon>
              <Title order={3} c="white">
                Our Vision
              </Title>
              <Text size="lg" style={{ lineHeight: 1.7, opacity: 0.95 }}>
                To be Bulacan&apos;s premier destination for nail care, known for our innovation,
                excellence, and the warm, welcoming environment we create for every guest.
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* Our Values */}
        <Paper p={60} radius="xl" shadow="lg" mb={60} style={{ background: "white" }}>
          <Stack align="center" mb={40}>
            <Badge size="xl" radius="xl" color="violet" variant="light">
              <Group gap="xs">
                <IconHeart size={18} />
                <Text fw={700}>What We Stand For</Text>
              </Group>
            </Badge>
            <Title order={2} ta="center" style={{ color: "#00838f" }}>
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
                    <Text fw={700} size="lg" mb={8} style={{ color: "#00838f" }}>
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

        {/* Our Journey Timeline */}
        <Paper p={60} radius="xl" shadow="lg" mb={60} style={{ background: "white" }}>
          <Stack align="center" mb={40}>
            <Badge size="xl" radius="xl" color="pink" variant="light">
              <Group gap="xs">
                <IconClock size={18} />
                <Text fw={700}>Our Journey</Text>
              </Group>
            </Badge>
            <Title order={2} ta="center" style={{ color: "#00838f" }}>
              Milestones
            </Title>
          </Stack>

          <Timeline
            active={4}
            bulletSize={40}
            lineWidth={3}
            color="cyan"
            styles={{
              itemBullet: {
                border: "3px solid #00bcd4",
                background: "white",
              },
            }}
          >
            <Timeline.Item
              bullet={<IconSparkles size={18} />}
              title={
                <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                  2021 - The Beginning
                </Text>
              }
            >
              <Text c="dimmed" size="md" mt={4}>
                FadCri opens its doors in Obando, Bulacan with a vision to provide premium nail care
                to the community.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconUsers size={18} />}
              title={
                <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                  2022 - Growing Team
                </Text>
              }
            >
              <Text c="dimmed" size="md" mt={4}>
                Expanded our team of skilled nail technicians and introduced advanced services like
                BIAB and Gel-X extensions.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconAward size={18} />}
              title={
                <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                  2023 - Recognition
                </Text>
              }
            >
              <Text c="dimmed" size="md" mt={4}>
                Reached 500+ happy clients and received numerous five-star reviews for our quality
                service and attention to detail.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconPalette size={18} />}
              title={
                <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                  2024 - Innovation
                </Text>
              }
            >
              <Text c="dimmed" size="md" mt={4}>
                Launched online booking system and introduced new nail art techniques, making it
                easier for clients to access our services.
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconTrendingUp size={18} />}
              title={
                <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                  2025 - The Future
                </Text>
              }
            >
              <Text c="dimmed" size="md" mt={4}>
                Continuing to grow, innovate, and serve our community with excellence, one beautiful
                manicure at a time.
              </Text>
            </Timeline.Item>
          </Timeline>
        </Paper>

        {/* Meet the Team */}
        <Paper p={60} radius="xl" shadow="lg" mb={60} style={{ background: "white" }}>
          <Stack align="center" mb={40}>
            <Badge size="xl" radius="xl" color="yellow" variant="light">
              <Group gap="xs">
                <IconUsers size={18} />
                <Text fw={700}>The Artists</Text>
              </Group>
            </Badge>
            <Title order={2} ta="center" style={{ color: "#00838f" }}>
              Meet Our Team
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={600}>
              Talented, passionate, and dedicated professionals who bring artistry and care to every
              appointment.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
            {team.map((member, index) => (
              <Paper
                key={index}
                p="xl"
                radius="xl"
                shadow="sm"
                style={{
                  border: `2px solid ${
                    member.color === "pink"
                      ? "#f8bbd0"
                      : member.color === "violet"
                        ? "#e1bee7"
                        : "#b2ebf2"
                  }`,
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
                      root: {
                        border: `4px solid ${
                          member.color === "pink"
                            ? "#f8bbd0"
                            : member.color === "violet"
                              ? "#e1bee7"
                              : "#b2ebf2"
                        }`,
                      },
                      placeholder: {
                        fontSize: 40,
                        fontWeight: 700,
                      },
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Box>
                    <Text fw={700} size="lg" style={{ color: "#00838f" }}>
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
        <Paper
          p={60}
          radius="xl"
          shadow="lg"
          mb={60}
          style={{
            background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
          }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Stack gap="lg">
              <Group>
                <ThemeIcon size={60} radius="xl" variant="light" color="cyan">
                  <IconMapPin size={32} />
                </ThemeIcon>
                <Box>
                  <Text fw={700} size="lg" style={{ color: "#00838f" }}>
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
                    <Text size="md">
                      JCG Bldg., 2nd floor, Unit Door 1
                      <br />
                      P Sevilla St, Catanghalan
                      <br />
                      Obando, Bulacan
                    </Text>
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
                    <Text size="md">Daily: 10:00 AM - 8:00 PM</Text>
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
                    <Text size="md">09123456789</Text>
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
                    <Text size="md">hello@fadcri.com</Text>
                  </Box>
                </Group>
              </Stack>
            </Stack>

            {/* Placeholder Map */}
            <Paper
              p={0}
              radius="xl"
              style={{
                background: "linear-gradient(135deg, #b2ebf2 0%, #b2dfdb 100%)",
                height: "100%",
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
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
                <Text fw={700} style={{ color: "#00838f" }}>
                  📍 Obando, Bulacan
                </Text>
                <Text size="sm" c="dimmed">
                  Click for directions
                </Text>
              </Box>
            </Paper>
          </SimpleGrid>
        </Paper>

        {/* CTA Section */}
        <Paper
          p={60}
          radius="xl"
          shadow="xl"
          style={{
            background: "linear-gradient(135deg, #00bcd4 0%, #ffd54f 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)",
              pointerEvents: "none",
            }}
          />

          <Stack align="center" gap="xl" style={{ position: "relative" }}>
            <ThemeIcon size={90} radius="xl" color="white" variant="light">
              <IconHeart size={50} style={{ color: "#00bcd4" }} />
            </ThemeIcon>

            <Box ta="center">
              <Title order={2} c="white" mb="sm" style={{ fontSize: 40, fontWeight: 900 }}>
                Become Part of Our Story
              </Title>
              <Text size="xl" c="white" style={{ opacity: 0.95 }}>
                Experience the FadCri difference and see why hundreds of clients trust us with their
                nail care.
              </Text>
            </Box>

            <Button
              component={Link}
              href="/user/booking-info"
              size="xl"
              radius="xl"
              color="white"
              styles={{
                root: {
                  color: "#00bcd4",
                  fontWeight: 800,
                  fontSize: 20,
                  padding: "16px 48px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  },
                },
              }}
              rightSection={<IconArrowRight size={24} />}
            >
              Book Your Appointment
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
