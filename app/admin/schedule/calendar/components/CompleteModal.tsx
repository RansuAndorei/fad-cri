import { CompleteScheduleType } from "@/utils/types";
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  NumberInput,
  Stack,
  Text,
  ThemeIcon,
  useComputedColorScheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  completeModalOpened: boolean;
  closeCompleteModal: () => void;
  handleComplete: (data: CompleteScheduleType) => void;
  openSelectedAppointmentModal: () => void;
};

const CompleteModal = ({
  completeModalOpened,
  closeCompleteModal,
  handleComplete,
  openSelectedAppointmentModal,
}: Props) => {
  const computedColorScheme = useComputedColorScheme();

  useEffect(() => {
    if (completeModalOpened) {
      reset();
    }
  }, [completeModalOpened]);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CompleteScheduleType>({
    defaultValues: {
      image: null,
      price: 0,
    },
  });

  const file = watch("image");

  return (
    <Modal
      opened={completeModalOpened}
      onClose={closeCompleteModal}
      title="Complete"
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSubmit(handleComplete)}>
        <Stack gap="md" p="xs">
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={() => (
              <>
                <Box
                  p="lg"
                  style={(theme) => ({
                    border: `2px dashed ${theme.colors.gray[computedColorScheme === "dark" ? 7 : 3]}`,
                    borderRadius: 14,
                  })}
                >
                  <Dropzone
                    onDrop={(files) =>
                      setValue("image", files[0] ?? null, {
                        shouldDirty: true,
                      })
                    }
                    accept={IMAGE_MIME_TYPE}
                    multiple={false}
                    maxSize={5 * 1024 ** 2}
                  >
                    <Stack align="center" gap="sm">
                      {!file ? (
                        <>
                          <Dropzone.Accept>
                            <ThemeIcon size={48} radius="xl" color="green" variant="light">
                              <IconUpload size={26} />
                            </ThemeIcon>
                          </Dropzone.Accept>

                          <Dropzone.Reject>
                            <ThemeIcon size={48} radius="xl" color="red" variant="light">
                              <IconX size={26} />
                            </ThemeIcon>
                          </Dropzone.Reject>

                          <Dropzone.Idle>
                            <ThemeIcon size={48} radius="xl" color="pink" variant="light">
                              <IconPhoto size={26} />
                            </ThemeIcon>
                          </Dropzone.Idle>
                        </>
                      ) : (
                        <Image
                          alt="Completed nail image"
                          src={URL.createObjectURL(file)}
                          h={200}
                          radius="md"
                          fit="contain"
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      )}

                      <Stack align="center" gap={4}>
                        <Text fw={500}>{file ? "Replace image" : "Upload image"}</Text>
                        <Text size="sm" c="dimmed" ta="center">
                          Drag & drop an image here, or click to select
                        </Text>
                      </Stack>

                      <Text size="xs" c="dimmed">
                        PNG, JPG, WEBP • Max 5MB
                      </Text>

                      {file && (
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setValue("image", null, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          Remove image
                        </Button>
                      )}
                    </Stack>
                  </Dropzone>
                </Box>
                {errors.image?.message ? (
                  <Text mt={-14} c="red" size="sm">
                    {errors.image?.message}
                  </Text>
                ) : null}
              </>
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{ required: "Time is required" }}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Price"
                placeholder="Input price"
                error={errors.price?.message}
                required
              />
            )}
          />

          <Flex gap="xs" align="center" justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                reset();
                closeCompleteModal();
                openSelectedAppointmentModal();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default CompleteModal;
