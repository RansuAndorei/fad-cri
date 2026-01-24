"use client";

import { insertError } from "@/app/actions";
import { useUserActions } from "@/stores/useUserStore";
import { supabaseClient } from "@/utils/supabase/single-client";
import { User } from "@supabase/supabase-js";
import { isError } from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function useAuthListener() {
  const { setUserData, setUserProfile, setIsLoading, reset, setHasInitialized } = useUserActions();
  const mounted = useRef(true);
  const pathname = usePathname();
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    mounted.current = true;

    const fetchUserProfile = async (user: User) => {
      try {
        const { data: profile, error } = await supabaseClient
          .from("user_table")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;

        if (mounted.current) {
          setUserProfile(profile);
        }

        return profile;
      } catch (e) {
        if (isError(e)) {
          await insertError(supabaseClient, {
            errorTableInsert: {
              error_message: e.message,
              error_url: pathname,
              error_function: "fetchUserProfile",
              error_user_email: user.email,
              error_user_id: user.id,
            },
          });
        }
        return null;
      }
    };

    const init = async () => {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes("log-in") || currentPath.includes("sign-up");

      if (!isAuthPage) setIsLoading(true);

      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        const user = data.session?.user ?? null;

        if (!mounted.current) return;

        if (user) {
          setUserData(user);
          currentUserIdRef.current = user.id;
          await fetchUserProfile(user);
        } else {
          reset();
          currentUserIdRef.current = null;
        }
      } catch (e) {
        if (isError(e)) {
          await insertError(supabaseClient, {
            errorTableInsert: {
              error_message: e.message,
              error_url: pathname,
              error_function: "init",
            },
          });
        }
        if (mounted.current) reset();
      } finally {
        if (mounted.current && !isAuthPage) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    init();

    const shouldShowLoading = (event: string) => event === "SIGNED_IN" || event === "SIGNED_OUT";

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes("log-in") || currentPath.includes("sign-up");

      const shouldIgnore =
        (event === "SIGNED_IN" && user?.id === currentUserIdRef.current) ||
        event === "TOKEN_REFRESHED";

      if (mounted.current && !isAuthPage && shouldShowLoading(event)) {
        setIsLoading(true);
      }

      try {
        if (!shouldIgnore) {
          if (user) {
            setUserData(user);
            currentUserIdRef.current = user.id;

            fetchUserProfile(user);
          } else {
            reset();
            currentUserIdRef.current = null;
          }
        }
      } catch (e) {
        if (isError(e)) {
          await insertError(supabaseClient, {
            errorTableInsert: {
              error_message: e.message,
              error_url: pathname,
              error_function: "onAuthStateChange",
              error_user_email: user?.email,
              error_user_id: user?.id,
            },
          });
        }
        if (mounted.current) reset();
      } finally {
        if (mounted.current && !isAuthPage && shouldShowLoading(event)) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription.subscription.unsubscribe();
    };
  }, [setUserData, setUserProfile, reset, setIsLoading, pathname]);
}
