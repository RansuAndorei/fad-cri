import { Database } from "./database";

export type ErrorTableRow = Database["public"]["Tables"]["error_table"]["Row"];
export type ErrorTableInsert = Database["public"]["Tables"]["error_table"]["Insert"];
export type ErrorTableUpdate = Database["public"]["Tables"]["error_table"]["Update"];

export type UserTableRow = Database["public"]["Tables"]["user_table"]["Row"];
export type UserTableInsert = Database["public"]["Tables"]["user_table"]["Insert"];
export type UserTableUpdate = Database["public"]["Tables"]["user_table"]["Update"];

export type GenderEnum = Database["public"]["Enums"]["gender"];

export type AttachmentBucketType = "USER_AVATARS";

export type LogInFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = LogInFormValues & {
  confirmPassword: string;
};

export type OnboardingFormValues = {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_gender: string;
  user_birth_date: Date | null;
  user_phone_number: string;
  user_avatar: File | null;
};

export type BookingFormValues = {
  type: string;
  removal: string;
  removalType: string;
  inspoLeft: (File | null)[];
  inspoRight: (File | null)[];
  scheduleDate: Date | null;
  scheduleTime: string;
};
