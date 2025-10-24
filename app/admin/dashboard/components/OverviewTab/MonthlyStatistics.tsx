import { formatWordDate, statusToColorHex } from "@/utils/functions";
import { MonthlySalesDataTypeWithTotal } from "@/utils/types";
import { Box, Center, Flex, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconChartBar, IconSquareRoundedFilled } from "@tabler/icons-react";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import StackedBarChart from "../Chart/StackedBarChart";

type Props = {
  startDateFilter: Date | null;
  endDateFilter: Date | null;
  monthlyChartData: MonthlySalesDataTypeWithTotal["data"];
};

const statusList = ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"];

const MonthlyStatistics = ({ startDateFilter, endDateFilter, monthlyChartData }: Props) => {
  const [chartData, setChartData] = useState(monthlyChartData);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

  const filterChart = (newFilter: string) => {
    let updatedFilter = selectedFilter;
    if (selectedFilter.includes(newFilter)) {
      updatedFilter = selectedFilter.filter((oldFilter) => oldFilter !== newFilter);
    } else {
      updatedFilter.push(newFilter);
    }
    setSelectedFilter(updatedFilter);

    const temp: MonthlySalesDataTypeWithTotal["data"] = JSON.parse(
      JSON.stringify(monthlyChartData),
    );
    const newChartData = temp.map((d) => {
      updatedFilter.forEach((filter) => {
        switch (filter) {
          case "PENDING":
            d.pending = 0;
            break;
          case "SCHEDULED":
            d.scheduled = 0;
            break;
          case "COMPLETED":
            d.completed = 0;
            break;
          case "CANCELLED":
            d.cancelled = 0;
            break;

          default:
            break;
        }
      });

      return d;
    });
    setChartData(newChartData);
  };

  const startDate = formatWordDate(startDateFilter ?? new Date());
  const endDate = formatWordDate(endDateFilter ?? new Date());
  const xAxisChartLabel = startDate === endDate ? startDate : `${startDate} to ${endDate}`;

  useEffect(() => {
    setChartData(monthlyChartData);
  }, [monthlyChartData]);

  return (
    <Paper w="100%" h="100%" p="lg" withBorder style={{ flex: 1 }}>
      <Stack>
        <Group gap="apart">
          <Group gap="xs" mb="sm">
            <Center c="green">
              <IconChartBar />
            </Center>
            <Title order={3}>Monthly Statistics</Title>
          </Group>
          <Group fz={14}>
            {statusList.map((status, idx) => (
              <Flex
                key={status + idx}
                gap={4}
                w="fit-content"
                onClick={() => filterChart(status)}
                style={{ cursor: "pointer" }}
              >
                <Box>
                  <IconSquareRoundedFilled color={statusToColorHex(status)} />
                </Box>
                <Text fw={600} td={selectedFilter.includes(status) ? "line-through" : ""}>
                  {capitalize(status)}
                </Text>
              </Flex>
            ))}
          </Group>
        </Group>
        <Box p="xs" w="100%">
          {monthlyChartData.length > 0 ? (
            <StackedBarChart
              data={chartData}
              xAxisLabel={xAxisChartLabel}
              yAxisLabel="No. of Appointments"
            />
          ) : (
            <Center mih={600}>
              <Text size="xl" c="dimmed" fw={600}>
                No data to display
              </Text>
            </Center>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default MonthlyStatistics;
