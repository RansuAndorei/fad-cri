import { DashboardTypeType } from "@/utils/types";
import { Box, Center, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconTrophyFilled } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TypeItem from "./TypeItem";

type Props = {
  typeList: DashboardTypeType[];
  loadMoreType: (page: number) => void;
  isTypeFetchable: boolean;
  typeOffset: number;
  setTypeOffset: Dispatch<SetStateAction<number>>;
};

const TypeTable = ({
  typeList,
  loadMoreType,
  isTypeFetchable,
  typeOffset,
  setTypeOffset,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);

  const handleScroll = () => {
    if (!isTypeFetchable) return;
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView(bottom <= innerHeight);
    }
  };

  useEffect(() => {
    if (isInView) {
      const newTypeOffset = typeOffset + 1;
      loadMoreType(newTypeOffset);
      setTypeOffset(newTypeOffset);
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
          <Title order={4}>Top Type</Title>
        </Group>

        <Stack p="lg" mb="sm" gap={32} ref={containerRef}>
          {typeList.length > 0 ? (
            typeList.map((type) => {
              return (
                <Box key={type.typeLabel}>
                  <TypeItem type={type} />
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

export default TypeTable;
