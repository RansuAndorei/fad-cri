"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { SettingsEnum } from "@/utils/types";
import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconMap, IconMap2, IconMapPin, IconPhone } from "@tabler/icons-react";
import { isEqual, isError } from "lodash";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { updateSettings } from "../../actions";

type Props = {
  locationAndContactData: Record<SettingsEnum, string>;
};

const LocationContactPage = ({ locationAndContactData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();

  const [initialLocationAndContactSettings, setInitialLocationAndContactSettings] =
    useState<Record<SettingsEnum, string>>(locationAndContactData);
  const [locationAndContactSettings, setLocationAndContactSettings] =
    useState<Record<SettingsEnum, string>>(locationAndContactData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!userData) return;

    const { GENERAL_LOCATION, SPECIFIC_ADDRESS, PIN_LOCATION, CONTACT_NUMBER } =
      locationAndContactSettings;
    const errors: string[] = [];
    if (!GENERAL_LOCATION.trim()) errors.push("General location");
    if (!SPECIFIC_ADDRESS.trim()) errors.push("Specific address");
    if (!PIN_LOCATION.trim()) errors.push("PIN location");
    if (!CONTACT_NUMBER.trim()) errors.push("Contact number");

    if (errors.length > 0) {
      notifications.show({
        message: `${errors.join(", ")} ${errors.length === 1 ? "is" : "are"} required`,
        color: "orange",
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateSettings(supabaseClient, {
        settings: Object.entries(locationAndContactSettings).map(([key, value]) => ({
          system_setting_key: key,
          system_setting_value: value,
        })),
      });
      setInitialLocationAndContactSettings(locationAndContactSettings);

      notifications.show({
        message: "Location and Contact settings updated successfully.",
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
            <Title order={2}>Location & Contact</Title>
            <Text c="dimmed">Update studio address and contact information</Text>
          </Box>
        </Group>

        <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* General Location */}
            <Paper
              p={{ base: "sm", xs: "xl" }}
              radius="md"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.cyan[2]}`,
              }}
            >
              <Group mb="md">
                <IconMapPin size={24} color={theme.colors.cyan[6]} />
                <Box>
                  <Text fw={600} size="lg" c="cyan.8">
                    General Location
                  </Text>
                  <Text size="sm" c="dimmed">
                    City or municipality
                  </Text>
                </Box>
              </Group>

              <TextInput
                size="md"
                value={locationAndContactSettings.GENERAL_LOCATION}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setLocationAndContactSettings((prev) => ({
                    ...prev,
                    GENERAL_LOCATION: value,
                  }));
                }}
                placeholder="e.g., Obando, Bulacan"
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.cyan[2]}`,
                  },
                }}
              />
            </Paper>

            {/* Specific Address */}
            <Paper
              p={{ base: "sm", xs: "xl" }}
              radius="md"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.yellow[2]}`,
              }}
            >
              <Group mb="md">
                <IconMap size={24} color={theme.colors.yellow[5]} />
                <Box>
                  <Text fw={600} size="lg" c="yellow.8">
                    Specific Address
                  </Text>
                  <Text size="sm" c="dimmed">
                    Complete studio address
                  </Text>
                </Box>
              </Group>

              <Textarea
                size="md"
                value={locationAndContactSettings.SPECIFIC_ADDRESS}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setLocationAndContactSettings((prev) => ({
                    ...prev,
                    SPECIFIC_ADDRESS: value,
                  }));
                }}
                placeholder="Building, floor, unit, street, barangay"
                minRows={3}
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.yellow[2]}`,
                  },
                }}
              />
            </Paper>

            {/* Pin Location */}
            <Paper
              p={{ base: "sm", xs: "xl" }}
              radius="md"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.cyan[2]}`,
              }}
            >
              <Group mb="md">
                <IconMap2 size={24} color={theme.colors.cyan[6]} />
                <Box>
                  <Text fw={600} size="lg" c="cyan.8">
                    Google Maps Link
                  </Text>
                  <Text size="sm" c="dimmed">
                    Share your exact location
                  </Text>
                </Box>
              </Group>

              <TextInput
                size="md"
                value={locationAndContactSettings.PIN_LOCATION}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.currentTarget.value;
                  const trimmedValue = value.trim();
                  setLocationAndContactSettings((prev) => ({
                    ...prev,
                    PIN_LOCATION: trimmedValue,
                  }));
                }}
                placeholder="Paste Google Maps URL here"
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.cyan[2]}`,
                  },
                }}
                error={
                  locationAndContactSettings.PIN_LOCATION &&
                  !/^https?:\/\/(www\.)?google\.com\/maps/.test(
                    locationAndContactSettings.PIN_LOCATION,
                  )
                    ? "Must be a valid Google Maps link"
                    : undefined
                }
              />

              {locationAndContactSettings.PIN_LOCATION && (
                <Box mt="md">
                  <Button
                    component="a"
                    href={locationAndContactSettings.PIN_LOCATION}
                    target="_blank"
                    variant="light"
                    color="cyan"
                    size="sm"
                    radius="md"
                  >
                    Preview on Google Maps
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Contact Number */}
            <Paper
              p={{ base: "sm", xs: "xl" }}
              radius="md"
              shadow="xs"
              style={{
                border: `2px solid ${theme.colors.yellow[2]}`,
              }}
            >
              <Group mb="md">
                <IconPhone size={24} color={theme.colors.yellow[5]} />
                <Box>
                  <Text fw={600} size="lg" c="yellow.8">
                    Contact Number
                  </Text>
                  <Text size="sm" c="dimmed">
                    Phone number for inquiries
                  </Text>
                </Box>
              </Group>

              <TextInput
                value={locationAndContactSettings.CONTACT_NUMBER}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.currentTarget.value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }
                  if (value && !value.startsWith("9")) {
                    return;
                  }
                  setLocationAndContactSettings((prev) => ({
                    ...prev,
                    CONTACT_NUMBER: value,
                  }));
                }}
                placeholder="9123456789"
                size="md"
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.yellow[2]}`,
                  },
                }}
                leftSection={<Text>+63</Text>}
              />
            </Paper>

            {/* Save Button */}
            <Flex align="center" justify="flex-end">
              <Button
                size="md"
                leftSection={<IconDeviceFloppy size={18} />}
                onClick={handleSave}
                loading={isLoading}
                disabled={isEqual(initialLocationAndContactSettings, locationAndContactSettings)}
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

export default LocationContactPage;
