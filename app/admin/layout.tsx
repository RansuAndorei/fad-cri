"use client";

import { Box, Flex, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { colors } = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Flex h="100%">
      <AdminNavbar />
      <Box
        style={{
          backgroundColor: isDark ? colors.dark[9] : colors.gray[0],
          flex: 1,
        }}
        p="lg"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
