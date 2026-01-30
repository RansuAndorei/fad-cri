import { insertError } from "@/app/actions";
import { fetchAppointmentList } from "@/app/user/appointment/actions";
import AppointmentListPage from "@/app/user/appointment/components/AppointmentListPage";
import { fetchServiceTypeList } from "@/app/user/booking/actions";
import { ROW_PER_PAGE } from "@/utils/constants";
import { isAppError } from "@/utils/functions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentTableType, SelectDataType } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchUserList } from "./actions";

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
  let userList: SelectDataType[] = [];
  try {
    const [{ data: appointmentListData, count: appointmentListCount }, serviceTypeData, userData] =
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
        fetchUserList(supabaseClient),
      ]);

    initialAppointmentList = appointmentListData ?? [];
    initialAppointmentListCount = appointmentListCount ?? 0;
    serviceTypeOptions = serviceTypeData.map((value) => value.service_type_label);
    userList = userData;
  } catch (e) {
    if (isAppError(e)) {
      const pathname = `/admin/schedule/list`;
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "fetchScheduleListInitialData",
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
      userList={userList}
    />
  );
};
export default Page;
