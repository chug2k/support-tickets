-- Create tickets table
CREATE TABLE tickets (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ticket_comments table
CREATE TABLE ticket_comments (
  id BIGSERIAL PRIMARY KEY,
  ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_customer_email ON tickets(customer_email);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);

-- Insert seed data for tickets
INSERT INTO tickets (title, description, status, priority, customer_email, customer_name, assigned_to) VALUES
  ('Login Issues', 'I am unable to log into my account. When I enter my credentials, I get an "Invalid password" error even though I know my password is correct.', 'open', 'high', 'john@example.com', 'John Smith', NULL),
  ('Feature Request: Dark Mode', 'It would be great to have a dark mode option for the application. My eyes get strained when using the app late at night.', 'open', 'low', 'sarah@example.com', 'Sarah Johnson', NULL),
  ('Payment Not Processing', 'My payment has been declined multiple times but my bank says there is no issue on their end. Transaction ID: TXN-12345', 'in_progress', 'high', 'mike@example.com', 'Mike Davis', 'Support Team'),
  ('How to Export Data', 'I would like to know how to export my data from the platform. I cannot find this option in the settings.', 'resolved', 'medium', 'emily@example.com', 'Emily Brown', 'Support Team'),
  ('Page Load Speed', 'The dashboard page takes a very long time to load. Sometimes it takes over 30 seconds. This is affecting my productivity.', 'in_progress', 'medium', 'david@example.com', 'David Wilson', 'Tech Team'),
  ('Mobile App Crash', 'The mobile app keeps crashing when I try to upload photos. This happens on both WiFi and mobile data.', 'open', 'high', 'lisa@example.com', 'Lisa Anderson', NULL),
  ('Documentation Error', 'The API documentation for the /users endpoint has incorrect parameter examples. The "role" field should be a string, not an array.', 'resolved', 'low', 'robert@example.com', 'Robert Taylor', 'Dev Team'),
  ('Notification Settings Not Saving', 'When I try to update my notification preferences, they revert back to the default settings after I log out and log back in.', 'open', 'medium', 'jennifer@example.com', 'Jennifer Martinez', NULL);

-- Insert seed comments
INSERT INTO ticket_comments (ticket_id, author_name, author_email, comment, is_staff) VALUES
  (3, 'Support Team', 'support@company.com', 'We have identified the issue with your payment gateway. Our team is working on a fix and we will update you within 24 hours.', TRUE),
  (3, 'Mike Davis', 'mike@example.com', 'Thank you for the quick response! Please let me know as soon as this is resolved.', FALSE),
  (4, 'Support Team', 'support@company.com', 'You can export your data by going to Settings > Privacy > Download Your Data. The export will be sent to your email within 48 hours.', TRUE),
  (4, 'Emily Brown', 'emily@example.com', 'Perfect, I found it! Thank you so much for your help.', FALSE),
  (5, 'Tech Team', 'tech@company.com', 'We are investigating the performance issues. Can you please share which browser and version you are using?', TRUE),
  (5, 'David Wilson', 'david@example.com', 'I am using Chrome version 120 on Windows 11.', FALSE),
  (7, 'Dev Team', 'dev@company.com', 'Thank you for reporting this! We have updated the documentation with the correct parameter types.', TRUE);
