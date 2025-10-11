"use client";

import { insertError } from "@/app/actions";

import { useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData } from "@/stores/useUserStore";
import { TAB_LIST } from "@/utils/constants";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import {
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconLogout, IconSettings } from "@tabler/icons-react";
import { isError, startCase, toLower } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import ColorSchemeToggle from "./ColorSchemeToggle";
import classes from "./Header.module.css";

const Header = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const userData = useUserData();
  const { setIsLoading } = useLoadingActions();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const isAdmin = userData?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isOnboarding = pathname === "/user/onboarding";
  const isNotAdminRoute = !pathname.includes("/admin");

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

  useEffect(() => {
    if (drawerOpened) {
      closeDrawer();
    }
  }, [pathname]);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Flex align="center" justify="center" gap="xs">
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

          <Stack gap="xs">
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
    </Box>
  );
};

export default Header;
