import { insertError } from "@/app/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleSlotTableRow } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchScheduleList } from "./actions";
import SchedulingPage from "./components/SchedulingPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let scheduleSlotData: ScheduleSlotTableRow[] = [];
  const serverTime = new Date().toISOString();
  try {
    scheduleSlotData = await fetchScheduleList(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/schedule",
          error_function: "fetchScheduleInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <SchedulingPage scheduleSlotData={scheduleSlotData} serverTime={serverTime} />;
};

export default Page;
