"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCalendar, IconCurrencyPeso, IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";

const FinancialSettingsPage = () => {
  const theme = useMantineTheme();

  const [bookingFee, setBookingFee] = useState(500);
  const [maxScheduleMonth, setMaxScheduleMonth] = useState(3);
  const [lateFees, setLateFees] = useState([
    { id: "1", amount: 300, label: "11-20 minutes" },
    { id: "2", amount: 500, label: "21-39 minutes" },
    { id: "3", amount: 1000, label: "40 minutes to 1 hour" },
    { id: "4", amount: 2000, label: "More than 1 hour" },
  ]);
  const [saved, setSaved] = useState(false);

  const updateLateFee = (id: string, amount: number) => {
    setLateFees((fees) => fees.map((fee) => (fee.id === id ? { ...fee, amount } : fee)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Container p={0} maw={1024} h="100%">
      <Stack>
        {/* Header */}
        <Group>
          <Box>
            <Title order={2}>Financial</Title>
            <Text c="dimmed">Manage booking fees and late penalties</Text>
          </Box>
        </Group>

        <Paper p="xl" shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* Booking Fee */}
            <Paper
              p="xl"
              radius="lg"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.cyan[2]}`,
              }}
            >
              <Group mb="md">
                <IconCurrencyPeso size={24} color={theme.colors.cyan[6]} />
                <Box>
                  <Text fw={600} size="lg" c="cyan.8">
                    Booking Fee
                  </Text>
                  <Text size="sm" c="dimmed">
                    Amount charged for each booking
                  </Text>
                </Box>
              </Group>

              <NumberInput
                size="md"
                value={bookingFee}
                onChange={(val) => setBookingFee(Number(val))}
                prefix="₱"
                thousandSeparator=","
                min={0}
                styles={{
                  input: {
                    color: theme.colors.cyan[6],
                    border: `2px solid ${theme.colors.cyan[2]}`,
                  },
                }}
              />
            </Paper>

            {/* Max Schedule Date */}
            <Paper
              p="xl"
              radius="lg"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.yellow[2]}`,
              }}
            >
              <Group mb="md">
                <IconCalendar size={24} color={theme.colors.yellow[5]} />
                <Box>
                  <Text fw={600} size="lg" c="yellow.8">
                    Max Schedule Date
                  </Text>
                  <Text size="sm" c="dimmed">
                    Maximum months ahead for booking
                  </Text>
                </Box>
              </Group>

              <NumberInput
                size="md"
                value={maxScheduleMonth}
                onChange={(val) => setMaxScheduleMonth(Number(val))}
                suffix=" months"
                min={1}
                max={12}
                styles={{
                  input: {
                    color: theme.colors.yellow[7],
                    border: `2px solid ${theme.colors.yellow[2]}`,
                  },
                }}
              />
            </Paper>

            {/* Late Fees */}
            <Paper
              p="xl"
              radius="lg"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.cyan[2]}`,
              }}
            >
              <Box mb="md">
                <Text fw={600} size="lg" c="cyan.8">
                  Late Fees
                </Text>
                <Text size="sm" c="dimmed">
                  Progressive penalties for late arrivals
                </Text>
              </Box>

              <Divider my="md" />

              <Stack gap="md">
                {lateFees.map((fee) => (
                  <Group key={fee.id} align="center" gap="md">
                    <Badge size="lg" variant="light" color="cyan" w={200}>
                      {fee.label}
                    </Badge>

                    <NumberInput
                      flex={1}
                      value={fee.amount}
                      onChange={(val) => updateLateFee(fee.id, Number(val))}
                      prefix="₱"
                      thousandSeparator=","
                      min={0}
                      styles={{
                        input: {
                          border: `2px solid ${theme.colors.cyan[2]}`,
                        },
                      }}
                    />
                  </Group>
                ))}
              </Stack>
            </Paper>

            {/* Save Button */}
            <Group justify="flex-end">
              <Button
                leftSection={<IconDeviceFloppy size={20} />}
                onClick={handleSave}
                size="md"
                radius="md"
              >
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default FinancialSettingsPage;
