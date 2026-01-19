CREATE OR REPLACE FUNCTION get_server_time()
RETURNS TIMESTAMPTZ
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
  input_is_with_reconstruction BOOLEAN := (input_data ->> 'isWithReconstruction')::BOOLEAN;
  input_schedule TIMESTAMPTZ := (input_data ->> 'schedule')::TIMESTAMPTZ;
  input_schedule_note TEXT := (input_data ->> 'scheduleNote')::TEXT;
  input_user_id UUID := (input_data ->> 'userId')::UUID;
  input_inspo_data JSONB := COALESCE(input_data -> 'inspoData', NULL);

  var_appointment_id UUID;
  var_appointment_detail_id UUID;
  var_inspo_attachment_id UUID;

  return_data UUID;
BEGIN
  INSERT INTO appointment_table
  (
    appointment_schedule,
    appointment_schedule_note,
    appointment_user_id
  )
  VALUES
  (
    input_schedule,
    input_schedule_note,
    input_user_id
  )
  RETURNING appointment_id
  INTO var_appointment_id;

  IF input_inspo_data IS NOT NULL AND input_inspo_data <> 'null'::JSONB THEN
    INSERT INTO attachment_table
    (
      attachment_name,
      attachment_path,
      attachment_bucket,
      attachment_mime_type,
      attachment_size
    )
    VALUES
    (
      input_inspo_data ->> 'attachment_name',
      input_inspo_data ->> 'attachment_path',
      input_inspo_data ->> 'attachment_bucket',
      input_inspo_data ->> 'attachment_mime_type',
      (input_inspo_data ->> 'attachment_size')::BIGINT
    )
    RETURNING attachment_id
    INTO var_inspo_attachment_id;
  END IF;

  INSERT INTO appointment_detail_table
  (
    appointment_detail_is_with_removal,
    appointment_detail_is_removal_done_by_fad_cri,
    appointment_detail_is_with_reconstruction,
    appointment_detail_type,
    appointment_detail_appointment_id,
    appointment_detail_inspo_attachment_id
  )
  VALUES
  (
    input_is_with_removal,
    input_is_removal_done_by_fad_cri,
    input_is_with_reconstruction,
    input_type,
    var_appointment_id,
    var_inspo_attachment_id
  )
  RETURNING appointment_detail_id
  INTO var_appointment_detail_id;

  return_data = var_appointment_id;
  RETURN return_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_appointment(input_data JSONB)
RETURNS JSONB
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
                FROM appointment_nail_design_table
                WHERE appointment_nail_design_appointment_detail_id = appointment_detail_id
              ),
              '[]'::JSONB
            )
          )
        FROM appointment_detail_table
        WHERE
          appointment_is_disabled = false
          AND appointment_detail_appointment_id = appointment_id
      ) AS appointment_detail,
      (
        SELECT TO_JSONB(payment_table.*)
        FROM payment_table
        WHERE payment_appointment_id = appointment_id
        ORDER BY payment_date_created DESC
        LIMIT 1
      ) AS payment
    FROM appointment_table
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
    UPDATE payment_table
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
                FROM appointment_nail_design_table
                WHERE appointment_nail_design_appointment_detail_id = appointment_detail_id
              ),
              '[]'::JSONB
            )
          )
        FROM appointment_detail_table
        WHERE
          appointment_is_disabled = false
          AND appointment_detail_appointment_id = appointment_id
      ) AS appointment_detail,
      (
        SELECT TO_JSONB(payment_table.*)
        FROM payment_table
        WHERE payment_appointment_id = appointment_id
        ORDER BY payment_date_created DESC
        LIMIT 1
      ) AS payment
    FROM appointment_table
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
AS $$
DECLARE
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;
  input_appointment_status_list appointment_status[] := ARRAY(
    SELECT jsonb_array_elements_text((input_data->'appointmentStatusList')::JSONB)
  );

  var_status appointment_status;
  var_status_count INTEGER;
  var_data JSONB := '[]'::JSONB;
  var_total_count INTEGER := 0;

  return_data JSONB;
