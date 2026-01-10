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
  appointment_is_disabled BOOLEAN DEFAULT FALSE NOT NULL,
  appointment_schedule TIMESTAMPTZ NOT NULL,
  appointment_status appointment_status DEFAULT 'PENDING' NOT NULL,
  appointment_is_rescheduled BOOLEAN DEFAULT FALSE NOT NULL,
  
  appointment_user_id UUID REFERENCES user_table(user_id) NOT NULL
);

CREATE TABLE appointment_detail_table(
  appointment_detail_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  appointment_detail_type TEXT NOT NULL,
  appointment_detail_is_with_removal BOOLEAN NOT NULL,
  appointment_detail_is_removal_done_by_fad_cri BOOLEAN DEFAULT FALSE NOT NULL,

  appointment_detail_appointment_id UUID UNIQUE REFERENCES appointment_table(appointment_id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE appointment_nail_design_table(
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

CREATE TABLE reminder_table (
  reminder_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  reminder_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reminder_order INT NOT NULL,
  reminder_value TEXT NOT NULL
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
  payment_appointment_id UUID REFERENCES appointment_table(appointment_id) NOT NULL
);

CREATE TABLE schedule_slot_table (
  schedule_slot_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  schedule_slot_day day NOT NULL,
  schedule_slot_time TIME WITH TIME ZONE NOT NULL,

  UNIQUE(schedule_slot_day, schedule_slot_time)
);

CREATE OR REPLACE FUNCTION get_server_time()
RETURNS TIMESTAMPTZ
SET search_path TO ''
AS $$
BEGIN
  RETURN NOW();
END;
$$ LANGUAGE plpgsql;

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
  input_inspo_data JSONB := (input_data -> 'inspoData'):: JSONB;

  var_appointment_id UUID;
  var_appointment_detail_id UUID;
  var_inspo JSONB;

  return_data UUID;
BEGIN
  INSERT INTO appointment_table
  (
    appointment_schedule,
    appointment_user_id
  )
  VALUES
  (
    input_schedule,
    input_user_id
  )
  RETURNING appointment_id
  INTO var_appointment_id;

  INSERT INTO appointment_detail_table
  (
    appointment_detail_is_with_removal,
    appointment_detail_is_removal_done_by_fad_cri,
    appointment_detail_type,
    appointment_detail_appointment_id
  )
  VALUES
  (
    input_is_with_removal,
    input_is_removal_done_by_fad_cri,
    input_type,
    var_appointment_id
  )
  RETURNING appointment_detail_id
  INTO var_appointment_detail_id;

  FOR var_inspo IN
    SELECT * FROM JSONB_ARRAY_ELEMENTS(input_inspo_data)
  LOOP
    INSERT INTO appointment_nail_design_table
    (
      appointment_nail_design_hand,
      appointment_nail_design_finger,
      appointment_nail_design,
      appointment_nail_design_appointment_detail_id
    )
    VALUES
    (
      (var_inspo ->> 'hand')::hand,
      (var_inspo ->> 'finger')::finger,
      (var_inspo ->> 'imageUrl')::TEXT,
      var_appointment_detail_id
    );
  END LOOP;

  return_data = var_appointment_id;
  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_appointment_id UUID := (input_data->>'appointmentId')::UUID;
  input_user_id UUID := (input_data->>'userId')::UUID;
  input_is_cancelled BOOLEAN := (input_data->>'isCancelled')::BOOLEAN;

  var_latest_payment_id UUID;
  var_latest_payment_status TEXT;
  var_latest_payment_date TIMESTAMPTZ; 

  return_data JSONB;
BEGIN
  WITH base AS (
    SELECT
      appointment_table.*,
      (
        SELECT TO_JSONB(appointment_detail_table.*)
          || JSONB_BUILD_OBJECT(
            'appointment_nail_design',
            COALESCE(
              (
                SELECT JSONB_AGG(TO_JSONB(appointment_nail_design_table.*))
                FROM public.appointment_nail_design_table
                WHERE appointment_nail_design_appointment_detail_id = appointment_detail_id
              ),
              '[]'::JSONB
            )
          )
        FROM public.appointment_detail_table
        WHERE
          appointment_is_disabled = false
          AND appointment_detail_appointment_id = appointment_id
      ) AS appointment_detail,
      (
        SELECT TO_JSONB(payment_table.*)
        FROM public.payment_table
        WHERE payment_appointment_id = appointment_id
        ORDER BY payment_date_created DESC
        LIMIT 1
      ) AS payment
    FROM public.appointment_table
    WHERE
      appointment_is_disabled = false
      AND appointment_id = input_appointment_id
      AND appointment_user_id = input_user_id
  )
  SELECT TO_JSONB(base.*) INTO return_data FROM base;

  IF (return_data->'payment') IS NOT NULL THEN
    var_latest_payment_id := (return_data->'payment'->>'payment_id')::UUID;
    var_latest_payment_status := (return_data->'payment'->>'payment_status')::TEXT;
    var_latest_payment_date := (return_data->'payment'->>'payment_date_created')::TIMESTAMPTZ;
  END IF;

  IF (
    (input_is_cancelled AND var_latest_payment_status = 'PENDING')
    OR (var_latest_payment_status = 'PENDING' AND var_latest_payment_date <= NOW() - INTERVAL '5 minutes')
  ) THEN
    UPDATE public.payment_table
    SET payment_status = 'CANCELLED'
    WHERE payment_id = var_latest_payment_id;

    return_data := JSONB_SET(
      return_data,
      '{payment, payment_status}',
      '"CANCELLED"',
      false
    );
  END IF;

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment_by_admin(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_appointment_id UUID := (input_data->>'appointmentId')::UUID;

  var_latest_payment_id UUID;
  var_latest_payment_status TEXT;
  var_latest_payment_date TIMESTAMPTZ; 

  return_data JSONB;
BEGIN
  WITH base AS (
    SELECT
      appointment_table.*,
      (
        SELECT TO_JSONB(appointment_detail_table.*)
          || JSONB_BUILD_OBJECT(
            'appointment_nail_design',
            COALESCE(
              (
                SELECT JSONB_AGG(TO_JSONB(appointment_nail_design_table.*))
                FROM public.appointment_nail_design_table
                WHERE appointment_nail_design_appointment_detail_id = appointment_detail_id
              ),
              '[]'::JSONB
            )
          )
        FROM public.appointment_detail_table
        WHERE
          appointment_is_disabled = false
          AND appointment_detail_appointment_id = appointment_id
      ) AS appointment_detail,
      (
        SELECT TO_JSONB(payment_table.*)
        FROM public.payment_table
        WHERE payment_appointment_id = appointment_id
        ORDER BY payment_date_created DESC
        LIMIT 1
      ) AS payment
    FROM public.appointment_table
    WHERE
      appointment_is_disabled = false
      AND appointment_id = input_appointment_id
  )
  SELECT TO_JSONB(base.*) INTO return_data FROM base;

  IF (return_data->'payment') IS NOT NULL THEN
    var_latest_payment_id := (return_data->'payment'->>'payment_id')::UUID;
    var_latest_payment_status := (return_data->'payment'->>'payment_status')::TEXT;
    var_latest_payment_date := (return_data->'payment'->>'payment_date_created')::TIMESTAMPTZ;
  END IF;

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment_status_count(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;
  input_appointment_status_list public.appointment_status[] := ARRAY(
    SELECT jsonb_array_elements_text((input_data->'appointmentStatusList')::JSONB)
  );

  var_status public.appointment_status;
  var_status_count INTEGER;
  var_data JSONB := '[]'::JSONB;
  var_total_count INTEGER := 0;

  return_data JSONB;
BEGIN
  FOREACH var_status IN ARRAY input_appointment_status_list LOOP
    SELECT COUNT(*)
    INTO var_status_count
    FROM public.appointment_table
    WHERE
      appointment_is_disabled = false
      AND appointment_status = var_status
      AND appointment_date_created >= input_start_date
      AND appointment_date_created <= input_end_date;

    var_data := var_data || jsonb_build_array(
      jsonb_build_object(
        'label', var_status,
        'value', var_status_count
      )
    );

    var_total_count := var_total_count + var_status_count;
  END LOOP;

  return_data := jsonb_build_object(
    'data', var_data,
    'totalCount', var_total_count
  );

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_dashboard_client_list(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_offset INTEGER := (input_data->>'offset')::INTEGER;
  input_limit INTEGER := (input_data->>'limit')::INTEGER;
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;
  return_data JSONB;
BEGIN
  SELECT COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'appointment', JSONB_BUILD_ARRAY(
          JSONB_BUILD_OBJECT('label', 'PENDING', 'value', pending_count),
          JSONB_BUILD_OBJECT('label', 'SCHEDULED', 'value', scheduled_count),
          JSONB_BUILD_OBJECT('label', 'COMPLETED', 'value', completed_count),
          JSONB_BUILD_OBJECT('label', 'CANCELLED', 'value', cancelled_count)
        ),
        'total', client_count,
        'userData', JSONB_BUILD_OBJECT(
          'userId', appointment_user_id,
          'firstName', user_first_name,
          'lastName', user_last_name,
          'avatar', user_avatar
        )
      )
    ),
    '[]'::JSONB
  )
  INTO return_data
  FROM (
    SELECT
      appointment_user_id,
      COUNT(*) AS client_count,
      COUNT(*) FILTER (WHERE appointment_status = 'PENDING') AS pending_count,
      COUNT(*) FILTER (WHERE appointment_status = 'SCHEDULED') AS scheduled_count,
      COUNT(*) FILTER (WHERE appointment_status = 'COMPLETED') AS completed_count,
      COUNT(*) FILTER (WHERE appointment_status = 'CANCELLED') AS cancelled_count,
      user_first_name,
      user_last_name,
      user_avatar
    FROM public.appointment_table
    INNER JOIN public.user_table
      ON user_id = appointment_user_id
    WHERE
      appointment_is_disabled = FALSE
      AND appointment_date_created BETWEEN input_start_date AND input_end_date
    GROUP BY appointment_user_id, user_first_name, user_last_name, user_avatar
    ORDER BY COUNT(*) DESC
    OFFSET input_offset
    LIMIT input_limit
  ) AS sub;

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_dashboard_Type_list(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_offset INTEGER := (input_data->>'offset')::INTEGER;
  input_limit INTEGER := (input_data->>'limit')::INTEGER;
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;
  return_data JSONB;
BEGIN
  SELECT COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'type', JSONB_BUILD_ARRAY(
          JSONB_BUILD_OBJECT('label', 'PENDING', 'value', pending_count),
          JSONB_BUILD_OBJECT('label', 'SCHEDULED', 'value', scheduled_count),
          JSONB_BUILD_OBJECT('label', 'COMPLETED', 'value', completed_count),
          JSONB_BUILD_OBJECT('label', 'CANCELLED', 'value', cancelled_count)
        ),
        'total', type_count,
        'typeLabel', appointment_detail_type
      )
    ),
    '[]'::JSONB
  )
  INTO return_data
  FROM (
    SELECT
      COUNT(*) AS type_count,
      COUNT(*) FILTER (WHERE appointment_status = 'PENDING') AS pending_count,
      COUNT(*) FILTER (WHERE appointment_status = 'SCHEDULED') AS scheduled_count,
      COUNT(*) FILTER (WHERE appointment_status = 'COMPLETED') AS completed_count,
      COUNT(*) FILTER (WHERE appointment_status = 'CANCELLED') AS cancelled_count,
      appointment_detail_type
    FROM public.appointment_table
    INNER JOIN public.appointment_detail_table
      ON appointment_id = appointment_detail_appointment_id
    WHERE
      appointment_is_disabled = FALSE
      AND appointment_date_created BETWEEN input_start_date AND input_end_date
    GROUP BY appointment_detail_type
    ORDER BY COUNT(*) DESC
    OFFSET input_offset
    LIMIT input_limit
  ) AS sub;

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment_status_monthly_count(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_month_ranges JSONB := input_data->'monthRanges';

  var_status_list TEXT[] := ARRAY['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];
  var_month JSONB;
  var_status public.appointment_status;
  var_request_status_count INTEGER;
  var_status_data JSONB;
  var_monthly_data JSONB := '[]'::JSONB;
BEGIN
  FOR var_month IN SELECT * FROM jsonb_array_elements(input_month_ranges)
  LOOP
    DECLARE
      var_start_of_month TIMESTAMPTZ := (var_month->>'start_of_month')::TIMESTAMPTZ;
      var_end_of_month TIMESTAMPTZ := (var_month->>'end_of_month')::TIMESTAMPTZ;
      var_month_status_data JSONB := '{}'::JSONB;
    BEGIN
      FOREACH var_status IN ARRAY var_status_list
      LOOP
        SELECT COUNT(*)
        INTO var_request_status_count
        FROM public.appointment_table
        WHERE
          appointment_is_disabled = FALSE
          AND appointment_status = var_status
          AND appointment_date_created >= var_start_of_month
          AND appointment_date_created <= var_end_of_month;

        var_month_status_data := var_month_status_data || JSONB_BUILD_OBJECT(var_status, var_request_status_count);
      END LOOP;

      var_monthly_data := var_monthly_data || JSONB_BUILD_OBJECT(
        'month', var_start_of_month,
        'pending', (var_month_status_data->>'PENDING')::INTEGER,
        'scheduled', (var_month_status_data->>'SCHEDULED')::INTEGER,
        'completed', (var_month_status_data->>'COMPLETED')::INTEGER,
        'cancelled', (var_month_status_data->>'CANCELLED')::INTEGER
      );
    END;
  END LOOP;

  RETURN var_monthly_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment_total_count(input_data JSONB)
RETURNS INTEGER
SET search_path TO ''
AS $$
DECLARE
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;

  var_total_count INTEGER := 0;
BEGIN
  SELECT COUNT(*)
  INTO var_total_count
  FROM public.appointment_table
  WHERE
    appointment_is_disabled = FALSE
    AND appointment_date_created >= input_start_date
    AND appointment_date_created <= input_end_date;

  RETURN var_total_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_schedule(input_data JSONB)
RETURNS JSONB
SET search_path TO ''
AS $$
DECLARE
  input_start_date TIMESTAMPTZ := (input_data->>'startDate')::TIMESTAMPTZ;
  input_end_date TIMESTAMPTZ := (input_data->>'endDate')::TIMESTAMPTZ;

  return_data JSONB;
BEGIN
  WITH scheduleData AS (
    SELECT *
    FROM public.appointment_table
    INNER JOIN public.user_table
      ON user_id = appointment_user_id
      AND user_is_disabled = false
    WHERE
      appointment_is_disabled = false
      AND appointment_schedule >= input_start_date
      AND appointment_schedule <= input_end_date
      AND appointment_status IN ('SCHEDULED', 'COMPLETED')
    ORDER BY appointment_schedule
  )
  SELECT JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'appointment_id', appointment_id,
      'appointment_date_created', appointment_date_created,
      'appointment_date_updated', appointment_date_updated,
      'appointment_schedule', appointment_schedule,
      'appointment_status', appointment_status,
      'appointment_is_rescheduled', appointment_is_rescheduled,
      'appointment_user', JSONB_BUILD_OBJECT(
        'user_id', user_id,
        'user_first_name', user_first_name,
        'user_last_name', user_last_name,
        'user_email', user_email,
        'user_avatar', user_avatar
      )
    )
  )
  FROM scheduleData
  INTO return_data;

  RETURN COALESCE(return_data, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

ALTER TABLE user_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_resend_table DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;


INSERT INTO system_setting_table (system_setting_key, system_setting_value)
VALUES 
('BOOKING_FEE', '500'),
('MAX_SCHEDULE_DATE_MONTH', '3'),
('LATE_FEE_1', '300'),
('LATE_FEE_2', '500'),
('LATE_FEE_3', '1000'),
('LATE_FEE_4', '2000'),
('GENERAL_LOCATION', 'Obando, Bulacan'),
('SPECIFIC_ADDRESS', 'JCG Bldg., 2nd floor, Unit Door 1, P Sevilla St, Catanghalan, Obando, Bulacan'),
('PIN_LOCATION', 'https://www.google.com/maps/place/Yummy+Teh/@14.7055595,120.9367399,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b378a1ac62bb:0xa05ccd9d184857fa!8m2!3d14.7055544!4d120.9416108!16s%2Fg%2F11c6zymgqr?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D'),
('CONTACT_NUMBER', '09123456789');

INSERT INTO reminder_table (reminder_order, reminder_value)
VALUES
(1, 'Come with clean, polish-free nails.'),
(2, 'Sanitize your hands upon arrival.'),
(3, 'Please do not cut, trim, file, or shape your nails beforehand — I will handle everything.');

INSERT INTO appointment_type_table (appointment_type_label) 
VALUES
('Gel Polish'),
('Structured Gel Polish'),
('BIAB'),
('Polygel Overlay'),
('Gel-X Extension');

INSERT INTO user_table (user_id, user_first_name, user_last_name, user_email, user_phone_number, user_gender, user_birth_date) VALUES
('554fa57b-00a6-457e-9361-287aa7694807', 'Admin', 'Admin', 'admin@gmail.com', '09999999999', 'MALE', '01-01-2000'),
('1d7645ed-3372-485e-9237-de3a8cd5fece', 'Dolor', 'Sit', 'dolorsit@gmail.com', '09123456789', 'FEMALE', '04-12-2000'),
('47dac5cd-cf2e-4e28-89d1-2f8ede52d30e', 'Jane', 'Doe', 'janedoe@gmail.com', '0956325784', 'FEMALE', '12-11-2001'),
('e2f572f7-1715-4ce8-9a1b-8c70fbaf3765', 'Lorem', 'Ipsum', 'loremipsum@gmail.com', '09659875121', 'FEMALE', '08-23-1999'),
('fa9d8410-f565-483b-ae21-e6ba882ee59c', 'John', 'Doe', 'johndoe@gmail.com', '09563269796', 'MALE', '06-29-2002');

INSERT INTO schedule_slot_table (schedule_slot_day, schedule_slot_time) VALUES
('SUNDAY', '12:00:00+08'),
('SUNDAY', '15:00:00+08'),
('SUNDAY', '18:00:00+08'),

('MONDAY', '12:00:00+08'),
('MONDAY', '15:00:00+08'),
('MONDAY', '18:00:00+08'),

('TUESDAY', '12:00:00+08'),
('TUESDAY', '15:00:00+08'),
('TUESDAY', '18:00:00+08'),

('WEDNESDAY', '12:00:00+08'),
('WEDNESDAY', '15:00:00+08'),
('WEDNESDAY', '18:00:00+08'),

('THURSDAY', '12:00:00+08'),
('THURSDAY', '15:00:00+08'),
('THURSDAY', '18:00:00+08'),

('FRIDAY', '12:00:00+08'),
('FRIDAY', '15:00:00+08'),
('FRIDAY', '18:00:00+08'),

('SATURDAY', '12:00:00+08'),
('SATURDAY', '15:00:00+08'),
('SATURDAY', '18:00:00+08');