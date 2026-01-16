"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { LATE_FEE_LABEL_LIST } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { SettingsEnum } from "@/utils/types";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCurrencyPeso, IconDeviceFloppy } from "@tabler/icons-react";
import { isEqual, isError } from "lodash";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { updateSettings } from "../../actions";

type Props = {
  financialData: Record<SettingsEnum, string>;
};

const FinancialSettingsPage = ({ financialData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();

  const [initialFinancialSettings, setInitialFinancialSettings] =
    useState<Record<SettingsEnum, string>>(financialData);
  const [financialSettings, setFinancialSettings] =
    useState<Record<SettingsEnum, string>>(financialData);
  const [isLoading, setIsLoading] = useState(false);

  const updateLateFee = (label: string, amount: number) => {
    setFinancialSettings((prev) => ({
      ...prev,
      [label]: amount,
    }));
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      setIsLoading(true);
      await updateSettings(supabaseClient, {
        settings: Object.entries(financialSettings).map(([key, value]) => ({
          system_setting_key: key,
          system_setting_value: value,
        })),
      });
      setInitialFinancialSettings(financialSettings);

      notifications.show({
        message: "Financial settingss updated successfully.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleSave",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
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
                value={financialSettings.BOOKING_FEE}
                onChange={(val) =>
                  setFinancialSettings((prev) => ({ ...prev, BOOKING_FEE: String(val) }))
                }
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
                value={financialSettings.MAX_SCHEDULE_DATE_MONTH}
                onChange={(val) =>
                  setFinancialSettings((prev) => ({
                    ...prev,
                    MAX_SCHEDULE_DATE_MONTH: String(val),
                  }))
                }
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
                {LATE_FEE_LABEL_LIST.map((label, index) => (
                  <Group key={label} align="center" gap="md">
                    <Badge size="lg" variant="light" color="cyan" w={200}>
                      {label}
                    </Badge>

                    <NumberInput
                      flex={1}
                      value={financialSettings[`LATE_FEE_${index + 1}` as SettingsEnum]}
                      onChange={(val) => updateLateFee(`LATE_FEE_${index + 1}`, Number(val))}
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
            <Flex align="center" justify="flex-end">
              <Button
                size="md"
                leftSection={<IconDeviceFloppy size={18} />}
                onClick={handleSave}
                loading={isLoading}
                disabled={isEqual(initialFinancialSettings, financialSettings)}
              >
                Save
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default FinancialSettingsPage;
