"use client";

import { insertError } from "@/app/actions";

import { useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData } from "@/stores/useUserStore";
import { ADMIN_NAVIGATION_ITEMS, HELP_TAB_LIST, TAB_LIST } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconChevronDown,
  IconHelp,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { isError, startCase, toLower } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import ColorSchemeToggle from "./ColorSchemeToggle";
import classes from "./Header.module.css";

const Header = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const userData = useUserData();
  const { setIsLoading } = useLoadingActions();
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme();

  const [activeMenu, setActiveMenu] = useState<string>("");

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure(false);
  const [opened, setOpened] = useState(false);

  const isDark = computedColorScheme === "dark";
  const isAdmin = userData?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isOnboarding = pathname === "/user/onboarding";
  const isNotAdminRoute = !pathname.includes("/admin");

  useEffect(() => {
    if (drawerOpened) {
      closeDrawer();
    }
    if (navbarOpened) {
      closeNavbar();
    }
  }, [pathname]);

  const handleLogout = async () => {
    if (!userData) return;
    try {
      setIsLoading(true);
      await supabaseClient.auth.signOut();
      router.push("/");
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });

      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleLogout",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubmenu = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? "" : menuId);
  };

  const helpTabLabelList = HELP_TAB_LIST.map((tab) => `/${tab.label}`);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Flex align="center" justify="center" gap="xs">
            {!isNotAdminRoute ? (
              <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="md" size={16} />
            ) : null}

            <UnstyledButton component={Link} href="/" className={classes.logo}>
              <Image alt="logo" width={55} height={50} src={"/images/logo.png"} priority />
            </UnstyledButton>
            <ColorSchemeToggle />
          </Flex>

          <Group h="100%" gap={0} visibleFrom="sm">
            {TAB_LIST.map(({ label }) => {
              const path = toLower(label) === "home" ? "/" : `/${label.split(" ").join("-")}`;
              return (
                <NavLink
                  key={label}
                  component={Link}
                  href={path}
                  label={startCase(label)}
                  active={pathname === path}
                  w="auto"
                  className={classes.link}
                />
              );
            })}
            <Menu trigger="hover" withinPortal>
              <Menu.Target>
                <NavLink
                  label={
                    <Group gap="xs">
                      Help
                      <IconChevronDown size={14} />
                    </Group>
                  }
                  w="auto"
                  className={classes.link}
                  active={helpTabLabelList.includes(pathname)}
                />
              </Menu.Target>

              <Menu.Dropdown>
                {HELP_TAB_LIST.map(({ label, icon }) => {
                  const path = `/${label}`;
                  return (
                    <Menu.Item key={label} component={Link} href={path} leftSection={icon}>
                      {startCase(label)}
                    </Menu.Item>
                  );
                })}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group visibleFrom="sm" gap="xs">
            {!isOnboarding && isAdmin && isNotAdminRoute ? (
              <Button component={Link} href="/admin/dashboard">
                Admin Dashboard
              </Button>
            ) : null}
            {!isOnboarding && !isAdmin ? (
              <Button component={Link} href="/user/booking-info">
                Book an Appointment
              </Button>
            ) : null}

            <ProfileDropdown />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" size={16} />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={9999}
        position="right"
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Center>
            <Flex align="center" justify="center">
              <UnstyledButton component={Link} href="/">
                <Image alt="logo" width={55} height={50} src={"/images/logo.png"} priority />
              </UnstyledButton>
            </Flex>
          </Center>
          <Divider my="sm" />

          <Stack gap="xs" px="xs">
            {TAB_LIST.map(({ label, icon }) => {
              const path = toLower(label) === "home" ? "/" : `/${label.split(" ").join("-")}`;
              return (
                <NavLink
                  key={label}
                  component={Link}
                  href={path}
                  label={startCase(label)}
                  leftSection={icon}
                  active={pathname === path}
                />
              );
            })}

            <Box>
              <UnstyledButton
                onClick={() => setOpened((o) => !o)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                }}
              >
                <Box style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <IconHelp size={16} />
                  <Text>Help</Text>
                </Box>

                <IconChevronDown
                  size={14}
                  style={{
                    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 150ms ease",
                  }}
                />
              </UnstyledButton>

              <Collapse in={opened}>
                <Box mt="xs" ml="md">
                  {HELP_TAB_LIST.map(({ label, icon }) => {
                    const path = `/${label}`;
                    return (
                      <NavLink
                        key={label}
                        component={Link}
                        href={path}
                        label={startCase(label)}
                        leftSection={icon}
                        active={pathname === path}
                      />
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          </Stack>
          <Divider my="sm" />

          {!isOnboarding && !isAdmin ? (
            <Group justify="center" grow pb="xl" px="md">
              <Button component={Link} href="/user/booking-info">
                Book an Appointment
              </Button>
            </Group>
          ) : null}

          {!isOnboarding && pathname.includes("user") ? (
            <Stack px="md" gap="xs">
              <Divider label="Profile" />
              <Button leftSection={<IconSettings size={14} />} variant="light">
                Settings
              </Button>
              <Button
                leftSection={<IconCalendar size={14} />}
                component={Link}
                href="/user/appointment"
                variant="light"
              >
                Appointments
              </Button>

              <Button color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          ) : null}

          {isOnboarding && pathname.includes("user") ? (
            <Stack px="md" gap="xs">
              <Button color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          ) : null}

          {pathname.includes("admin") ? (
            <Stack px="md" gap="xs">
              <Button color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          ) : null}
        </ScrollArea>
      </Drawer>

      <Drawer
        opened={navbarOpened}
        onClose={closeNavbar}
        size="100%"
        padding="md"
        hiddenFrom="md"
        zIndex={9999}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Center>
            <Flex align="center" justify="center">
              <UnstyledButton component={Link} href="/">
                <Image alt="logo" width={55} height={50} src={"/images/logo.png"} priority />
              </UnstyledButton>
            </Flex>
          </Center>
          <Divider my="sm" />

          <ScrollArea offsetScrollbars={false} scrollbarSize={10}>
            <Box h="fit-content">
              <Stack gap={0} align="start" w="100%" p="xs">
                {ADMIN_NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isActive = activeMenu === item.id;
                  const isLink = Boolean(item.path);

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
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark
                            ? theme.colors.dark[6]
                            : theme.colors.gray[1];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
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
                                    backgroundColor: "transparent",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = isDark
                                      ? theme.colors.dark[6]
                                      : theme.colors.gray[1];
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
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
                })}
              </Stack>
            </Box>
          </ScrollArea>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
