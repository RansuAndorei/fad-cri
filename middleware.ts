import { SupabaseClient, User } from "@supabase/supabase-js";
import { isError } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { insertError } from "./app/actions";
import { Database } from "./utils/database";
import { createSupabaseServerClient } from "./utils/supabase/server";

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/log-in", "/sign-up"],
};

const adminEmailList =
  (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").split(",").map((e) => e.trim()) ?? [];

export async function middleware(request: NextRequest) {
  const supabaseClient = await createSupabaseServerClient();
  const pathname = request.nextUrl.pathname;

  let user: User | null = null;
  try {
    const {
      data: { user: supabaseUser },
    } = await supabaseClient.auth.getUser();
    user = supabaseUser;
  } catch (e) {
    logMiddlewareError(supabaseClient, e, pathname, "middleware-fetch-user");
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  try {
    if (pathname.startsWith("/user")) return handleUserRoute(supabaseClient, request, user);
    if (pathname.startsWith("/admin")) return handleAdminRoute(supabaseClient, request, user);
    return handleNoUserRoute(request, user);
  } catch (e) {
    logMiddlewareError(supabaseClient, e, pathname, "middleware-main", user);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

const handleUserRoute = async (
  supabaseClient: SupabaseClient<Database>,
  request: NextRequest,
  user: User | null,
) => {
  const pathname = request.nextUrl.pathname;
  const isFromBooking = pathname === "/user/booking-info";
  const isOnboarding = pathname === "/user/onboarding";

  if (!user) {
    return NextResponse.redirect(
      new URL(`/log-in${isFromBooking ? "?booking=true" : ""}`, request.url),
    );
  }

  const { data: userData, error } = await supabaseClient
    .from("user_table")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;

  // New user or not in DB → onboarding
  if (!userData)
    return isOnboarding
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/user/onboarding", request.url));

  // Prevent access to onboarding if user already exists
  if (isOnboarding) return NextResponse.redirect(new URL("/user/booking-info", request.url));

  // Admin user
  if (adminEmailList.includes(userData.user_email)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
};

const handleNoUserRoute = (request: NextRequest, user: User | null) => {
  if (user) return NextResponse.redirect(new URL("/user/booking-info", request.url));
  return NextResponse.next();
};

const handleAdminRoute = async (
  supabaseClient: SupabaseClient<Database>,
  request: NextRequest,
  user: User | null,
) => {
  if (!user?.email) return NextResponse.redirect(new URL("/log-in", request.url));
  if (!adminEmailList.length)
    return NextResponse.redirect(new URL("/user/onboarding", request.url));
  if (!adminEmailList.includes(user.email))
    return NextResponse.redirect(new URL("/user/booking-info", request.url));

  const { data: userData, error } = await supabaseClient
    .from("user_table")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!userData) return NextResponse.redirect(new URL("/user/onboarding", request.url));

  return NextResponse.next();
};

const logMiddlewareError = (
  supabaseClient: SupabaseClient<Database>,
  e: unknown,
  url: string,
  fnName: string,
  user?: User | null,
) => {
  if (isError(e)) {
    try {
      insertError(supabaseClient, {
        errorTableInsert: {
          error_message: e.message,
          error_url: url,
          error_function: fnName,
          error_user_email: user?.email,
          error_user_id: user?.id,
        },
      });
    } catch (e) {
      console.error("Failed to log middleware error", e);
    }
  }
};
