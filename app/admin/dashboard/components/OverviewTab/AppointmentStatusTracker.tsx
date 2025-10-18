import { statusToColor } from "@/utils/functions";
import { Box, Center, Flex, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconChartDonutFilled, IconSquareRoundedFilled } from "@tabler/icons-react";
import { capitalize } from "lodash";
import RadialChart, { RadialChartData } from "../Chart/RadialChart";

const getPercentage = (value: number, total: number) => {
  const percentage = (value / total) * 100;
  return !isNaN(percentage) ? `${percentage.toFixed(0)}%` : `0%`;
};

type Props = {
  data: RadialChartData[];
  totalAppointmentCount: number;
};

const AppointmentStatusTracker = ({ data, totalAppointmentCount }: Props) => {
  return (
    <Paper w="100%" h="100%" withBorder>
      <Group
        p="md"
        gap="xs"
        style={{
          borderBottom: "0.0625rem solid #dee2e6",
        }}
      >
        <Center c="green">
          <IconChartDonutFilled />
        </Center>
        <Title order={4}>Total Appointment: {totalAppointmentCount.toLocaleString()}</Title>
      </Group>
      <Flex direction="column" align="stretch" gap="sm" mt="lg">
        <Center w="100%">
          <Box maw={175} mih={175}>
            {totalAppointmentCount > 0 ? (
              <RadialChart data={data} totalCount={totalAppointmentCount} />
            ) : (
              <Center h={175}>
                <Text size="xl" c="dimmed" fw={600}>
                  No data to display
                </Text>
              </Center>
            )}
          </Box>
        </Center>
        <Stack p="lg" gap="lg">
          {data.map((d, idx) => (
            <Flex key={d.label + idx} fz={14} justify="space-between" align="center" wrap="wrap">
              <Group gap="xs" w="fit-content" align="center">
                <Center c={statusToColor(d.label)}>
                  <IconSquareRoundedFilled />
                </Center>
                <Text fw={600}>{capitalize(d.label)}</Text>
                <Text ta="right" fw={600} c="dimmed">
                  {getPercentage(d.value, totalAppointmentCount)}
                </Text>
              </Group>
              <Text
                fw={600}
              >{`${d.value.toLocaleString()}/${totalAppointmentCount.toLocaleString()}`}</Text>
            </Flex>
          ))}
        </Stack>
      </Flex>
    </Paper>
  );
};

export default AppointmentStatusTracker;
