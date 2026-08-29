-- ==========================================
-- Mini CRM - SQL Test & Verification Queries
-- Purpose: Validate tables, relationships, and basic CRUD operations
-- ==========================================

-- ------------------------------------------
-- SECTION 1: Verification Queries (SELECT All)
-- ------------------------------------------

-- 1a. View all registered users
SELECT * FROM Users;

-- 1b. View all available lead statuses
SELECT * FROM Lead_Status;

-- 1c. View all lead records
SELECT * FROM Leads;

-- 1d. View all notes associated with leads
SELECT * FROM Notes;

-- 1e. View all scheduled and completed activities
SELECT * FROM Activities;


-- ------------------------------------------
-- SECTION 2: JOIN Queries (Relational Integrity Checks)
-- ------------------------------------------

-- 2a. Fetch leads with assigned user (Sales Rep) details
SELECT 
    l.id AS lead_id,
    CONCAT(l.first_name, ' ', l.last_name) AS lead_name,
    l.company,
    l.email AS lead_email,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_sales_rep,
    u.email AS rep_email
FROM Leads l
LEFT JOIN Users u ON l.assigned_to = u.id;

-- 2b. Fetch leads with their current status and status description
SELECT 
    l.id AS lead_id,
    CONCAT(l.first_name, ' ', l.last_name) AS lead_name,
    l.company,
    ls.status_name,
    ls.description AS status_description
FROM Leads l
JOIN Lead_Status ls ON l.status_id = ls.id;

-- 2c. Fetch notes along with lead and author details
SELECT 
    n.id AS note_id,
    CONCAT(l.first_name, ' ', l.last_name) AS lead_name,
    l.company,
    CONCAT(u.first_name, ' ', u.last_name) AS author_name,
    n.content AS note_content,
    n.created_at
FROM Notes n
JOIN Leads l ON n.lead_id = l.id
JOIN Users u ON n.author_id = u.id
ORDER BY n.created_at DESC;

-- 2d. Fetch activities along with lead info, assigned user, and status
SELECT 
    a.id AS activity_id,
    CONCAT(l.first_name, ' ', l.last_name) AS lead_name,
    l.company,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_user,
    a.activity_type,
    a.subject,
    a.due_date,
    a.completed
FROM Activities a
JOIN Leads l ON a.lead_id = l.id
JOIN Users u ON a.user_id = u.id
ORDER BY a.due_date ASC;


-- ------------------------------------------
-- SECTION 3: Basic CRUD Testing Queries
-- ------------------------------------------

-- 3a. CREATE: Insert a new test lead
INSERT INTO Leads (first_name, last_name, email, phone, company, status_id, assigned_to, created_by)
VALUES ('Test', 'Prospect', 'test.prospect@example.com', '+1-555-9999', 'Test Company Inc', 1, 2, 1);

-- 3b. READ: Count total leads grouped by status
SELECT 
    ls.status_name, 
    COUNT(l.id) AS total_leads
FROM Lead_Status ls
LEFT JOIN Leads l ON ls.id = l.status_id
GROUP BY ls.id, ls.status_name;

-- 3c. UPDATE: Change lead status from 'New' to 'Contacted' for the test lead
UPDATE Leads 
SET status_id = 2, updated_at = CURRENT_TIMESTAMP 
WHERE email = 'test.prospect@example.com';

-- 3d. DELETE: Safely remove the test lead record
DELETE FROM Leads 
WHERE email = 'test.prospect@example.com';
