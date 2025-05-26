-- Insert User Accounts first
INSERT INTO user_account (id, email, password) VALUES
(2000, 'test@provider.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'),
(2001, 'test@home.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'),
(1000, 'john@plumbing.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'),
(1001, 'mike@electrical.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'),
(1002, 'sarah@garden.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'),
(1003, 'smith@home.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'), -- Changed from 1000 to 1003 for home owner Alex Smith
(1004, 'jones@home.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'), -- Changed from 1001 to 1004
(1005, 'brown@home.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW'); -- Changed from 1002 to 1005

-- Insert Admin User
INSERT INTO user_account (id, email, password) VALUES
(3000, 'admin@reno.com', '$2a$10$2jlp/NKHZ9IoBtLIyEG.iuXmguug5.TwKu0IE6HHqRAQ8rpeb1uGW');

INSERT INTO admin (id) VALUES
(3000);

-- Insert Test Service Provider (linked to user_account 2000)
INSERT INTO service_provider (id, address, phone_number, business_name)
VALUES 
(2000, '123 Test St, City', '555-0000', 'Test Provider');

-- Insert Test Home Owner (linked to user_account 2001)
INSERT INTO home_owner (id, address, phone_number, first_name, last_name)
VALUES 
(2001, '123 Test St, City', '555-0000', 'Test', 'User');

-- Insert Service Providers (linked to user_accounts 1000, 1001, 1002)
INSERT INTO service_provider (id, address, phone_number, business_name)
VALUES 
(1000, '123 Plumbing St, City', '555-0123', 'John Smith Plumbing'),
(1001, '456 Electric Ave, City', '555-0124', 'Mike Johnson Electrical'),
(1002, '789 Garden Rd, City', '555-0125', 'Sarah Williams Garden');

-- Insert Home Owners (linked to user_accounts 1003, 1004, 1005)
INSERT INTO home_owner (id, address, phone_number, first_name, last_name)
VALUES 
(1003, '101 Home St, City', '555-0001', 'Alex', 'Smith'),
(1004, '202 Home Ave, City', '555-0002', 'John', 'Jones'),
(1005, '303 Home Rd, City', '555-0003', 'Mary', 'Brown');

-- Insert Services (adding duration column back)
INSERT INTO service (id, name, description, type, price, location, service_provider_id, duration)
VALUES 
(1000, 'Basic Plumbing', 'Fix leaks and clogs', 'PLUMBING', 100, 'NORTH', 1000, 2),
(1001, 'Advanced Plumbing', 'Pipe installation and repair', 'PLUMBING', 200, 'SOUTH', 1000, 4),
(1002, 'Emergency Plumbing', '24/7 emergency service', 'PLUMBING', 300, 'WEST', 1000, 3),
(1003, 'Basic Electrical', 'Light fixture installation', 'ELECTRICAL', 150, 'EAST', 1001, 2),
(1004, 'Advanced Electrical', 'Circuit installation', 'ELECTRICAL', 250, 'MIDTOWN', 1001, 5),
(1005, 'Emergency Electrical', '24/7 emergency service', 'ELECTRICAL', 350, 'DOWNTOWN', 1001, 3),
(1006, 'Basic Gardening', 'Lawn mowing and basic maintenance', 'GARDENING', 80, 'SPARKS', 1002, 1),
(1007, 'Advanced Gardening', 'Landscaping and design', 'GARDENING', 180, 'NORTH', 1002, 3),
(1008, 'Full Garden Service', 'Complete garden maintenance', 'GARDENING', 280, 'SOUTH', 1002, 4);

-- Insert Bookings
-- Ensuring home_owner_id and service_provider_id match the updated user IDs
INSERT INTO booking (id, booking_date, status, service_id, home_owner_id, service_provider_id)
VALUES 
(1000, '2024-05-20 09:00:00', 'PENDING', 1000, 2001, 1000),
(1001, '2024-05-21 10:00:00', 'CONFIRMED', 1003, 1003, 1001),
(1002, '2024-05-22 11:00:00', 'PENDING', 1006, 1003, 1002),
(1003, '2024-05-23 13:00:00', 'CONFIRMED', 1001, 1004, 1000),
(1004, '2024-05-24 14:00:00', 'PENDING', 1004, 1004, 1001),
(1005, '2024-05-25 15:00:00', 'CONFIRMED', 1007, 1004, 1002),
(1006, '2024-05-26 16:00:00', 'PENDING', 1002, 1005, 1000),
(1007, '2024-05-27 17:00:00', 'CONFIRMED', 1005, 1005, 1001),
(1008, '2024-05-28 18:00:00', 'PENDING', 1008, 1005, 1002);

-- Insert reviews
-- Ensuring home_owner_id matches the updated user IDs
INSERT INTO review (id, rating, comment, home_owner_id, service_id) VALUES 
(1000, 5, 'Excellent service!', 1003, 1000),
(1001, 4, 'Very professional', 1004, 1003);

