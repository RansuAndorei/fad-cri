import { fetchHours, insertError } from "@/app/actions";
import { fetchSystemSettings } from "@/app/admin/settings/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { Box, Flex } from "@mantine/core";
import { redirect } from "next/navigation";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import classes from "./HomeLayout.module.css";

type Props = {
  children?: React.ReactNode;
};

const HomeLayout = async ({ children }: Props) => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let specificAddress: string = "";
  let pinLocation: string = "";
  let email: string = "";
  try {
    const [hours, location] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, {
        keyList: ["SPECIFIC_ADDRESS", "PIN_LOCATION", "EMAIL"],
      }),
    ]);
    scheduleList = hours;
    specificAddress = location.SPECIFIC_ADDRESS.system_setting_value;
    pinLocation = location.PIN_LOCATION.system_setting_value;
    email = location.EMAIL.system_setting_value;
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/home-layout",
          error_function: "fetchHomeLayoutInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return (
    <Flex direction={"column"} className={classes.container}>
      <Header />
      <Box className={classes.main}>{children}</Box>
      <Footer
        scheduleList={scheduleList}
        specificAddress={specificAddress}
        pinLocation={pinLocation}
        email={email}
      />
    </Flex>
  );
};

export default HomeLayout;
