import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ScheduleRangeType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchHours, insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import FAQsPage from "./components/FAQsPage";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let generalLocation: string = "";
  let contactNumber: string = "";
  let maxScheduleDateMonth: number = 2;
  let bookingFee: number = 500;
  try {
    const [hours, faqsData] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, {
        keyList: ["GENERAL_LOCATION", "CONTACT_NUMBER", "MAX_SCHEDULE_DATE_MONTH", "BOOKING_FEE"],
      }),
    ]);
    scheduleList = hours;

    generalLocation = faqsData.GENERAL_LOCATION.system_setting_value;
    contactNumber = faqsData.CONTACT_NUMBER.system_setting_value;
    maxScheduleDateMonth = Number(faqsData.MAX_SCHEDULE_DATE_MONTH.system_setting_value);
    bookingFee = Number(faqsData.BOOKING_FEE.system_setting_value);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/faqs",
          error_function: "fetchFAQsInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return (
    <FAQsPage
      scheduleList={scheduleList}
      generalLocation={generalLocation}
      contactNumber={contactNumber}
      maxScheduleDateMonth={maxScheduleDateMonth}
      bookingFee={bookingFee}
    />
  );
};

export default Page;
