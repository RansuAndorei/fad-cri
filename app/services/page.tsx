import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ServiceTypeTableRow } from "@/utils/types";
import { redirect } from "next/navigation";
import { insertError } from "../actions";
import { getServiceTypeList } from "./actions";
import ServicesPage from "./components/ServicesPage";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let services: ServiceTypeTableRow[];
  try {
    services = await getServiceTypeList(supabaseClient);
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/services",
          error_function: "fetchServicesInitialData",
        },
      });
    }
    redirect("/error/500");
  }

  return <ServicesPage services={services} />;
};

export default Page;
