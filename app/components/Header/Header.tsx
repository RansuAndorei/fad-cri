"use client";

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
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconPhone, IconSparkles, IconWallet } from "@tabler/icons-react";
import { capitalize, toLower } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ColorSchemeToggle from "./ColorSchemeToggle";
import classes from "./Header.module.css";

const TAB_LIST = [
  { label: "home", icon: <IconHome size={16} /> },
  { label: "features", icon: <IconSparkles size={16} /> },
  { label: "pricing", icon: <IconWallet size={16} /> },
  { label: "contact us", icon: <IconPhone size={16} /> },
];

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
              <Image alt="logo" width={35} height={40} src={"/logo.png"} />
            </UnstyledButton>
            <Title order={2}>Barbers</Title>
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
                  label={capitalize(label)}
                  active={pathname === path}
                  w="auto"
                  className={classes.link}
                />
              );
            })}
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default" onClick={() => router.push("/log-in")}>
              Log In
            </Button>
            <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
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
                <Image src={"/logo.png"} width={35} height={40} alt="logo" />
              </UnstyledButton>
              <Title order={2} ml="xs">
                Barbers
              </Title>
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
                  label={capitalize(label)}
                  leftSection={icon}
                  active={pathname === path}
                />
              );
            })}
          </Stack>
          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default" onClick={() => router.push("/log-in")}>
              Log In
            </Button>
            <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
