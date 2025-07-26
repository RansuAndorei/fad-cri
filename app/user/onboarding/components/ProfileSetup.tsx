"use client";

import { Box, Center, Paper, rem, Stack, Text, Title } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { OnboardingFormValues } from "./OnboardingPage";

const ProfileSetup = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const file = watch("user_avatar");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("user_avatar", file);
    }
  };

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Title c="dimmed" order={3} mb="xs">
        Profile Setup
      </Title>

      <Stack gap="md" align="center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Controller
          name="user_avatar"
          control={control}
          render={() => (
            <Box
              onClick={handleImageClick}
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                width: rem(120),
                height: rem(120),
                overflow: "hidden",
                border: "2px solid #ccc",
                position: "relative",
              }}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <Center
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: rem(12),
                    textAlign: "center",
                  }}
                  bg="var(--mantine-color-gray-light)"
                >
                  <IconUpload color="gray" />
                </Center>
              )}
            </Box>
          )}
        />

        {errors.user_avatar && (
          <Text c="red" size="sm">
            {errors.user_avatar.message}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default ProfileSetup;
