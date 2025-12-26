"use client";

import { useUserActions } from "@/stores/useUserStore";
import { supabaseClient } from "@/utils/supabase/single-client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useAuthListener() {
  const { setUserData, setUserProfile, setIsLoading, reset } = useUserActions();
  const mounted = useRef(true);
  const currentUserIdRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    mounted.current = true;

    const fetchUserProfile = async (user: User) => {
      const { data: profile } = await supabaseClient
        .from("user_table")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (mounted.current) {
        setUserProfile(profile);

        const currentPath = window.location.pathname;
        if (currentPath.includes("log-in")) {
          router.push("/user/onboarding");
        }
      }
    };

    const init = async () => {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes("log-in");

      // Only show loading if NOT on login page
      if (!isLoginPage) {
        setIsLoading(true);
      }

      const { data } = await supabaseClient.auth.getSession();
      const user = data.session?.user ?? null;

      if (!mounted.current) return;

      if (user) {
        setUserData(user);
        currentUserIdRef.current = user.id;
        await fetchUserProfile(user);
      } else {
        reset();
      }

      if (!isLoginPage) {
        setIsLoading(false);
      }
    };

    init();

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;

      if (event === "SIGNED_IN" && user?.id === currentUserIdRef.current) {
        return;
      }
      if (event === "TOKEN_REFRESHED") {
        return;
      }

      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes("log-in");

      if (mounted.current && !isLoginPage) {
        setIsLoading(true);
      }

      if (user) {
        setUserData(user);
        currentUserIdRef.current = user.id;
        await fetchUserProfile(user);
      } else {
        reset();
        currentUserIdRef.current = null;
      }
      if (mounted.current && !isLoginPage) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted.current = false;
      subscription.subscription.unsubscribe();
    };
  }, [setUserData, setUserProfile, reset, setIsLoading, router]);
}
