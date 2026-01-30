import { TablerIcon } from "@tabler/icons-react";
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

export type ServiceTypeTableRow = Database["public"]["Tables"]["service_type_table"]["Row"];
export type ServiceTypeTableInsert = Database["public"]["Tables"]["service_type_table"]["Insert"];
export type ServiceTypeTableUpdate = Database["public"]["Tables"]["service_type_table"]["Update"];

export type BlockedScheduleTableRow = Database["public"]["Tables"]["blocked_schedule_table"]["Row"];
export type BlockedScheduleTableInsert =
  Database["public"]["Tables"]["blocked_schedule_table"]["Insert"];
export type BlockedScheduleTableUpdate =
  Database["public"]["Tables"]["blocked_schedule_table"]["Update"];

export type AppointmentCompletionTableRow =
  Database["public"]["Tables"]["appointment_completion_table"]["Row"];
export type AppointmentCompletionTableInsert =
  Database["public"]["Tables"]["appointment_completion_table"]["Insert"];
export type AppointmentCompletionTableUpdate =
  Database["public"]["Tables"]["appointment_completion_table"]["Update"];

export type FAQTableRow = Database["public"]["Tables"]["faq_table"]["Row"];
export type FAQTableInsert = Database["public"]["Tables"]["faq_table"]["Insert"];
export type FAQTableUpdate = Database["public"]["Tables"]["faq_table"]["Update"];

export type GenderEnum = Database["public"]["Enums"]["gender"];
export type AppointmentStatusEnum = Database["public"]["Enums"]["appointment_status"];

export type AttachmentBucketType = "USER_AVATARS" | "NAIL_INSPO" | "COMPLETED_NAILS";

export type SettingsEnum = Database["public"]["Enums"]["settings"];
export type DaysEnum = Database["public"]["Enums"]["day"];
export type FAQCategoryEnum = Database["public"]["Enums"]["faq_category"];

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
  appointment_detail: AppointmentDetailTableRow & {
    appointment_nail_design: AttachmentTableRow | null;
  };
  appointment_completion:
    | (AppointmentCompletionTableRow & {
        appointment_completion_image: AttachmentTableRow;
      })
    | null;
  payment: PaymentTableRow;
};

export type PaymentMethod = "gcash" | "card";

export type AppointmentTableType = AppointmentTableRow & {
  appointment_detail: AppointmentDetailTableRow;
  appointment_user: UserTableRow;
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

export type UserProfilePasswordType = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export type ScheduleRangeType = {
  days: DaysEnum[];
  earliest_time: string;
  latest_time: string;
};

export type SelectDataType = {
  value: string;
  label: string;
};

export type RescheduleScheduleType = {
  scheduleDate: string;
  scheduleTime: string;
};

export type CompleteScheduleType = {
  image: File | null;
  price: number;
};

export type FAQType = {
  id: string;
  category: string;
  icon?: TablerIcon;
  color: string;
  faqList: {
    question: string;
    answer: string;
  }[];
};

export type FAQSettingsType = FAQTableRow & {
  questionError?: string;
  answerError?: string;
};
