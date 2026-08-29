-- ==========================================
-- Mini CRM - Seed Data Script (India Focused)
-- Populates demo data for learning SQL & testing
-- ==========================================

-- 1. Insert Users (1 Admin, 3 Sales Representatives)
INSERT INTO Users (id, first_name, last_name, email, password_hash, role) VALUES
(1, 'Rajesh', 'Sharma', 'rajesh.sharma@minicrm.in', '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M0hJ8D/J9Cq5zL4fG4G.9v6oJ7Sm', 'admin'),
(2, 'Priya', 'Patel', 'priya.patel@minicrm.in', '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M0hJ8D/J9Cq5zL4fG4G.9v6oJ7Sm', 'sales_rep'),
(3, 'Amit', 'Verma', 'amit.verma@minicrm.in', '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M0hJ8D/J9Cq5zL4fG4G.9v6oJ7Sm', 'sales_rep'),
(4, 'Neha', 'Sundaram', 'neha.sundaram@minicrm.in', '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M0hJ8D/J9Cq5zL4fG4G.9v6oJ7Sm', 'sales_rep');

-- 2. Insert Lead Statuses
INSERT INTO Lead_Status (id, status_name, description) VALUES
(1, 'New', 'Lead newly added to the CRM and pending initial outreach'),
(2, 'Contacted', 'Initial communication established with the prospect'),
(3, 'Qualified', 'Prospect requirements, budget, and timeline verified'),
(4, 'Won', 'Deal successfully closed and prospect converted'),
(5, 'Lost', 'Prospect declined offer or chose a competitor');

-- 3. Insert Leads
INSERT INTO Leads (id, first_name, last_name, email, phone, company, status_id, assigned_to, created_by) VALUES
(1, 'Rohan', 'Gupta', 'rohan.gupta@apextech.in', '+91 98765 43210', 'Apex Tech Solutions (Bengaluru)', 1, 2, 1),
(2, 'Ananya', 'Iyer', 'ananya.iyer@brightmedia.in', '+91 98123 45678', 'Bright Media Works (Mumbai)', 2, 2, 1),
(3, 'Vikram', 'Malhotra', 'vmalhotra@cloudnet.co.in', '+91 97111 22334', 'CloudNet Systems (Gurugram)', 3, 3, 1),
(4, 'Sunita', 'Rao', 'sunita.rao@deltacorp.in', '+91 99000 11223', 'Delta Corp Infra (Hyderabad)', 4, 3, 1),
(5, 'Aditya', 'Joshi', 'ajoshi@elevate.in', '+91 98450 98450', 'Elevate Global Logistics (Pune)', 5, 4, 1),
(6, 'Kavita', 'Reddy', 'kavita.reddy@firsttier.in', '+91 94400 55667', 'FirstTier Tech (Chennai)', 1, 4, 2),
(7, 'Deepak', 'Agarwal', 'dagarwal@greenfield.co.in', '+91 93100 22110', 'Greenfield Energy (Noida)', 2, 2, 2),
(8, 'Pooja', 'Deshmukh', 'pooja.d@horizonlabs.in', '+91 98220 33445', 'Horizon Labs (Ahmedabad)', 3, 3, 3),
(9, 'Suresh', 'Kumar', 'skumar@innovatelabs.in', '+91 99887 76655', 'Innovate Labs (Kolkata)', 4, 4, 3);

-- 4. Insert Notes
INSERT INTO Notes (id, lead_id, author_id, content) VALUES
(1, 1, 2, 'Lead registered via website inquiry form. Assigned to Priya for outreach.'),
(2, 2, 2, 'Spoke with Ananya via phone. Expressed strong interest in our enterprise tier.'),
(3, 2, 2, 'Sent GST-compliant product brochure and INR pricing proposal via email.'),
(4, 3, 3, 'Conducted discovery call with IT director. Tech budget approved for Q4 FY26.'),
(5, 3, 3, 'Sent formal proposal with dedicated SLA add-on.'),
(6, 4, 3, 'Annual contract signed by Sunita! Account onboarded smoothly in Hyderabad office.'),
(7, 5, 4, 'Prospect opted for a local competitor due to legacy on-premise server requirements.'),
(8, 6, 4, 'Inbound lead registered via marketing webinar on SaaS CRM trends in India.'),
(9, 7, 2, 'Left voicemail requesting a callback regarding Noida plant software requirements.'),
(10, 8, 3, 'Technical team requested live demo of UPI payment gateway & API integrations.'),
(11, 8, 3, 'Product demo completed smoothly with CTO and VP of Engineering in attendance.'),
(12, 9, 4, 'Final security audit passed. Annual subscription payment received via NEFT.');

-- 5. Insert Activities
INSERT INTO Activities (id, lead_id, user_id, activity_type, subject, description, due_date, completed) VALUES
(1, 1, 2, 'Call', 'Initial Discovery Call', 'Introduce Mini CRM services and assess requirements for Bengaluru team', '2026-08-26 10:00:00', FALSE),
(2, 2, 2, 'Email', 'Send Product Documentation', 'Send feature breakdown and Indian client case studies', '2026-08-24 14:30:00', TRUE),
(3, 2, 2, 'Follow-up', 'Check-in on Proposal', 'Follow up regarding pricing review with Mumbai management team', '2026-08-27 11:00:00', FALSE),
(4, 3, 3, 'Demo', 'Product Walkthrough Demo', 'Live presentation of admin dashboard and analytics to Gurugram team', '2026-08-23 15:00:00', TRUE),
(5, 3, 3, 'Meeting', 'Pricing & Legal Review', 'Review custom licensing terms with procurement team', '2026-08-28 09:30:00', FALSE),
(6, 4, 3, 'Meeting', 'Contract Kickoff Meeting', 'Onboarding alignment session with customer success team', '2026-08-22 16:00:00', TRUE),
(7, 5, 4, 'Email', 'Post-Mortem Feedback Request', 'Ask prospect for feedback regarding competitor selection', '2026-08-21 12:00:00', TRUE),
(8, 6, 4, 'Call', 'Cold Outreach Call', 'Initial call to qualify inbound webinar attendee from Chennai', '2026-08-26 14:00:00', FALSE),
(9, 7, 2, 'Call', 'Follow-up Call', 'Second call attempt following previous voicemail', '2026-08-25 16:30:00', TRUE),
(10, 8, 3, 'Demo', 'Technical Deep-Dive Demo', 'API architecture and integration walk-through with dev team in Ahmedabad', '2026-08-24 11:00:00', TRUE),
(11, 8, 3, 'Follow-up', 'Send Security Questionnaire', 'Provide completed SOC2 and security compliance documentation', '2026-08-27 15:30:00', FALSE),
(12, 9, 4, 'Email', 'Welcome & GST Invoice Receipt', 'Send welcome email with account credentials and tax invoice', '2026-08-20 10:00:00', TRUE);
