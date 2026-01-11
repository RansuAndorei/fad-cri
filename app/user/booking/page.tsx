import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ReminderTableRow, ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import moment from "moment";
import { redirect } from "next/navigation";
import { getAppointmentType, getMaxScheduleDate, getReminders, getScheduleSlot } from "./actions";
import BookingPage from "./components/BookingPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let appointmentTypeOptions: string[] = [];
  let scheduleSlot: ScheduleSlotTableRow[] = [];
  let maxDateNumberOfMonths: number = 5;
  let maxScheduleDate: string = "";
  let reminderList: ReminderTableRow[] = [];
  try {
    [appointmentTypeOptions, scheduleSlot, maxDateNumberOfMonths, reminderList] = await Promise.all(
      [
        getAppointmentType(supabaseClient),
        getScheduleSlot(supabaseClient),
        getMaxScheduleDate(supabaseClient),
        getReminders(supabaseClient),
      ],
    );

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
      appointmentTypeOptions={appointmentTypeOptions}
      scheduleSlot={scheduleSlot}
      maxScheduleDate={maxScheduleDate}
      reminderList={reminderList.map((reminder) => reminder.reminder_value)}
    />
  );
};

export default Page;
