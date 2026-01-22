import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ServiceTypeTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { insertError } from "../actions";
import { getServiceTypeList } from "./actions";
import ServicesPage from "./components/ServicesPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  let services: ServiceTypeTableRow[];
  try {
    services = await getServiceTypeList(supabaseClient);
  } catch (e) {
    if (isError(e)) {
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
