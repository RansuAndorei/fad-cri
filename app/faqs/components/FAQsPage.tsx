"use client";

import {
  Accordion,
  Anchor,
  Badge,
  Box,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
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
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";

type FAQ = {
  category: string;
  icon: typeof IconSparkles;
  color: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

const FAQsPage = () => {
  const faqs: FAQ[] = [
    {
      category: "General Information",
      icon: IconInfoCircle,
      color: "cyan",
      questions: [
        {
          question: "What services does FadCri offer?",
          answer:
            "FadCri specializes in professional nail services including Gel Polish, Structured Gel Polish, BIAB (Builder in a Bottle), Polygel Overlay, and Gel-X Extensions. All services are performed by our skilled nail technicians in a clean, relaxing environment.",
        },
        {
          question: "Where is FadCri located?",
          answer:
            "We are located at JCG Bldg., 2nd floor, Unit Door 1, P Sevilla St, Catanghalan, Obando, Bulacan. Find us easily using our location pin on the booking page.",
        },
        {
          question: "What are your operating hours?",
          answer:
            "We are open daily from 10:00 AM to 8:00 PM. Appointments are available throughout the day. Walk-ins are welcome subject to availability, but we highly recommend booking in advance.",
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
            'Simply click the "Book an Appointment" button on our website, select your preferred service type, choose an available date and time slot, and complete your booking. You\'ll receive a confirmation via email.',
        },
        {
          question: "How far in advance can I book?",
          answer:
            "You can book appointments up to 3 months in advance. This allows you to plan ahead and secure your preferred dates, especially during busy seasons.",
        },
        {
          question: "Can I cancel or reschedule my appointment?",
          answer:
            "Yes, you can cancel or reschedule your appointment through your account dashboard. Please note that cancellations or changes made less than 24 hours before your appointment may be subject to fees.",
        },
        {
          question: "What if I'm running late?",
          answer:
            "Please contact us as soon as possible if you're running late. We have a 15-minute grace period. Beyond that, we may need to reschedule your appointment to accommodate other clients.",
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
            "Pricing varies by service type. You can view detailed pricing for each service during the booking process. Our prices are competitive and reflect our commitment to quality and hygiene.",
        },
        {
          question: "Is there a booking fee?",
          answer:
            "Yes, there is a booking fee of ₱500 to secure your appointment. This fee goes toward your total service cost and is non-refundable if you cancel within 24 hours of your appointment.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept cash, GCash, Maya, and major credit/debit cards. Payment is required at the time of service. The booking fee is paid online during reservation.",
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
          answer:
            "You can reach us via phone at 09123456789, email us through our website contact form, or visit us directly at our salon. We typically respond to inquiries within 24 hours.",
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
        background: "linear-gradient(180deg, #e0f7fa 0%, #fff9e6 50%, #ffe0f5 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <Box
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,188,212,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,213,79,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container size="lg" py={80}>
        {/* Hero Section */}
        <Stack align="center" mb={60}>
          <Badge
            size="lg"
            radius="md"
            variant="gradient"
            gradient={{ from: "cyan", to: "yellow", deg: 45 }}
            style={{ padding: "12px 24px" }}
          >
            <Group gap="xs">
              <IconSparkles size={18} />
              <Text fw={600} size="sm">
                Help Center
              </Text>
            </Group>
          </Badge>

          <Title
            order={1}
            ta="center"
            style={{
              fontSize: 56,
              fontWeight: 800,
              background: "linear-gradient(135deg, #00bcd4 0%, #ffd54f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Frequently Asked Questions
          </Title>

          <Text size="xl" c="dimmed" ta="center" maw={600} style={{ lineHeight: 1.6 }}>
            Find answers to common questions about FadCri&apos;s nail services, booking process, and
            policies. Still have questions?{" "}
            <Anchor component={Link} href="/contact" fw={600} style={{ color: "#00bcd4" }}>
              Contact us
            </Anchor>
            !
          </Text>
        </Stack>

        {/* Quick Stats */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb={60} spacing="lg">
          <Paper
            p="xl"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #b2ebf2",
              background: "rgba(255, 255, 255, 0.8)",
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
              <Text fw={700} size="lg" style={{ color: "#00838f" }}>
                10AM - 8PM
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Daily Hours
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="xl"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #fff9c4",
              background: "rgba(255, 255, 255, 0.8)",
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
              <Text fw={700} size="lg" style={{ color: "#f57f17" }}>
                3 Months
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
              border: "2px solid #c8e6c9",
              background: "rgba(255, 255, 255, 0.8)",
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
              <Text fw={700} size="lg" style={{ color: "#00695c" }}>
                Obando
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Bulacan
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="xl"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #f8bbd0",
              background: "rgba(255, 255, 255, 0.8)",
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
              <Text fw={700} size="lg" style={{ color: "#c2185b" }}>
                09123456789
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Call Us
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* FAQ Accordion by Category */}
        <Stack gap="xl">
          {faqs.map((category) => {
            const Icon = category.icon;
            return (
              <Paper
                key={category.category}
                p="xl"
                radius="xl"
                shadow="md"
                style={{
                  border: `2px solid ${getCategoryBorder(category.color)}`,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Group mb="xl" gap="md">
                  <ThemeIcon size={50} radius="xl" variant="light" color={category.color}>
                    <Icon size={28} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={700} size="xl" style={{ color: "#00838f" }}>
                      {category.category}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {category.questions.length} questions answered
                    </Text>
                  </Box>
                </Group>

                <Accordion
                  variant="separated"
                  radius="lg"
                  chevron={<IconChevronDown size={20} />}
                  styles={{
                    item: {
                      border: "1px solid #e0e0e0",
                      marginBottom: 12,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#00bcd4",
                        transform: "translateX(4px)",
                      },
                      "&[dataActive]": {
                        borderColor: "#00bcd4",
                        borderWidth: 2,
                      },
                    },
                    control: {
                      padding: "20px 24px",
                      "&:hover": {
                        backgroundColor: "rgba(0, 188, 212, 0.05)",
                      },
                    },
                    label: {
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#00838f",
                    },
                    content: {
                      padding: "16px 24px 24px",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#424242",
                    },
                    chevron: {
                      color: "#00bcd4",
                    },
                  }}
                >
                  {category.questions.map((faq, index) => (
                    <Accordion.Item key={index} value={`${category.category}-${index}`}>
                      <Accordion.Control>{faq.question}</Accordion.Control>
                      <Accordion.Panel>{faq.answer}</Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Paper>
            );
          })}
        </Stack>

        {/* Still Have Questions CTA */}
        <Paper
          p={60}
          radius="xl"
          mt={80}
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
            <ThemeIcon size={80} radius="xl" color="white" variant="light">
              <IconAlertCircle size={40} style={{ color: "#00bcd4" }} />
            </ThemeIcon>

            <Box ta="center">
              <Title order={2} c="white" mb="sm" style={{ fontSize: 36, fontWeight: 800 }}>
                Still Have Questions?
              </Title>
              <Text size="lg" c="white" style={{ opacity: 0.95 }}>
                We&apos;re here to help! Contact us anytime and we&apos;ll get back to you soon.
              </Text>
            </Box>

            <Group gap="md">
              <Anchor
                component={Link}
                href="/contact"
                underline="never"
                style={{
                  padding: "16px 32px",
                  borderRadius: 12,
                  background: "white",
                  color: "#00bcd4",
                  fontWeight: 700,
                  fontSize: 16,
                  transition: "all 0.2s ease",
                  display: "inline-block",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                Contact Us
              </Anchor>

              <Anchor
                component={Link}
                href="/user/booking-info"
                underline="never"
                style={{
                  padding: "16px 32px",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  transition: "all 0.2s ease",
                  display: "inline-block",
                  border: "2px solid white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#00bcd4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.color = "white";
                }}
              >
                Book Appointment
              </Anchor>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

// Helper function for category border colors
const getCategoryBorder = (color: string) => {
  const borders: Record<string, string> = {
    cyan: "#b2ebf2",
    yellow: "#fff9c4",
    teal: "#b2dfdb",
    pink: "#f8bbd0",
    red: "#ffcdd2",
    violet: "#e1bee7",
  };
  return borders[color] || "#e0e0e0";
};

export default FAQsPage;
