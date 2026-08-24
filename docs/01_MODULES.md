# Modules & Core Methods

The **AI-Agentix CRM** system is structured into **12 core modules**, each exposing programmatic methods and API capabilities to deliver a complete sales management and AI-assisted automation workflow:

---

## 1. Authentication & Access Control Module
Handles user identity, session lifecycle, security, and role-based permissions.

- **`authenticateUser(email, password)`**: Validates credentials and returns JWT token & user object.
- **`logoutUser(token)`**: Invalidates active session token and clears user state.
- **`verifySession(token)`**: Verifies token validity and user active status on protected routes.
- **`checkPermission(userId, permissionKey)`**: Evaluates Role-Based Access Control (RBAC) permissions for specific system actions.

---

## 2. Dashboard & Analytics Module
Provides aggregated performance metrics, pipeline overview, and real-time activity tracking.

- **`getDashboardSummary()`**: Retrieves key performance indicators (KPIs: Total Leads, Customers, Pending Follow-ups, Revenue).
- **`getLeadConversionStats(dateRange)`**: Calculates conversion ratios, pipeline velocity, and lead stage distribution.
- **`getRecentActivities(limit)`**: Fetches global audit trail feed of recent lead updates and customer conversions.
- **`getFollowupMetrics()`**: Summarizes tasks due today, upcoming, and overdue for quick action.

---

## 3. Lead Management Module
Manages the entire lifecycle of prospective leads from capture to conversion.

- **`createLead(leadData)`**: Validates and persists a new lead record into the database.
- **`getLeads(queryParams)`**: Returns paginated, searchable, and filterable list of leads (`search`, `status`, `assignedUser`).
- **`getLeadById(leadId)`**: Fetches detailed profile of a single lead including historical touchpoints.
- **`updateLead(leadId, updateData)`**: Modifies prospect details, company affiliation, service interest, or assigned rep.
- **`deleteLead(leadId)`**: Soft/hard deletes a lead record from the system.
- **`convertLeadToCustomer(leadId, dealDetails)`**: One-click conversion mechanism transferring qualified leads into official customer records.

---

## 4. Customer Management Module
Centralized management of active converted client profiles, subscriptions, and purchase history.

- **`createCustomer(customerData)`**: Direct creation of an active customer account.
- **`getCustomers(queryParams)`**: Retrieves customer accounts directory with filters (`search`, `servicePurchased`).
- **`getCustomerById(customerId)`**: Fetches full customer profile, active services, and purchase transaction history.
- **`updateCustomer(customerId, updateData)`**: Updates customer contact details, account status, or service tier.
- **`getCustomerLifetimeValue(customerId)`**: Calculates total cumulative revenue generated from a customer account.

---

## 5. Follow-up & Task Management Module
Schedules and monitors sales outreach tasks, reminders, and activity logs.

- **`scheduleFollowup(followupData)`**: Creates a scheduled touchpoint (call, email, meeting) linked to a specific lead.
- **`getFollowups(filterParams)`**: Queries follow-up tasks categorized by timeframe (Overdue, Today, Upcoming, Completed).
- **`updateFollowupStatus(followupId, status)`**: Transitions task status (`Pending`, `Completed`, `Cancelled`).
- **`addFollowupNotes(followupId, noteText)`**: Appends rich text commentary, logs, or meeting outcome summaries.

---

## 6. AI Agent & Smart Automation Module
Powers intelligent lead scoring, automated email generation, sentiment analysis, and smart recommendations.

- **`calculateAILeadScore(leadId)`**: Evaluates lead engagement, company size, and profile signals to compute conversion probability score.
- **`generateAIEmailDraft(leadId, templateType)`**: Synthesizes personalized email copy based on lead context and history.
- **`getAIFollowupRecommendations(leadId)`**: Suggests optimal follow-up timing, topic, and channel using predictive AI models.
- **`analyzeSentiment(communicationLogs)`**: Evaluates past interactions for positive, neutral, or negative customer sentiment.

---

## 7. Deal & Pipeline Management Module
Visualizes and manages sales pipeline stages, deal values, and revenue forecasting.

- **`getPipelineDeals()`**: Returns active deals structured by Kanban pipeline stages.
- **`updateDealStage(dealId, newStage)`**: Moves deals across pipeline stages (`Discovery`, `Proposal`, `Negotiation`, `Closed Won`, `Closed Lost`).
- **`getSalesForecast(period)`**: Projects expected pipeline revenue based on stage probability weightings.
- **`closeDeal(dealId, closureData)`**: Marks deal as Won/Lost with win/loss reason analysis for sales intelligence.

---

## 8. Communication & Email Module
Facilitates multi-channel outreach, email logging, and standardized template dispatching.

- **`sendEmailToLead(leadId, emailContent)`**: Dispatches email via integrated SMTP/service and logs entry to lead timeline.
- **`getEmailTemplates()`**: Retrieves stored email templates for standardized sales outreach.
- **`logCommunication(leadId, channel, notes)`**: Creates manual or automated entry of phone call/meeting touchpoints.
- **`trackEmailMetrics(emailId)`**: Monitors email delivery, open rates, link clicks, and response status.

---

## 9. Notifications & Alerts Module
Delivers real-time notifications, task reminders, and system alerts to sales representatives.

- **`getUserNotifications(userId)`**: Retrieves unread system alerts, task reminders, and team mentions.
- **`markNotificationAsRead(notificationId)`**: Updates notification status to read.
- **`triggerOverdueFollowupAlerts()`**: Automated background cron job notifying reps of past-due tasks.
- **`sendPushNotification(userId, message)`**: Dispatches real-time WebSocket or push notification to active clients.

---

## 10. Reports & Data Export Module
Generates analytical reports, sales rep performance tracking, and data export capabilities.

- **`generateSalesReport(dateRange, metrics)`**: Aggregates sales velocity, win rates, and rep performance metrics.
- **`exportLeadsCSV(filterParams)`**: Generates downloadable CSV/Excel export of filtered lead records.
- **`exportCustomerReportPDF(customerId)`**: Produces comprehensive PDF statement for customer account history.
- **`getSalesRepLeaderboard()`**: Ranks sales reps based on deals closed, leads converted, and tasks completed.

---

## 11. Integrations & Webhook Module
Manages third-party CRM syncing, API integrations, webhooks, and lead ingestion.

- **`registerWebhook(event, targetUrl)`**: Subscribes external services to CRM events (e.g. `lead.created`, `customer.converted`).
- **`handleIncomingWebhook(source, payload)`**: Ingests external lead captures from web forms, Meta ads, or Zapier.
- **`syncThirdPartyCRM(integrationId)`**: Synchronizes data bidirectionally with external platforms (HubSpot, Salesforce, Google Contacts).
- **`getAPIKeys(userId)`**: Manages developer API access keys, secret tokens, and usage rate limits.

---

## 12. Settings & Administration Module
Configures system preferences, user profiles, security credentials, and system audit logs.

- **`updateUserProfile(userId, profileData)`**: Updates user name, avatar, phone number, and email signature.
- **`changeUserPassword(userId, currentPassword, newPassword)`**: Verifies current credentials and updates security password hash.
- **`getSystemSettings()`**: Retrieves global application configurations, white-labeling options, and default currencies.
- **`getAuditLogs(queryParams)`**: Provides administrator view of system user activity logs and security events.

