import { insertError } from "@/app/actions";
import { ROW_PER_PAGE } from "@/utils/constants";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentTableType } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { fetchServiceType } from "../booking/actions";
import { getAppointmentList } from "./actions";
import AppointmentListPage from "./components/AppointmentListPage";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let initialAppointmentList: AppointmentTableType[] = [];
  let initialAppointmentListCount = 0;
  let serviceTypeOptions: string[] = [];

  try {
    const [{ data: appointmentListData, count: appointmentListCount }, serviceTypeData] =
      await Promise.all([
        getAppointmentList(supabaseClient, {
          page: 1,
          limit: ROW_PER_PAGE,
          sortStatus: {
            columnAccessor: "appointment_date_created",
            direction: "desc",
          },
          userId: user.id,
          type: null,
          status: null,
        }),
        fetchServiceType(supabaseClient),
      ]);

    initialAppointmentList = appointmentListData ?? [];
    initialAppointmentListCount = appointmentListCount ?? 0;
    serviceTypeOptions = serviceTypeData;
  } catch (e) {
    if (isError(e)) {
      const pathname = `/user/appointment`;
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "getAppointmentData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return (
    <AppointmentListPage
      initialAppointmentList={initialAppointmentList}
      initialAppointmentListCount={initialAppointmentListCount}
      serviceTypeOptions={serviceTypeOptions}
    />
  );
};
export default Page;
