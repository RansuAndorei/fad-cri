DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION postgres;

DROP POLICY IF EXISTS objects_policy ON storage.objects;
DROP POLICY IF EXISTS buckets_policy ON storage.buckets;

DELETE FROM storage.objects;
DELETE FROM storage.buckets;

CREATE POLICY objects_policy ON storage.objects FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY buckets_policy ON storage.buckets FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

INSERT INTO storage.buckets(id, name) VALUES ('USER_AVATARS', 'USER_AVATARS');
INSERT INTO storage.buckets(id, name) VALUES ('NAIL_INSPO', 'NAIL_INSPO');
INSERT INTO storage.buckets(id, name) VALUES ('COMPLETED_NAILS', 'COMPLETED_NAILS');
UPDATE storage.buckets SET public = true;

CREATE TYPE gender AS ENUM(
  'MALE',
  'FEMALE',
  'OTHER'
);

CREATE TYPE appointment_status AS ENUM(
  'PENDING',
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'PAID',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE day AS ENUM (
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
);

CREATE TYPE settings AS ENUM (
  'BOOKING_FEE',
  'MAX_SCHEDULE_DATE_MONTH',
  'LATE_FEE_1',
  'LATE_FEE_2',
  'LATE_FEE_3',
  'LATE_FEE_4',
  'SPECIFIC_ADDRESS',
  'PIN_LOCATION',
  'CONTACT_NUMBER',
  'EMAIL'
);

CREATE TYPE faq_category AS ENUM (
  'GENERAL_INFORMATION',
  'BOOKING_AND_APPOINTMENTS',
  'PRICING_AND_PAYMENT',
  'SERVICES_AND_NAIL_CARE',
  'HEALTH_AND_SAFETY',
  'CONTACT_AND_SUPPORT'
);

CREATE TABLE attachment_table (
    attachment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    attachment_date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    attachment_is_disabled BOOLEAN DEFAULT false NOT NULL,

    attachment_name TEXT NOT NULL,
    attachment_path TEXT NOT NULL,
    attachment_bucket TEXT NOT NULL,
    attachment_mime_type TEXT,
    attachment_size BIGINT,

    UNIQUE (attachment_bucket, attachment_path)
);

CREATE TABLE user_table(
  user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_first_name TEXT NOT NULL,
  user_last_name TEXT NOT NULL,
  user_email TEXT UNIQUE NOT NULL,
  user_is_disabled boolean DEFAULT FALSE NOT NULL,
  user_phone_number TEXT NOT NULL,
  user_avatar TEXT,
  user_gender gender NOT NULL,
  user_birth_date DATE NOT NULL
);

CREATE TABLE error_table(
  error_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  error_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  error_message TEXT NOT NULL,
  error_url TEXT NOT NULL,
  error_function TEXT NOT NULL,
  error_user_email TEXT,

  error_user_id uuid REFERENCES user_table(user_id) ON DELETE CASCADE
);

CREATE TABLE email_resend_table(
  email_resend_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  email_resend_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email_resend_email TEXT NOT NULL
);

CREATE TABLE service_type_table(
  service_type_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  service_type_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  service_type_date_updated TIMESTAMPTZ,

  service_type_is_active BOOLEAN DEFAULT TRUE NOT NULL,
  service_type_is_disabled BOOLEAN DEFAULT FALSE NOT NULL,

  service_type_label TEXT NOT NULL,
  service_type_subtext TEXT NOT NULL,
  service_type_description TEXT NOT NULL,

  service_type_features TEXT[] NOT NULL,
  service_type_benefits TEXT[] NOT NULL,

  service_type_minimum_time_minutes INT NOT NULL,
  service_type_maximum_time_minutes INT NOT NULL,
  service_type_minimum_price INT NOT NULL,
  service_type_maximum_price INT NOT NULL,
  
  service_type_ideal_for_description TEXT NOT NULL
);

CREATE TABLE appointment_table(
  appointment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  appointment_date_updated TIMESTAMPTZ,
  appointment_is_disabled BOOLEAN DEFAULT FALSE NOT NULL,
  appointment_schedule TIMESTAMP NOT NULL,
  appointment_status appointment_status DEFAULT 'PENDING' NOT NULL,
  appointment_is_rescheduled BOOLEAN DEFAULT FALSE NOT NULL,
  appointment_schedule_note TEXT,
  
  appointment_user_id UUID REFERENCES user_table(user_id) NOT NULL
);

CREATE TABLE appointment_detail_table(
  appointment_detail_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_detail_type TEXT NOT NULL,
  appointment_detail_is_with_removal BOOLEAN NOT NULL,
  appointment_detail_is_removal_done_by_fad_cri BOOLEAN DEFAULT FALSE NOT NULL,
  appointment_detail_is_with_reconstruction BOOLEAN NOT NULL,

  appointment_detail_appointment_id UUID UNIQUE REFERENCES appointment_table(appointment_id) ON DELETE CASCADE NOT NULL,
  appointment_detail_inspo_attachment_id UUID REFERENCES attachment_table(attachment_id)
);

CREATE TABLE appointment_completion_table(
  appointment_completion_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_completion_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  appointment_completion_price INT NOT NULL,

  appointment_completion_appointment_id UUID UNIQUE REFERENCES appointment_table(appointment_id) ON DELETE CASCADE NOT NULL,
  appointment_completion_image_attachment_id UUID REFERENCES attachment_table(attachment_id)
);

CREATE TABLE system_setting_table (
  system_setting_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  system_setting_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  system_setting_date_updated TIMESTAMPTZ,
  system_setting_key settings NOT NULL,
  system_setting_value TEXT NOT NULL
);

CREATE TABLE reminder_table (
  reminder_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  reminder_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reminder_order INT NOT NULL,
  reminder_value TEXT NOT NULL
);

CREATE TABLE faq_table (
  faq_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  faq_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  faq_order INT NOT NULL,
  faq_category faq_category NOT NULL,
  faq_question TEXT NOT NULL,
  faq_answer TEXT NOT NULL
);

CREATE TABLE payment_table (
  payment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  payment_date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- PayMongo refs
  payment_intent_id TEXT,
  payment_external_id TEXT,
  payment_checkout_id TEXT,

  -- Status
  payment_status payment_status NOT NULL,

  -- Details
  payment_amount INTEGER NOT NULL,
  payment_currency TEXT NOT NULL DEFAULT 'PHP',
  payment_method TEXT NOT NULL,
  payment_description TEXT,

  -- URLs
  payment_checkout_url TEXT,

  -- Timestamps
  payment_date_paid TIMESTAMPTZ,
  
  -- Error
  payment_failure_message TEXT,
  payment_failure_code TEXT,

  -- Linking
  payment_appointment_id UUID REFERENCES appointment_table(appointment_id) ON DELETE CASCADE NOT NULL 
);

CREATE TABLE schedule_slot_table (
  schedule_slot_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  schedule_slot_day day NOT NULL,
  schedule_slot_time TIME NOT NULL,
  schedule_slot_note TEXT,

  UNIQUE(schedule_slot_day, schedule_slot_time)
);

CREATE TABLE blocked_schedule_table (
  blocked_schedule_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  blocked_schedule_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  blocked_schedule_date DATE NOT NULL,
  blocked_schedule_time TIME
);

ALTER TABLE user_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_resend_table DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;