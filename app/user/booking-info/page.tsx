import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getBookingInfoSystemSettings } from "./actions";
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
    const data = await getBookingInfoSystemSettings(supabaseClient);
    data.forEach((item) => {
      switch (item.system_setting_key) {
        case "BOOKING_FEE":
          bookingFee = Number(item.system_setting_value);
          break;
        case "LATE_FEE_1":
        case "LATE_FEE_2":
        case "LATE_FEE_3":
        case "LATE_FEE_4":
          lateFee.push(Number(item.system_setting_value));
          break;
      }
    });
    lateFee.sort((a, b) => a - b);
  } catch (e) {
    if (isError(e)) {
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
    redirect("/500");
  }

  return <BookingInfoPage bookingFee={bookingFee} lateFee={lateFee} />;
};

export default Page;
