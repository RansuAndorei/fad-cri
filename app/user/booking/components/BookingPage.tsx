"use client";

import { useIsLoading } from "@/stores/useLoadingStore";
import { BookingFormValues, ScheduleSlotTableRow } from "@/utils/types";
import { Button, Container, Group, Stepper, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppointmentType from "./AppointmentType";
import NailDesign from "./NailDesign";
import Payment from "./Payment";
import Reminders from "./Reminders";
import Schedule from "./Schedule";
import Summary from "./Summary";

type Props = {
  serviceTypeOptions: string[];
  scheduleSlot: ScheduleSlotTableRow[];
  maxScheduleDate: string;
  reminderList: string[];
};

const BookingPage = ({
  serviceTypeOptions,
  scheduleSlot,
  maxScheduleDate,
  reminderList,
}: Props) => {
  const isLoading = useIsLoading();

  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const orientation = isMobile ? "vertical" : "horizontal";

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step && !isLoading;

  const methods = useForm<BookingFormValues>({
    mode: "onChange",
    defaultValues: {
      type: "",
      removal: "",
      removalType: "",
      inspo: null,
      scheduleDate: "",
      scheduleTime: "",
      scheduleNote: null,
      availableSlot: [],
    },
  });
  const { trigger } = methods;

  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 6 || nextStep < 0;
    const valid = await trigger();

    if (isOutOfBounds || (nextStep > active && !valid)) return;

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  return (
    <FormProvider {...methods}>
      <Container size="md" py="xl">
        <Group mb="md" wrap="nowrap">
          <IconCalendarPlus color="gray" />
          <Title order={2}>Booking Form</Title>
        </Group>

        <form>
          <Stepper
            active={active}
            onStepClick={setActive}
            mt="xl"
            allowNextStepsSelect
            orientation={orientation}
          >
            <Stepper.Step
              label="Appointment Details"
              description="Type, Removal, Reconstruction"
              allowStepSelect={shouldAllowSelectStep(0)}
            >
              <AppointmentType serviceTypeOptions={serviceTypeOptions} />
            </Stepper.Step>

            <Stepper.Step
              label="Nail Design"
              description="Upload your nail inspiration."
              allowStepSelect={shouldAllowSelectStep(1)}
            >
              <NailDesign />
            </Stepper.Step>

            <Stepper.Step
              label="Schedule"
              description="Date and Time"
              allowStepSelect={shouldAllowSelectStep(2)}
            >
              <Schedule scheduleSlot={scheduleSlot} maxScheduleDate={maxScheduleDate} />
            </Stepper.Step>

            <Stepper.Step
              label="Summary"
              description="Review details"
              allowStepSelect={shouldAllowSelectStep(3)}
            >
              <Summary />
            </Stepper.Step>

            <Stepper.Step
              label="Reminders"
              description="Message from Fad Cri"
              allowStepSelect={shouldAllowSelectStep(4)}
            >
              <Reminders reminderList={reminderList} />
            </Stepper.Step>

            <Stepper.Step
              label="Payment"
              description="Secure your schedule"
              allowStepSelect={shouldAllowSelectStep(5)}
            >
              <Payment handleStepChange={handleStepChange} />
            </Stepper.Step>
          </Stepper>

          <Group justify="flex-end" gap="xs" mt="xl">
            {active > 0 && (
              <Button
                type="button"
                variant="default"
                onClick={() => handleStepChange(active - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            {active < 5 ? (
              <Button
                type="button"
                onClick={() => handleStepChange(active + 1)}
                disabled={isLoading}
              >
                Next
              </Button>
            ) : null}
          </Group>
        </form>
      </Container>
    </FormProvider>
  );
};

export default BookingPage;
