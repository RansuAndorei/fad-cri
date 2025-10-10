import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AppointmentType } from "@/utils/types";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getServerTime } from "../../booking/actions";
import { getAppointmentData } from "./actions";
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
  try {
    appointmentData = await getAppointmentData(supabaseClient, {
      appointmentId,
      userId: user.id,
      isCancelled: status === "cancelled",
    });
  } catch (e) {
    if (isError(e)) {
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
    redirect("/500");
  }
  const serverTime = await getServerTime(supabaseClient);

  return <AppointmentPage appointmentData={appointmentData} serverTime={serverTime} />;
};

export default Page;
