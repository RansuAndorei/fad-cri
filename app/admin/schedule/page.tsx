import { insertError } from "@/app/actions";
import { getScheduleSlot } from "@/app/user/booking/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import SchedulePage from "./components/SchedulePage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let scheduleSlot: ScheduleSlotTableRow[] = [];
  try {
    scheduleSlot = await getScheduleSlot(supabaseClient);
  } catch (e) {
    if (isError(e)) {
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
    redirect("/500");
  }

  return <SchedulePage scheduleSlot={scheduleSlot} />;
};

export default Page;
