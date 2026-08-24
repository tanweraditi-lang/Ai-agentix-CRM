# Product Requirement Document (PRD)

**Project Name:** AI-Agentix Mini CRM  
**Document Type:** Product Requirement Document & System Architecture  
**Status:** Approved & Finalized  
**Version:** 1.0.0  

---

## 1. Modules

The **AI-Agentix Mini CRM** is structured into 6 core modules to provide a seamless sales management lifecycle:

### 1. Authentication Module
- **Login:** Secure email and password authentication with JWT/session token issuance.
- **Logout:** Session invalidation and token destruction.
- **User Access:** Role-based access control (RBAC) ensuring users access authorized features and assigned resources safely.

### 2. Dashboard Module
- **Overview of CRM Activities:** Real-time metrics overview displaying key performance indicators (KPIs).
- **Total Leads:** Metric display showing total active leads in the pipeline.
- **Total Customers:** Count of successfully converted active customers.
- **Pending Follow-ups:** Count and quick view of follow-ups scheduled for today or past due.
- **Recent Activities:** Audit log/feed displaying recent lead updates, customer conversions, and scheduled follow-ups.

### 3. Lead Management Module
- **Create Leads:** Input form to add new prospective leads into the system.
- **View Leads:** Searchable, filterable list and card grid of all existing leads.
- **Update Lead Details:** Ability to modify prospect contact details, company, and service interest.
- **Manage Lead Status:** Transition lead stage (e.g., New, Contacted, Qualified, In Negotiation, Converted, Lost).
- **Assign Leads:** Assign leads to designated team members or sales representatives.
- **Convert Leads into Customers:** One-click conversion mechanism to transfer qualified leads into official customer records.

### 4. Customer Management Module
- **Store Customer Details:** Centralized database storage of active customer profiles, purchased services, and historical data.
- **View Customer Information:** Clean presentation of detailed customer profiles, company affiliations, and purchase history.
- **Manage Customer Records:** Update and maintain accurate account details and status logs.

### 5. Follow-up Management Module
- **Schedule Follow-ups:** Calendar and time picker to schedule calls, emails, or meetings linked to a specific lead.
- **Track Upcoming Follow-ups:** Categorized tracking for Today, Upcoming, and Overdue tasks.
- **Add Notes:** Rich text commentary and notes attached to follow-up sessions.
- **Update Follow-up Status:** Mark follow-up activities as Pending, Completed, or Cancelled.

### 6. Settings Module
- **Profile Management:** Edit personal info (Name, Email, Job Title).
- **Password Change:** Secure password modification with current password verification.
- **Account Settings:** Global application preferences, notifications, and theme settings.

---

## 2. User Flow

The complete end-to-end user journey within **AI-Agentix Mini CRM** is defined as follows:

```
[Login] ──> [Dashboard] ──> [View Leads] ──> [Open Lead Details] ──> [Contact Lead] 
                                                                          │
[Settings] <── [Manage Customers] <── [Convert Lead into Customer] <── [Update Lead Status] <── [Schedule Follow-up]
    │
[Logout]
```

### Detailed Step Explanation:

1. **Login:** User navigates to the login screen, enters email/password credentials, passes authentication, and receives a session token.
2. **Dashboard:** Redirected to the executive overview page displaying key metrics (Total Leads, Customers, Pending Follow-ups, and Recent Activity Feed).
3. **View Leads:** User navigates to the Leads Page to view the sales pipeline, apply filters by status or assignment, and search for specific prospects.
4. **Open Lead Details:** User clicks on a lead row/card to view comprehensive prospect info, past notes, assigned user, and historical touchpoints.
5. **Contact Lead:** Sales representative initiates outreach (call/email) using recorded phone number or email address.
6. **Schedule Follow-up:** User logs an action or schedules a future touchpoint (date, time, notes) in the Follow-up section for that lead.
7. **Update Lead Status:** As conversations progress, the user updates lead status from `New` to `Contacted`, `Qualified`, or `Negotiation`.
8. **Convert Lead into Customer:** Upon closing a deal, the user triggers "Convert to Customer", transferring lead details and recorded service interested into a Customer entity with `Service Purchased`.
9. **Manage Customers:** User accesses the Customer Management page to view converted accounts, manage service details, and monitor customer retention.
10. **Settings:** User navigates to Settings to manage profile info, update security credentials, or adjust system configuration.
11. **Logout:** User logs out, safely clearing local authentication tokens and ending the active session.

