import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "./utils/database";
import { createSupabaseServerClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const supabaseClient = await createSupabaseServerClient();
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/user")) {
    return await userMiddleware(supabaseClient, request);
  } else {
    return await noUserMiddleware(supabaseClient, request);
  }
}

export const config = {
  matcher: ["/user/:path*", "/log-in", "/sign-up"],
};

const userMiddleware = async (supabaseClient: SupabaseClient<Database>, request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const isFromBooking = path.includes("booking");

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(`/log-in${isFromBooking ? "?booking=true" : ""}`, request.url),
    );
  }

  const { data: userData, error } = await supabaseClient
    .from("user_table")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const isOnboarding = path === "/user/onboarding";

  if (!userData || error) {
    if (!isOnboarding) {
      return NextResponse.redirect(new URL("/user/onboarding", request.url));
    }
  } else {
    if (isOnboarding) {
      return NextResponse.redirect(new URL("/user/booking-info", request.url));
    }
  }

  return NextResponse.next();
};

const noUserMiddleware = async (supabaseClient: SupabaseClient<Database>, request: NextRequest) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (user) {
    return NextResponse.redirect(new URL("/user/booking-info", request.url));
  }

  return NextResponse.next();
};
