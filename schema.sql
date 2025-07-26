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

CREATE TABLE user_table(
  user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
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
  error_id uuid DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY NOT NULL,
  error_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  error_message TEXT NOT NULL,
  error_url TEXT NOT NULL,
  error_function TEXT NOT NULL,
  error_user_email TEXT,

  error_user_id uuid REFERENCES user_table(user_id) ON DELETE CASCADE
);

CREATE TABLE email_resend_table(
  email_resend_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  email_resend_date_created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email_resend_email varchar(4000) NOT NULL
);

CREATE OR REPLACE FUNCTION get_email_resend_timer(input_data JSONB)
RETURNS INTEGER
AS $$
DECLARE
  input_email TEXT := input_data ->> 'email'::TEXT;

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

ALTER TABLE user_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_table DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_resend_table DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;