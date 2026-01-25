import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ReminderTableRow, ScheduleSlotTableRow } from "@/utils/types";
import moment from "moment";
import { redirect } from "next/navigation";
import { fetchReminders, fetchScheduleSlot, fetchServiceType, getMaxScheduleDate } from "./actions";
import BookingPage from "./components/BookingPage";
import { isAppError } from "@/utils/functions";

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
  const serverTime = new Date().toISOString();
  try {
    [serviceTypeOptions, scheduleSlot, maxDateNumberOfMonths, reminderList] = await Promise.all([
      fetchServiceType(supabaseClient),
      fetchScheduleSlot(supabaseClient),
      getMaxScheduleDate(supabaseClient),
      fetchReminders(supabaseClient),
    ]);

    maxScheduleDate = moment().add(maxDateNumberOfMonths, "months").format();
  } catch (e) {
    if (isAppError(e)) {
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
    redirect("/error/500");
  }

  return (
    <BookingPage
      serviceTypeOptions={serviceTypeOptions}
      scheduleSlot={scheduleSlot}
      maxScheduleDate={maxScheduleDate}
      reminderList={reminderList.map((reminder) => reminder.reminder_value)}
      serverTime={serverTime}
    />
  );
};

export default Page;
