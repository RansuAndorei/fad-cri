"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { ServiceTypeTableInsert, ServiceTypeTableRow } from "@/utils/types";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Paper,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { insertServiceType, updateServiceType } from "../../actions";
import { checkServiceType } from "../actions";
import { isAppError } from "@/utils/functions";

type DraggableListProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
};

const DraggableList = ({ label, value, onChange, error }: DraggableListProps) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onChange([...value, input.trim()]);
    setInput("");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = [...value];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    onChange(items);
  };

  return (
    <Stack gap="xs">
      <Text fw={500}>{label}</Text>

      <Group>
        <TextInput
          placeholder={`Add ${label.toLowerCase()}`}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          flex={1}
        />
        <ActionIcon onClick={handleAdd} variant="light">
          <IconPlus size={16} />
        </ActionIcon>
      </Group>

      {error && (
        <Text size="xs" c="red">
          {error}
        </Text>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={label}>
          {(provided) => (
            <Stack ref={provided.innerRef} {...provided.droppableProps}>
              {value.map((item, index) => (
                <Draggable
                  key={`${label}-${index}`}
                  draggableId={`${label}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <Paper ref={provided.innerRef} {...provided.draggableProps} withBorder p="xs">
                      <Group>
                        <ActionIcon variant="subtle" {...provided.dragHandleProps}>
                          <IconGripVertical size={16} />
                        </ActionIcon>

                        <Text size="sm" flex={1}>
                          {item}
                        </Text>

                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => onChange(value.filter((_, i) => i !== index))}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
};

type Props = {
  serviceTypeData?: ServiceTypeTableRow;
};

const CreateServiceTypePage = ({ serviceTypeData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const userData = useUserData();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ServiceTypeTableInsert>({
    defaultValues: serviceTypeData || {
      service_type_is_active: true,

      service_type_label: "",
      service_type_subtext: "",
      service_type_description: "",

      service_type_features: [],
      service_type_benefits: [],

      service_type_minimum_time_minutes: 0,
      service_type_maximum_time_minutes: 0,
      service_type_minimum_price: 0,
      service_type_maximum_price: 0,

      service_type_ideal_for_description: "",
    },
  });

  const handleCheckServiceType = async (value: string) => {
    if (!userData) return;

    try {
      const trimmedType = value.trim();
      const isUnique = await checkServiceType(supabaseClient, {
        serviceTypeLabel: trimmedType,
        currentId: serviceTypeData?.service_type_id,
      });
      return isUnique;
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
            error_function: "handleCheckServiceType",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
      return false;
    }
  };

  const handleCreate = async (data: ServiceTypeTableInsert) => {
    if (!userData) return;

    try {
      setIsLoading(true);
      const trimmedData = {
        ...data,
        service_type_label: data.service_type_label.trim(),
        service_type_subtext: data.service_type_subtext.trim(),
        service_type_description: data.service_type_description.trim(),
        service_type_features: data.service_type_features.map((value) => value.trim()),
        service_type_benefits: data.service_type_benefits.map((value) => value.trim()),
        service_type_ideal_for_description: data.service_type_ideal_for_description.trim(),
      };
      const serviceTypeId = await insertServiceType(supabaseClient, {
        serviceTypeData: trimmedData,
      });
      router.push(`/admin/settings/service-type/${serviceTypeId}`);
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
            error_function: "handleCreate",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: ServiceTypeTableInsert) => {
    if (!userData || !serviceTypeData) return;

    setIsLoading(true);
    try {
      const trimmedData = {
        ...data,
        service_type_label: data.service_type_label.trim(),
        service_type_subtext: data.service_type_subtext.trim(),
        service_type_description: data.service_type_description.trim(),
        service_type_features: data.service_type_features.map((value) => value.trim()),
        service_type_benefits: data.service_type_benefits.map((value) => value.trim()),
        service_type_ideal_for_description: data.service_type_ideal_for_description.trim(),
      };
      await updateServiceType(supabaseClient, {
        serviceTypeId: serviceTypeData.service_type_id,
        serviceTypeData: trimmedData,
      });
      router.push(`/admin/settings/service-type/${serviceTypeData.service_type_id}`);
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
            error_function: "handleUpdate",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Box maw={900} mx="auto">
      <form onSubmit={handleSubmit(serviceTypeData ? handleUpdate : handleCreate)}>
        <Stack>
          <Title order={2}>{serviceTypeData ? "Edit" : "Create"} Service Type</Title>

          {/* Basic Info */}
          <Card withBorder>
            <Stack>
              <Controller
                name="service_type_label"
                control={control}
                rules={{
                  required: "Label is required",
                  validate: async (value) =>
                    (await handleCheckServiceType(value)) || "Label already exists",
                }}
                render={({ field }) => (
                  <TextInput label="Label" error={errors.service_type_label?.message} {...field} />
                )}
              />

              <Controller
                name="service_type_subtext"
                control={control}
                rules={{ required: "Subtext is required" }}
                render={({ field }) => (
                  <TextInput
                    label="Subtext"
                    error={errors.service_type_subtext?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="service_type_description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Textarea
                    label="Description"
                    error={errors.service_type_description?.message}
                    {...field}
                  />
                )}
              />
            </Stack>
          </Card>

          {/* Features & Benefits */}
          <Card withBorder>
            <Stack>
              <Controller
                name="service_type_features"
                control={control}
                rules={{
                  validate: (v: string[]) => {
                    if (v.length === 0) return "At least one feature is required";
                    const uniqueItems = new Set(v.map((item) => item.trim().toLowerCase()));
                    if (uniqueItems.size !== v.length) return "Features must be unique";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DraggableList
                    label="Features"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.service_type_features?.message}
                  />
                )}
              />

              <Divider />

              <Controller
                name="service_type_benefits"
                control={control}
                rules={{
                  validate: (v: string[]) => {
                    if (v.length === 0) return "At least one benefit is required";
                    const uniqueItems = new Set(v.map((item) => item.trim().toLowerCase()));
                    if (uniqueItems.size !== v.length) return "Benefits must be unique";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DraggableList
                    label="Benefits"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.service_type_benefits?.message}
                  />
                )}
              />
            </Stack>
          </Card>

          {/* Time & Pricing */}
          <Card withBorder>
            <Stack>
              <Group grow>
                <Controller
                  name="service_type_minimum_time_minutes"
                  control={control}
                  rules={{
                    required: "Min time required",
                    validate: {
                      required: (v) => v > 0 || "Min time is required",
                    },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Min Time"
                      {...field}
                      error={errors.service_type_minimum_time_minutes?.message}
                    />
                  )}
                />
                <Controller
                  name="service_type_maximum_time_minutes"
                  control={control}
                  rules={{
                    required: "Max time required",
                    validate: {
                      required: (v) => v > 0 || "Max time is required",
                      checkMinTime: (v) =>
                        v > getValues("service_type_minimum_time_minutes") ||
                        "Max time must be greater than min time",
                    },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Max Time"
                      error={errors.service_type_maximum_time_minutes?.message}
                      {...field}
                    />
                  )}
                />
              </Group>

              <Group grow>
                <Controller
                  name="service_type_minimum_price"
                  control={control}
                  rules={{
                    required: "Min price required",
                    validate: {
                      required: (v) => v > 0 || "Min price is required",
                    },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Min Price"
                      {...field}
                      error={errors.service_type_minimum_price?.message}
                    />
                  )}
                />
                <Controller
                  name="service_type_maximum_price"
                  control={control}
                  rules={{
                    required: "Max price required",
                    validate: {
                      required: (v) => v > 0 || "Max price is required",
                      checkMinPrice: (v) =>
                        v > getValues("service_type_minimum_price") ||
                        "Max price must be greater than min price",
                    },
                  }}
                  render={({ field }) => (
                    <NumberInput
                      label="Max Price"
                      error={errors.service_type_maximum_price?.message}
                      {...field}
                    />
                  )}
                />
              </Group>
            </Stack>
          </Card>

          {/* Ideal For */}
          <Card withBorder>
            <Stack>
              <Controller
                name="service_type_ideal_for_description"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Textarea
                    label="Ideal For"
                    error={errors.service_type_ideal_for_description?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="service_type_is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    label="Active"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                    description="If enabled, this service type will be visible to clients when creating a booking."
                  />
                )}
              />
            </Stack>
          </Card>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => reset()} disabled={isLoading}>
              Reset
            </Button>
            <Button type="submit" leftSection={<IconDeviceFloppy size={14} />} loading={isLoading}>
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateServiceTypePage;
