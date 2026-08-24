# Database Entities

## 1. User Entity
Represents internal CRM users / sales representatives.
- **Fields:**
  - `User ID` (UUID / Primary Key)
  - `Name` (String, Required)
  - `Email` (String, Unique, Required)
  - `Password` (String, Hashed, Required)
  - `Role` (Enum: `Admin`, `Manager`, `Sales Rep`)

## 2. Lead Entity
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

## 3. Customer Entity
Represents closed clients converted from successful leads.
- **Fields:**
  - `Customer ID` (UUID / Primary Key)
  - `Name` (String, Required)
  - `Email` (String, Required)
  - `Phone` (String)
  - `Company` (String)
  - `Service Purchased` (String, Required)

## 4. Follow-up Entity
Represents scheduled outreach tasks and touchpoints associated with leads.
- **Fields:**
  - `Follow-up ID` (UUID / Primary Key)
  - `Lead ID` (Foreign Key referencing `Lead ID`)
  - `Date` (Date, Required)
  - `Time` (Time / String, Required)
  - `Notes` (Text)
  - `Status` (Enum: `Pending`, `Completed`, `Cancelled`)

## Entity Relationships

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
