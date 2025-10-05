"use client";

import { TAB_LIST } from "@/utils/constants";
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
import { startCase, toLower } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import ColorSchemeToggle from "./ColorSchemeToggle";
import classes from "./Header.module.css";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

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
            <UnstyledButton onClick={() => router.push("/")} className={classes.logo}>
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
            <Button onClick={() => router.push("/user/booking-info")}>Book an Appointment</Button>
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
              <UnstyledButton onClick={async () => router.push("/")}>
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

          <Group justify="center" grow pb="xl" px="md">
            <Button onClick={() => router.push("/user/booking-info")}>Book an Appointment</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
