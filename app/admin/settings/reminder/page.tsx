import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchReminders } from "./actions";
import RemindersPage from "./components/RemindersPage";
import { isAppError } from "@/utils/functions";

const Page = async () => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/");
  }

  let reminderList: { id: string; order: number; value: string }[] = [];
  try {
    const reminderData = await fetchReminders(supabaseClient);
    reminderList = reminderData.map((reminder) => ({
      id: reminder.reminder_id,
      order: reminder.reminder_order,
      value: reminder.reminder_value,
    }));
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: "/admin/settings/reminder",
          error_function: "fetchReminderInitialData",
          error_user_email: user.email,
          error_user_id: user.id,
        },
      });
    }
    redirect("/error/500");
  }

  return <RemindersPage reminderList={reminderList} />;
};

export default Page;
