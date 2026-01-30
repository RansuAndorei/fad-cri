INSERT INTO system_setting_table (system_setting_key, system_setting_value)
VALUES 
('BOOKING_FEE', '500'),
('MAX_SCHEDULE_DATE_MONTH', '2'),
('LATE_FEE_1', '300'),
('LATE_FEE_2', '500'),
('LATE_FEE_3', '1000'),
('LATE_FEE_4', '2000'),
('SPECIFIC_ADDRESS', 'JCG Bldg., 2nd floor, Unit Door 1, P Sevilla St, Catanghalan, Obando, Bulacan'),
('PIN_LOCATION', 'https://www.google.com/maps/place/Yummy+Teh/@14.7055595,120.9367399,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b378a1ac62bb:0xa05ccd9d184857fa!8m2!3d14.7055544!4d120.9416108!16s%2Fg%2F11c6zymgqr?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D'),
('CONTACT_NUMBER', '09123456789'),
('EMAIL', 'fadcri@gmail.com');

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
('SUNDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SUNDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SUNDAY', '13:00:00', null),
('SUNDAY', '16:00:00', null),
('SUNDAY', '19:00:00', null),
('SUNDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('MONDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('MONDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('MONDAY', '13:00:00', null),
('MONDAY', '16:00:00', null),
('MONDAY', '19:00:00', null),
('MONDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('TUESDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('TUESDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('TUESDAY', '13:00:00', null),
('TUESDAY', '16:00:00', null),
('TUESDAY', '19:00:00', null),
('TUESDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('WEDNESDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('WEDNESDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('WEDNESDAY', '13:00:00', null),
('WEDNESDAY', '16:00:00', null),
('WEDNESDAY', '19:00:00', null),
('WEDNESDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('THURSDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('THURSDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('THURSDAY', '13:00:00', null),
('THURSDAY', '16:00:00', null),
('THURSDAY', '19:00:00', null),
('THURSDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('FRIDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('FRIDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('FRIDAY', '13:00:00', null),
('FRIDAY', '16:00:00', null),
('FRIDAY', '19:00:00', null),
('FRIDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),

('SATURDAY', '08:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SATURDAY', '10:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.'),
('SATURDAY', '13:00:00', null),
('SATURDAY', '16:00:00', null),
('SATURDAY', '19:00:00', null),
('SATURDAY', '22:00:00', 'Please be advised that this schedule requires an additional payment of ₱1,000.');

INSERT INTO faq_table (faq_order, faq_category, faq_question, faq_answer) VALUES
(1, 'GENERAL_INFORMATION', 'What services does FadCri offer?', 'FadCri specializes in professional nail services. All services are performed by our skilled nail technicians in a clean, relaxing environment. Visit the Services page for more details'),
(2, 'GENERAL_INFORMATION', 'Where is FadCri located?', 'We are located in ${SPECIFIC_ADDRESS}.'),
(3, 'GENERAL_INFORMATION', 'What are your operating hours?', 'We are open ${SCHEDULE_LIST}. Appointments are available throughout the day. Walk-ins are welcome subject to availability, but we highly recommend booking in advance.'),
(4, 'GENERAL_INFORMATION', 'Do I need to book an appointment?', 'Yes, we highly recommend booking an appointment through our website to secure your preferred time slot. This ensures we can provide you with our full attention and the best service possible.'),

(1, 'BOOKING_AND_APPOINTMENTS', 'How do I book an appointment?', 'Simply click the "Book an Appointment" button on our website, select your preferred service type, choose an available date and time slot, and complete your booking.'),
(2, 'BOOKING_AND_APPOINTMENTS', 'How far in advance can I book?', 'You can book appointments up to ${MAX_SCHEDULE_MONTH} months in advance. This allows you to plan ahead and secure your preferred dates, especially during busy seasons.'),
(3, 'BOOKING_AND_APPOINTMENTS', 'Can I reschedule my appointment?', 'Yes, you can reschedule your appointment through your account dashboard. Please note that changes made less than 24 hours before your appointment may be subject to fees.'),
(4, 'BOOKING_AND_APPOINTMENTS', 'What if I’m running late?', 'Please contact us as soon as possible if you’re running late. We have a 10-minute grace period. Beyond that, we may need to reschedule your appointment to accommodate other clients.'),
(5, 'BOOKING_AND_APPOINTMENTS', 'Do you accept walk-ins?', 'Walk-ins are welcome when we have availability, but appointments are prioritized. We recommend booking ahead to guarantee your spot and avoid waiting times.'),

(1, 'PRICING_AND_PAYMENT', 'How much do your services cost?', 'Pricing varies by service type. You can view detailed pricing for each service on the services page. Our prices are competitive and reflect our commitment to quality and hygiene.'),
(2, 'PRICING_AND_PAYMENT', 'Is there a booking fee?', 'Yes, there is a booking fee of ${BOOKING_FEE} to secure your appointment. This fee goes toward your total service cost and is non-refundable if you cancel.'),
(3, 'PRICING_AND_PAYMENT', 'What payment methods do you accept?', 'We accept cash and GCash. Payment is required at the time of service. The booking fee is paid online during reservation.'),
(4, 'PRICING_AND_PAYMENT', 'Are there late fees?', 'Yes, late fees apply based on how late you cancel or fail to show up for your appointment. Check our cancellation policy for specific fee amounts.'),
(5, 'PRICING_AND_PAYMENT', 'Do you offer discounts or packages?', 'We occasionally offer special promotions and package deals. Follow us on social media or check our website regularly for current offers and discounts.'),

(1, 'SERVICES_AND_NAIL_CARE', 'What’s the difference between Gel Polish and regular polish?', 'Gel Polish is cured under UV/LED light, providing a chip-resistant, glossy finish that lasts 2-3 weeks. Regular polish air-dries and typically lasts 5-7 days. Gel Polish is more durable and maintains its shine throughout wear.'),
(2, 'SERVICES_AND_NAIL_CARE', 'How long do gel nails last?', 'With proper care, gel manicures typically last 2-3 weeks without chipping. The longevity depends on your nail growth rate, daily activities, and how well you care for your nails.'),
(3, 'SERVICES_AND_NAIL_CARE', 'What is BIAB?', 'BIAB (Builder in a Bottle) is a soak-off hard gel that strengthens and protects your natural nails. It’s perfect for those looking to grow their nails or repair damaged nails while still having a beautiful manicure.'),
(4, 'SERVICES_AND_NAIL_CARE', 'Can I bring my own nail polish?', 'Yes, you’re welcome to bring your own nail polish! However, we cannot guarantee the longevity or quality of products not from our salon. We use premium, professional-grade products for best results.'),
(5, 'SERVICES_AND_NAIL_CARE', 'How should I prepare for my appointment?', 'Come with clean, dry nails. Remove any existing polish if possible. Avoid trimming your cuticles beforehand - we’ll take care of that. Keep your hands moisturized in the days leading up to your appointment.'),

(1, 'HEALTH_AND_SAFETY', 'How do you ensure hygiene and safety?', 'We follow strict sanitation protocols. All tools are sterilized between clients, we use disposable files and buffers, and our technicians wash and sanitize hands before each service. Your health and safety are our top priorities.'),
(2, 'HEALTH_AND_SAFETY', 'Are your products safe', 'Absolutely! We only use high-quality, reputable nail care brands that meet safety standards. All our products are regularly checked and replaced to ensure freshness and quality.'),
(3, 'HEALTH_AND_SAFETY', 'What if I have allergies or sensitive skin?', 'Please inform us about any allergies or skin sensitivities when booking or upon arrival. We can recommend suitable products or services and perform patch tests if needed.'),
(4, 'HEALTH_AND_SAFETY', 'Do you sanitize your tools?', 'Yes! All metal tools are sterilized in a hospital-grade autoclave. Disposable items like files and buffers are used once and discarded. Our workstations are thoroughly cleaned and sanitized between each client.'), 

(1, 'CONTACT_AND_SUPPORT', 'How can I contact FadCri?', 'You can reach us via phone at ${CONTACT_NUMBER}, email us through our website contact form, or visit us directly at our salon. We typically respond to inquiries within 24 hours.'),
(2, 'CONTACT_AND_SUPPORT', 'Can I leave feedback or reviews?', 'We love hearing from our clients! You can leave reviews on our Facebook page or Google Business listing. Your feedback helps us improve and helps others discover our services.'),
(3, 'CONTACT_AND_SUPPORT', 'What if I have a complaint?', 'We’re committed to your satisfaction. If you have any concerns, please contact us immediately. We’ll work with you to resolve any issues and ensure you have a positive experience.'),
(4, 'CONTACT_AND_SUPPORT', 'Do you have a loyalty program?', 'Stay tuned! We’re working on a rewards program for our regular clients. Follow us on social media for announcements about exclusive perks and benefits.');