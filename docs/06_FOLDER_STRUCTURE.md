# Folder Structure

```
AI-Agentix-Mini-CRM/
├── frontend/                              # Client SPA Application
│   ├── components/                        # UI Components
│   │   ├── common/                        # Buttons, Inputs, Modals, Badges
│   │   ├── layout/                        # Sidebar, Header, PageWrapper
│   │   └── modules/                       # Module Components (LeadTable, StatCard, etc.)
│   ├── pages/                             # Route Pages
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
