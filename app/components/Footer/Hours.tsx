import { formatDaysInOperatingHours, formatTimeInOperatingHours } from "@/utils/functions";
import { ScheduleRangeType } from "@/utils/types";
import { Stack, Text, Title } from "@mantine/core";

type Props = {
  scheduleList: ScheduleRangeType[];
};

const Hours = ({ scheduleList }: Props) => {
  return (
    <Stack style={{ flex: 1 }} gap="xs">
      <Title order={4}>Hours</Title>
      {scheduleList.map((range, index) => (
        <Stack key={index} gap={0} ml="xs">
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

export default Hours;
