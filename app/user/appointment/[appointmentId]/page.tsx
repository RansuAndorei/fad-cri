import { insertError } from "@/app/actions";
import { fetchSystemSettings } from "@/app/admin/settings/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentType, ScheduleSlotTableRow } from "@/utils/types";
import { redirect } from "next/navigation";
import { fetchReminders, fetchScheduleSlot } from "../../booking/actions";
import { getAppointmentData } from "./actions";
import AppointmentPage from "./components/AppointmentPage";
import { isAppError } from "@/utils/functions";

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
  let reminderList: string[] = [];
  let scheduleSlot: ScheduleSlotTableRow[] = [];
  let maxScheduleDateMonth: number;
  const serverTime = new Date().toISOString();
  try {
    const [appointment, remindersData, scheduleSlotData, settingsData] = await Promise.all([
      getAppointmentData(supabaseClient, {
        appointmentId,
        userId: user.id,
        isCancelled: status === "cancelled",
      }),
      fetchReminders(supabaseClient),
      fetchScheduleSlot(supabaseClient),
      fetchSystemSettings(supabaseClient, { keyList: ["MAX_SCHEDULE_DATE_MONTH"] }),
    ]);
    appointmentData = appointment;
    reminderList = remindersData.map((value) => value.reminder_value);
    scheduleSlot = scheduleSlotData;
    maxScheduleDateMonth = Number(settingsData.MAX_SCHEDULE_DATE_MONTH.system_setting_value);
  } catch (e) {
    if (isAppError(e)) {
      const pathname = `/user/appointment/${appointmentId}`;
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
    <AppointmentPage
      appointmentData={appointmentData}
      serverTime={serverTime}
      reminderList={reminderList}
      scheduleSlot={scheduleSlot}
      maxScheduleDateMonth={maxScheduleDateMonth}
    />
  );
};

export default Page;
