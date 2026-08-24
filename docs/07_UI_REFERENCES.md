# UI References & Interface Specifications

## Design Inspiration & Aesthetic Standards
The UI design language takes direct inspiration from top-tier modern productivity and CRM applications:
- **HubSpot CRM:** Clean data density, intuitive lead status pill styling, and clear action triggers.
- **Salesforce CRM:** Structured lead lifecycle stages and enterprise status indicators.
- **Zoho CRM:** Compact, highly readable data grids with multi-field search filtering.
- **Linear:** Sleek dark/light themes, fine 1px borders, smooth state transitions, and micro-interactions.
- **Notion:** Minimalist typography, subtle background contrast, clean card elevation, and distraction-free details panels.

## UI Element Specifications

### 1. Dashboard Design:
- **Hero Metric Grid:** Top row features 4 key stat cards (Total Leads, Converted Customers, Pending Follow-ups, Recent Activity) with color-coded indicators.
- **Split View Layout:** Left column displays upcoming follow-ups; right column displays a real-time activity stream feed.
- **Visual Accents:** Glassmorphism card backgrounds with subtle borders (`#E2E8F0` light / `#1E293B` dark mode).

### 2. Navigation Style:
- **Sidebar Navigation:** Persistent left sidebar with slim collapsible icon mode.
- **Active State:** Highlighted background pill indicator for current active route.
- **Top Utility Header:** Contains global search input, quick "+ Add Lead" action trigger, and user profile avatar dropdown.

### 3. Tables:
- **Modern Data Grid:** Hover-highlighted rows, crisp column headers, sticky header on scrolling.
- **Status Badges:** Dynamic color badges for statuses:
  - `New`: Indigo / Soft Blue
  - `Contacted`: Amber / Warm Yellow
  - `Qualified`: Emerald / Green
  - `In Negotiation`: Purple
  - `Converted`: Teal / Bright Cyan
  - `Lost`: Rose / Red
- **Inline Actions:** Quick Action icons (View Details, Edit, Convert, Delete).

### 4. Cards:
- Elevated cards with 1px border, subtle shadow on hover, rounded corners (`12px`).
- Kanban board view option for lead stages.

### 5. Filters:
- Top action bar featuring instant text search input.
- Dropdown select filters for Status, Service Interested, and Assigned User.
- Active filter pills display with one-click clear button.

### 6. Forms:
- Clean side-drawer modal overlays for "Add Lead", "Schedule Follow-up", and "Edit Details".
- Clear field labels, muted helper text, and subtle focus ring (`#6366F1`).
- Primary action buttons highlighted with vibrant indigo button styling.

### 7. Responsive Layout:
- **Desktop (>= 1024px):** Full expanded sidebar, multi-column dashboard grid, multi-column data tables.
- **Tablet (768px - 1023px):** Collapsed icon-only sidebar, 2-column metrics grid, horizontally scrollable data tables.
- **Mobile (< 768px):** Drawer sidebar menu, stacked single-column metric cards, swipeable mobile lead cards.
