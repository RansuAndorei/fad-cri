import { SKIPPED_ERROR_MESSAGES } from "@/utils/constants";
import { Database } from "@/utils/database";
import {
  AttachmentBucketType,
  ErrorTableInsert,
  ScheduleRangeType,
  UserTableInsert,
} from "@/utils/types";
import { SupabaseClient } from "@supabase/supabase-js";
import Compressor from "compressorjs";
import { v4 } from "uuid";

export const insertError = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    errorTableInsert: ErrorTableInsert;
  },
) => {
  const { errorTableInsert } = params;
  if (SKIPPED_ERROR_MESSAGES.includes(errorTableInsert.error_message)) {
    return;
  }
  const { error } = await supabaseClient.from("error_table").insert(errorTableInsert);
  if (error) throw error;
};

export const getUserProfile = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    userId: string;
  },
) => {
  const { userId } = params;
  const { data, error } = await supabaseClient
    .from("user_table")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const uploadImage = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    image: Blob | File;
    bucket: AttachmentBucketType;
    fileName: string;
  },
) => {
  const { image, bucket, fileName } = params;

  let compressedImage: Blob;
  if (["image/jpeg", "image/png", "image/webp"].includes(image.type.toLocaleLowerCase())) {
    compressedImage = await new Promise((resolve, reject) => {
      new Compressor(image, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
        error(error) {
          reject(error);
        },
      });
    });
  } else {
    compressedImage = image;
  }

  const formattedFileName = `${fileName}-${v4()}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(bucket)
    .upload(formattedFileName, compressedImage, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(formattedFileName);

  return {
    fileName: formattedFileName,
    publicUrl: data.publicUrl,
  };
};

export const insertUser = async (
  supabaseClient: SupabaseClient<Database>,
  params: {
    userTableInsert: UserTableInsert;
  },
) => {
  const { userTableInsert } = params;
  const { data, error } = await supabaseClient
    .from("user_table")
    .insert(userTableInsert)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const fetchHours = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient.rpc("fetch_schedule_slot_time_range_per_day");
  if (error) throw error;
  return data as ScheduleRangeType[];
};

export const fetchGeneralLocation = async (supabaseClient: SupabaseClient<Database>) => {
  const { data, error } = await supabaseClient
    .from("system_setting_table")
    .select("system_setting_value")
    .eq("system_setting_key", "GENERAL_LOCATION")
    .single();
  if (error) throw error;
  return data.system_setting_value;
};
