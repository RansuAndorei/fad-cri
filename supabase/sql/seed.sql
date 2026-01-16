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
(1, '<p>Come with <strong>clean, polish-free nails</strong>.</p>"'),
(2, '<p><strong>Sanitize your hands</strong> upon arrival.</p>'),
(3, '<p>Please <strong>do not cut, trim, file, or shape your nails</strong> beforehand — I will handle everything.</p>"'),
(4, '<p><strong>Avoid using lotion</strong> on the day of your appointment.</p>'),
(5, '<p><strong>No late arrivals</strong> — please respect our time as much as your own.</p>'),
(6, '<p><strong>One client at a time</strong>.</p>'),
(7, '<p><strong>Strictly no companions allowed.</strong></p>'),
(8, '<p><strong>Strictly no children allowed.</strong></p>'),
(9, '<p><strong>By appointment only.</strong></p>'),
(10, '<p><strong>3-day warranty</strong> on nail services.</p>'),
(11, '<p><strong>Remaining balance must be paid in cash only.</strong></p>');

INSERT INTO appointment_type_table (appointment_type_label) 
VALUES
('Soft Builder Gel (BIAB)'),
('Hard Builder Gel'),
('Gel-X (Soft-Gel Extensions)'),
('Polygel Overlay');

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