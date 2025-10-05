"use client";

import { statusToColor } from "@/utils/functions";
import { AppointmentType } from "@/utils/types";
import { Badge, Container, Flex, Group, Tabs, Title } from "@mantine/core";
import { IconBell, IconCalendarCheck, IconCreditCard, IconListDetails } from "@tabler/icons-react";
import Payment from "./Payment";
import Reminders from "./Reminders";
import Summary from "./Summary";

type Props = {
  appointmentData: AppointmentType;
  serverTime: string;
};

const AppointmentPage = ({ appointmentData, serverTime }: Props) => {
  return (
    <Container size="md" py="xl">
      <Group mb="md" wrap="nowrap">
        <IconCalendarCheck color="gray" />
        <Flex align="center" gap="md">
          <Title order={2}>Appointment</Title>
          <Badge color={statusToColor(appointmentData.appointment_status)}>
            {appointmentData.appointment_status}
          </Badge>
        </Flex>
      </Group>

      <Tabs defaultValue="summary" mt="xl" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="summary" leftSection={<IconListDetails size={12} />}>
            Summary
          </Tabs.Tab>
          <Tabs.Tab value="reminders" leftSection={<IconBell size={12} />}>
            Reminders
          </Tabs.Tab>
          <Tabs.Tab value="payment" leftSection={<IconCreditCard size={12} />}>
            Payment
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="summary">
          <Summary appointmentData={appointmentData} serverTime={serverTime} />
        </Tabs.Panel>

        <Tabs.Panel value="reminders">
          <Reminders />
        </Tabs.Panel>

        <Tabs.Panel value="payment">
          <Payment
            appointmentId={appointmentData.appointment_id}
            payment={appointmentData.payment}
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default AppointmentPage;
