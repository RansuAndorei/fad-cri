import { fetchGeneralLocation, fetchHours, insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { Box, Flex } from "@mantine/core";
import { isError } from "lodash";
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
  let generalLocation: string | null = null;
  try {
    const [hours, location] = await Promise.all([
      fetchHours(supabaseClient),
      fetchGeneralLocation(supabaseClient),
    ]);
    scheduleList = hours;
    generalLocation = location;
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "home-layout",
          error_function: "fetcFooterInitialData",
        },
      });
    }
    redirect("/500");
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
