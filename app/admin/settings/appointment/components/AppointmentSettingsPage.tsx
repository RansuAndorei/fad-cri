"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AppointmentTypeTableRow } from "@/utils/types";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { isError } from "lodash";
import { DataTable } from "mantine-datatable";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  checkAppointmentType,
  deleteAppointmentType,
  getAppointmentTypeSettings,
  insertAppointmentType,
  updateAppointmentType,
} from "../actions";

type Props = {
  appointmentTypeData: AppointmentTypeTableRow[];
};

const AppointmentSettingsPage = ({ appointmentTypeData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const theme = useMantineTheme();
  const pathname = usePathname();
  const userData = useUserData();

  const [appointmentTypes, setAppointmentTypes] =
    useState<AppointmentTypeTableRow[]>(appointmentTypeData);
  const [editingType, setEditingType] = useState<AppointmentTypeTableRow | null>(null);
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const handleReset = () => {
    setNewTypeLabel("");
    setIsActive(true);
  };

  const handleAdd = async () => {
    if (!userData) return;

    setIsLoading(true);
    try {
      const trimmedType = newTypeLabel.trim();
      const isUnique = await checkAppointmentType(supabaseClient, {
        appointmentTypeLabel: trimmedType,
      });
      if (!isUnique) {
        notifications.show({
          message: "Appointment type already exists.",
          color: "orange",
        });
        return;
      }

      await insertAppointmentType(supabaseClient, { appointmentTypeLabel: trimmedType, isActive });
      await handleRefresh();

      handleReset();
      closeAddModal();
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
            error_function: "handleAdd",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingType || !userData) return;

    setIsLoading(true);
    try {
      const trimmedType = editingType.appointment_type_label.trim();
      const isUnique = await checkAppointmentType(supabaseClient, {
        appointmentTypeLabel: trimmedType,
        currentId: editingType.appointment_type_id,
      });
      if (!isUnique) {
        notifications.show({
          message: "Appointment type already exists.",
          color: "orange",
        });
        return;
      }

      await updateAppointmentType(supabaseClient, {
        id: editingType.appointment_type_id,
        appointmentTypeLabel: trimmedType,
        isActive: editingType.appointment_type_is_active,
      });
      await handleRefresh();

      setEditingType(null);
      closeEditModal();
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
            error_function: "handleEdit",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userData) return;

    setIsLoading(true);
    try {
      await deleteAppointmentType(supabaseClient, { appointmentTypeId: id });
      await handleRefresh();
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

  const openEditWithType = (type: AppointmentTypeTableRow) => {
    setEditingType({ ...type });
    openEditModal();
  };

  const handleRefresh = async () => {
    if (!userData) return;

    setIsFetching(true);
    try {
      const appointmentTypeData = await getAppointmentTypeSettings(supabaseClient);
      setAppointmentTypes(appointmentTypeData);
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
      {/* Add Modal */}
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        title="Add Appointment Type"
        centered
        radius="md"
        styles={{ title: { fontSize: 20, fontWeight: 600, color: theme.colors.cyan[7] } }}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack gap="md">
          <TextInput
            label="Service Type Name"
            placeholder="e.g., Gel Polish"
            value={newTypeLabel}
            onChange={(e) => setNewTypeLabel(e.currentTarget.value)}
            required
            styles={{ input: { border: `2px solid ${theme.colors.cyan[1]}` } }}
          />

          <Switch
            label="Active"
            description="Make this type available for booking"
            checked={isActive}
            onChange={(e) => setIsActive(e.currentTarget.checked)}
            color="cyan"
          />

          <Divider />

          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                handleReset();
                closeAddModal();
              }}
              color="gray"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!newTypeLabel.trim()}
              color="cyan"
              loading={isLoading}
            >
              Add Type
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Appointment Type"
        centered
        radius="md"
        styles={{ title: { fontSize: 20, fontWeight: 600, color: theme.colors.cyan[7] } }}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        {editingType && (
          <Stack gap="md">
            <TextInput
              label="Service Type Name"
              placeholder="e.g., Gel Polish"
              value={editingType.appointment_type_label}
              onChange={(e) =>
                setEditingType({ ...editingType, appointment_type_label: e.currentTarget.value })
              }
              required
              styles={{ input: { border: `2px solid ${theme.colors.cyan[1]}` } }}
            />

            <Switch
              label="Active"
              description="Make this type available for booking"
              checked={editingType.appointment_type_is_active}
              onChange={(e) =>
                setEditingType({
                  ...editingType,
                  appointment_type_is_active: e.currentTarget.checked,
                })
              }
              color="cyan"
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={closeEditModal} color="gray">
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editingType.appointment_type_label.trim()}
                color="cyan"
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Stack>
        {/* Header */}
        <Group>
          <Box>
            <Title order={2}>Appointment</Title>
            <Text c="dimmed">Set up appointment categories, durations, and related settings.</Text>
          </Box>
        </Group>

        <Paper p="xl" shadow="xl" radius="sm">
          {/* Stats */}
          <Group mb="lg" grow>
            <Paper
              p="md"
              radius="lg"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.yellow[1]}` }}
            >
              <Group gap="xs">
                <IconSparkles size={24} style={{ color: theme.colors.yellow[6] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Total Types
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.yellow[7] }}>
                    {appointmentTypes.length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="lg"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.green[1]}` }}
            >
              <Group gap="xs">
                <IconCheck size={24} style={{ color: theme.colors.green[6] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Active
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.green[7] }}>
                    {appointmentTypes.filter((t) => t.appointment_type_is_active).length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="lg"
              shadow="sm"
              style={{ border: `2px solid ${theme.colors.red[1]}` }}
            >
              <Group gap="xs">
                <IconX size={24} style={{ color: theme.colors.red[7] }} />
                <Box>
                  <Text size="sm" c="dimmed">
                    Inactive
                  </Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.red[7] }}>
                    {appointmentTypes.filter((t) => !t.appointment_type_is_active).length}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Group>

          {/* Table */}
          <Paper
            p="xl"
            radius="lg"
            shadow="sm"
            style={{ border: `2px solid ${theme.colors.cyan[1]}` }}
          >
            <Flex justify="space-between" mb="md" align="center" wrap="wrap" gap="xs">
              <Flex gap="xl" align="center" wrap="wrap">
                <Box>
                  <Text fw={600} size="lg" style={{ color: theme.colors.cyan[7] }}>
                    Service Types
                  </Text>
                  <Text size="sm" c="dimmed">
                    Manage your nail service appointment types
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
              <Button leftSection={<IconPlus size={18} />} onClick={openAddModal} color="cyan">
                Add Type
              </Button>
            </Flex>

            <Divider my="md" />

            <DataTable
              columns={[
                {
                  accessor: "appointment_type_label",
                  title: "Service Type",
                  render: (record) => (
                    <Text fw={600} style={{ color: theme.colors.cyan[7] }}>
                      {record.appointment_type_label}
                    </Text>
                  ),
                },
                {
                  accessor: "appointment_type_is_active",
                  title: "Status",
                  textAlign: "center",
                  render: (record) => (
                    <Group gap="xs" justify="center">
                      <Badge
                        color={record.appointment_type_is_active ? "green" : "red"}
                        variant="light"
                      >
                        {record.appointment_type_is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Group>
                  ),
                },
                {
                  accessor: "appointment_type_created",
                  title: "Created",
                  render: (record) => (
                    <Text size="sm" c="dimmed">
                      {new Date(record.appointment_type_created).toLocaleDateString()}
                    </Text>
                  ),
                },
                {
                  accessor: "appointment_type_date_updated",
                  title: "Last Updated",
                  render: (record) => (
                    <Text size="sm" c="dimmed">
                      {record.appointment_type_date_updated
                        ? new Date(record.appointment_type_date_updated).toLocaleDateString()
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
                      <ActionIcon
                        color="yellow"
                        variant="light"
                        onClick={() => openEditWithType(record)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() =>
                          deleteModal(record.appointment_type_label, record.appointment_type_id)
                        }
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
              records={appointmentTypes}
              idAccessor="appointment_type_id"
              minHeight={200}
              highlightOnHover
              styles={{
                header: {
                  background: theme.colors.cyan[0],
                  fontWeight: 600,
                  color: theme.colors.cyan[7],
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

export default AppointmentSettingsPage;
