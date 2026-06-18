# RoomFMS — Room Financial Management System

A digital finance tracker for shared room members. Built with **Spring Boot**, **React + Reactstrap**, and **PostgreSQL**.

---

## 🗂 Project Structure

```
RoomFMS/
├── backend/     → Spring Boot (Java 17)
└── frontend/    → React + Vite + Reactstrap
```

---

## ✅ Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 16+
- PostgreSQL (running locally)

---

## 🗄 Database Setup

Run the following in your PostgreSQL shell:

```sql
CREATE USER roomfms WITH PASSWORD 'roomfms';
CREATE DATABASE roomfms OWNER roomfms;
GRANT ALL PRIVILEGES ON DATABASE roomfms TO roomfms;
```

Tables are created automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

---

## 🚀 Running the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

**Default login (seeded automatically):**
- Mobile: `roomfms`
- Password: `roomfms`
- Role: Finance Manager

---

## 🌐 Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: `http://localhost:3000`

---

## 👥 Roles

| Role        | Capabilities                                                    |
|-------------|------------------------------------------------------------------|
| `FIN_MGR`   | Dashboard, Budget Entry, Part Amount, Transfer, Expenditure, History, Add User |
| `USER`      | Dashboard (personal stats), Expenditure, Transaction History, Profile |

---

## 📋 Features

- **Dashboard** — Room balance, own pocket expenses, monthly amount (editable by FIN_MGR), next month pay
- **Budget Manager** — Monthly entry, part payment, carry-forward transfer (FIN_MGR only)
- **Expenditure Tracker** — Add expenses from Budget or Own money
- **Transaction History** — All transactions with date range filtering, user name, payment source
- **Profile** — Edit name, mobile, email, password, profile photo
- **Add User** — Create accounts for members (FIN_MGR only)
