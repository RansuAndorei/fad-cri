import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getAppointmentType } from "./actions";
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
  try {
    appointmentTypeOptions = await getAppointmentType(supabaseClient);
  } catch (e) {
    if (isError(e)) {
      const pathname = "/user/booking";
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "getAppointmentType",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/500");
  }

  return <BookingPage appointmentTypeOptions={appointmentTypeOptions} />;
};

export default Page;
