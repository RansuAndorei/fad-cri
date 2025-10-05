"use client";

import { HELP_TAB_LIST, TAB_LIST } from "@/utils/constants";
import {
  ActionIcon,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandGmail,
  IconBrandInstagram,
  IconMapPin,
} from "@tabler/icons-react";
import { startCase, toLower } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./Footer.module.css";

const Footer = () => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const theme = useMantineTheme();

  return (
    <Box className={classes.footer} style={{ backgroundColor: theme.colors.cyan[isDark ? 9 : 0] }}>
      <Box mx="auto" w="100%" maw={1600}>
        <Flex justify="space-between" p="xl" gap="xl" wrap="wrap">
          <Stack style={{ flex: 1 }} gap="xs">
            <Title order={4}>FadCri</Title>
            <Stack gap={0}>
              {TAB_LIST.map(({ label, icon }) => {
                const path = toLower(label) === "home" ? "/" : `/${label.split(" ").join("-")}`;
                return (
                  <NavLink
                    key={label}
                    component={Link}
                    href={path}
                    label={startCase(label)}
                    leftSection={icon}
                    variant="subtle"
                  />
                );
              })}
            </Stack>
          </Stack>
          <Stack style={{ flex: 1 }} gap="xs">
            <Title order={4}>Help</Title>
            <Stack gap={0}>
              {HELP_TAB_LIST.map(({ label, icon }) => {
                const formattedLabel = label === "faqs" ? "FAQs" : startCase(label);
                const path = `/${label.split(" ").join("-")}`;
                return (
                  <NavLink label={formattedLabel} leftSection={icon} key={label} href={path} />
                );
              })}
            </Stack>
          </Stack>
          <Stack style={{ flex: 1 }} gap="xs">
            <Title order={4}>Hours</Title>
            <Stack gap={0} ml="xs">
              <Text>Monday — Friday</Text>
              <Text>8:00am — 5:00pm</Text>
            </Stack>
            <Stack gap={0} ml="xs">
              <Text>Saturday — Sunday</Text>
              <Text>10:00am — 10:00pm</Text>
            </Stack>
          </Stack>
          <Stack style={{ flex: 1 }} gap="xs">
            <Title order={4}>Location</Title>
            <Flex align="center" gap="xs">
              <ActionIcon
                variant="light"
                color="orange"
                onClick={() => window.open("https://maps.app.goo.gl/swsmSMptb3KcWGk76")}
              >
                <IconMapPin size={16} />
              </ActionIcon>
              <Text>Obando, Bulacan</Text>
            </Flex>
          </Stack>
        </Flex>
      </Box>

      <Divider size="sm" color="cyan" />
      <Container className={classes.inner}>
        <UnstyledButton onClick={() => router.push("/")} className={classes.logo}>
          <Image alt="logo" width={35} height={40} src={"/images/logo.png"} priority />
        </UnstyledButton>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            onClick={() => {
              window.open("https://www.facebook.com/fad.cri", "_blank");
            }}
          >
            <IconBrandFacebook size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            onClick={() => {
              window.open("https://www.instagram.com/fad_cri", "_blank");
            }}
          >
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            onClick={() => {
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=fadcri@gmail.com",
                "_blank",
              );
            }}
          >
            <IconBrandGmail size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
