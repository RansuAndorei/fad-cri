import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import ReservationPage from "./components/ReservationPage";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let maxScheduleDateMonth: number = 2;
  const serverTime = new Date().toISOString();
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
