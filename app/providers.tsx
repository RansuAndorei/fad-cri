"use client";

import { useAuthListener } from "@/hooks/useAuthListener";
import { useUserHasInitialized, useUserIsLoading } from "@/stores/useUserStore";
import { Center, Flex, Loader, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import Image from "next/image";
import { ReactNode } from "react";
import ProgressBar from "./components/ProgressBar";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  useAuthListener();
  const isLoading = useUserIsLoading();
  const hasInitialized = useUserHasInitialized();

  const showInitialLoader = isLoading && !hasInitialized;

  return (
    <MantineProvider
      theme={{
        primaryColor: "cyan",
        fontFamily: "CorporateAProRegular, sans-serif",
        components: {
          Button: { styles: { root: { fontWeight: 100, fontSize: 16 } } },
          NavLink: { styles: { label: { fontWeight: 100, fontSize: 16 } } },
          Radio: {
            styles: {
              radio: { cursor: "pointer" },
              label: { cursor: "pointer" },
              icon: { cursor: "pointer" },
            },
          },
          Checkbox: { styles: { input: { cursor: "pointer" } } },
        },
      }}
    >
      <ModalsProvider>
        <ProgressBar />
        <Notifications />

        {showInitialLoader ? (
          <Center h="100vh">
            <Flex gap="xl" align="center">
              <Loader type="dots" size="sm" />
              <Image alt="logo" width={55} height={50} src={"/images/logo.png"} priority />
              <Loader type="dots" size="sm" />
            </Flex>
          </Center>
        ) : (
          children
        )}
      </ModalsProvider>
    </MantineProvider>
  );
}
