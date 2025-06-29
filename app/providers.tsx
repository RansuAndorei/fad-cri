"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { ReactNode, useEffect, useState } from "react";
import ProgressBar from "./components/ProgressBar";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MantineProvider
      theme={{
        primaryColor: "cyan",
        fontFamily: "CorporateAProRegular, sans-serif",
        components: {
          Button: {
            styles: {
              root: {
                fontWeight: 100,
                fontSize: 16,
              },
            },
          },
          NavLink: {
            styles: {
              label: {
                fontWeight: 100,
                fontSize: 16,
              },
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <ProgressBar />
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
