"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ReactNode, useState } from "react";
import ProgressBar from "./components/ProgressBar";

export function Providers({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <MantineProvider
        theme={{
          primaryColor: "violet",
        }}
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
