import { BookingFormValues } from "@/utils/types";
import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";

const NailDesign = () => {
  const { setValue, watch } = useFormContext<BookingFormValues>();
  const computedColorScheme = useComputedColorScheme();

  const file = watch("inspo");

  return (
    <Paper p={{ base: "lg", xs: "xl" }} shadow="xl" withBorder radius="lg">
      <Stack gap="lg">
        <Group gap="xs">
          <Title order={3}>Nail Design</Title>
          <Text c="dimmed" size="sm">
            (optional)
          </Text>
        </Group>

        <Box
          p="lg"
          style={(theme) => ({
            border: `2px dashed ${theme.colors.gray[computedColorScheme === "dark" ? 7 : 3]}`,
            borderRadius: 14,
          })}
        >
          <Dropzone
            onDrop={(files) =>
              setValue("inspo", files[0] ?? null, {
                shouldDirty: true,
              })
            }
            accept={IMAGE_MIME_TYPE}
            multiple={false}
            maxSize={5 * 1024 ** 2}
          >
            <Stack align="center" gap="sm">
              {/* Icon OR Preview */}
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
                  alt="Nail inspo preview"
                  src={URL.createObjectURL(file)}
                  h={200}
                  radius="md"
                  fit="contain"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              )}

              <Stack align="center" gap={4}>
                <Text fw={500}>
                  {file ? "Replace nail design inspiration" : "Upload nail design inspiration"}
                </Text>
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
                    setValue("inspo", null, {
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
      </Stack>
    </Paper>
  );
};

export default NailDesign;