---

## 3. Pages

| Page Name | Purpose | Main Features | User Actions |
|---|---|---|---|
| **Login Page** | Secure entry door for user authentication. | • Credential form<br>• Password visibility toggle<br>• Remember Me option<br>• Error alert banner | • Input email & password<br>• Click "Sign In"<br>• Reset forgotten password |
| **Dashboard Page** | Central command center for quick metrics & activity summary. | • KPI Summary Cards<br>• Pending Follow-ups Widget<br>• Recent Activity Stream<br>• Conversion Rate Charts | • View aggregated metrics<br>• Click widget links to jump to Leads/Follow-ups |
| **Leads Page** | Pipeline directory to browse and manage leads. | • Data table / Kanban view<br>• Search bar & filter pills<br>• "Add Lead" modal button<br>• Quick actions (Edit, Delete, Convert) | • Filter/Search leads<br>• Create new lead<br>• Click lead to open detail view<br>• Quick status change |
| **Lead Details Page** | Single source of truth for an individual lead's profile. | • Contact Info header<br>• Activity timeline<br>• Follow-ups scheduling widget<br>• "Convert to Customer" button | • Edit lead profile<br>• Assign to user<br>• Log notes & schedule follow-ups<br>• Trigger customer conversion |
| **Customers Page** | Directory of active paying clients. | • Customer directory table<br>• Purchased services filter<br>• Account summary metrics<br>• Search & export tools | • Browse customer list<br>• View customer profile details<br>• Update service purchased |
| **Follow-ups Page** | Calendar & list planner for sales reminders. | • Filter tabs (Overdue, Today, Upcoming, Completed)<br>• Time & date schedule picker<br>• Notes editor | • Schedule new follow-up<br>• Mark task as completed<br>• Edit notes & re-schedule |
| **Settings Page** | Account configuration & preferences hub. | • Profile Information form<br>• Change Password card<br>• Preferences & Notifications toggles | • Update user profile info<br>• Change password<br>• Toggle theme/notifications |

---

## 4. Database Entities

### 1. User Entity
Represents internal CRM users / sales representatives.
- **Fields:**
  - `User ID` (UUID / Primary Key)
  - `Name` (String, Required)
  - `Email` (String, Unique, Required)
  - `Password` (String, Hashed, Required)
  - `Role` (Enum: `Admin`, `Manager`, `Sales Rep`)

### 2. Lead Entity
Represents potential prospective clients in the sales funnel.
- **Fields:**
  - `Lead ID` (UUID / Primary Key)
  - `Name` (String, Required)
  - `Email` (String, Required)
  - `Phone` (String)
  - `Company` (String)
  - `Service Interested` (String, Required)
  - `Status` (Enum: `New`, `Contacted`, `Qualified`, `In Negotiation`, `Converted`, `Lost`)
  - `Assigned User` (Foreign Key referencing `User ID`)

### 3. Customer Entity
Represents closed clients converted from successful leads.
- **Fields:**
  - `Customer ID` (UUID / Primary Key)
  - `Name` (String, Required)
  - `Email` (String, Required)
  - `Phone` (String)
  - `Company` (String)
  - `Service Purchased` (String, Required)

