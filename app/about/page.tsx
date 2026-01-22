import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { fetchHours, insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import AboutPage from "./components/About";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let generalLocation: string = "";
  let contactNumber: string = "";
  try {
    const [hours, aboutData] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, { keyList: ["GENERAL_LOCATION", "CONTACT_NUMBER"] }),
    ]);
    scheduleList = hours;
    generalLocation = aboutData.GENERAL_LOCATION.system_setting_value;
    contactNumber = aboutData.CONTACT_NUMBER.system_setting_value;
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/about",
          error_function: "fetchAboutInitialData",
        },
      });
    }
    redirect("/500");
  }

  return (
    <AboutPage
      scheduleList={scheduleList}
      generalLocation={generalLocation}
      contactNumber={contactNumber}
    />
  );
};

export default Page;
