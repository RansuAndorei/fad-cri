import { AppleStoreIcon } from "@/public/Icons/AppleStoreIcon";
import { GooglePlayIcon } from "@/public/Icons/GooglePlayIcon";
import { Button, Center, Flex, Stack, Text } from "@mantine/core";

const DownloadButton = () => {
  return (
    <Stack mt="xs" gap="xs" px="xl">
      <Center>
        <Text c="dimmed" fz={14}>
          Download it on
        </Text>
      </Center>
      <Flex align="center" justify="center" gap="md" wrap="wrap">
        <Button
          leftSection={<GooglePlayIcon />}
          variant="filled"
          color="dark"
          fz={12}
          style={{ flex: 1 }}
          miw={120}
        >
          Google Play
        </Button>
        <Button
          leftSection={<AppleStoreIcon />}
          variant="filled"
          color="dark"
          fz={12}
          style={{ flex: 1 }}
          miw={120}
        >
          Apple Store
        </Button>
      </Flex>
    </Stack>
  );
};

export default DownloadButton;