### 4. Follow-up Entity
Represents scheduled outreach tasks and touchpoints associated with leads.
- **Fields:**
  - `Follow-up ID` (UUID / Primary Key)
  - `Lead ID` (Foreign Key referencing `Lead ID`)
  - `Date` (Date, Required)
  - `Time` (Time / String, Required)
  - `Notes` (Text)
  - `Status` (Enum: `Pending`, `Completed`, `Cancelled`)

### Entity Relationships:

```
+------------+          1 : N          +------------+
|    User    | -----------------------<|    Lead    |
+------------+                         +------------+
      |                                      |      |
      | 1 : N                                | 1 : N| 1 : 1 (on conversion)
      v                                      v      v
+------------+                         +------------+     +--------------+
| Follow-up  |<------------------------| Follow-up  |     |   Customer   |
+------------+                         +------------+     +--------------+
```

- **User to Lead (1 : N):** One User can be assigned to multiple Leads. A Lead is assigned to one User.
- **Lead to Follow-up (1 : N):** One Lead can have multiple scheduled Follow-ups over time.
- **User to Follow-up (1 : N):** One User can create and manage multiple Follow-up tasks.
- **Lead to Customer (1 : 1 Conversion):** When a Lead is successfully closed and converted, a corresponding Customer entity record is created mapping the prospect details and purchased service.

---

## 5. API List

### Authentication
- `POST /login`
  - Request: `{ email, password }`
  - Response: `{ token, user }`
- `POST /logout`
  - Request: `{}`
  - Response: `{ message }`

### Dashboard
- `GET /dashboard`
  - Request: `None`
  - Response: `{ totalLeads, totalCustomers, pendingFollowups, recentActivities }`

### Leads
- `GET /leads`
  - Request: Query params `(?status=&search=&assignedUser=)`
  - Response: `{ leads: [...] }`
- `GET /leads/:id`
  - Request: `Params: id`
  - Response: `{ lead: { ... }, followups: [...] }`
- `POST /leads`
  - Request: `{ name, email, phone, company, serviceInterested, assignedUser }`
  - Response: `{ lead }`
- `PUT /leads/:id`
  - Request: `{ name, email, phone, company, serviceInterested, status, assignedUser }`
  - Response: `{ lead }`
- `DELETE /leads/:id`
  - Request: `Params: id`
  - Response: `{ message }`

### Customers
- `GET /customers`
  - Request: Query params `(?search=)`
  - Response: `{ customers: [...] }`
- `GET /customers/:id`
  - Request: `Params: id`
  - Response: `{ customer }`
- `POST /customers`
  - Request: `{ name, email, phone, company, servicePurchased }`
  - Response: `{ customer }`
- `PUT /customers/:id`
  - Request: `{ name, email, phone, company, servicePurchased }`
  - Response: `{ customer }`

### Follow-ups
- `GET /followups`
  - Request: Query params `(?leadId=&status=)`
  - Response: `{ followups: [...] }`
- `POST /followups`
  - Request: `{ leadId, date, time, notes, status }`
  - Response: `{ followup }`
- `PUT /followups/:id`
  - Request: `{ date, time, notes, status }`
  - Response: `{ followup }`
- `DELETE /followups/:id`
  - Request: `Params: id`
  - Response: `{ message }`

---

## 6. Folder Structure

