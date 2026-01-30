import { insertError } from "@/app/actions";
import { DATE_AND_TIME_FORMAT, TIME_ZONE } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  ReminderTableRow,
  ScheduleSlotTableRow,
  SelectDataType,
  ServiceTypeTableRow,
} from "@/utils/types";
import moment from "moment-timezone";
import { redirect } from "next/navigation";
import {
  fetchReminders,
  fetchScheduleSlot,
  fetchServiceTypeList,
  getMaxScheduleDate,
} from "./actions";
import BookingPage from "./components/BookingPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let serviceTypeOptions: (SelectDataType & { disabled: boolean })[] = [];
  let scheduleSlot: ScheduleSlotTableRow[] = [];
  let maxDateNumberOfMonths: number = 5;
  let maxScheduleDate: string = "";
  let reminderList: ReminderTableRow[] = [];
  const serverTime = moment.tz(TIME_ZONE).format(DATE_AND_TIME_FORMAT);
  try {
    let serviceTypeData: ServiceTypeTableRow[];
    [serviceTypeData, scheduleSlot, maxDateNumberOfMonths, reminderList] = await Promise.all([
      fetchServiceTypeList(supabaseClient),
      fetchScheduleSlot(supabaseClient),
      getMaxScheduleDate(supabaseClient),
      fetchReminders(supabaseClient),
    ]);
    serviceTypeOptions = serviceTypeData.map((serviceType) => ({
      label: serviceType.service_type_label,
      value: serviceType.service_type_label,
      disabled: !serviceType.service_type_is_active,
    }));
    maxScheduleDate = moment.tz(TIME_ZONE).add(maxDateNumberOfMonths, "months").format();
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
