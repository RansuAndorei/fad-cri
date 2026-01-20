import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ServiceTypeTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getServiceTypeSettings } from "./actions";
import ServiceTypeSettingsPage from "./components/ServiceTypeSettingsPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let serviceTypeData: ServiceTypeTableRow[];
  try {
    serviceTypeData = await getServiceTypeSettings(supabaseClient);
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/service-type",
          error_function: "fetchServiceTypeInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/500");
  }

  return <ServiceTypeSettingsPage serviceTypeData={serviceTypeData} />;
};

export default Page;
