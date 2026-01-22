import { Badge, Group, Stack, Text, Title, useComputedColorScheme } from "@mantine/core";
import { TablerIcon } from "@tabler/icons-react";

type Props = {
  icon: TablerIcon;
  badgeLabel: string;
  title: string;
  description: string;
};

const HeroSection = ({ icon: BadgeIcon, badgeLabel, title, description }: Props) => {
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  return (
    <Stack align="center">
      <Badge
        size="xl"
        radius="xl"
        variant="gradient"
        gradient={{ from: "cyan", to: "yellow", deg: 45 }}
        style={{ padding: "14px 28px" }}
      >
        <Group gap="xs">
          <BadgeIcon size={20} />
          <Text fw={700} size="md">
            {badgeLabel}
          </Text>
        </Group>
      </Badge>

      <Title
        order={1}
        ta="center"
        style={{
          fontSize: 48,
          fontWeight: 900,
          lineHeight: 1.1,
        }}
        c={isDark ? "cyan.0" : "cyan"}
      >
        {title}
      </Title>

      <Text
        size="xl"
        ta="center"
        maw={700}
        style={{ lineHeight: 1.7, fontSize: 20 }}
        c={isDark ? "gray.1" : "dimmed"}
      >
        {description}
      </Text>
    </Stack>
  );
};

export default HeroSection;
