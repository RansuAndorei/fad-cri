import { DATE_AND_TIME_FORMAT, TIME_ZONE } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import moment from "moment-timezone";
import { redirect } from "next/navigation";
import { insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import ReservationPage from "./components/ReservationPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let maxScheduleDateMonth: number = 2;
  const serverTime = moment.tz(TIME_ZONE).format(DATE_AND_TIME_FORMAT);
  try {
    const reservationData = await fetchSystemSettings(supabaseClient, {
      keyList: ["MAX_SCHEDULE_DATE_MONTH"],
    });
    maxScheduleDateMonth = Number(reservationData.MAX_SCHEDULE_DATE_MONTH.system_setting_value);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/reservation",
          error_function: "fetchReservationInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return <ReservationPage maxScheduleDateMonth={maxScheduleDateMonth} serverTime={serverTime} />;
};

export default Page;
