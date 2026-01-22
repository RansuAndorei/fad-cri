import { ActionIcon, Flex, Stack, Text, Title } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";

type Props = {
  generalLocation: string;
};

const Location = ({ generalLocation }: Props) => {
  return (
    <Stack style={{ flex: 1 }} gap="xs">
      <Title order={4}>Location</Title>

      <Flex align="center" gap="xs">
        <ActionIcon
          variant="light"
          color="orange"
          onClick={() =>
            window.open(`https://www.google.com/maps/search/?api=1&query=${generalLocation}`)
          }
        >
          <IconMapPin size={16} />
        </ActionIcon>
        <Text>{generalLocation}</Text>
      </Flex>
    </Stack>
  );
};

export default Location;