BEGIN
  FOREACH var_status IN ARRAY input_appointment_status_list LOOP
    SELECT COUNT(*)
    INTO var_status_count
    FROM appointment_table
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
    FROM appointment_table
    INNER JOIN user_table
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
    FROM appointment_table
    INNER JOIN appointment_detail_table
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
AS $$
DECLARE
  input_month_ranges JSONB := input_data->'monthRanges';

  var_status_list TEXT[] := ARRAY['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];
  var_month JSONB;
  var_status appointment_status;
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
        FROM appointment_table
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
AS $$
DECLARE
  input_start_date TIMESTAMP := (input_data->>'startDate')::TIMESTAMP;
  input_end_date TIMESTAMP := (input_data->>'endDate')::TIMESTAMP;

  var_total_count INTEGER := 0;
BEGIN
  SELECT COUNT(*)
  INTO var_total_count
  FROM appointment_table
  WHERE
    appointment_is_disabled = FALSE
    AND appointment_date_created >= input_start_date
    AND appointment_date_created <= input_end_date;

  RETURN var_total_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_schedule(input_data JSONB)
RETURNS JSONB
AS $$
DECLARE
  input_start_date TIMESTAMPTZ := (input_data->>'startDate')::TIMESTAMPTZ;
  input_end_date TIMESTAMPTZ := (input_data->>'endDate')::TIMESTAMPTZ;

  return_data JSONB;
BEGIN
  WITH scheduleData AS (
    SELECT *
    FROM appointment_table
    INNER JOIN user_table
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

CREATE OR REPLACE FUNCTION upsert_reminders(input_data JSONB)
RETURNS VOID
AS $$
DECLARE
  input_reminder JSONB;
BEGIN
  DELETE FROM reminder_table WHERE true;

  FOR input_reminder IN 
    SELECT * FROM jsonb_array_elements(input_data->'reminders')
  LOOP
    INSERT INTO reminder_table (reminder_order, reminder_value)
    VALUES (
      (input_reminder->>'order')::INT,
      (input_reminder->>'value')::TEXT
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_system_settings(input_data JSONB)
RETURNS SETOF system_setting_table
AS $$
DECLARE
  return_data system_setting_table;
BEGIN
  FOR return_data IN
    WITH input_settings AS (
      SELECT
        (value->>'system_setting_key')::TEXT AS system_setting_key,
        (value->>'system_setting_value')::TEXT AS system_setting_value
      FROM JSONB_ARRAY_ELEMENTS(input_data->'settings')
    ),
    updated AS (
      UPDATE system_setting_table
      SET
        system_setting_value = input_settings.system_setting_value,
        system_setting_date_updated = NOW()
      FROM input_settings
      WHERE system_setting_table.system_setting_key = input_settings.system_setting_key
        AND system_setting_table.system_setting_value IS DISTINCT FROM input_settings.system_setting_value
      RETURNING system_setting_table.*
    )

    SELECT * FROM updated
    UNION ALL
    SELECT system_setting_table.*
    FROM system_setting_table
    JOIN input_settings
      ON system_setting_table.system_setting_key = input_settings.system_setting_key
    WHERE system_setting_table.system_setting_value IS NOT DISTINCT FROM input_settings.system_setting_value
  LOOP
    RETURN NEXT return_data;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION upsert_schedule_slot(input_data JSONB)
RETURNS VOID
AS $$
DECLARE
  var_slot JSONB;
  var_id UUID;
  var_day day;
  var_time TIME WITH TIME ZONE;
  var_note TEXT;
BEGIN
  DELETE FROM schedule_slot_table WHERE true;

  FOR var_slot IN
    SELECT * FROM JSONB_ARRAY_ELEMENTS(input_data->'scheduleSlots')
  LOOP
    var_id := (var_slot->>'schedule_slot_id')::UUID;
    var_day := (var_slot->>'schedule_slot_day')::day;
    var_time := (var_slot->>'schedule_slot_time')::TIME WITH TIME ZONE;
    var_note := var_slot->>'schedule_slot_note';

    INSERT INTO schedule_slot_table(schedule_slot_id, schedule_slot_day, schedule_slot_time, schedule_slot_note)
    VALUES (var_id, var_day, var_time, var_note);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fetch_schedule_slot_time_range_per_day()
RETURNS JSONB
AS $$
DECLARE
  return_data JSONB;
BEGIN
  WITH day_ranges AS (
    SELECT
      schedule_slot_day,
      MIN(schedule_slot_time) AS earliest_time,
      MAX(schedule_slot_time) AS latest_time,
      CASE schedule_slot_day
        WHEN 'SUNDAY' THEN 1
        WHEN 'MONDAY' THEN 2
        WHEN 'TUESDAY' THEN 3
        WHEN 'WEDNESDAY' THEN 4
        WHEN 'THURSDAY' THEN 5
        WHEN 'FRIDAY' THEN 6
        WHEN 'SATURDAY' THEN 7
      END AS day_order
    FROM schedule_slot_table
    GROUP BY schedule_slot_day
  )
  SELECT
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'days', days,
        'earliest_time', earliest_time,
        'latest_time', latest_time
      )
      ORDER BY min_day_order
    )
  INTO return_data
  FROM (
    SELECT
      ARRAY_AGG(schedule_slot_day ORDER BY day_order) AS days,
      earliest_time,
      latest_time,
      MIN(day_order) AS min_day_order
    FROM day_ranges
    GROUP BY earliest_time, latest_time
  ) grouped_ranges;

  RETURN return_data;
END;
$$ LANGUAGE plpgsql;
