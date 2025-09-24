# Bill Blister Backend

This is the backend service for the **Bill Blister App**, handling employees, expense claims, allocations, approvals, and file storage.  
The backend is built with **Node.js + Express + MySQL**.  
Database is managed using **MySQL Workbench** for schema and queries.  
Receipt images/files are stored in **Firebase Storage**, while only the download URL is stored in MySQL.

---

## 🚀 Features
- User Authentication (JWT-based)
- Employee Management
- Expense Type Management
- Amount Allocation & Claims
- Claim Verification & Approval Workflow
- File Uploads with Firebase Storage
- RESTful API

---

## 🛠 Tech Stack
- **Backend Framework**: Node.js + Express.js
- **Database**: MySQL (managed via MySQL Workbench)
- **Auth**: JWT (JSON Web Tokens)
- **File Storage**: Firebase Storage
- **Deployment**: Render / Railway (for backend hosting)

---

## 📂 Project Structure

backend/
├── src/
│ ├── config/ # DB + Firebase config
│ ├── controllers/ # Business logic
│ ├── routes/ # API routes
│ ├── middlewares/ # Auth, error handling
│ ├── utils/ # Helpers
│ └── index.js # Entry point
├── package.json
└── README.md



---

## 🗄 Database Schema (MySQL Workbench)

Run these queries in **MySQL Workbench** to set up the schema:

### Employee
```sql
CREATE TABLE Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20),
  reporting_manager INT,
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  dob DATE,
  status VARCHAR(20),
  login_name VARCHAR(50) UNIQUE,
  password_hash TEXT,
  head1 VARCHAR(50),
  head2 VARCHAR(50),
  joining_date DATE,
  leaving_date DATE,
  country VARCHAR(50),
  state VARCHAR(50),
  city VARCHAR(50),
  full_address1 TEXT,
  full_address2 TEXT,
  FOREIGN KEY (reporting_manager) REFERENCES Employee(id)
);


ExpenseType

CREATE TABLE ExpenseType (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  status BOOLEAN
);


Allocation

CREATE TABLE Allocation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  allocation_date DATE,
  emp_id INT,
  expense_type INT,
  amount DECIMAL(10,2),
  remarks TEXT,
  bill_number VARCHAR(50),
  bill_date DATE,
  file_url TEXT,
  notes TEXT,
  status_eng VARCHAR(20),
  notes_eng TEXT,
  status_ho VARCHAR(20),
  notes_ho TEXT,
  original_bill BOOLEAN,
  FOREIGN KEY (emp_id) REFERENCES Employee(id),
  FOREIGN KEY (expense_type) REFERENCES ExpenseType(id)
);


🔑 Authentication

JWT tokens for login sessions

Roles:

Employee: Can create claims

Engineer: Can verify claims

HO Approver: Can approve claims



🔗 API Endpoints
Auth

POST /auth/signup

POST /auth/login

Employee

GET /employees

POST /employees

Expense Type

GET /expense-types

POST /expense-types

Allocation / Claims

GET /allocations

POST /allocations

PUT /claims/:id/verify

PUT /claims/:id/approve