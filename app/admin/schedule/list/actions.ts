import { FETCH_OPTION_LIMIT } from "@/utils/constants";
import { Database } from "@/utils/database";
import { SelectDataType } from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUserList = async (supabaseClient: SupabaseClient<Database>) => {
  let offset = 0;

  const userList: SelectDataType[] = [];
  while (true) {
    const { data, error } = await supabaseClient
      .from("user_table")
      .select("user_id, user_first_name, user_last_name")
      .order("user_first_name", { ascending: true })
      .order("user_last_name", { ascending: true })
      .range(offset, offset + FETCH_OPTION_LIMIT - 1);
    if (error) throw error;

    if (!data || data.length === 0) break;
    userList.push(
      ...data.map((user) => ({
        value: user.user_id,
        label: [user.user_first_name, user.user_last_name].join(" "),
      })),
    );
    if (data.length < FETCH_OPTION_LIMIT) break;
    offset += FETCH_OPTION_LIMIT;
  }
  return userList;
};
