-- Create account table
CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(100) NOT NULL,
    account_lastname VARCHAR(100) NOT NULL,
    account_email VARCHAR(255) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL DEFAULT 'Client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample accounts
INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES 
('Admin', 'User', 'admin@cse340.com', '$2b$10$YourHashedPasswordHere', 'Admin'),
('Employee', 'User', 'employee@cse340.com', '$2b$10$YourHashedPasswordHere', 'Employee'),
('Basic', 'User', 'client@cse340.com', '$2b$10$YourHashedPasswordHere', 'Client')
ON CONFLICT (account_email) DO NOTHING;

-- Note: Replace '$2b$10$YourHashedPasswordHere' with actual bcrypt hashes
-- You can generate them using: bcrypt.hash('yourpassword', 10)