"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  List,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconDiamond,
  IconHeart,
  IconInfoCircle,
  IconPalette,
  IconSparkles,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  price: string;
  priceRange?: string;
  popular?: boolean;
  new?: boolean;
  features: string[];
  benefits: string[];
  ideal: string;
  color: string;
  icon: typeof IconSparkles;
  gradient: { from: string; to: string };
};

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const services: Service[] = [
    {
      id: "gel-polish",
      name: "Gel Polish",
      tagline: "Classic elegance that lasts",
      description:
        "Our signature gel polish service delivers a flawless, chip-resistant manicure that maintains its glossy finish for 2-3 weeks. Perfect for those who want beautiful nails without the maintenance.",
      duration: "45-60 minutes",
      price: "₱800",
      priceRange: "₱800-₱1,200",
      popular: true,
      features: [
        "Long-lasting shine (2-3 weeks)",
        "Chip-resistant formula",
        "Quick-dry UV/LED curing",
        "Wide color selection",
        "Natural nail-friendly",
      ],
      benefits: [
        "No chipping or peeling",
        "Instant dry time",
        "Strengthens natural nails",
        "Maintains glossy finish",
        "Easy removal process",
      ],
      ideal:
        "Perfect for busy professionals, special events, or anyone wanting low-maintenance beautiful nails.",
      color: "cyan",
      icon: IconSparkles,
      gradient: { from: "cyan", to: "blue" },
    },
    {
      id: "structured-gel",
      name: "Structured Gel Polish",
      tagline: "Enhanced strength and durability",
      description:
        "A thicker gel application that adds structure and strength to your natural nails. Ideal for those with weaker nails or who prefer extra durability without extensions.",
      duration: "60-75 minutes",
      price: "₱1,200",
      priceRange: "₱1,200-₱1,500",
      features: [
        "Added nail strength",
        "Thicker, more durable finish",
        "Natural nail enhancement",
        "Extended wear (3-4 weeks)",
        "Protects from breakage",
      ],
      benefits: [
        "Reinforces weak nails",
        "Longer-lasting than regular gel",
        "Smoother nail surface",
        "Added thickness without tips",
        "Professional appearance",
      ],
      ideal:
        "Great for those with soft or brittle nails, or anyone wanting extra durability without extensions.",
      color: "violet",
      icon: IconDiamond,
      gradient: { from: "violet", to: "grape" },
    },
    {
      id: "biab",
      name: "BIAB (Builder in a Bottle)",
      tagline: "Build, strengthen, and beautify",
      description:
        "Builder in a Bottle is a revolutionary soak-off hard gel that strengthens your natural nails while providing a beautiful finish. Perfect for nail growth and repair.",
      duration: "75-90 minutes",
      price: "₱1,500",
      priceRange: "₱1,500-₱2,000",
      popular: true,
      features: [
        "Strengthens natural nails",
        "Promotes healthy nail growth",
        "Soak-off formula (no damage)",
        "Long-lasting (3-4 weeks)",
        "Repairs damaged nails",
      ],
      benefits: [
        "Builds strength over time",
        "Protects while growing",
        "Natural-looking finish",
        "Flexible yet strong",
        "Helps repair weak spots",
      ],
      ideal:
        "Ideal for nail biters, those growing out damaged nails, or anyone wanting to strengthen their natural nails.",
      color: "pink",
      icon: IconHeart,
      gradient: { from: "pink", to: "red" },
    },
    {
      id: "polygel-overlay",
      name: "Polygel Overlay",
      tagline: "Lightweight strength and protection",
      description:
        "A hybrid between hard gel and acrylic, polygel provides superior strength without the weight. Applied as an overlay on natural nails for ultimate durability.",
      duration: "90-120 minutes",
      price: "₱1,800",
      priceRange: "₱1,800-₱2,500",
      features: [
        "Lighter than acrylic",
        "Stronger than gel",
        "No odor or fumes",
        "Flexible and natural feel",
        "Long-wearing (4-5 weeks)",
      ],
      benefits: [
        "Exceptional durability",
        "Comfortable lightweight feel",
        "Natural nail protection",
        "Minimal damage on removal",
        "Professional salon quality",
      ],
      ideal:
        "Perfect for those wanting maximum durability with a natural feel, or transitioning from acrylics.",
      color: "teal",
      icon: IconPalette,
      gradient: { from: "teal", to: "cyan" },
    },
    {
      id: "gelx-extension",
      name: "Gel-X Extension",
      tagline: "Instant length with a natural finish",
      description:
        "The latest in nail extension technology - soft gel tips applied with gel for a lightweight, flexible, and natural-looking extension that lasts.",
      duration: "120-150 minutes",
      price: "₱2,500",
      priceRange: "₱2,500-₱3,500",
      new: true,
      features: [
        "Soft gel tip system",
        "Natural-looking extensions",
        "Customizable length and shape",
        "Lightweight and flexible",
        "Damage-free application",
      ],
      benefits: [
        "Instant length transformation",
        "Natural feel and movement",
        "No drilling required",
        "Easy to maintain",
        "Long-lasting (3-4 weeks)",
      ],
      ideal:
        "Ideal for special occasions, those wanting dramatic length, or anyone preferring extensions over natural nails.",
      color: "yellow",
      icon: IconStar,
      gradient: { from: "yellow", to: "orange" },
    },
  ];

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
    openModal();
  };

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
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,213,79,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,188,212,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container size="xl" py={80}>
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
                Premium Nail Services
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
            Our Services
          </Title>

          <Text
            size="xl"
            c="dimmed"
            ta="center"
            maw={700}
            style={{ lineHeight: 1.7, fontSize: 20 }}
          >
            Experience the art of nail care with our premium services. From classic gel polish to
            advanced nail enhancements, we offer treatments that combine beauty, strength, and
            lasting results.
          </Text>

          <Group gap="md" mt="xl">
            <Button
              component={Link}
              href="/user/booking-info"
              size="lg"
              radius="xl"
              styles={{
                root: {
                  background: "linear-gradient(135deg, #00bcd4 0%, #ffd54f 100%)",
                  border: "none",
                  padding: "12px 40px",
                  fontSize: 18,
                  fontWeight: 700,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 4px 20px rgba(0, 188, 212, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(0, 188, 212, 0.4)",
                  },
                },
              }}
              rightSection={<IconArrowRight size={20} />}
            >
              Book Now
            </Button>

            <Button
              component={Link}
              href="/faqs"
              size="lg"
              radius="xl"
              variant="outline"
              color="cyan"
              styles={{
                root: {
                  borderWidth: 2,
                  padding: "12px 40px",
                  fontSize: 18,
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(0, 188, 212, 0.05)",
                    transform: "translateY(-2px)",
                  },
                },
              }}
            >
              Learn More
            </Button>
          </Group>
        </Stack>

        {/* Services Grid */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Paper
                key={service.id}
                p={0}
                radius="xl"
                shadow="xl"
                style={{
                  border: "2px solid",
                  borderColor:
                    service.color === "cyan"
                      ? "#b2ebf2"
                      : service.color === "violet"
                        ? "#e1bee7"
                        : service.color === "pink"
                          ? "#f8bbd0"
                          : service.color === "teal"
                            ? "#b2dfdb"
                            : "#fff9c4",
                  background: "white",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
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
                {/* Badges */}
                {(service.popular || service.new) && (
                  <Box style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
                    {service.popular && (
                      <Badge
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: "orange", to: "red" }}
                        mb={service.new ? 8 : 0}
                      >
                        POPULAR
                      </Badge>
                    )}
                    {service.new && (
                      <Badge size="lg" radius="md" color="green">
                        NEW
                      </Badge>
                    )}
                  </Box>
                )}

                {/* Header with gradient */}
                <Box
                  p="xl"
                  style={{
                    background: `linear-gradient(135deg, ${
                      service.color === "cyan"
                        ? "#00bcd4"
                        : service.color === "violet"
                          ? "#9c27b0"
                          : service.color === "pink"
                            ? "#e91e63"
                            : service.color === "teal"
                              ? "#009688"
                              : "#ffd54f"
                    } 0%, ${
                      service.color === "cyan"
                        ? "#0097a7"
                        : service.color === "violet"
                          ? "#7b1fa2"
                          : service.color === "pink"
                            ? "#c2185b"
                            : service.color === "teal"
                              ? "#00796b"
                              : "#ffc107"
                    } 100%)`,
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <ThemeIcon size={60} radius="xl" color="white" variant="light">
                      <Icon size={32} style={{ color: "rgba(0,0,0,0.7)" }} />
                    </ThemeIcon>
                    <Box ta="right">
                      <Text size="xs" c="white" opacity={0.9}>
                        Starting at
                      </Text>
                      <Text size="xl" fw={900} c="white">
                        {service.price}
                      </Text>
                    </Box>
                  </Group>

                  <Title order={3} c="white" mb={4}>
                    {service.name}
                  </Title>
                  <Text c="white" size="sm" opacity={0.95} fw={500}>
                    {service.tagline}
                  </Text>
                </Box>

                {/* Content */}
                <Stack p="xl" gap="md">
                  <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                    {service.description}
                  </Text>

                  <Divider />

                  <Group gap="xs">
                    <ThemeIcon size={24} radius="xl" color={service.color} variant="light">
                      <IconClock size={14} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} c="dimmed">
                      {service.duration}
                    </Text>
                  </Group>

                  <Box>
                    <Text size="sm" fw={700} c="dimmed" mb={8}>
                      Key Features:
                    </Text>
                    <List
                      size="sm"
                      spacing={4}
                      icon={
                        <ThemeIcon size={20} radius="xl" color={service.color} variant="light">
                          <IconCheck size={12} />
                        </ThemeIcon>
                      }
                    >
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <List.Item key={idx}>
                          <Text size="sm">{feature}</Text>
                        </List.Item>
                      ))}
                    </List>
                  </Box>

                  <Button
                    fullWidth
                    radius="xl"
                    size="md"
                    variant="gradient"
                    gradient={service.gradient}
                    onClick={() => handleLearnMore(service)}
                    rightSection={<IconInfoCircle size={18} />}
                    styles={{
                      root: {
                        fontWeight: 700,
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </SimpleGrid>

        {/* Why Choose FadCri */}
        <Paper
          p={60}
          radius="xl"
          mt={100}
          shadow="xl"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
            border: "2px solid #e0e0e0",
          }}
        >
          <Stack align="center" gap="xl">
            <Badge size="xl" radius="xl" color="cyan" variant="light">
              <Group gap="xs">
                <IconHeart size={18} />
                <Text fw={700}>Why Choose FadCri</Text>
              </Group>
            </Badge>

            <Title order={2} ta="center" style={{ color: "#00838f" }}>
              Experience The Difference
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" w="100%">
              <Stack align="center" ta="center">
                <ThemeIcon size={70} radius="xl" variant="light" color="cyan">
                  <IconSparkles size={36} />
                </ThemeIcon>
                <Text fw={700} size="lg">
                  Premium Quality
                </Text>
                <Text size="sm" c="dimmed">
                  We use only the finest products and materials for exceptional results
                </Text>
              </Stack>

              <Stack align="center" ta="center">
                <ThemeIcon size={70} radius="xl" variant="light" color="violet">
                  <IconHeart size={36} />
                </ThemeIcon>
                <Text fw={700} size="lg">
                  Expert Care
                </Text>
                <Text size="sm" c="dimmed">
                  Skilled technicians with years of experience and continuous training
                </Text>
              </Stack>

              <Stack align="center" ta="center">
                <ThemeIcon size={70} radius="xl" variant="light" color="pink">
                  <IconPalette size={36} />
                </ThemeIcon>
                <Text fw={700} size="lg">
                  Creative Design
                </Text>
                <Text size="sm" c="dimmed">
                  From classic to trendy, we bring your nail art vision to life
                </Text>
              </Stack>

              <Stack align="center" ta="center">
                <ThemeIcon size={70} radius="xl" variant="light" color="teal">
                  <IconCheck size={36} />
                </ThemeIcon>
                <Text fw={700} size="lg">
                  Hygiene First
                </Text>
                <Text size="sm" c="dimmed">
                  Hospital-grade sterilization and strict safety protocols
                </Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Paper>

        {/* CTA Section */}
        <Paper
          p={60}
          radius="xl"
          mt={60}
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
              <IconSparkles size={50} style={{ color: "#00bcd4" }} />
            </ThemeIcon>

            <Box ta="center">
              <Title order={2} c="white" mb="sm" style={{ fontSize: 40, fontWeight: 900 }}>
                Ready for Beautiful Nails?
              </Title>
              <Text size="xl" c="white" style={{ opacity: 0.95 }}>
                Book your appointment today and experience the FadCri difference!
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

      {/* Service Detail Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Group>
            {selectedService && (
              <>
                <ThemeIcon size={40} radius="xl" color={selectedService.color} variant="light">
                  {<selectedService.icon size={24} />}
                </ThemeIcon>
                <Box>
                  <Text fw={700} size="lg">
                    {selectedService.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedService.tagline}
                  </Text>
                </Box>
              </>
            )}
          </Group>
        }
        size="lg"
        radius="lg"
        centered
      >
        {selectedService && (
          <Stack gap="lg">
            <Box>
              <Group justify="space-between" mb="md">
                <Badge size="lg" color={selectedService.color} variant="light">
                  {selectedService.duration}
                </Badge>
                <Text size="xl" fw={900} style={{ color: "#00838f" }}>
                  {selectedService.priceRange || selectedService.price}
                </Text>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                {selectedService.description}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fw={700} size="lg" mb="sm" style={{ color: "#00838f" }}>
                Features
              </Text>
              <List
                spacing="xs"
                icon={
                  <ThemeIcon size={24} radius="xl" color={selectedService.color} variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                {selectedService.features.map((feature, idx) => (
                  <List.Item key={idx}>{feature}</List.Item>
                ))}
              </List>
            </Box>

            <Box>
              <Text fw={700} size="lg" mb="sm" style={{ color: "#00838f" }}>
                Benefits
              </Text>
              <List
                spacing="xs"
                icon={
                  <ThemeIcon size={24} radius="xl" color={selectedService.color} variant="light">
                    <IconStar size={14} />
                  </ThemeIcon>
                }
              >
                {selectedService.benefits.map((benefit, idx) => (
                  <List.Item key={idx}>{benefit}</List.Item>
                ))}
              </List>
            </Box>

            <Paper p="md" radius="lg" style={{ background: "rgba(0, 188, 212, 0.05)" }}>
              <Group gap="xs" mb="xs">
                <IconInfoCircle size={20} style={{ color: "#00bcd4" }} />
                <Text fw={700} style={{ color: "#00838f" }}>
                  Ideal For
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {selectedService.ideal}
              </Text>
            </Paper>

            <Button
              component={Link}
              href="/user/booking-info"
              fullWidth
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={selectedService.gradient}
              rightSection={<IconArrowRight size={20} />}
              onClick={closeModal}
            >
              Book This Service
            </Button>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default ServicesPage;
