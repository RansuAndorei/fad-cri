import { formatPeso } from "@/utils/functions";
import { AppointmentType } from "@/utils/types";
import { Anchor, Badge, Card, Image, Paper, Stack, Text, Title } from "@mantine/core";

type Props = {
  completionData: AppointmentType["appointment_completion"];
};

const Completion = ({ completionData }: Props) => {
  return (
    <Paper p={{ base: "sm", xs: "xl" }} shadow="xl" withBorder style={{ borderTop: 0 }}>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Completion
        </Title>

        {/* Nail Inspiration Card */}
        {completionData?.appointment_completion_image.attachment_path ? (
          <Card shadow="sm" radius="md" p={{ base: "md", xs: "xl" }} withBorder>
            <Title order={5} mb={8} c="cyan">
              Nail Design
            </Title>
            <Stack align="center" gap={6}>
              <Anchor
                href={completionData?.appointment_completion_image.attachment_path}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={completionData?.appointment_completion_image.attachment_path}
                  alt="Nail Completion"
                  radius="md"
                  height={200}
                  fit="contain"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
              </Anchor>

              <Badge color="yellow.9" variant="light">
                Completed Nail Design
              </Badge>
            </Stack>
            <Text>
              <strong>Price:</strong> {formatPeso(completionData.appointment_completion_price)}
            </Text>
          </Card>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default Completion;
