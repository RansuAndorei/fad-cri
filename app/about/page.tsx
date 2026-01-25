import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchHours, insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import AboutPage from "./components/About";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let generalLocation: string = "";
  let contactNumber: string = "";
  const serverTime = new Date().toISOString();
  try {
    const [hours, aboutData] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, { keyList: ["GENERAL_LOCATION", "CONTACT_NUMBER"] }),
    ]);
    scheduleList = hours;
    generalLocation = aboutData.GENERAL_LOCATION.system_setting_value;
    contactNumber = aboutData.CONTACT_NUMBER.system_setting_value;
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
      generalLocation={generalLocation}
      contactNumber={contactNumber}
      serverTime={serverTime}
    />
  );
};

export default Page;
