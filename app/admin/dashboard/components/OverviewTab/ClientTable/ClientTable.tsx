import { DashboardClientType } from "@/utils/types";
import { Box, Center, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconTrophyFilled } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ClientItem from "./ClientItem";

type Props = {
  clientList: DashboardClientType[];
  loadMoreClient: (page: number) => void;
  isClientFetchable: boolean;
  clientOffset: number;
  setClientOffset: Dispatch<SetStateAction<number>>;
};

const ClientTable = ({
  clientList,
  loadMoreClient,
  isClientFetchable,
  clientOffset,
  setClientOffset,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);

  const handleScroll = () => {
    if (!isClientFetchable) return;
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView(bottom <= innerHeight);
    }
  };

  useEffect(() => {
    if (isInView) {
      const newClientOffset = clientOffset + 1;
      loadMoreClient(newClientOffset);
      setClientOffset(newClientOffset);
    }
  }, [isInView]);

  return (
    <ScrollArea w="100%" h="100%" onScrollCapture={handleScroll}>
      <Paper w={{ base: "100%" }} h={470} withBorder>
        <Group
          p="md"
          gap="xs"
          style={{
            borderBottom: "0.0625rem solid #dee2e6",
          }}
        >
          <Center c="green">
            <IconTrophyFilled />
          </Center>
          <Title order={4}>Top Client</Title>
        </Group>

        <Stack p="lg" mb="sm" gap={32} ref={containerRef}>
          {clientList.length > 0 ? (
            clientList.map((client) => {
              return (
                <Box key={client.userData.userId}>
                  <ClientItem client={client} />
                </Box>
              );
            })
          ) : (
            <Center h={175}>
              <Text fs="xl" c="dimmed" fw={600}>
                No data to display
              </Text>
            </Center>
          )}
        </Stack>
      </Paper>
    </ScrollArea>
  );
};

export default ClientTable;
