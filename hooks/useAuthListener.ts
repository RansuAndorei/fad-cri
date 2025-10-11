"use client";

import { useUserActions } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { useEffect } from "react";

export function useAuthListener() {
  const supabaseClient = createSupabaseBrowserClient();
  const { setUserData, setUserProfile, setIsLoading, reset } = useUserActions();

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      setIsLoading(true);

      const { data } = await supabaseClient.auth.getSession();
      const user = data.session?.user ?? null;

      if (ignore) return;

      if (user) {
        setUserData(user);

        const { data: profile } = await supabaseClient
          .from("user_table")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        setUserProfile(profile);
      } else {
        reset();
      }

      setIsLoading(false);
    };

    init();

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        const user = session?.user ?? null;

        if (user) {
          setUserData(user);

          const { data: profile } = await supabaseClient
            .from("user_table")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          setUserProfile(profile);
        } else {
          reset();
        }

        setIsLoading(false);
      },
    );

    return () => {
      ignore = true;
      subscription.subscription.unsubscribe();
    };
  }, [setUserData, setUserProfile, reset, setIsLoading]);
}
