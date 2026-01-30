import { insertError } from "@/app/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SettingsEnum } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchFinancialSettings } from "./actions";
import FinancialSettingsPage from "./components/FinancialSettingsPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let financialData: Record<SettingsEnum, string>;
  try {
    financialData = await fetchFinancialSettings(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/financial",
          error_function: "fetchFinancialInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <FinancialSettingsPage financialData={financialData} />;
};

export default Page;
