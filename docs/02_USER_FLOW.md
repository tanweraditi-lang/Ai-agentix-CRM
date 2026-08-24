# User Flow

The complete end-to-end user journey within **AI-Agentix Mini CRM** is defined as follows:

```
[Login] ──> [Dashboard] ──> [View Leads] ──> [Open Lead Details] ──> [Contact Lead] 
                                                                          │
[Settings] <── [Manage Customers] <── [Convert Lead into Customer] <── [Update Lead Status] <── [Schedule Follow-up]
    │
[Logout]
```

## Detailed Step Explanation:

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
