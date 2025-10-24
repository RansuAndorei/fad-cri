import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getAppointmentType, getMaxScheduleDate, getScheduleSlot } from "./actions";
import BookingPage from "./components/BookingPage";
import moment from "moment";

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
  try {
    [appointmentTypeOptions, scheduleSlot, maxDateNumberOfMonths] = await Promise.all([
      getAppointmentType(supabaseClient),
      getScheduleSlot(supabaseClient),
      getMaxScheduleDate(supabaseClient),
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
      appointmentTypeOptions={appointmentTypeOptions}
      scheduleSlot={scheduleSlot}
      maxScheduleDate={maxScheduleDate}
    />
  );
};

export default Page;
