import { FAQS_DATA } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { FAQCategoryEnum, FAQType, ScheduleRangeType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchHours, insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import { fetchFAQList } from "./actions";
import FAQsPage from "./components/FAQsPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let scheduleList: ScheduleRangeType[] = [];
  let specificAddress: string = "";
  let contactNumber: string = "";
  let maxScheduleDateMonth: number = 2;
  let bookingFee: number = 500;
  let faqList: FAQType[] = [];
  try {
    const [hours, systemSettings, faqData] = await Promise.all([
      fetchHours(supabaseClient),
      fetchSystemSettings(supabaseClient, {
        keyList: ["SPECIFIC_ADDRESS", "CONTACT_NUMBER", "MAX_SCHEDULE_DATE_MONTH", "BOOKING_FEE"],
      }),
      fetchFAQList(supabaseClient),
    ]);
    scheduleList = hours;
    specificAddress = systemSettings.SPECIFIC_ADDRESS.system_setting_value;
    contactNumber = systemSettings.CONTACT_NUMBER.system_setting_value;
    maxScheduleDateMonth = Number(systemSettings.MAX_SCHEDULE_DATE_MONTH.system_setting_value);
    bookingFee = Number(systemSettings.BOOKING_FEE.system_setting_value);
    faqList = Object.keys(FAQS_DATA).map((category) => {
      const formattedCategory = category as FAQCategoryEnum;
      return {
        id: category,
        category: FAQS_DATA[formattedCategory].label,
        color: FAQS_DATA[formattedCategory].color,
        faqList: faqData
          .filter((faq) => faq.faq_category === category)
          .map((faq) => ({ question: faq.faq_question, answer: faq.faq_answer })),
      };
    });
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
      specificAddress={specificAddress}
      contactNumber={contactNumber}
      maxScheduleDateMonth={maxScheduleDateMonth}
      bookingFee={bookingFee}
      faqList={faqList}
    />
  );
};

export default Page;
