-- Insert sample users
INSERT INTO users (id, email, name) VALUES 
('user1', 'john@example.com', 'John Doe'),
('user2', 'jane@example.com', 'Jane Smith');

-- Insert sample packages
INSERT INTO packages (id, name, description, destination, duration, price, "imageUrl") VALUES 
('pkg1', 'Paris Romance Package', 'A romantic 5-day getaway to Paris including flights, luxury hotel, and romantic activities', 'Paris, France', 5, 2499.99, '/placeholder.svg?height=300&width=400'),
('pkg2', 'Tokyo Adventure', 'Explore Tokyo for 7 days with guided tours, traditional accommodations, and cultural experiences', 'Tokyo, Japan', 7, 3299.99, '/placeholder.svg?height=300&width=400'),
('pkg3', 'Bali Relaxation Retreat', 'Unwind in Bali with spa treatments, beachfront resort, and island excursions', 'Bali, Indonesia', 6, 1899.99, '/placeholder.svg?height=300&width=400');

-- Insert sample services
INSERT INTO services (id, type, name, description, price, metadata) VALUES 
-- Flights
('svc1', 'FLIGHT', 'NYC to Paris Flight', 'Round-trip flight from New York to Paris', 899.99, '{"origin": "NYC", "destination": "Paris", "airline": "Air France", "departure": "2024-06-15T08:00:00Z", "arrival": "2024-06-15T20:30:00Z", "flightNumber": "AF007"}'),
('svc2', 'FLIGHT', 'NYC to Tokyo Flight', 'Round-trip flight from New York to Tokyo', 1299.99, '{"origin": "NYC", "destination": "Tokyo", "airline": "JAL", "departure": "2024-07-01T14:00:00Z", "arrival": "2024-07-02T18:45:00Z", "flightNumber": "JL006"}'),
('svc3', 'FLIGHT', 'NYC to Bali Flight', 'Round-trip flight from New York to Bali', 1199.99, '{"origin": "NYC", "destination": "Bali", "airline": "Singapore Airlines", "departure": "2024-08-10T10:30:00Z", "arrival": "2024-08-11T22:15:00Z", "flightNumber": "SQ021"}'),

-- Lodging
('svc4', 'LODGING', 'Hotel Le Meurice Paris', 'Luxury hotel in the heart of Paris', 450.00, '{"hotelName": "Hotel Le Meurice", "location": "Paris, France", "checkIn": "2024-06-15", "checkOut": "2024-06-20", "roomType": "Deluxe Room", "nightlyPrice": 450.00}'),
('svc5', 'LODGING', 'Park Hyatt Tokyo', 'Modern luxury hotel in Shinjuku', 380.00, '{"hotelName": "Park Hyatt Tokyo", "location": "Tokyo, Japan", "checkIn": "2024-07-02", "checkOut": "2024-07-09", "roomType": "Park Room", "nightlyPrice": 380.00}'),
('svc6', 'LODGING', 'Four Seasons Bali', 'Beachfront resort with spa and pools', 320.00, '{"hotelName": "Four Seasons Resort Bali", "location": "Jimbaran, Bali", "checkIn": "2024-08-11", "checkOut": "2024-08-17", "roomType": "Ocean View Villa", "nightlyPrice": 320.00}'),

-- Activities
('svc7', 'ACTIVITY', 'Eiffel Tower Dinner', 'Romantic dinner at the Eiffel Tower restaurant', 180.00, '{"name": "Eiffel Tower Dinner", "description": "3-course dinner with champagne", "duration": "3 hours", "date": "2024-06-16", "location": "Eiffel Tower, Paris"}'),
('svc8', 'ACTIVITY', 'Tokyo Food Tour', 'Guided food tour through Tokyo neighborhoods', 120.00, '{"name": "Tokyo Food Tour", "description": "Taste authentic Japanese cuisine", "duration": "4 hours", "date": "2024-07-03", "location": "Shibuya & Harajuku, Tokyo"}'),
('svc9', 'ACTIVITY', 'Bali Spa Treatment', 'Traditional Balinese massage and spa day', 95.00, '{"name": "Balinese Spa Day", "description": "Full body massage and wellness treatments", "duration": "6 hours", "date": "2024-08-13", "location": "Ubud, Bali"}'),

-- Transport
('svc10', 'TRANSPORT', 'Paris Airport Transfer', 'Private transfer from CDG to hotel', 75.00, '{"type": "Private Car", "origin": "Charles de Gaulle Airport", "destination": "Hotel Le Meurice", "date": "2024-06-15", "provider": "Paris Luxury Transport"}'),
('svc11', 'TRANSPORT', 'Tokyo Rail Pass', '7-day unlimited JR Pass for Tokyo area', 280.00, '{"type": "Rail Pass", "origin": "Tokyo Area", "destination": "Tokyo Area", "date": "2024-07-02", "provider": "JR East"}'),
('svc12', 'TRANSPORT', 'Bali Private Driver', 'Full-day private driver service', 60.00, '{"type": "Private Driver", "origin": "Hotel", "destination": "Various Locations", "date": "2024-08-12", "provider": "Bali Tours & Transport"}');

-- Link services to packages
INSERT INTO package_services (id, "packageId", "serviceId") VALUES 
('ps1', 'pkg1', 'svc1'),
('ps2', 'pkg1', 'svc4'),
('ps3', 'pkg1', 'svc7'),
('ps4', 'pkg1', 'svc10'),
('ps5', 'pkg2', 'svc2'),
('ps6', 'pkg2', 'svc5'),
('ps7', 'pkg2', 'svc8'),
('ps8', 'pkg2', 'svc11'),
('ps9', 'pkg3', 'svc3'),
('ps10', 'pkg3', 'svc6'),
('ps11', 'pkg3', 'svc9'),
('ps12', 'pkg3', 'svc12');
