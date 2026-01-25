"use client";

import { insertError } from "@/app/actions";
import { useUserData } from "@/stores/useUserStore";
import { formatPeso, isAppError } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { ServiceTypeTableRow } from "@/utils/types";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCash,
  IconCheck,
  IconClock,
  IconEdit,
  IconGift,
  IconSparkles,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { deleteServiceType } from "../../actions";

type Props = {
  serviceTypeData: ServiceTypeTableRow;
};

const ServiceTypePage = ({ serviceTypeData }: Props) => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const userData = useUserData();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const deleteModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">Are you sure you want to delete {serviceTypeData.service_type_label}?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => handleDelete(),
      centered: true,
    });

  const handleDelete = async () => {
    if (!userData) return;

    setIsLoading(true);
    try {
      await deleteServiceType(supabaseClient, { serviceTypeId: serviceTypeData.service_type_id });
      router.push("/admin/settings/service-type");

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
      setIsLoading(false);
    }
  };

  return (
    <Box maw={900} mx="auto" py="xl">
      {/* Header */}
      <Stack gap="md">
        <Flex align="center" justify="space-between">
          <Group>
            <Title order={2}>{serviceTypeData.service_type_label}</Title>
            <Badge color={serviceTypeData.service_type_is_active ? "green" : "red"}>
              {serviceTypeData.service_type_is_active ? "Active" : "Inactive"}
            </Badge>
          </Group>

          <Group gap="xs">
            <Button
              color="yellow"
              variant="light"
              leftSection={<IconEdit size={14} />}
              disabled={isLoading}
              component={Link}
              href={`/admin/settings/service-type/${serviceTypeData.service_type_id}/edit`}
              w={100}
            >
              Edit
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={14} />}
              loading={isLoading}
              onClick={() => deleteModal()}
              w={100}
            >
              Delete
            </Button>
          </Group>
        </Flex>
        <Text c="dimmed">{serviceTypeData.service_type_subtext}</Text>
        <Text>{serviceTypeData.service_type_description}</Text>
      </Stack>

      <Divider my="md" />

      {/* Features & Benefits */}
      <Card withBorder mb="md">
        <Stack gap="md">
          {/* Features */}
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon color="cyan" variant="subtle" size={18}>
                <IconSparkles />
              </ThemeIcon>
              <Title c="cyan" order={3}>
                Features
              </Title>
            </Group>
            <List
              spacing="xs"
              size="sm"
              mt="xs"
              center
              icon={
                <ThemeIcon color="yellow" size={14} radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {serviceTypeData.service_type_features.map((feature, index) => (
                <List.Item key={index}>{feature}</List.Item>
              ))}
            </List>
          </Stack>

          <Divider />

          {/* Benefits */}
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon color="cyan" variant="subtle" size={18}>
                <IconGift />
              </ThemeIcon>
              <Title c="cyan" order={3}>
                Benefits
              </Title>
            </Group>

            <List
              spacing="xs"
              size="sm"
              mt="xs"
              center
              icon={
                <ThemeIcon color="yellow" size={14} radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {serviceTypeData.service_type_benefits.map((benefit, index) => (
                <List.Item key={index}>{benefit}</List.Item>
              ))}
            </List>
          </Stack>
        </Stack>
      </Card>

      {/* Time */}
      <Card withBorder mb="md">
        <Stack>
          <Group gap="xs">
            <ThemeIcon color="cyan" variant="subtle" size={18}>
              <IconClock />
            </ThemeIcon>
            <Title c="cyan" order={3}>
              Time
            </Title>
          </Group>

          <Group grow>
            <Text>Minimum Time: {serviceTypeData.service_type_minimum_time_minutes} min</Text>
            <Text>Maximum Time: {serviceTypeData.service_type_maximum_time_minutes} min</Text>
          </Group>
        </Stack>
      </Card>

      {/* Pricing */}
      <Card withBorder mb="md">
        <Stack>
          <Group gap="xs">
            <ThemeIcon color="cyan" variant="subtle" size={18}>
              <IconCash />
            </ThemeIcon>
            <Title c="cyan" order={3}>
              Pricing
            </Title>
          </Group>

          <Group grow>
            <Text>Minimum Price: {formatPeso(serviceTypeData.service_type_minimum_price)}</Text>
            <Text>Maximum Price: {formatPeso(serviceTypeData.service_type_maximum_price)}</Text>
          </Group>
        </Stack>
      </Card>

      {/* Ideal For */}
      <Card withBorder>
        <Stack>
          <Group gap="xs">
            <ThemeIcon color="cyan" variant="subtle" size={18}>
              <IconUser size={18} />
            </ThemeIcon>
            <Title c="cyan" order={3}>
              Ideal For
            </Title>
          </Group>

          <Text>{serviceTypeData.service_type_ideal_for_description}</Text>
        </Stack>
      </Card>
    </Box>
  );
};

export default ServiceTypePage;
