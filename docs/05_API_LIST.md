# API List

## Authentication
- `POST /login`
  - Request: `{ email, password }`
  - Response: `{ token, user }`
- `POST /logout`
  - Request: `{}`
  - Response: `{ message }`

## Dashboard
- `GET /dashboard`
  - Request: `None`
  - Response: `{ totalLeads, totalCustomers, pendingFollowups, recentActivities }`

## Leads
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

## Customers
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

## Follow-ups
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
