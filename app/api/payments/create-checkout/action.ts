import { Database } from "@/utils/database";
import { combineDateTime } from "@/utils/functions";
import { BookingFormValues } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertAppointment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    bookingData: Omit<BookingFormValues, "inspoLeft" | "inspoRight">;
    userId: string;
  },
) => {
  const { bookingData, userId } = params;
  const { scheduleDate, scheduleTime, removal, removalType } = bookingData;

  if (!scheduleDate) throw new Error("Missing Schedule Date.");
  const { data, error } = await supabaseClient.rpc("insert_appointment", {
    input_data: {
      ...bookingData,
      schedule: String(combineDateTime(new Date(scheduleDate), scheduleTime).toISOString()),
      isWithRemoval: removal === "with",
      isRemovalDoneByFadCri: removalType === "fad",
      userId,
    },
  });
  console.log("DATA:", data, error);
  if (error) throw error;

  return data;
};
