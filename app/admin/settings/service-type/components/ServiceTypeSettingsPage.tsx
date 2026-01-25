"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { ServiceTypeTableRow } from "@/utils/types";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconMaximize,
  IconPlus,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { deleteServiceType, getServiceTypeSettings } from "../actions";
import { isAppError } from "@/utils/functions";

type Props = {
  serviceTypeData: ServiceTypeTableRow[];
};

const ServiceTypeSettingsPage = ({ serviceTypeData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();
  const computedColorScheme = useComputedColorScheme();
  const isDark = computedColorScheme === "dark";

  const [serviceTypes, setServiceTypes] = useState<ServiceTypeTableRow[]>(serviceTypeData);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!userData) return;

    try {
      setIsLoading(true);
      await deleteServiceType(supabaseClient, { serviceTypeId: id });
      await handleRefresh();

      notifications.show({
        message: "Service type delete successfully.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleDelete",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!userData) return;

    try {
      setIsFetching(true);
      const serviceTypeData = await getServiceTypeSettings(supabaseClient);
      setServiceTypes(serviceTypeData);
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isAppError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleRefresh",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsFetching(false);
    }
  };

  const deleteModal = (label: string, id: string) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure you want to delete {label}?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => handleDelete(id),
      centered: true,
    });

  return (
    <Container p={0} maw={1024} h="100%">
      <Stack>
        {/* Header */}
        <Group>
          <Box>
            <Title order={2}>Service Type</Title>
            <Text c="dimmed">Set up service types, durations, and related settings.</Text>
          </Box>
        </Group>

        <Paper p={{ base: "xs", xs: "xl" }} shadow="xl" radius="sm">
          {/* Stats */}
          <Flex mb="lg" wrap="wrap" gap="xs">
            <Paper
              p="md"
              radius="md"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.yellow[1]}`, flex: 1 }}
            >
              <Group gap="xs">
                <IconSparkles size={24} style={{ color: theme.colors.yellow[6] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Total Types
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.yellow[7] }}>
                    {serviceTypes.length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="md"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.green[1]}`, flex: 1 }}
            >
              <Group gap="xs">
                <IconCheck size={24} style={{ color: theme.colors.green[6] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Active
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.green[7] }}>
                    {serviceTypes.filter((t) => t.service_type_is_active).length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="md"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.red[1]}`, flex: 1 }}
            >
              <Group gap="xs">
                <IconX size={24} style={{ color: theme.colors.red[7] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Inactive
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.red[7] }}>
                    {serviceTypes.filter((t) => !t.service_type_is_active).length}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Flex>

          {/* Table */}
          <Paper
            p="xl"
            radius="md"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[1]}` }}
          >
            <Flex justify="space-between" mb="md" align="center" wrap="wrap" gap="xs">
              <Flex gap="lg" align="center" wrap="wrap">
                <Box>
                  <Text fw={600} size="lg" style={{ color: theme.colors.cyan[7] }}>
                    Service Types
                  </Text>
                  <Text size="sm" c="dimmed">
                    Manage your nail service types
                  </Text>
                </Box>
                <Button
                  leftSection={<IconRefresh size={14} />}
                  variant="light"
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  Refresh
                </Button>
              </Flex>
              <Button
                leftSection={<IconPlus size={18} />}
                color="cyan"
                component={Link}
                href="/admin/settings/service-type/create"
              >
                Add Type
              </Button>
            </Flex>

            <Divider my="md" />

            <DataTable
              columns={[
                {
                  accessor: "service_type_label",
                  title: "Service Type",
                  render: (record) => (
                    <Text fw={600} style={{ color: theme.colors.cyan[7] }}>
                      {record.service_type_label}
                    </Text>
                  ),
                },
                {
                  accessor: "service_type_is_active",
                  title: "Status",
                  textAlign: "center",
                  render: (record) => (
                    <Group gap="xs" justify="center">
                      <Badge
                        color={record.service_type_is_active ? "green" : "red"}
                        variant="light"
                      >
                        {record.service_type_is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Group>
                  ),
                },
                {
                  accessor: "service_type_date_created",
                  title: "Created",
                  render: (record) => (
                    <Text size="sm" c="dimmed">
                      {new Date(record.service_type_date_created).toLocaleDateString()}
                    </Text>
                  ),
                },
                {
                  accessor: "service_type_date_updated",
                  title: "Last Updated",
                  render: (record) => (
                    <Text size="sm" c="dimmed">
                      {record.service_type_date_updated
                        ? new Date(record.service_type_date_updated).toLocaleDateString()
                        : "Never"}
                    </Text>
                  ),
                },
                {
                  accessor: "actions",
                  title: "Actions",
                  textAlign: "center",
                  render: (record) => (
                    <Group gap="xs" justify="center">
                      <Tooltip label="View">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          component={Link}
                          href={`/admin/settings/service-type/${record.service_type_id}`}
                        >
                          <IconMaximize size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() =>
                            deleteModal(record.service_type_label, record.service_type_id)
                          }
                          disabled={isLoading}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  ),
                },
              ]}
              records={serviceTypes}
              idAccessor="service_type_id"
              minHeight={200}
              highlightOnHover
              styles={{
                header: {
                  background: theme.colors.cyan[isDark ? 9 : 0],
                  fontWeight: 600,
                  color: theme.colors.cyan[isDark ? 0 : 7],
                },
              }}
              fetching={isFetching}
            />
          </Paper>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ServiceTypeSettingsPage;
