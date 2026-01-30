import { ActionIcon, Flex, Stack, Text, Title } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";

type Props = {
  specificAddress: string;
  pinLocation: string;
};

const Location = ({ specificAddress, pinLocation }: Props) => {
  return (
    <Stack style={{ flex: 1 }} gap="xs">
      <Title order={4}>Location</Title>

      <Flex align="center" gap="xs">
        <ActionIcon variant="light" color="orange" onClick={() => window.open(pinLocation)}>
          <IconMapPin size={16} />
        </ActionIcon>
        <Text>{specificAddress}</Text>
      </Flex>
    </Stack>
  );
};

export default Location;
