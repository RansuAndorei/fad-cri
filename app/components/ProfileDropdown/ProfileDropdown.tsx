import { insertError } from "@/app/actions";
import { useIsLoading, useLoadingActions } from "@/stores/useLoadingStore";
import { useUserData, useUserProfile } from "@/stores/useUserStore";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { ActionIcon, Avatar, Button, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconLogout, IconSettings } from "@tabler/icons-react";
import { isError } from "lodash";
import { usePathname, useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();
  const router = useRouter();
  const isLoading = useIsLoading();
  const userData = useUserData();
  const userProfile = useUserProfile();
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
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" radius="xl" size="lg">
            <Avatar src={userProfile?.user_avatar} radius="xl" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Menu</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
          <Menu.Item
            leftSection={<IconCalendar size={14} />}
            onClick={() => router.push("/user/appointment")}
          >
            Appointments
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  } else {
    return null;
  }
};

export default ProfileDropdown;
