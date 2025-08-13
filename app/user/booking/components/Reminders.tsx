import { List, Paper, Space, Stack, Text, Title } from "@mantine/core";

const Reminders = () => {
  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3} mb="xs">
          Reminders and Message
        </Title>
        <List spacing="md" size="md" withPadding pr="xl">
          <List.Item>
            Come with <strong>clean, polish-free nails</strong>.
          </List.Item>
          <List.Item>
            <strong>Sanitize your hands</strong> upon arrival.
          </List.Item>
          <List.Item>
            Please <strong>do not cut, trim, file, or shape your nails</strong> beforehand — I will
            handle everything.
          </List.Item>
          <List.Item>
            <strong>Avoid using lotion</strong> on the day of your appointment.
          </List.Item>
          <List.Item>
            <strong>No late arrivals</strong> — please respect our time as much as your own.
          </List.Item>
          <List.Item>
            <strong>One client at a time</strong>.
          </List.Item>
          <List.Item>
            <strong>Strictly no companions allowed.</strong>
          </List.Item>
          <List.Item>
            <strong>Strictly no children allowed.</strong>
          </List.Item>
          <List.Item>
            <strong>By appointment only.</strong>
          </List.Item>
          <List.Item>
            <strong>3-day warranty</strong> on nail services.
          </List.Item>
          <List.Item>
            <strong>Remaining balance must be paid in cash only.</strong>
          </List.Item>
        </List>

        <Space h="xs" />

        <Paper shadow="md" p="md" withBorder>
          <Title order={4} mb="sm">
            💌 A Message from Fad Cri
          </Title>
          <Text>
            Thank you for choosing my home-based nail studio. I&apos;m a private nail technician who
            truly values creativity, collaboration, and the trust of every client I work with.
          </Text>
          <Space h="sm" />
          <Text>
            I sincerely apologize for any inconvenience this may cause, but in order to provide you
            with the best possible service, I kindly ask for your full cooperation in following the
            studio policies. For the comfort, safety, and focus of both client and technician, I
            unfortunately cannot allow companions or children inside the studio. This helps maintain
            a calm and distraction-free environment where I can give you the attention and quality
            you deserve.
          </Text>
          <Space h="sm" />
          <Text>
            Please arrive on time or at least 10 minutes early. Late arrivals may affect the
            schedule, as I allot dedicated time for each client. Your understanding and cooperation
            mean so much.
          </Text>
          <Space h="md" />
          <Text ta="right">
            With gratitude, <br /> <strong>Fad Cri</strong>
          </Text>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default Reminders;
