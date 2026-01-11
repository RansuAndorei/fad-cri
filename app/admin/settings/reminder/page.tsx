import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { redirect } from "next/navigation";
import { getReminders } from "./action";
import RemindersPage from "./components/RemindersPage";

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
    const reminderData = await getReminders(supabaseClient);
    reminderList = reminderData.map((reminder) => ({
      id: reminder.reminder_id,
      order: reminder.reminder_order,
      value: reminder.reminder_value,
    }));
  } catch (e) {
    if (isError(e)) {
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
    redirect("/500");
  }

  return <RemindersPage reminderList={reminderList} />;
};

export default Page;
