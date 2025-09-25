import { insertError } from "@/app/actions";
import { useIsLoading, useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Avatar, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { isError } from "lodash";
import { usePathname, useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const router = useRouter();
  const isLoading = useIsLoading();
  const userData = useUserData();
  const { setIsLoading } = useLoadingActions();

  const handleLogout = async () => {
    if (!userData) return;
    try {
      setIsLoading(true);
      await supabaseClient.auth.signOut();
      router.push("/");
      setIsLoading(false);
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      setIsLoading(false);
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleLogout",
            error_user_email: userData.email,
            error_user_id: userData.id,
          },
        });
      }
    }
  };

  if (pathname === "/user/onboarding") {
    return (
      <Button variant="light" onClick={handleLogout} loading={isLoading}>
        Logout
      </Button>
    );
  } else if (pathname.includes("user")) {
    return <Avatar></Avatar>;
  } else {
    return null;
  }
};

export default ProfileDropdown;
