import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { updateAppointment, updatePayment } from "./actions";
import { isAppError } from "@/utils/functions";

export async function POST(req: Request) {
  const supabaseClient = await createSupabaseServerClient();
  const pathname = new URL(req.url).pathname;
  const payload = await req.json();

  try {
    const event = payload.data.attributes.type;
    const paymentId = payload.data.id;
    const attributes = payload.data.attributes.data.attributes;
    const paymentIntentId = attributes.payment_intent_id;

    if (event === "payment.paid") {
      const appointmentId = attributes.metadata.appointmentId;
      const datePaid = attributes.paid_at
        ? new Date(attributes.paid_at * 1000).toISOString()
        : null;

      await Promise.all([
        updatePayment(supabaseClient, {
          paymentData: {
            payment_status: "PAID",
            payment_external_id: paymentId,
            payment_date_paid: datePaid,
          },
          paymentIntentId,
        }),
        updateAppointment(supabaseClient, {
          appointmentData: {
            appointment_date_updated: new Date().toISOString(),
            appointment_status: "SCHEDULED",
          },
          appointmentId,
        }),
      ]);
    }

    if (event === "payment.failed") {
      await updatePayment(supabaseClient, {
        paymentData: {
          payment_status: "FAILED",
          payment_failure_message: attributes.failed_message ?? "Unknown error",
          payment_failure_code: attributes.failed_code ?? null,
        },
        paymentIntentId,
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (e) {
    if (isAppError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "webhook",
        },
      });
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
