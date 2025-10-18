import { statusToColor } from "@/utils/functions";
import { DashboardTypeType } from "@/utils/types";
import {
  Badge,
  Group,
  Progress,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { capitalize } from "lodash";

type Props = {
  type: DashboardTypeType;
};

const TypeItem = ({ type }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const { colors } = useMantineTheme();

  const progressSections = type.type.map(({ label, value }) => ({
    rawValue: value,
    value: (value / type.total) * 100,
    color: `${statusToColor(label) || "dark"}`,
    tooltip: `${capitalize(label)}: ${value}`,
    label: label,
  }));

  const progressSectionsWithoutTotal = progressSections.filter(
    (section) => !section.tooltip.includes("Total"),
  );

  return (
    <Stack gap="xs">
      <Group justify="apart">
        <Tooltip label={type.typeLabel}>
          <Group gap="xs">
            <Text fw={500} maw={120} truncate>
              {type.typeLabel}
            </Text>
          </Group>
        </Tooltip>
        <Tooltip
          label={progressSectionsWithoutTotal.map((section, idx) => (
            <Text key={section.tooltip + idx}>{section.tooltip}</Text>
          ))}
        >
          <Badge
            size="sm"
            variant="filled"
            style={{
              backgroundColor: colorScheme === "light" ? colors.dark[9] : colors.dark[3],
            }}
          >
            Total: {type.total.toLocaleString()}
          </Badge>
        </Tooltip>
      </Group>
      <Progress.Root size="md" radius="lg">
        {progressSectionsWithoutTotal.map((section, index) => (
          <Tooltip
            label={`${capitalize(section.label)}: ${section.rawValue}`}
            key={index}
            withArrow
          >
            <Progress.Section value={section.value} color={section.color}></Progress.Section>
          </Tooltip>
        ))}
      </Progress.Root>
    </Stack>
  );
};

export default TypeItem;
