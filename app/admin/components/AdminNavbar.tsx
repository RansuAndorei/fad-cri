"use client";

import { ADMIN_NAVIGATION_ITEMS } from "@/utils/constants";
import {
  Accordion,
  Box,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavbar = () => {
  const pathname = usePathname();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const [activeMenu, setActiveMenu] = useLocalStorage<string[]>({
    key: "active-menu",
    defaultValue: [],
  });

  const isActivePath = (path?: string) => {
    if (!path) return false;
    return pathname.startsWith(path);
  };

  return (
    <Box
      px="md"
      py="lg"
      miw={300}
      visibleFrom="md"
      style={{
        borderRight: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      }}
    >
      <ScrollArea offsetScrollbars={false} scrollbarSize={10}>
        <Accordion multiple value={activeMenu} onChange={setActiveMenu} variant="unstyled">
          <Stack gap={0}>
            {ADMIN_NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu?.length;
              const isCurrentPage = isActivePath(item.path);

              if (!hasSubmenu && item.path) {
                return (
                  <UnstyledButton
                    key={item.id}
                    component={Link}
                    href={item.path || "#"}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "24px 16px",
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
                    <Group gap="sm">
                      <Icon size={18} />
                      <Text size="sm" fw={500}>
                        {item.label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                );
              }

              return (
                <Accordion.Item key={item.id} value={item.id}>
                  <Accordion.Control
                    icon={<Icon size={18} />}
                    chevron={<IconChevronDown size={14} />}
                    px="md"
                    py="xs"
                    styles={{
                      control: {
                        color: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
                        padding: "16px",
                      },
                      label: {
                        fontWeight: 500,
                        fontSize: theme.fontSizes.sm,
                      },
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
                    {item.label}
                  </Accordion.Control>

                  <Accordion.Panel>
                    <Stack gap={0} pl="xs">
                      {item.submenu?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActivePath(subItem.path);

                        return (
                          <UnstyledButton
                            key={subItem.id}
                            component={Link}
                            href={subItem.path}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: 8,
                              borderRadius: 4,
                              color: isDark ? theme.colors.dark[1] : theme.colors.gray[6],
                              fontSize: 14,
                              backgroundColor: isSubActive
                                ? isDark
                                  ? theme.colors.cyan[9]
                                  : theme.colors.cyan[0]
                                : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubActive) {
                                e.currentTarget.style.backgroundColor = isDark
                                  ? theme.colors.dark[6]
                                  : theme.colors.gray[1];
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isSubActive
                                ? isDark
                                  ? theme.colors.cyan[9]
                                  : theme.colors.cyan[0]
                                : "transparent";
                            }}
                            p="sm"
                          >
                            <Group>
                              <SubIcon size={16} />
                              <Text size="sm">{subItem.label}</Text>
                            </Group>
                          </UnstyledButton>
                        );
                      })}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Stack>
        </Accordion>
      </ScrollArea>
    </Box>
  );
};

export default AdminNavbar;
