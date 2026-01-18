import { Database } from "./database";

export type ErrorTableRow = Database["public"]["Tables"]["error_table"]["Row"];
export type ErrorTableInsert = Database["public"]["Tables"]["error_table"]["Insert"];
export type ErrorTableUpdate = Database["public"]["Tables"]["error_table"]["Update"];

export type UserTableRow = Database["public"]["Tables"]["user_table"]["Row"];
export type UserTableInsert = Database["public"]["Tables"]["user_table"]["Insert"];
export type UserTableUpdate = Database["public"]["Tables"]["user_table"]["Update"];

export type AppointmentTableRow = Database["public"]["Tables"]["appointment_table"]["Row"];
export type AppointmentTableInsert = Database["public"]["Tables"]["appointment_table"]["Insert"];
export type AppointmentTableUpdate = Database["public"]["Tables"]["appointment_table"]["Update"];

export type AttachmentTableRow = Database["public"]["Tables"]["attachment_table"]["Row"];
export type AttachmentTableInsert = Database["public"]["Tables"]["attachment_table"]["Insert"];
export type AttachmentTableUpdate = Database["public"]["Tables"]["attachment_table"]["Update"];

export type ReminderTableRow = Database["public"]["Tables"]["reminder_table"]["Row"];
export type ReminderTableInsert = Database["public"]["Tables"]["reminder_table"]["Insert"];
export type ReminderTableUpdate = Database["public"]["Tables"]["reminder_table"]["Update"];

export type AppointmentDetailTableRow =
  Database["public"]["Tables"]["appointment_detail_table"]["Row"];
export type AppointmentDetailTableInsert =
  Database["public"]["Tables"]["appointment_detail_table"]["Insert"];
export type AppointmentDetailTableUpdate =
  Database["public"]["Tables"]["appointment_detail_table"]["Update"];

export type PaymentTableRow = Database["public"]["Tables"]["payment_table"]["Row"];
export type PaymentTableInsert = Database["public"]["Tables"]["payment_table"]["Insert"];
export type PaymentTableUpdate = Database["public"]["Tables"]["payment_table"]["Update"];

export type ScheduleSlotTableRow = Database["public"]["Tables"]["schedule_slot_table"]["Row"];
export type ScheduleSlotTableInsert = Database["public"]["Tables"]["schedule_slot_table"]["Insert"];
export type ScheduleSlotTableUpdate = Database["public"]["Tables"]["schedule_slot_table"]["Update"];

export type AppointmentTypeTableRow = Database["public"]["Tables"]["appointment_type_table"]["Row"];
export type AppointmentTypeTableInsert =
  Database["public"]["Tables"]["appointment_type_table"]["Insert"];
export type AppointmentTypeTableUpdate =
  Database["public"]["Tables"]["appointment_type_table"]["Update"];

export type GenderEnum = Database["public"]["Enums"]["gender"];
export type AppointmentStatusEnum = Database["public"]["Enums"]["appointment_status"];

export type AttachmentBucketType = "USER_AVATARS" | "NAIL_INSPO";

export type SettingsEnum = Database["public"]["Enums"]["settings"];
export type DaysEnum = Database["public"]["Enums"]["day"];

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
  reconstruction: string;
  inspo: File | null;
  scheduleDate: string;
  scheduleTime: string;
  scheduleNote: string | null;
  availableSlot: { value: string; label: string; note: string | null }[];
};

export type AppointmentType = AppointmentTableRow & {
  appointment_detail: AppointmentDetailTableRow;
  payment: PaymentTableRow;
};

export type PaymentMethod = "gcash" | "card";

export type AppointmentTableType = AppointmentTableRow & {
  appointment_detail: AppointmentDetailTableRow;
};

export type DashboardClientType = {
  total: number;
  appointment: { label: string; value: number }[];
  userData: {
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
};

export type DashboardTypeType = {
  total: number;
  type: { label: string; value: number }[];
  typeLabel: string;
};

export type MonthlySalesDataTypeWithTotal = {
  data: StackedBarChartDataType[];
  totalCount: number;
};

export type StackedBarChartDataType = {
  month: string;
  pending: number;
  scheduled: number;
  completed: number;
  cancelled: number;
};

export type ScheduleType = AppointmentTableRow & {
  appointment_user: UserTableRow;
};
