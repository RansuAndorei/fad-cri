import { getAvatarColor, statusToColor } from "@/utils/functions";
import { DashboardClientType } from "@/utils/types";
import {
  Avatar,
  Badge,
  Group,
  Progress,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { capitalize, startCase } from "lodash";

type Props = {
  client: DashboardClientType;
};

const ClientItem = ({ client }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const { colors } = useMantineTheme();

  const progressSections = client.appointment.map(({ label, value }) => ({
    rawValue: value,
    value: (value / client.total) * 100,
    color: `${statusToColor(label) || "dark"}`,
    tooltip: `${capitalize(label)}: ${value}`,
    label: label,
  }));
  const { userId, firstName, lastName, avatar } = client.userData;
  const requestorFullname = startCase(`${firstName} ${lastName}`);
  const progressSectionsWithoutTotal = progressSections.filter(
    (section) => !section.tooltip.includes("Total"),
  );
  return (
    <Stack gap="xs">
      <Group justify="apart">
        <Tooltip label={requestorFullname}>
          <Group gap="xs">
            <Avatar
              size="sm"
              radius="xl"
              src={avatar ?? null}
              color={getAvatarColor(Number(`${userId.charCodeAt(0)}`))}
            >
              {!avatar && `${firstName[0]}${lastName[0]}`}
            </Avatar>
            <Text fw={500} maw={120} truncate>
              {requestorFullname}
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
            Total: {client.total.toLocaleString()}
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

export default ClientItem;
