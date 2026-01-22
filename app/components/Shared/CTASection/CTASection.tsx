import {
  Box,
  Button,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight, TablerIcon } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  icon: TablerIcon;
  title: string;
  description: string;
};

const CTASection = ({ icon: Icon, title, description }: Props) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  return (
    <Paper
      p={{ base: "xl", sm: 60 }}
      radius="xl"
      shadow="xl"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.cyan[isDark ? 6 : 4]} 0%, ${theme.colors.yellow[isDark ? 6 : 4]} 100%)`,
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
          <Icon size={50} />
        </ThemeIcon>

        <Box ta="center">
          <Title order={2} c="white" mb="sm" style={{ fontSize: 36, fontWeight: 800 }}>
            {title}
          </Title>
          <Text size="xl" c="white" style={{ opacity: 0.95 }}>
            {description}
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
              color: theme.colors.cyan[6],
              fontWeight: 800,
              fontSize: 16,
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
  );
};

export default CTASection;
