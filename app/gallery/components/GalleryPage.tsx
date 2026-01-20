"use client";

import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconDiamond,
  IconHeart,
  IconPalette,
  IconPhoto,
  IconSparkles,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type GalleryImage = {
  id: string;
  category: "all" | "gel-polish" | "biab" | "extensions" | "nail-art";
  title: string;
  description: string;
  service: string;
  color: string;
  aspectRatio: "square" | "portrait" | "landscape";
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  // Dummy gallery images with realistic nail service descriptions
  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      category: "gel-polish",
      title: "Classic French Manicure",
      description: "Timeless elegance with a modern twist - gel polish French tips",
      service: "Gel Polish",
      color: "cyan",
      aspectRatio: "square",
    },
    {
      id: "2",
      category: "nail-art",
      title: "Floral Paradise",
      description: "Hand-painted flowers with delicate gold accents",
      service: "Nail Art",
      color: "pink",
      aspectRatio: "portrait",
    },
    {
      id: "3",
      category: "biab",
      title: "Natural BIAB Overlay",
      description: "Strengthening builder gel with nude pink finish",
      service: "BIAB",
      color: "pink",
      aspectRatio: "landscape",
    },
    {
      id: "4",
      category: "extensions",
      title: "Almond Gel-X Extensions",
      description: "Soft pink almond extensions with glossy finish",
      service: "Gel-X Extension",
      color: "yellow",
      aspectRatio: "square",
    },
    {
      id: "5",
      category: "nail-art",
      title: "Galaxy Dreams",
      description: "Cosmic nail art with holographic glitter",
      service: "Nail Art",
      color: "violet",
      aspectRatio: "square",
    },
    {
      id: "6",
      category: "gel-polish",
      title: "Ombre Sunset",
      description: "Gradient gel polish in warm sunset tones",
      service: "Gel Polish",
      color: "orange",
      aspectRatio: "portrait",
    },
    {
      id: "7",
      category: "extensions",
      title: "Stiletto Polygel",
      description: "Bold stiletto shape with nude polygel overlay",
      service: "Polygel Overlay",
      color: "teal",
      aspectRatio: "landscape",
    },
    {
      id: "8",
      category: "nail-art",
      title: "Marble Masterpiece",
      description: "White and gold marble effect with metallic accents",
      service: "Nail Art",
      color: "yellow",
      aspectRatio: "square",
    },
    {
      id: "9",
      category: "biab",
      title: "Strengthening BIAB",
      description: "Builder gel for damaged nails with sheer coverage",
      service: "BIAB",
      color: "pink",
      aspectRatio: "square",
    },
    {
      id: "10",
      category: "gel-polish",
      title: "Crimson Elegance",
      description: "Deep red gel polish with high-shine finish",
      service: "Gel Polish",
      color: "red",
      aspectRatio: "portrait",
    },
    {
      id: "11",
      category: "nail-art",
      title: "Tropical Vibes",
      description: "Palm leaves and exotic flowers on nude base",
      service: "Nail Art",
      color: "green",
      aspectRatio: "landscape",
    },
    {
      id: "12",
      category: "extensions",
      title: "Long Coffin Extensions",
      description: "Gel-X coffin shape with ombre design",
      service: "Gel-X Extension",
      color: "violet",
      aspectRatio: "square",
    },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    openModal();
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const getPlaceholderGradient = (color: string) => {
    const gradients: Record<string, string> = {
      cyan: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
      pink: "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)",
      yellow: "linear-gradient(135deg, #ffd54f 0%, #ffc107 100%)",
      violet: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
      teal: "linear-gradient(135deg, #009688 0%, #00796b 100%)",
      orange: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
      red: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
      green: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
    };
    return gradients[color] || gradients.cyan;
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
          top: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,30,99,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "20%",
          left: "0%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(156,39,176,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container size="xl" py={80}>
        {/* Hero Section */}
        <Stack align="center" mb={60}>
          <Badge
            size="xl"
            radius="xl"
            variant="gradient"
            gradient={{ from: "pink", to: "violet", deg: 45 }}
            style={{ padding: "14px 28px" }}
          >
            <Group gap="xs">
              <IconPhoto size={20} />
              <Text fw={700} size="md">
                Our Work
              </Text>
            </Group>
          </Badge>

          <Title
            order={1}
            ta="center"
            style={{
              fontSize: 64,
              fontWeight: 900,
              background: "linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Gallery
          </Title>

          <Text
            size="xl"
            c="dimmed"
            ta="center"
            maw={700}
            style={{ lineHeight: 1.7, fontSize: 20 }}
          >
            Explore our collection of beautiful nail designs and transformations. From classic
            elegance to bold statement pieces, see what&apos;s possible at FadCri.
          </Text>
        </Stack>

        {/* Category Filter */}
        <Center mb={60}>
          <SegmentedControl
            value={selectedCategory}
            onChange={setSelectedCategory}
            size="md"
            radius="xl"
            data={[
              { label: "All", value: "all" },
              { label: "Gel Polish", value: "gel-polish" },
              { label: "BIAB", value: "biab" },
              { label: "Extensions", value: "extensions" },
              { label: "Nail Art", value: "nail-art" },
            ]}
            styles={{
              root: {
                background: "white",
                padding: 4,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              },
              label: {
                padding: "12px 24px",
                fontWeight: 600,
              },
              indicator: {
                background: "linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)",
              },
            }}
          />
        </Center>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} mb={60} spacing="lg">
          <Paper
            p="lg"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #f8bbd0",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon size={50} radius="xl" variant="light" color="pink">
                <IconSparkles size={26} />
              </ThemeIcon>
              <Text fw={800} size="xl" style={{ color: "#c2185b" }}>
                {galleryImages.length}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Designs
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #e1bee7",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon size={50} radius="xl" variant="light" color="violet">
                <IconHeart size={26} />
              </ThemeIcon>
              <Text fw={800} size="xl" style={{ color: "#7b1fa2" }}>
                500+
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Happy Clients
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #b2dfdb",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon size={50} radius="xl" variant="light" color="teal">
                <IconPalette size={26} />
              </ThemeIcon>
              <Text fw={800} size="xl" style={{ color: "#00796b" }}>
                100+
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Colors
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            radius="xl"
            shadow="sm"
            style={{
              border: "2px solid #fff9c4",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon size={50} radius="xl" variant="light" color="yellow">
                <IconStar size={26} />
              </ThemeIcon>
              <Text fw={800} size="xl" style={{ color: "#f57f17" }}>
                5⭐
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Rating
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* Gallery Grid - Masonry Style */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {filteredImages.map((image, index) => (
            <Paper
              key={image.id}
              p={0}
              radius="xl"
              shadow="md"
              style={{
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid rgba(0,0,0,0.05)",
                height:
                  image.aspectRatio === "portrait"
                    ? "400px"
                    : image.aspectRatio === "landscape"
                      ? "250px"
                      : "320px",
              }}
              onClick={() => handleImageClick(image, index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              {/* Placeholder with gradient */}
              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  background: getPlaceholderGradient(image.color),
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Overlay with info */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                    padding: "24px 16px 16px",
                    color: "white",
                  }}
                >
                  <Badge
                    size="sm"
                    radius="md"
                    variant="light"
                    color="white"
                    mb={8}
                    styles={{
                      root: {
                        color: "white",
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                      },
                    }}
                  >
                    {image.service}
                  </Badge>
                  <Text fw={700} size="lg" mb={4}>
                    {image.title}
                  </Text>
                  <Text size="sm" opacity={0.9}>
                    {image.description}
                  </Text>
                </Box>

                {/* Icon in center */}
                <IconDiamond
                  size={80}
                  style={{
                    color: "rgba(255,255,255,0.2)",
                  }}
                />
              </Box>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <Paper p={80} radius="xl" shadow="sm" ta="center">
            <ThemeIcon size={100} radius="xl" variant="light" color="gray" mx="auto" mb="xl">
              <IconPhoto size={60} />
            </ThemeIcon>
            <Title order={3} c="dimmed" mb="sm">
              No designs found
            </Title>
            <Text c="dimmed" mb="xl">
              Try selecting a different category
            </Text>
            <Button variant="light" color="pink" onClick={() => setSelectedCategory("all")}>
              View All Designs
            </Button>
          </Paper>
        )}

        {/* CTA Section */}
        <Paper
          p={60}
          radius="xl"
          mt={80}
          shadow="xl"
          style={{
            background: "linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)",
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
              <IconSparkles size={50} style={{ color: "#e91e63" }} />
            </ThemeIcon>

            <Box ta="center">
              <Title order={2} c="white" mb="sm" style={{ fontSize: 40, fontWeight: 900 }}>
                Ready for Your Own Stunning Nails?
              </Title>
              <Text size="xl" c="white" style={{ opacity: 0.95 }}>
                Book your appointment and let our artists create something beautiful for you!
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
                  color: "#e91e63",
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

      {/* Lightbox Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        size="xl"
        radius="lg"
        centered
        withCloseButton={false}
        padding={0}
        styles={{
          body: {
            padding: 0,
          },
          content: {
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {selectedImage && (
          <Box style={{ position: "relative" }}>
            {/* Close Button */}
            <Box
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            >
              <Button
                onClick={closeModal}
                radius="xl"
                size="md"
                color="white"
                styles={{
                  root: {
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    "&:hover": {
                      background: "rgba(0,0,0,0.8)",
                    },
                  },
                }}
              >
                <IconX size={20} />
              </Button>
            </Box>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  onClick={handlePrev}
                  radius="xl"
                  size="lg"
                  color="white"
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                  }}
                >
                  <IconChevronLeft size={24} />
                </Button>

                <Button
                  onClick={handleNext}
                  radius="xl"
                  size="lg"
                  color="white"
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                  }}
                >
                  <IconChevronRight size={24} />
                </Button>
              </>
            )}

            {/* Image */}
            <Box
              style={{
                background: getPlaceholderGradient(selectedImage.color),
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                minHeight: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconDiamond
                size={120}
                style={{
                  color: "rgba(255,255,255,0.3)",
                }}
              />

              {/* Info Overlay */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.8)",
                  backdropFilter: "blur(20px)",
                  padding: "32px",
                  color: "white",
                }}
              >
                <Badge
                  size="lg"
                  radius="md"
                  variant="light"
                  color="white"
                  mb="md"
                  styles={{
                    root: {
                      color: "white",
                      background: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  {selectedImage.service}
                </Badge>
                <Title order={2} c="white" mb="sm">
                  {selectedImage.title}
                </Title>
                <Text size="lg" opacity={0.9}>
                  {selectedImage.description}
                </Text>
                <Text size="sm" opacity={0.7} mt="md">
                  {currentIndex + 1} / {filteredImages.length}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default GalleryPage;
