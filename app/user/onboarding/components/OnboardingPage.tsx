"use client";

import { insertError, insertUser, uploadImage } from "@/app/actions";
import { useIsLoading, useLoadingActions } from "@/stores/useLoadingStore";
import { useUserActions, useUserData } from "@/stores/useUserStore";
import { formatDate } from "@/utils/functions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { GenderEnum } from "@/utils/types";
import { Button, Container, Group, Stepper, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { isError } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BasicInfo from "./BasicInfo";
import PersonalInfo from "./PersonalInfo";
import ProfileSetup from "./ProfileSetup";
import Summary from "./Summary";

export type OnboardingFormValues = {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_gender: string;
  user_birth_date: Date | null;
  user_phone_number: string;
  user_avatar: File | null;
};

const OnboardingPage = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const userData = useUserData();
  const isLoading = useIsLoading();
  const { setIsLoading } = useLoadingActions();
  const router = useRouter();
  const pathname = usePathname();
  const { setUserProfile } = useUserActions();
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const orientation = isMobile ? "vertical" : "horizontal";

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step && !isLoading;

  const methods = useForm<OnboardingFormValues>({
    mode: "onChange",
    defaultValues: {
      user_first_name: "",
      user_last_name: "",
      user_email: userData?.email,
      user_gender: "",
      user_birth_date: null,
      user_phone_number: userData?.phone || "",
      user_avatar: null,
    },
  });

  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    const valid = await methods.trigger();

    if (isOutOfBounds || !valid) return;

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (!userData) return;

    setIsLoading(true);
    try {
      let imageUrl = "";
      if (data.user_avatar) {
        const result = await uploadImage(supabaseClient, {
          image: data.user_avatar,
          bucket: "USER_AVATARS",
          fileName: userData.id,
        });
        imageUrl = result.publicUrl;
      }

      const newUserData = await insertUser(supabaseClient, {
        userTableInsert: {
          ...data,
          user_id: userData.id,
          user_avatar: imageUrl,
          user_birth_date: data.user_birth_date ? formatDate(data.user_birth_date) : "",
          user_gender: data.user_gender as GenderEnum,
        },
      });
      setUserProfile(newUserData);

      router.push("/user/booking");

      notifications.show({
        message: "Profile completed.",
        color: "green",
      });
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "onSubmit",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    }
  };
  return (
    <FormProvider {...methods}>
      <Container size="sm" py="xl">
        <Title>Onboarding</Title>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stepper
            active={active}
            onStepClick={setActive}
            mt="xl"
            allowNextStepsSelect
            orientation={orientation}
          >
            <Stepper.Step
              label="Basic Info"
              description="Name & Email"
              allowStepSelect={shouldAllowSelectStep(0)}
            >
              <BasicInfo />
            </Stepper.Step>

            <Stepper.Step
              label="Personal Info"
              description="Other Details"
              allowStepSelect={shouldAllowSelectStep(1)}
            >
              <PersonalInfo />
            </Stepper.Step>

            <Stepper.Step
              label="Profile Setup"
              description="Avatar"
              allowStepSelect={shouldAllowSelectStep(2)}
            >
              <ProfileSetup />
            </Stepper.Step>

            <Stepper.Completed>
              <Summary />
            </Stepper.Completed>
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
            {active < 3 ? (
              <Button
                type="button"
                onClick={() => handleStepChange(active + 1)}
                disabled={isLoading}
              >
                Next
              </Button>
            ) : null}
            {active === 3 ? (
              <Button type="submit" loading={isLoading}>
                Submit
              </Button>
            ) : null}
          </Group>
        </form>
      </Container>
    </FormProvider>
  );
};

export default OnboardingPage;
