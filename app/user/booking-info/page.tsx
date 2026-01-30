import { insertError } from "@/app/actions";
import { fetchSystemSettings } from "@/app/admin/settings/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookingInfoPage from "./components/BookingInfoPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let bookingFee = 0;
  const lateFee: number[] = [];
  try {
    const data = await fetchSystemSettings(supabaseClient, {
      keyList: ["BOOKING_FEE", "LATE_FEE_1", "LATE_FEE_2", "LATE_FEE_3", "LATE_FEE_4"],
    });
    bookingFee = Number(data.BOOKING_FEE.system_setting_value);
    lateFee.push(
      Number(data.LATE_FEE_1.system_setting_value),
      Number(data.LATE_FEE_2.system_setting_value),
      Number(data.LATE_FEE_3.system_setting_value),
      Number(data.LATE_FEE_4.system_setting_value),
    );
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/user/booking-info",
          error_function: "fetchBookingInfoInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <BookingInfoPage bookingFee={bookingFee} lateFee={lateFee} />;
};

export default Page;
