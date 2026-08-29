# Database Directory Structure (`DB/`)

This directory is organized to store all SQL-related scripts for the Mini CRM project.

## Directory Tree

```
DB/
├── schema/
│   └── schema.sql         # Database table definitions, constraints, & indexes
├── seeds/
│   └── seed.sql           # Initial seed & mock data for testing
├── queries/
│   └── test_queries.sql   # Test queries & verification scripts
└── README.md              # Database folder structure overview
```

## Structure Overview

1. **`schema/`**: Holds SQL scripts for defining the database structure (tables, primary/foreign key constraints, and indexes).
2. **`seeds/`**: Holds SQL scripts for populating the database with sample data (users, customers, leads, follow-ups, etc.).
3. **`queries/`**: Holds SQL test scripts, validation queries, complex joins, and report queries for testing functionality.