```
AI-Agentix-Mini-CRM/
├── frontend/                              # Client SPA Application
│   ├── components/                        # UI Components
│   │   ├── common/                        # Buttons, Inputs, Modals, Badges
│   │   ├── layout/                        # Sidebar, Header, PageWrapper
│   │   └── modules/                       # Module Components (LeadTable, StatCard, etc.)
│   ├── pages/                         # Route Pages
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LeadsPage.jsx
│   │   ├── LeadDetailsPage.jsx
│   │   ├── CustomersPage.jsx
│   │   ├── FollowupsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/                          # API Integrations
│   │   ├── api.js                         # Axios Client
│   │   ├── authService.js
│   │   ├── leadService.js
│   │   ├── customerService.js
│   │   └── followupService.js
│   ├── hooks/                             # React Hooks (useAuth, useLeads)
│   ├── assets/                            # Brand Assets & Icons
│   ├── utils/                             # Helpers & Formatters
│   └── App.jsx                            # App Root Router
│
└── backend/                               # Server API Service
    ├── controllers/                       # Route Controllers
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── leadController.js
    │   ├── customerController.js
    │   └── followupController.js
    ├── models/                            # Database Schemas
    │   ├── User.js
    │   ├── Lead.js
    │   ├── Customer.js
    │   └── Followup.js
    ├── routes/                            # API Routes
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── leadRoutes.js
    │   ├── customerRoutes.js
    │   └── followupRoutes.js
    ├── middleware/                        # Auth & Error Handler Middleware
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    ├── services/                          # Business Services (Lead conversion engine)
    ├── config/                            # Environment & DB Config
    └── server.js                          # Express Server Bootstrap
```

---

## 7. UI Interface / UI References

### Design Inspiration & Aesthetic Standards
The UI design language takes direct inspiration from top-tier modern productivity and CRM applications:
- **HubSpot CRM:** Clean data density, intuitive lead status pill styling, and clear action triggers.
- **Salesforce CRM:** Structured lead lifecycle stages and enterprise status indicators.
- **Zoho CRM:** Compact, highly readable data grids with multi-field search filtering.
- **Linear:** Sleek dark/light themes, fine 1px borders, smooth state transitions, and micro-interactions.
- **Notion:** Minimalist typography, subtle background contrast, clean card elevation, and distraction-free details panels.

### UI Element Specifications

1. **Dashboard Design:**
   - **Hero Metric Grid:** Top row features 4 key stat cards (Total Leads, Converted Customers, Pending Follow-ups, Recent Activity) with color-coded indicators.
   - **Split View Layout:** Left column displays upcoming follow-ups; right column displays a real-time activity stream feed.
   - **Visual Accents:** Glassmorphism card backgrounds with subtle borders (`#E2E8F0` light / `#1E293B` dark mode).

2. **Navigation Style:**
   - **Sidebar Navigation:** Persistent left sidebar with slim collapsible icon mode.
   - **Active State:** Highlighted background pill indicator for current active route.
   - **Top Utility Header:** Contains global search input, quick "+ Add Lead" action trigger, and user profile avatar dropdown.

3. **Tables:**
   - **Modern Data Grid:** Hover-highlighted rows, crisp column headers, sticky header on scrolling.
   - **Status Badges:** Dynamic color badges for statuses:
     - `New`: Indigo / Soft Blue
     - `Contacted`: Amber / Warm Yellow
     - `Qualified`: Emerald / Green
     - `In Negotiation`: Purple
     - `Converted`: Teal / Bright Cyan
     - `Lost`: Rose / Red
   - **Inline Actions:** Quick Action icons (View Details, Edit, Convert, Delete).

4. **Cards:**
   - Elevated cards with 1px border, subtle shadow on hover, rounded corners (`12px`).
   - Kanban board view option for lead stages.

5. **Filters:**
   - Top action bar featuring instant text search input.
   - Dropdown select filters for Status, Service Interested, and Assigned User.
   - Active filter pills display with one-click clear button.

6. **Forms:**
   - Clean side-drawer modal overlays for "Add Lead", "Schedule Follow-up", and "Edit Details".
   - Clear field labels, muted helper text, and subtle focus ring (`#6366F1`).
   - Primary action buttons highlighted with vibrant indigo button styling.

7. **Responsive Layout:**
   - **Desktop (>= 1024px):** Full expanded sidebar, multi-column dashboard grid, multi-column data tables.
   - **Tablet (768px - 1023px):** Collapsed icon-only sidebar, 2-column metrics grid, horizontally scrollable data tables.
   - **Mobile (< 768px):** Drawer sidebar menu, stacked single-column metric cards, swipeable mobile lead cards.
