import { insertError } from "@/app/actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isError } from "lodash";
import { NextResponse } from "next/server";
import { insertPayment } from "../create-checkout/actions";
export async function POST(req: Request) {
  const supabaseClient = await createSupabaseServerClient();
  const pathname = new URL(req.url).pathname;
  const { amount, method, appointmentId, userId, userEmail } = await req.json();

  try {
    const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

    const res = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                name: "Booking Fee",
                amount, // in centavos (500 pesos = 50000)
                currency: "PHP",
                quantity: 1,
              },
            ],
            payment_method_types: [method.toLowerCase()], // "gcash" or "card"
            description: "Booking Fee Payment",
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/appointment/${appointmentId}?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/appointment/${appointmentId}?status=cancelled`,
            metadata: {
              appointmentId,
            },
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    const checkoutUrl = data.data.attributes.checkout_url;
    const paymentIntentId = data.data.attributes.payment_intent.id;
    const checkoutSessionId = data.data.id;

    await insertPayment(supabaseClient, {
      paymentData: {
        payment_appointment_id: appointmentId,
        payment_intent_id: paymentIntentId,
        payment_checkout_id: checkoutSessionId,
        payment_amount: amount,
        payment_currency: "PHP",
        payment_method: method.toLowerCase(),
        payment_status: "PENDING",
        payment_description: "Booking Fee Payment",
        payment_checkout_url: checkoutUrl,
      },
    });

    return NextResponse.json({
      checkout_url: data.data.attributes.checkout_url,
      payment_intent_id: data.data.attributes.payment_intent.id,
    });
  } catch (e) {
    if (isError(e)) {
      await insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: pathname,
          error_function: "retry-checkout",
          error_user_email: userEmail,
          error_user_id: userId,
        },
      });
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
