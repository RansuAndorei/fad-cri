import { insertError } from "@/app/actions";
import { FacebookIcon } from "@/utils/icons/FacebookIcon";
import { GoogleIcon } from "@/utils/icons/GoogleIcon";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Button, Divider, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { Provider } from "@supabase/supabase-js";
import { isError } from "lodash";
import { usePathname } from "next/navigation";

const OAuth = () => {
  const supabaseClient = createSupabaseBrowserClient();
  const pathname = usePathname();

  const handleSignin = async (provider: Provider) => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) throw error;
    } catch (e) {
      notifications.show({
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
      if (isError(e)) {
        await insertError(supabaseClient, {
          errorTableInsert: {
            error_message: e.message,
            error_url: pathname,
            error_function: "handleSignin",
          },
        });
      }
    }
  };

  return (
    <>
      <Divider label="Or with" mt="xl" />
      <Flex align="center" justify="center" gap="md">
        <Button
          leftSection={<FacebookIcon />}
          variant="outline"
          color="blue"
          fz={12}
          style={{ flex: 1 }}
          h={40}
          onClick={() => handleSignin("facebook")}
        >
          Facebook
        </Button>
        <Button
          leftSection={<GoogleIcon />}
          variant="outline"
          color="gray"
          fz={12}
          style={{ flex: 1 }}
          h={40}
          onClick={() => handleSignin("google")}
        >
          Google
        </Button>
      </Flex>
    </>
  );
};

export default OAuth;
