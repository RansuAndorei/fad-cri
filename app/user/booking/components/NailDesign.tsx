import { FINGER_LABEL } from "@/utils/constants";
import { useNailBoxStyle } from "@/utils/functions";
import { BookingFormValues } from "@/utils/types";
import { Box, FileButton, Group, Image, Paper, Stack, Text, Title } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";

const NailDesign = () => {
  const { control } = useFormContext<BookingFormValues>();
  const getNailBoxStyle = useNailBoxStyle();

  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Group mb="xs" gap="xs">
          <Title c="dimmed" order={3}>
            Nail Design
          </Title>
          <Text c="dimmed">(optional)</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Left Hand</Text>
          <Stack gap="xs" style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {[...Array(5)].map((_, index) => (
              <Controller
                key={`inspoLeft-${index}`}
                name={`inspoLeft.${index}`}
                control={control}
                render={({ field }) => (
                  <Stack align="center" gap={0} justify="flex-end">
                    <FileButton onChange={field.onChange} accept="image/*">
                      {(props) => (
                        <Box {...props} style={getNailBoxStyle(FINGER_LABEL[index])}>
                          {field.value ? (
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt={`Nail ${index + 1}`}
                              fit="cover"
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            <Text size="xs" c="gray">
                              {FINGER_LABEL[index]}
                            </Text>
                          )}
                        </Box>
                      )}
                    </FileButton>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{ visibility: !Boolean(field.value) ? "hidden" : "visible" }}
                    >
                      {FINGER_LABEL[index]}
                    </Text>
                  </Stack>
                )}
              />
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500} mt="md">
            Right Hand
          </Text>
          <Stack gap="xs" style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {[...Array(5)].map((_, index) => (
              <Controller
                key={`inspoRight-${index}`}
                name={`inspoRight.${index}`}
                control={control}
                render={({ field }) => (
                  <Stack align="center" gap={0} justify="flex-end">
                    <FileButton onChange={field.onChange} accept="image/*">
                      {(props) => (
                        <Box {...props} style={getNailBoxStyle(FINGER_LABEL[4 - index])}>
                          {field.value ? (
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt={`Nail ${index + 1}`}
                              fit="cover"
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            <Text size="xs" c="gray">
                              {FINGER_LABEL[4 - index]}
                            </Text>
                          )}
                        </Box>
                      )}
                    </FileButton>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{ visibility: !Boolean(field.value) ? "hidden" : "visible" }}
                    >
                      {FINGER_LABEL[4 - index]}
                    </Text>
                  </Stack>
                )}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NailDesign;
