import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { insertError } from "../actions";
import { fetchSystemSettings } from "../admin/settings/actions";
import GuidelinesPage from "./components/GuidelinesPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let contactNumber: string = "";
  let bookingFee: number = 500;
  let lateFee1: number = 300;
  let lateFee2: number = 500;
  let lateFee3: number = 1000;
  let lateFee4: number = 2000;
  try {
    const guidelinesData = await fetchSystemSettings(supabaseClient, {
      keyList: [
        "CONTACT_NUMBER",
        "BOOKING_FEE",
        "LATE_FEE_1",
        "LATE_FEE_2",
        "LATE_FEE_3",
        "LATE_FEE_4",
      ],
    });
    contactNumber = guidelinesData.CONTACT_NUMBER.system_setting_value;
    bookingFee = Number(guidelinesData.BOOKING_FEE.system_setting_value);
    lateFee1 = Number(guidelinesData.LATE_FEE_1.system_setting_value);
    lateFee2 = Number(guidelinesData.LATE_FEE_2.system_setting_value);
    lateFee3 = Number(guidelinesData.LATE_FEE_3.system_setting_value);
    lateFee4 = Number(guidelinesData.LATE_FEE_4.system_setting_value);
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/guidelines",
          error_function: "fetchGuidelinesInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return (
    <GuidelinesPage
      contactNumber={contactNumber}
      bookingFee={bookingFee}
      lateFee1={lateFee1}
      lateFee2={lateFee2}
      lateFee3={lateFee3}
      lateFee4={lateFee4}
    />
  );
};

export default Page;
