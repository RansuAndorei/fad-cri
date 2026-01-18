import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentTypeTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getAppointmentTypeSettings } from "./actions";
import AppointmentSettingsPage from "./components/AppointmentSettingsPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let appointmentTypeData: AppointmentTypeTableRow[];
  try {
    appointmentTypeData = await getAppointmentTypeSettings(supabaseClient);
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/appointment",
          error_function: "fetchAppointmentInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/500");
  }

  return <AppointmentSettingsPage appointmentTypeData={appointmentTypeData} />;
};

export default Page;
