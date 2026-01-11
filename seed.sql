CREATE OR REPLACE FUNCTION seed_appointment_data()
RETURNS VOID
AS $$
DECLARE
  var_counter INTEGER := 0;
  var_max_appointments INTEGER := 100;
  var_users UUID[] := ARRAY[
    '1d7645ed-3372-485e-9237-de3a8cd5fece',
    '47dac5cd-cf2e-4e28-89d1-2f8ede52d30e',
    'e2f572f7-1715-4ce8-9a1b-8c70fbaf3765',
    'fa9d8410-f565-483b-ae21-e6ba882ee59c'
  ];

  var_detail_types TEXT[] := ARRAY[
    'Soft Builder Gel (BIAB)',
    'Hard Builder Gel',
    'Gel-X (Soft-Gel Extensions)',
    'Polygel Overlay',
  ];

  var_statuses appointment_status[] := ARRAY['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];

  var_schedule TIMESTAMPTZ;
  var_created TIMESTAMPTZ;
  var_date DATE;
  var_hour_choice INTEGER;
  var_existing_count INTEGER;
  var_user UUID;
  var_detail_type TEXT;
  var_status appointment_status;
  var_is_with_removal BOOLEAN;
  var_is_removal_done_by_fad_cri BOOLEAN;
  var_appointment_id UUID;
  var_days_before INTEGER;
BEGIN
  WHILE var_counter < var_max_appointments LOOP
    -- Generate random date in 2025
    var_date := DATE '2025-01-01' + FLOOR(random() * 365)::INT;

    -- Randomly select one of 3 allowed times (12 PM, 3 PM, 6 PM)
    var_hour_choice := (ARRAY[12, 15, 18])[FLOOR(random() * 3 + 1)];

    -- Combine date and time in +8 timezone
    var_schedule := (var_date::TIMESTAMP + make_interval(hours => var_hour_choice)) AT TIME ZONE 'Asia/Manila';

    -- Check if schedule already exists
    SELECT COUNT(*) INTO var_existing_count
    FROM appointment_table
    WHERE appointment_schedule = var_schedule;

    -- Only insert if no conflict
    IF var_existing_count = 0 THEN
      var_user := var_users[FLOOR(random() * array_length(var_users, 1) + 1)];
      var_detail_type := var_detail_types[FLOOR(random() * array_length(var_detail_types, 1) + 1)];
      var_status := var_statuses[FLOOR(random() * array_length(var_statuses, 1) + 1)];
      var_is_with_removal := (random() > 0.5);
      var_is_removal_done_by_fad_cri := CASE WHEN var_is_with_removal THEN (random() > 0.5) ELSE FALSE END;

      -- Generate a random created date 1 to 60 days before schedule
      var_days_before := FLOOR(random() * 60 + 1);
      var_created := var_schedule - make_interval(days => var_days_before);

      INSERT INTO appointment_table (
        appointment_date_created,
        appointment_schedule,
        appointment_status,
        appointment_user_id
      )
      VALUES (
        var_created,
        var_schedule,
        var_status,
        var_user
      )
      RETURNING appointment_id INTO var_appointment_id;

      INSERT INTO appointment_detail_table (
        appointment_detail_type,
        appointment_detail_is_with_removal,
        appointment_detail_is_removal_done_by_fad_cri,
        appointment_detail_appointment_id
      )
      VALUES (
        var_detail_type,
        var_is_with_removal,
        var_is_removal_done_by_fad_cri,
        var_appointment_id
      );

      var_counter := var_counter + 1;
    END IF;
  END LOOP;

  RAISE NOTICE '✅ Inserted % new appointments without overlap.', var_counter;
END;
$$ LANGUAGE plpgsql;
