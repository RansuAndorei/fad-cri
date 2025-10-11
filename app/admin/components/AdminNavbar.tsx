"use client";

import {
  Box,
  NavLink,
  ScrollArea,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconCalendar, IconDashboard, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkList = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Schedule",
    icon: IconCalendar,
    href: "/admin/schedule",
  },
  { label: "Settings", icon: IconSettings, href: "/admin/settings" },
];

const AdminNavbar = () => {
  const pathname = usePathname();
  const { colors } = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const defaultNavLinkContainerProps = { py: 5, mt: 6 };
  const defaultIconProps = { size: 20, stroke: 1 };
  const navLinkStyle = { borderRadius: 5, display: "flex" };

  return (
    <Box
      px="md"
      py="lg"
      w={{ sm: 200, lg: 300 }}
      style={{ borderRight: `solid 1px ${isDark ? colors.dark[4] : colors.gray[3]}` }}
    >
      <ScrollArea offsetScrollbars={false} scrollbarSize={10}>
        <Box h="fit-content">
          <Stack gap={0} align="start" w="100%">
            {navLinkList.map(({ label, icon: Icon, href }) => (
              <NavLink
                key={label}
                px={0}
                label={label}
                style={navLinkStyle}
                leftSection={
                  <Box ml="sm" {...defaultNavLinkContainerProps}>
                    <Icon {...defaultIconProps} />
                  </Box>
                }
                active={pathname.includes(href)}
                component={Link}
                href={href}
              />
            ))}
          </Stack>
        </Box>
      </ScrollArea>
    </Box>
  );
};

export default AdminNavbar;
