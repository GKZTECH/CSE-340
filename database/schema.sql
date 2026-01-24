-- Create classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(100) NOT NULL,
    inv_model VARCHAR(100) NOT NULL,
    inv_year CHAR(4) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    inv_price DECIMAL(10,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER REFERENCES classification(classification_id) ON DELETE CASCADE
);

-- Insert sample classifications
INSERT INTO classification (classification_name) VALUES 
('Sports Cars'),
('SUVs'),
('Trucks'),
('Sedans'),
('Electric');

-- Insert sample inventory items
INSERT INTO inventory (
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
) VALUES 
('Tesla', 'Model 3', '2023', 'Fully electric sedan with autopilot capabilities, sleek design, and advanced technology features.',
'/images/vehicles/tesla-model3.jpg', '/images/vehicles/tesla-model3-tn.jpg', 45999.00, 1500, 'Midnight Silver Metallic', 5),
('Ford', 'F-150', '2022', 'Powerful pickup truck with excellent towing capacity and advanced safety features.',
'/images/vehicles/ford-f150.jpg', '/images/vehicles/ford-f150-tn.jpg', 38999.00, 28000, 'Oxford White', 3),
('Toyota', 'RAV4', '2023', 'Compact SUV with hybrid option, spacious interior, and excellent fuel economy.',
'/images/vehicles/toyota-rav4.jpg', '/images/vehicles/toyota-rav4-tn.jpg', 32999.00, 5000, 'Lunar Rock', 2),
('Porsche', '911', '2023', 'Iconic sports car with exceptional performance and timeless design.',
'/images/vehicles/porsche-911.jpg', '/images/vehicles/porsche-911-tn.jpg', 115999.00, 2500, 'GT Silver Metallic', 1);