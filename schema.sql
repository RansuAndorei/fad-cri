CREATE TYPE gender AS ENUM(
  'MALE',
  'FEMALE'
);

CREATE TABLE address_table(
  address_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  address_date_created timestamptz DEFAULT NOW() NOT NULL,
  address_region text NOT NULL,
  address_province text NOT NULL,
  address_city text NOT NULL,
  address_barangay text NOT NULL,
  address_street text NOT NULL,
  address_zip_code text NOT NULL
);

CREATE TABLE user_table(
  user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_date_created timestamptz DEFAULT NOW() NOT NULL,
  user_first_name text NOT NULL,
  user_last_name text NOT NULL,
  user_email text UNIQUE NOT NULL,
  user_is_disabled boolean DEFAULT FALSE NOT NULL,
  user_phone_number text,
  user_avatar text,
  user_gender gender,
  user_birth_date date,
  user_address_id uuid REFERENCES address_table(address_id)
);

CREATE TABLE error_table(
  error_id uuid DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  error_date_created timestamptz DEFAULT NOW() NOT NULL,
  error_message text NOT NULL,
  error_url text NOT NULL,
  error_function text NOT NULL,
  error_user_email text,
  error_user_id uuid REFERENCES user_table(user_id)
);

CREATE TABLE email_resend_table(
  email_resend_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  email_resend_date_created timestamptz DEFAULT NOW() NOT NULL,
  email_resend_email varchar(4000) NOT NULL
);

CREATE OR REPLACE FUNCTION get_email_resend_timer(input_data json)
  RETURNS json
  LANGUAGE plpgsql
  AS $$
DECLARE
  email text;
  email_resend_record RECORD;
  current_ts timestamptz;
  diff_in_seconds integer;
  timer integer;
BEGIN
  email := input_data ->> 'email';
  SELECT
    * INTO email_resend_record
  FROM
    email_resend_table
  WHERE
    email_resend_email = email
  ORDER BY
    email_resend_date_created DESC
  LIMIT 1;
  IF NOT FOUND THEN
    RETURN to_json(0);
  END IF;
  current_ts := now();
  diff_in_seconds := EXTRACT(EPOCH FROM (current_ts - email_resend_record.email_resend_date_created));
  timer := 60 - CEIL(diff_in_seconds);
  IF timer <= 0 THEN
    RETURN to_json(0);
  ELSE
    RETURN to_json(timer);
  END IF;
END;
$$;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;

GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;

GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON SCHEMA public TO public;

