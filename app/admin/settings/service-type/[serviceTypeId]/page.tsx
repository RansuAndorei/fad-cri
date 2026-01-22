import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ServiceTypeTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { fetchServiceType } from "./actions";
import ServiceTypePage from "./components/ServiceTypePage";

type Props = {
  params: Promise<{ serviceTypeId: string }>;
};

const Page = async ({ params }: Props) => {
  const { serviceTypeId } = await params;
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let serviceTypeData: ServiceTypeTableRow;
  try {
    serviceTypeData = await fetchServiceType(supabaseClient, { serviceTypeId: serviceTypeId });
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

  return <ServiceTypePage serviceTypeData={serviceTypeData} />;
};

export default Page;
