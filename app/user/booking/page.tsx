import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ReminderTableRow, ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import moment from "moment";
import { redirect } from "next/navigation";
import { getMaxScheduleDate, getReminders, getScheduleSlot, getServiceType } from "./actions";
import BookingPage from "./components/BookingPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let serviceTypeOptions: string[] = [];
  let scheduleSlot: ScheduleSlotTableRow[] = [];
  let maxDateNumberOfMonths: number = 5;
  let maxScheduleDate: string = "";
  let reminderList: ReminderTableRow[] = [];
  try {
    [serviceTypeOptions, scheduleSlot, maxDateNumberOfMonths, reminderList] = await Promise.all([
      getServiceType(supabaseClient),
      getScheduleSlot(supabaseClient),
      getMaxScheduleDate(supabaseClient),
      getReminders(supabaseClient),
    ]);

    maxScheduleDate = moment().add(maxDateNumberOfMonths, "months").format();
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/user/booking",
          error_function: "fetchBookingInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/500");
  }

  return (
    <BookingPage
      serviceTypeOptions={serviceTypeOptions}
      scheduleSlot={scheduleSlot}
      maxScheduleDate={maxScheduleDate}
      reminderList={reminderList.map((reminder) => reminder.reminder_value)}
    />
  );
};

export default Page;
