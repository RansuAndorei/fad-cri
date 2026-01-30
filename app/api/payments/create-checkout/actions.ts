import { Database } from "@/utils/database";
import { AttachmentTableInsert, BookingFormValues, PaymentTableInsert } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const insertAppointment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    bookingData: Omit<BookingFormValues, "inspo">;
    inspoData: AttachmentTableInsert;
    userId: string;
    combinedDateAndTime: string;
  },
) => {
  const { bookingData, inspoData, userId, combinedDateAndTime } = params;
  const { removal, removalType, reconstruction } = bookingData;

  const { data, error } = await supabaseClient.rpc("insert_appointment", {
    input_data: {
      ...bookingData,
      inspoData,
      schedule: combinedDateAndTime,
      isWithRemoval: removal === "with",
      isRemovalDoneByFadCri: removalType === "fad",
      isWithReconstruction: reconstruction === "with",
      userId,
    },
  });
  if (error) throw error;

  return data;
};

export const insertPayment = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    paymentData: PaymentTableInsert;
  },
) => {
  const { paymentData } = params;
  const { error } = await supabaseClient.from("payment_table").insert(paymentData);
  if (error) throw error;
};
