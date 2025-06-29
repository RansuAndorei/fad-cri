import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: UserLayoutProps) => {
  const supabaseClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    redirect("/log-in?booking=true");
  }
  return <>{children}</>;
};

export default Layout;
