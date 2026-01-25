import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ServiceTypeTableRow } from "@/utils/types";
import { redirect } from "next/navigation";
import CreateServiceTypePage from "../../create/components/CreateServiceTypePage";
import { fetchServiceType } from "../actions";
import { isAppError } from "@/utils/functions";

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
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/service-type",
          error_function: "fetchEditServiceTypeInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <CreateServiceTypePage serviceTypeData={serviceTypeData} />;
};

export default Page;
