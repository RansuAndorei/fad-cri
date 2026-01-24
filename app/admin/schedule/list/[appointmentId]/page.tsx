import { insertError } from "@/app/actions";
import { fetchSystemSettings } from "@/app/admin/settings/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentType, ScheduleSlotTableRow } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";

import { getAppointmentData } from "@/app/user/appointment/[appointmentId]/actions";
import { fetchScheduleSlot } from "@/app/user/booking/actions";
import AppointmentPage from "./components/AppointmentPage";

type Props = {
  params: Promise<{ appointmentId: string }>;
  searchParams?: Promise<{ status: string }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { appointmentId } = await params;
  const { status } = (await searchParams) ?? {};
  const supabaseClient = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let appointmentData: AppointmentType;
  let scheduleSlot: ScheduleSlotTableRow[] = [];
  let maxScheduleDateMonth: number;
  const serverTime = new Date().toISOString();
  try {
    const [appointment, scheduleSlotData, settingsData] = await Promise.all([
      getAppointmentData(supabaseClient, {
        appointmentId,
        userId: user.id,
        isCancelled: status === "cancelled",
      }),
      fetchScheduleSlot(supabaseClient),
      fetchSystemSettings(supabaseClient, { keyList: ["MAX_SCHEDULE_DATE_MONTH"] }),
    ]);
    appointmentData = appointment;
    scheduleSlot = scheduleSlotData;
    maxScheduleDateMonth = Number(settingsData.MAX_SCHEDULE_DATE_MONTH.system_setting_value);
  } catch (e) {
    if (isError(e)) {
      const pathname = `/user/appointment/${appointmentId}`;
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "getAdminAppointmentData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  if (!appointmentData) redirect("/400");

  return (
    <AppointmentPage
      appointmentData={appointmentData}
      serverTime={serverTime}
      scheduleSlot={scheduleSlot}
      maxScheduleDateMonth={maxScheduleDateMonth}
    />
  );
};

export default Page;
