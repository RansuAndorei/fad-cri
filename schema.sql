DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION postgres;

DROP POLICY IF EXISTS objects_policy ON storage.objects;
DROP POLICY IF EXISTS buckets_policy ON storage.buckets;

DELETE FROM storage.objects;
DELETE FROM storage.buckets;

CREATE POLICY objects_policy ON storage.objects FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
CREATE POLICY buckets_policy ON storage.buckets FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

INSERT INTO storage.buckets(id, name) VALUES ('USER_AVATARS', 'USER_AVATARS');
UPDATE storage.buckets SET public = true;

CREATE TYPE gender AS ENUM(
  'MALE',
  'FEMALE',
  'OTHER'
);

CREATE TYPE appointment_status AS ENUM(
  'PENDING',
  'COMPLETED',
  'CANCELED'
);

CREATE TYPE payment_status AS ENUM(
  'PENDING',
  'COMPLETED',
  'CANCELED'
);


CREATE TYPE finger AS ENUM(
  'PINKY',
  'RING',
  'MIDDLE',
  'INDEX',
  'THUMB'
);

CREATE TYPE hand as ENUM(
  'LEFT',
  'RIGHT'
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

CREATE TABLE appointment_type_table(
  appointment_type_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_type_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  appointment_type_label TEXT NOT NULL
);

CREATE TABLE appointment_table(
  appointment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  appointment_date_updated TIMESTAMPTZ,
  appointment_schedule TIMESTAMPTZ NOT NULL,
  appointment_status appointment_status DEFAULT 'PENDING' NOT NULL,
  appointment_payment_status payment_status DEFAULT 'PENDING' NOT NULL,
  
  appointment_user_id UUID REFERENCES user_table(user_id) NOT NULL
);

CREATE TABLE appointment_detail_table(
  appointment_detail_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_detail_type TEXT NOT NULL,
  appointment_detail_is_with_removal BOOLEAN NOT NULL,
  appointment_detail_is_removal_done_by_fad_cri BOOLEAN DEFAULT FALSE NOT NULL,
  
  appointment_detail_appointment_id UUID UNIQUE REFERENCES appointment_table(appointment_id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE appointment_nail_design (
  appointment_nail_design_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_nail_design_hand hand NOT NULL,
  appointment_nail_design_finger finger NOT NULL,
  appointment_nail_design TEXT NOT NULL,

  appointment_nail_design_appointment_detail_id UUID REFERENCES appointment_detail_table(appointment_detail_id) NOT NULL,
  UNIQUE (appointment_nail_design_appointment_detail_id, appointment_nail_design_hand, appointment_nail_design_finger)
);

CREATE TABLE system_setting_table (
  system_setting_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  system_setting_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  system_setting_date_updated TIMESTAMPTZ,
  system_setting_key TEXT UNIQUE NOT NULL,
  system_setting_value TEXT NOT NULL
);

INSERT INTO system_setting_table (system_setting_key, system_setting_value)
VALUES ('BOOKING_FEE', '500.00');

CREATE OR REPLACE FUNCTION get_email_resend_timer(input_data JSONB)
RETURNS INTEGER
AS $$
DECLARE
  input_email TEXT := (input_data ->> 'email')::TEXT;

  var_email_resend_record RECORD;
  var_current_ts TIMESTAMPTZ;
  var_diff_in_seconds INTEGER;
  
  return_data INTEGER;
BEGIN
  SELECT *
  INTO var_email_resend_record
  FROM email_resend_table
  WHERE email_resend_email = email
  ORDER BY email_resend_date_created DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  var_current_ts := NOW();
  var_diff_in_seconds := EXTRACT(EPOCH FROM (var_current_ts - var_email_resend_record.email_resend_date_created));
  return_data := 60 - CEIL(var_diff_in_seconds);
  IF return_data <= 0 THEN
    RETURN 0;
  ELSE
    RETURN return_data;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_appointment(input_data JSONB)
RETURNS UUID
AS $$
DECLARE
  input_type TEXT := (input_data ->> 'type')::TEXT;
  input_is_with_removal BOOLEAN := (input_data ->> 'isWithRemoval')::BOOLEAN;
  input_is_removal_done_by_fad_cri BOOLEAN := (input_data ->> 'isRemovalDoneByFadCri')::BOOLEAN;
  input_schedule TIMESTAMPTZ := (input_data ->> 'schedule')::TIMESTAMPTZ;
  input_user_id UUID := (input_data ->> 'userId')::UUID;

  return_data UUID;
BEGIN
  INSERT INTO appointment_table
  (appointment_schedule, appointment_user_id)
  VALUES
  (input_schedule, input_user_id)
  RETURNING appointment_id
  INTO return_data;

  INSERT INTO appointment_detail_table
  (appointment_detail_is_with_removal, appointment_detail_is_removal_done_by_fad_cri, appointment_detail_type, appointment_detail_appointment_id)
  VALUES
  (input_is_with_removal, input_is_removal_done_by_fad_cri, input_type, return_data);

  return return_data;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE user_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_resend_table DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;