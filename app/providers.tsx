"use client";

import { useUserActions } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { ReactNode, useEffect, useState } from "react";
import { getUserProfile } from "./actions";
import ProgressBar from "./components/ProgressBar";

export function Providers({ children }: { children: ReactNode }) {
  const { setUserProfile, setUserData } = useUserActions();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();
    let isMounted = true;
    const fetchStoreData = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user && isMounted) {
        setUserData(user);
        const userProfile = await getUserProfile(supabaseClient, { userId: user.id });
        if (userProfile) {
          setUserProfile(userProfile);
        }
      }

      setMounted(true);
    };

    fetchStoreData();

    return () => {
      isMounted = false;
    };
  }, []);

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
          Radio: {
            styles: {
              radio: {
                cursor: "pointer",
              },
              label: {
                cursor: "pointer",
              },
              icon: {
                cursor: "pointer",
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
