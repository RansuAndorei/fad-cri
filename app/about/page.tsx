import { DATE_AND_TIME_FORMAT, TIME_ZONE } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import moment from "moment-timezone";
import { redirect } from "next/navigation";
import { fetchHours, insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import AboutPage from "./components/About";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let specificAddress: string = "";
  let contactNumber: string = "";
  let pinLocation: string = "";
  let email: string = "";
  const serverTime = moment.tz(TIME_ZONE).format(DATE_AND_TIME_FORMAT);
  try {
    const [hours, aboutData] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, {
        keyList: ["SPECIFIC_ADDRESS", "CONTACT_NUMBER", "PIN_LOCATION", "EMAIL"],
      }),
    ]);
    scheduleList = hours;
    specificAddress = aboutData.SPECIFIC_ADDRESS.system_setting_value;
    contactNumber = aboutData.CONTACT_NUMBER.system_setting_value;
    pinLocation = aboutData.PIN_LOCATION.system_setting_value;
    email = aboutData.EMAIL.system_setting_value;
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/about",
          error_function: "fetchAboutInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return (
    <AboutPage
      scheduleList={scheduleList}
      specificAddress={specificAddress}
      contactNumber={contactNumber}
      serverTime={serverTime}
      pinLocation={pinLocation}
      email={email}
    />
  );
};

export default Page;
