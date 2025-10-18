"use client";

import { useUserActions } from "@/stores/useUserStore";
import { supabaseClient } from "@/utils/supabase/single-client";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export function useAuthListener() {
  const { setUserData, setUserProfile, setIsLoading, reset } = useUserActions();
  const mounted = useRef(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;

    const fetchUserProfile = async (user: User) => {
      const { data: profile } = await supabaseClient
        .from("user_table")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (mounted.current) setUserProfile(profile);
    };

    const init = async () => {
      setIsLoading(true);

      const { data } = await supabaseClient.auth.getSession();
      const user = data.session?.user ?? null;

      if (!mounted.current) return;

      if (user) {
        setUserData(user);
        setCurrentUserId(user.id);
        await fetchUserProfile(user);
      } else {
        reset();
      }

      setIsLoading(false);
    };

    init();

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;

      if (event === "SIGNED_IN" && user?.id === currentUserId) {
        return;
      }
      if (event === "TOKEN_REFRESHED") {
        return;
      }

      if (mounted.current) setIsLoading(true);

      if (user) {
        setUserData(user);
        setCurrentUserId(user.id);
        await fetchUserProfile(user);
      } else {
        reset();
        setCurrentUserId(null);
      }

      if (mounted.current) setIsLoading(false);
    });

    return () => {
      mounted.current = false;
      subscription.subscription.unsubscribe();
    };
  }, [setUserData, setUserProfile, reset, setIsLoading, currentUserId]);
}
