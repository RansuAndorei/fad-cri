import { fetchHours, insertError } from "@/app/actions";
import { fetchSystemSettings } from "@/app/admin/settings/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { Box, Flex } from "@mantine/core";
import { redirect } from "next/navigation";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import classes from "./HomeLayout.module.css";
import { isAppError } from "@/utils/functions";

type Props = {
  children?: React.ReactNode;
};

const HomeLayout = async ({ children }: Props) => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let generalLocation: string = "";
  try {
    const [hours, location] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, { keyList: ["GENERAL_LOCATION"] }),
    ]);
    scheduleList = hours;
    generalLocation = location.GENERAL_LOCATION.system_setting_value;
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
      <Footer scheduleList={scheduleList} generalLocation={generalLocation} />
    </Flex>
  );
};

export default HomeLayout;
