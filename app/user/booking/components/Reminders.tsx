import { List, Paper, Space, Stack, Text, Title } from "@mantine/core";

type Props = {
  reminderList: string[];
};

const Reminders = ({ reminderList }: Props) => {
  return (
    <Paper p="xl" shadow="xl" withBorder>
      <Stack gap="md">
        <Title c="dimmed" order={3}>
          Reminders and Message
        </Title>
        <List spacing={-16} size="md" withPadding pr="xl">
          {reminderList.map((reminder, index) => (
            <List.Item key={index}>
              <Text component="div">
                <div dangerouslySetInnerHTML={{ __html: reminder }} />
              </Text>
            </List.Item>
          ))}
        </List>

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
            studio policies. For the comfort, safety, and focus of both client and nail technician,
            I unfortunately cannot allow companions or children inside the studio. This helps
            maintain a calm and distraction-free environment where I can give you the attention and
            quality you deserve.
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
