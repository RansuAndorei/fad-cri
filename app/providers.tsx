"use client";

import { useUserActions } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Center, Flex, Loader, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Session, User } from "@supabase/supabase-js";
import Image from "next/image";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "./actions";
import ProgressBar from "./components/ProgressBar";

export function Providers({
  children,
  user: initialUser,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const { setUserProfile, setUserData } = useUserActions();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);

  const supabaseClient = useMemo(() => createSupabaseBrowserClient(), []);

  // Fetch user profile
  const fetchUserProfile = async (user: User) => {
    setUserData(user);
    const userProfile = await getUserProfile(supabaseClient, { userId: user.id });
    if (userProfile) setUserProfile(userProfile);
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (user && isMounted) {
        await fetchUserProfile(user);
      }
      setMounted(true);
    };
    init();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        if (!isMounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserData(null);
          setUserProfile(null);
        }
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [user, supabaseClient, setUserData, setUserProfile]);

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
        {!mounted ? (
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
