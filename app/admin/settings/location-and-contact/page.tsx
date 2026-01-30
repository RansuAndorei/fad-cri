import { insertError } from "@/app/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SettingsEnum } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchLocationAndContactSettings } from "./actions";
import LocationContactPage from "./components/LocationContactPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let locationAndContactData: Record<SettingsEnum, string>;
  try {
    locationAndContactData = await fetchLocationAndContactSettings(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/location-and-contact",
          error_function: "fetchLocationAndContactInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <LocationContactPage locationAndContactData={locationAndContactData} />;
};

export default Page;
