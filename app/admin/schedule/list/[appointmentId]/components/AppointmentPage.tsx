"use client";

import Completion from "@/app/user/appointment/[appointmentId]/components/Completion";
import { statusToColor } from "@/utils/functions";
import { AppointmentType, ScheduleSlotTableRow } from "@/utils/types";
import { Badge, Container, Flex, Group, Tabs, Title } from "@mantine/core";
import {
  IconCalendarCheck,
  IconCircleCheck,
  IconCreditCard,
  IconListDetails,
} from "@tabler/icons-react";
import Payment from "./Payment";
import Summary from "./Summary";

type Props = {
  appointmentData: AppointmentType;
  serverTime: string;
  scheduleSlot: ScheduleSlotTableRow[];
  maxScheduleDateMonth: number;
};

const AppointmentPage = ({
  appointmentData,
  serverTime,
  scheduleSlot,
  maxScheduleDateMonth,
}: Props) => {
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
          <Tabs.Tab value="payment" leftSection={<IconCreditCard size={12} />}>
            Payment
          </Tabs.Tab>
          {appointmentData.appointment_completion ? (
            <Tabs.Tab value="completion" leftSection={<IconCircleCheck size={12} />}>
              Completion
            </Tabs.Tab>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="summary">
          <Summary
            appointmentData={appointmentData}
            serverTime={serverTime}
            scheduleSlot={scheduleSlot}
            maxScheduleDateMonth={maxScheduleDateMonth}
          />
        </Tabs.Panel>

        <Tabs.Panel value="payment">
          <Payment payment={appointmentData.payment} />
        </Tabs.Panel>

        {appointmentData.appointment_completion ? (
          <Tabs.Panel value="completion">
            <Completion completionData={appointmentData.appointment_completion} />
          </Tabs.Panel>
        ) : null}
      </Tabs>
    </Container>
  );
};

export default AppointmentPage;
