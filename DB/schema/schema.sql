-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Activities;
DROP TABLE IF EXISTS Notes;
DROP TABLE IF EXISTS Leads;
DROP TABLE IF EXISTS Lead_Status;
DROP TABLE IF EXISTS Users;

-- 1. Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'sales_rep',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Lead_Status Table
CREATE TABLE Lead_Status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Leads Table
CREATE TABLE Leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    company VARCHAR(100),
    status_id INT NOT NULL,
    assigned_to INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leads_status FOREIGN KEY (status_id) REFERENCES Lead_Status(id) ON DELETE RESTRICT,
    CONSTRAINT fk_leads_assigned_to FOREIGN KEY (assigned_to) REFERENCES Users(id) ON DELETE SET NULL,
    CONSTRAINT fk_leads_created_by FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. Notes Table
CREATE TABLE Notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notes_lead FOREIGN KEY (lead_id) REFERENCES Leads(id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. Activities Table
CREATE TABLE Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_lead FOREIGN KEY (lead_id) REFERENCES Leads(id) ON DELETE CASCADE,
    CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_leads_status_id ON Leads(status_id);
CREATE INDEX idx_leads_assigned_to ON Leads(assigned_to);
CREATE INDEX idx_leads_created_by ON Leads(created_by);
CREATE INDEX idx_notes_lead_id ON Notes(lead_id);
CREATE INDEX idx_notes_author_id ON Notes(author_id);
CREATE INDEX idx_activities_lead_id ON Activities(lead_id);
CREATE INDEX idx_activities_user_id ON Activities(user_id);
CREATE INDEX idx_activities_due_date ON Activities(due_date);
