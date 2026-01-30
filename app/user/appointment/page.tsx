import { insertError } from "@/app/actions";
import { ROW_PER_PAGE } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentTableType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchServiceTypeList } from "../booking/actions";
import { fetchAppointmentList } from "./actions";
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
        fetchAppointmentList(supabaseClient, {
          page: 1,
          limit: ROW_PER_PAGE,
          sortStatus: {
            columnAccessor: "appointment_schedule",
            direction: "desc",
          },
          userId: user.id,
          type: null,
          status: null,
          user: null,
        }),
        fetchServiceTypeList(supabaseClient),
      ]);

    initialAppointmentList = appointmentListData ?? [];
    initialAppointmentListCount = appointmentListCount ?? 0;
    serviceTypeOptions = serviceTypeData.map((value) => value.service_type_label);
  } catch (e) {
    if (isAppError(e)) {
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
