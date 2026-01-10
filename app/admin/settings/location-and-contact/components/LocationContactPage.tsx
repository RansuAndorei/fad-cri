"use client";

import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDeviceFloppy, IconMap, IconMap2, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useState } from "react";

const LocationContactPage = () => {
  const theme = useMantineTheme();

  const [generalLocation, setGeneralLocation] = useState("Obando, Bulacan");
  const [specificAddress, setSpecificAddress] = useState(
    "JCG Bldg., 2nd floor, Unit Door 1, P Sevilla St, Catanghalan, Obando, Bulacan",
  );
  const [pinLocation, setPinLocation] = useState(
    "https://www.google.com/maps/place/Yummy+Teh/@14.7055595,120.9367399,17z",
  );
  const [contactNumber, setContactNumber] = useState("09123456789");
  const [saved, setSaved] = useState(false);

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
            <Title order={2}>Location & Contact</Title>
            <Text c="dimmed">Update studio address and contact information</Text>
          </Box>
        </Group>

        <Paper p="xl" shadow="xl" radius="sm">
          <Stack gap="lg">
            {/* General Location */}
            <Paper
              p="xl"
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
                value={generalLocation}
                onChange={(e) => setGeneralLocation(e.currentTarget.value)}
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
              p="xl"
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
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.currentTarget.value)}
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
              p="xl"
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
                value={pinLocation}
                onChange={(e) => setPinLocation(e.currentTarget.value)}
                placeholder="Paste Google Maps URL here"
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.cyan[2]}`,
                  },
                }}
              />

              {pinLocation && (
                <Box mt="md">
                  <Button
                    component="a"
                    href={pinLocation}
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
              p="xl"
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
                value={contactNumber}
                onChange={(e) => setContactNumber(e.currentTarget.value)}
                placeholder="09123456789"
                type="number"
                size="md"
                styles={{
                  input: {
                    border: `2px solid ${theme.colors.yellow[2]}`,
                  },
                }}
              />
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

export default LocationContactPage;
