import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getScheduleList } from "./actions";
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
  try {
    scheduleSlotData = await getScheduleList(supabaseClient);
  } catch (e) {
    if (isError(e)) {
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
    redirect("/500");
  }

  return <SchedulingPage scheduleSlotData={scheduleSlotData} />;
};

export default Page;
