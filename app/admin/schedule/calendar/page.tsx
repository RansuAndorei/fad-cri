import { insertError } from "@/app/actions";
import { fetchScheduleSlot } from "@/app/reservation/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleSlotTableRow } from "@/utils/types";
import { redirect } from "next/navigation";
import CalendarPage from "./components/CalendarPage";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let scheduleSlot: ScheduleSlotTableRow[] = [];
  const serverTime = new Date().toISOString();
  try {
    scheduleSlot = await fetchScheduleSlot(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/user/booking",
          error_function: "fetchScheduleInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <CalendarPage scheduleSlot={scheduleSlot} serverTime={serverTime} />;
};

export default Page;
