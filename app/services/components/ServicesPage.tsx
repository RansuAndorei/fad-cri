"use client";

import CTASection from "@/app/components/Shared/CTASection/CTASection";
import HeroSection from "@/app/components/Shared/HeroSection/HeroSection";
import { FEATURE_BACKGROUND_COLORS, FEATURE_ICONS } from "@/utils/constants";
import { formatPeso } from "@/utils/functions";
import { ServiceTypeTableRow } from "@/utils/types";
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  List,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconHeart,
  IconInfoCircle,
  IconPalette,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  services: ServiceTypeTableRow[];
};

const ServicesPage = ({ services }: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const [selectedService, setSelectedService] = useState<ServiceTypeTableRow | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleLearnMore = (service: ServiceTypeTableRow, color: string) => {
    setSelectedService(service);
    setSelectedColor(color);
    openModal();
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
              icon={IconSparkles}
              badgeLabel="Premium Nail Services"
              title="Our Services"
              description="Experience the art of nail care with our premium services. From classic gel polish to
            advanced nail enhancements, we offer treatments that combine beauty, strength, and
            lasting results."
            />

            <Flex gap="md" mt="xl" align="center" justify="center" wrap="wrap">
              <Button
                component={Link}
                href="/user/booking-info"
                size="lg"
                radius="xl"
                styles={{
                  root: {
                    padding: "12px 40px",
                    fontSize: 18,
                    fontWeight: 700,
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
                color={isDark ? "gray.7" : "cyan"}
                styles={{
                  root: {
                    padding: "12px 40px",
                    fontSize: 18,
                    fontWeight: 700,
                  },
                }}
              >
                Learn More
              </Button>
            </Flex>
          </Stack>

          {/* Services Grid */}
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
            {services.map((service, index) => {
              const IconComponent = FEATURE_ICONS[index % FEATURE_ICONS.length];
              const color =
                theme.colors[FEATURE_BACKGROUND_COLORS[index % FEATURE_BACKGROUND_COLORS.length]];

              return (
                <Paper
                  key={service.service_type_id}
                  p={0}
                  radius="xl"
                  shadow="xl"
                  style={{
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
                  {/* Header with gradient */}
                  <Box
                    p="xl"
                    style={{
                      backgroundColor: color[isDark ? 9 : 6],
                    }}
                  >
                    <Group justify="space-between" mb="md">
                      <ThemeIcon size={60} radius="xl" color={color[0]} variant="light">
                        <IconComponent size={32} color={isDark ? theme.colors.gray[9] : color[0]} />
                      </ThemeIcon>
                      <Box ta="right">
                        <Text size="xs" c="white" opacity={0.9}>
                          Starting at
                        </Text>
                        <Text size="xl" fw={900} c="white">
                          {formatPeso(service.service_type_minimum_price)}
                        </Text>
                      </Box>
                    </Group>

                    <Title order={3} c="white" mb={4}>
                      {service.service_type_label}
                    </Title>

                    <Text c="white" size="sm" opacity={0.95} fw={500}>
                      {service.service_type_subtext}
                    </Text>
                  </Box>

                  {/* Content */}
                  <Stack
                    p="xl"
                    gap="md"
                    style={{ backgroundColor: isDark ? theme.colors["gray"][9] : "white" }}
                  >
                    <Stack gap="xs">
                      <Flex justify="flex-end">
                        <Badge
                          size="sm"
                          color={service.service_type_is_active ? "green" : "red"}
                          variant="light"
                        >
                          {service.service_type_is_active ? "Available" : "Unavailable"}
                        </Badge>
                      </Flex>
                      <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                        {service.service_type_description}
                      </Text>
                    </Stack>

                    <Divider />

                    <Group gap="xs">
                      <ThemeIcon size={24} radius="xl" variant="light" color={color[9]}>
                        <IconClock size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dimmed">
                        {[
                          service.service_type_minimum_time_minutes,
                          service.service_type_maximum_time_minutes,
                        ].join(" - ")}{" "}
                        minutes
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
                          <ThemeIcon size={20} radius="xl" variant="light" color={color[6]}>
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }
                      >
                        {service.service_type_features.slice(0, 3).map((feature, idx) => (
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
                      mt="xs"
                      variant="gradient"
                      gradient={{ from: color[6], to: color[9], deg: 45 }}
                      onClick={() =>
                        handleLearnMore(
                          service,
                          FEATURE_BACKGROUND_COLORS[index % FEATURE_BACKGROUND_COLORS.length],
                        )
                      }
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
          <Paper p={{ base: "xl", xs: 60 }} radius="xl" shadow="xl">
            <Stack align="center" gap="xl">
              <Badge size="xl" radius="xl" color="cyan" variant="light">
                <Group gap="xs">
                  <IconHeart size={18} />
                  <Text fw={700}>Why Choose FadCri</Text>
                </Group>
              </Badge>

              <Title order={2} ta="center" style={{ color: theme.colors.cyan[8] }}>
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
          <CTASection
            icon={IconSparkles}
            title="Ready for Beautiful Nails?"
            description="Book your appointment today and experience the FadCri difference!"
          />
        </Stack>
      </Container>

      {/* Service Detail Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Group p="xs">
            {selectedService && (
              <>
                <Box>
                  <Title order={2} c={selectedColor || "cyan"}>
                    {selectedService.service_type_label}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {selectedService.service_type_subtext}
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
        {selectedService && selectedColor && (
          <Stack gap="lg" p="xs">
            <Box>
              <Group justify="space-between" mb="md">
                <Badge size="lg" variant="light" color={selectedColor}>
                  {[
                    selectedService.service_type_minimum_time_minutes,
                    selectedService.service_type_maximum_time_minutes,
                  ].join(" - ")}{" "}
                  minutes
                </Badge>
                <Text size="xl" fw={900} c={selectedColor}>
                  {[
                    formatPeso(selectedService.service_type_minimum_price),
                    formatPeso(selectedService.service_type_maximum_price),
                  ].join(" - ")}
                </Text>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                {selectedService.service_type_description}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fw={700} size="lg" mb="sm" c={selectedColor}>
                Features
              </Text>
              <List
                spacing="xs"
                icon={
                  <ThemeIcon size={24} radius="xl" variant="light" color={selectedColor}>
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                {selectedService.service_type_features.map((feature, idx) => (
                  <List.Item key={idx}>{feature}</List.Item>
                ))}
              </List>
            </Box>

            <Box>
              <Text fw={700} size="lg" mb="sm" c={selectedColor}>
                Benefits
              </Text>
              <List
                spacing="xs"
                icon={
                  <ThemeIcon size={24} radius="xl" variant="light" color={selectedColor}>
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                {selectedService.service_type_benefits.map((benefit, idx) => (
                  <List.Item key={idx}>{benefit}</List.Item>
                ))}
              </List>
            </Box>

            <Alert icon={<IconInfoCircle size={16} />} color={selectedColor}>
              <Stack>
                <Text fw={700} c={selectedColor}>
                  Ideal For
                </Text>

                <Text size="sm" c="dimmed">
                  {selectedService.service_type_ideal_for_description}
                </Text>
              </Stack>
            </Alert>

            <Button
              component={Link}
              href="/user/booking-info"
              fullWidth
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{
                from: theme.colors[selectedColor][6],
                to: theme.colors[selectedColor][9],
                deg: 45,
              }}
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
