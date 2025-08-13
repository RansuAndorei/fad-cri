"use client";

import { useIsLoading, useLoadingActions } from "@/stores/useLoadingStore";
import { BookingFormValues } from "@/utils/types";
import { Button, Container, Group, Stepper, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppointmentType from "./AppointmentType";
import NailDesign from "./NailDesign";
import Reminders from "./Reminders";
import Schedule from "./Schedule";
import Summary from "./Summary";

export default function BookingFormStepper() {
  const isLoading = useIsLoading();
  const { setIsLoading } = useLoadingActions();

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
      inspoLeft: [null, null, null, null, null],
      inspoRight: [null, null, null, null, null],
      scheduleDate: null,
      scheduleTime: "",
    },
  });
  const { handleSubmit, trigger } = methods;

  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 6 || nextStep < 0;
    const valid = await trigger();

    if (isOutOfBounds || !valid) return;

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const onSubmit = (data: BookingFormValues) => {
    console.log("Booking Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <Container size="md" py="xl">
        <Group mb="md" wrap="nowrap">
          <IconCalendarPlus color="gray" />
          <Title order={2}>Booking Form</Title>
        </Group>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper
            active={active}
            onStepClick={setActive}
            mt="xl"
            allowNextStepsSelect
            orientation={orientation}
          >
            <Stepper.Step
              label="Appointment Type"
              description="Type and Removal"
              allowStepSelect={shouldAllowSelectStep(0)}
            >
              <AppointmentType />
            </Stepper.Step>

            <Stepper.Step
              label="Nail Design"
              description="Left and Right Hand"
              allowStepSelect={shouldAllowSelectStep(1)}
            >
              <NailDesign />
            </Stepper.Step>

            <Stepper.Step
              label="Schedule"
              description="Date and Time"
              allowStepSelect={shouldAllowSelectStep(2)}
            >
              <Schedule />
            </Stepper.Step>

            <Stepper.Step
              label="Summary"
              description="Review details"
              allowStepSelect={shouldAllowSelectStep(3)}
            >
              <Summary />
            </Stepper.Step>

            <Stepper.Step
              label="Payment"
              description="Secure your schedule"
              allowStepSelect={shouldAllowSelectStep(4)}
            >
              Payment
            </Stepper.Step>

            <Stepper.Step
              label="Reminders"
              description="Message from Fad Cri"
              allowStepSelect={shouldAllowSelectStep(5)}
            >
              <Reminders />
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
            {active < 6 ? (
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
}
