"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ReactNode, useEffect, useState } from "react";
import ProgressBar from "./components/ProgressBar";

export function Providers({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
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
        defaultColorScheme="dark"
      >
        <ModalsProvider>
          <ProgressBar />
          <Notifications />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </SessionContextProvider>
  );
}
