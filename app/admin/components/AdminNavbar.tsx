"use client";

import {
  Box,
  Collapse,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  Icon,
  IconBell,
  IconCalendar,
  IconChevronDown,
  IconClock,
  IconCurrencyPeso,
  IconLayoutDashboard,
  IconMapPin,
  IconProps,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

type NavigationItem = {
  id: string;
  label: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  path?: string;
  submenu?: {
    id: string;
    label: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    path: string;
  }[];
};

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
    path: `/admin/dashboard`,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: IconCalendar,
    path: `/admin/schedule`,
  },
  {
    id: "settings",
    label: "Settings",
    icon: IconSettings,
    submenu: [
      {
        id: "financial-settings",
        label: "Financial",
        icon: IconCurrencyPeso,
        path: `/admin/settings/financial`,
      },
      {
        id: "scheduling",
        label: "Scheduling",
        icon: IconClock,
        path: `/admin/settings/scheduling`,
      },
      {
        id: "location-and-contact",
        label: "Location & Contact",
        icon: IconMapPin,
        path: `/admin/settings/location-and-contact`,
      },
      {
        id: "reminders",
        label: "Reminders",
        icon: IconBell,
        path: `/admin/settings/reminder`,
      },
    ],
  },
];

const AdminNavbar = () => {
  const pathname = usePathname();
  const theme = useMantineTheme();
  const colors = theme.colors;
  const { colorScheme } = useMantineColorScheme();

  const [activeMenu, setActiveMenu] = useState<string>("");

  const isDark = colorScheme === "dark";

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = activeMenu === item.id;
    const isLink = Boolean(item.path);
    const isCurrentPage = isActivePath(item.path);

    return (
      <Box key={item.id} w="100%">
        <UnstyledButton
          component={isLink ? Link : undefined}
          href={item.path || "#"}
          onClick={() => (hasSubmenu ? toggleSubmenu(item.id) : null)}
          style={{
            display: "block",
            width: "100%",
            padding: "16px",
            borderRadius: "4px",
            color: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
            backgroundColor: isCurrentPage
              ? isDark
                ? theme.colors.cyan[9]
                : theme.colors.cyan[0]
              : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!isCurrentPage) {
              e.currentTarget.style.backgroundColor = isDark
                ? theme.colors.dark[6]
                : theme.colors.gray[1];
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isCurrentPage
              ? isDark
                ? theme.colors.cyan[9]
                : theme.colors.cyan[0]
              : "transparent";
          }}
        >
          <Group justify="space-between">
            <Group>
              <Icon size={18} />
              <Text size="sm" fw={500}>
                {item.label}
              </Text>
            </Group>
            {hasSubmenu && (
              <IconChevronDown
                size={14}
                style={{
                  transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                }}
              />
            )}
          </Group>
        </UnstyledButton>

        {hasSubmenu && (
          <Collapse in={isActive}>
            <Stack gap={2} pl="lg" mt={4}>
              {item.submenu?.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubItemActive = isActivePath(subItem.path);
                return (
                  <UnstyledButton
                    component={Link}
                    href={subItem.path}
                    key={subItem.id}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      color: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
                      fontSize: "14px",
                      backgroundColor: isSubItemActive
                        ? isDark
                          ? theme.colors.cyan[9]
                          : theme.colors.cyan[0]
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubItemActive) {
                        e.currentTarget.style.backgroundColor = isDark
                          ? theme.colors.dark[6]
                          : theme.colors.gray[1];
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSubItemActive
                        ? isDark
                          ? theme.colors.cyan[9]
                          : theme.colors.cyan[0]
                        : "transparent";
                    }}
                  >
                    <Group>
                      <SubIcon size={16} />
                      <Text size="sm">{subItem.label}</Text>
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </Collapse>
        )}
      </Box>
    );
  };

  const toggleSubmenu = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? "" : menuId);
  };

  const isActivePath = (path?: string): boolean => {
    if (!path) return false;
    return pathname.startsWith(path);
  };

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
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </Stack>
        </Box>
      </ScrollArea>
    </Box>
  );
};

export default AdminNavbar;
