import { ScheduleRangeType } from "@/utils/types";
import { Stack, Text, Title } from "@mantine/core";
import { capitalize } from "lodash";

type Props = {
  data: ScheduleRangeType[];
};

const Hours = ({ data }: Props) => {
  const formatDays = (days: string[]) => {
    if (days.length === 1) return capitalize(days[0]);

    return `${capitalize(days[0])} — ${capitalize(days[days.length - 1])}`;
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [rawTime] = time.split("+");
    const [hour, minute] = rawTime.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <Stack style={{ flex: 1 }} gap="xs">
      <Title order={4}>Hours</Title>

      {data?.map((range, index) => (
        <Stack key={index} gap={0} ml="xs">
          <Text>{formatDays(range.days)}</Text>
          <Text c="dimmed">
            {formatTime(range.earliest_time)} — {formatTime(range.latest_time)}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default Hours;
