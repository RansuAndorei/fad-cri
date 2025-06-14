import { Database } from "./database";

export type ErrorTableRow = Database["public"]["Tables"]["error_table"]["Row"];
export type ErrorTableInsert = Database["public"]["Tables"]["error_table"]["Insert"];
export type ErrorTableUpdate = Database["public"]["Tables"]["error_table"]["Update"];

export type UserTableRow = Database["public"]["Tables"]["user_table"]["Row"];
export type UserTableInsert = Database["public"]["Tables"]["user_table"]["Insert"];
export type UserTableUpdate = Database["public"]["Tables"]["user_table"]["Update"];

export type AddressTableRow = Database["public"]["Tables"]["address_table"]["Row"];
export type AddressTableInsert = Database["public"]["Tables"]["address_table"]["Insert"];
export type AddressTableUpdate = Database["public"]["Tables"]["address_table"]["Update"];

export type LogInFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  termsAndCondition: boolean;
};
