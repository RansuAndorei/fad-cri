import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { fetchServiceLabelList, insertError } from "./actions";
import HomePage from "./components/HomePage/HomePage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let serviceList: string[];
  try {
    serviceList = await fetchServiceLabelList(supabaseClient);
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/",
          error_function: "fetchHomeInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return <HomePage serviceList={serviceList} />;
};

export default Page;
