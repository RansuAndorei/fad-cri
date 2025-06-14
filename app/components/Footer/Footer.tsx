"use client";

import { ActionIcon, Box, Container, Group, UnstyledButton } from "@mantine/core";
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import classes from "./Footer.module.css";

const Footer = () => {
  const router = useRouter();

  return (
    <Box className={classes.footer}>
      <Container className={classes.inner}>
        <UnstyledButton onClick={() => router.push("/")} className={classes.logo}>
          <Image alt="logo" width={35} height={40} src={"/logo.png"} />
        </UnstyledButton>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
