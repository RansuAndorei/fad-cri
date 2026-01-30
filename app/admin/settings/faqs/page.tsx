import { insertError } from "@/app/actions";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { FAQSettingsType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchFAQs } from "./actions";
import FAQSettingsPage from "./components/FAQSettingsPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let faqList: FAQSettingsType[] = [];
  try {
    faqList = await fetchFAQs(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/faqs",
          error_function: "fetchFAQsInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <FAQSettingsPage faqList={faqList} />;
};

export default Page;
