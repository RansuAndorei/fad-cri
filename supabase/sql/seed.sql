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
(1, '<p>Come with <strong>clean, polish-free nails</strong>.</p>'),
(2, '<p><strong>Sanitize your hands</strong> upon arrival.</p>'),
(3, '<p>Please <strong>do not cut, trim, file, or shape your nails</strong> beforehand — I will handle everything.</p>'),
(4, '<p><strong>Avoid using lotion</strong> on the day of your appointment.</p>'),
(5, '<p><strong>No late arrivals</strong> — please respect our time as much as your own.</p>'),
(6, '<p><strong>One client at a time</strong>.</p>'),
(7, '<p><strong>Strictly no companions allowed.</strong></p>'),
(8, '<p><strong>Strictly no children allowed.</strong></p>'),
(9, '<p><strong>By appointment only.</strong></p>'),
(10, '<p><strong>3-day warranty</strong> on nail services.</p>'),
(11, '<p><strong>Remaining balance must be paid in cash only.</strong></p>');

INSERT INTO service_type_table (
  service_type_label,
  service_type_subtext,
  service_type_description,
  service_type_features,
  service_type_benefits,
  service_type_minimum_time_minutes,
  service_type_maximum_time_minutes,
  service_type_minimum_price,
  service_type_maximum_price,
  service_type_ideal_for_description
)
VALUES
(
  'Soft Builder Gel (BIAB)',
  'Build, strengthen, and beautify',
  'Builder in a Bottle is a soak-off builder gel designed to strengthen natural nails while maintaining a natural and elegant finish. Ideal for nail growth and repair.',
  ARRAY[
    'Strengthens natural nails',
    'Promotes healthy nail growth',
    'Soak-off formula',
    'Long-lasting wear (3-4 weeks)',
    'Repairs damaged nails'
  ],
  ARRAY[
    'Builds nail strength over time',
    'Protects nails while growing',
    'Natural-looking finish',
    'Flexible yet durable',
    'Helps repair weak spots'
  ],
  75,
  90,
  1500,
  2000,
  'Ideal for nail biters, those growing out damaged nails, or anyone wanting stronger, healthier natural nails.'
),
(
  'Hard Builder Gel',
  'Enhanced strength and durability',
  'A thicker builder gel application that adds structure and durability to natural nails. Perfect for clients who need extra strength without extensions.',
  ARRAY[
    'Added nail strength',
    'Thicker and more durable finish',
    'Natural nail enhancement',
    'Extended wear (3-4 weeks)',
    'Protects from breakage'
  ],
  ARRAY[
    'Reinforces weak nails',
    'Longer-lasting than regular gel',
    'Smoother nail surface',
    'Added thickness without tips',
    'Professional salon finish'
  ],
  60,
  75,
  1200,
  1500,
  'Great for clients with soft or brittle nails or anyone wanting extra durability without nail extensions.'
),
(
  'Gel-X (Soft-Gel Extensions)',
  'Instant length with a natural finish',
  'Soft gel extensions applied using full-cover gel tips for a lightweight, flexible, and natural-looking nail extension system.',
  ARRAY[
    'Soft gel tip system',
    'Natural-looking extensions',
    'Customizable length and shape',
    'Lightweight and flexible',
    'Damage-free application'
  ],
  ARRAY[
    'Instant nail length',
    'Natural feel and movement',
    'No drilling required',
    'Easy to maintain',
    'Long-lasting wear (3-4 weeks)'
  ],
  120,
  150,
  2500,
  3500,
  'Ideal for special occasions, clients wanting dramatic length, or those who prefer extensions over natural nails.'
),
(
  'Polygel Overlay',
  'Lightweight strength and protection',
  'A hybrid system combining the strength of acrylic with the flexibility of gel. Applied as an overlay for superior durability without added weight.',
  ARRAY[
    'Lighter than acrylic',
    'Stronger than gel',
    'No odor or fumes',
    'Flexible natural feel',
    'Long-wearing (4-5 weeks)'
  ],
  ARRAY[
    'Exceptional durability',
    'Comfortable lightweight wear',
    'Protects natural nails',
    'Minimal damage on removal',
    'Professional salon-quality finish'
  ],
  90,
  120,
  1800,
  2500,
  'Perfect for clients who want maximum durability with a natural feel or those transitioning from acrylic nails.'
);

INSERT INTO user_table (user_id, user_first_name, user_last_name, user_email, user_phone_number, user_gender, user_birth_date) VALUES
('554fa57b-00a6-457e-9361-287aa7694807', 'Admin', 'Admin', 'admin@gmail.com', '09999999999', 'MALE', '01-01-2000'),
('1d7645ed-3372-485e-9237-de3a8cd5fece', 'Dolor', 'Sit', 'dolorsit@gmail.com', '09123456789', 'FEMALE', '04-12-2000'),
('47dac5cd-cf2e-4e28-89d1-2f8ede52d30e', 'Jane', 'Doe', 'janedoe@gmail.com', '0956325784', 'FEMALE', '12-11-2001'),
('e2f572f7-1715-4ce8-9a1b-8c70fbaf3765', 'Lorem', 'Ipsum', 'loremipsum@gmail.com', '09659875121', 'FEMALE', '08-23-1999'),
('fa9d8410-f565-483b-ae21-e6ba882ee59c', 'John', 'Doe', 'johndoe@gmail.com', '09563269796', 'MALE', '06-29-2002');

INSERT INTO schedule_slot_table (schedule_slot_day, schedule_slot_time, schedule_slot_note) VALUES
('SUNDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SUNDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SUNDAY', '13:00:00+08', null),
('SUNDAY', '16:00:00+08', null),
('SUNDAY', '19:00:00+08', null),
('SUNDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('MONDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('MONDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('MONDAY', '13:00:00+08', null),
('MONDAY', '16:00:00+08', null),
('MONDAY', '19:00:00+08', null),
('MONDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('TUESDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('TUESDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('TUESDAY', '13:00:00+08', null),
('TUESDAY', '16:00:00+08', null),
('TUESDAY', '19:00:00+08', null),
('TUESDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('WEDNESDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('WEDNESDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('WEDNESDAY', '13:00:00+08', null),
('WEDNESDAY', '16:00:00+08', null),
('WEDNESDAY', '19:00:00+08', null),
('WEDNESDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('THURSDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('THURSDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('THURSDAY', '13:00:00+08', null),
('THURSDAY', '16:00:00+08', null),
('THURSDAY', '19:00:00+08', null),
('THURSDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('FRIDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('FRIDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('FRIDAY', '13:00:00+08', null),
('FRIDAY', '16:00:00+08', null),
('FRIDAY', '19:00:00+08', null),
('FRIDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('SATURDAY', '08:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SATURDAY', '10:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SATURDAY', '13:00:00+08', null),
('SATURDAY', '16:00:00+08', null),
('SATURDAY', '19:00:00+08', null),
('SATURDAY', '22:00:00+08', 'Please be advised that this schedule requires an additional payment of ₱1,000.');

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