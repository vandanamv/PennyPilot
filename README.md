# PennyPilot

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express-111827?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-16A34A?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F59E0B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-8B5CF6?style=for-the-badge)

> A modern personal finance workspace for tracking spending, controlling budgets, managing goals, exploring mutual funds, and learning through curated finance content.

## What Is PennyPilot?

PennyPilot is a full-stack finance application built with React, Vite, Express, and MongoDB. It brings together day-to-day money tracking and planning tools in one product:

- transaction tracking for deposits and expenses
- dashboard visibility for balance, pace, and recent activity
- analytics for category focus and spending momentum
- guardrails for category budgets and spending pressure
- goal planning for savings targets
- mutual fund exploration with filters and sorting
- a reading section for finance education

## Quick Highlights

- Modern dashboard and analytics workspace
- Budget limits and spending guardrails
- Goal tracking and planning
- Mutual funds explorer with shortlist-style filtering
- Finance article library
- JWT-based authentication flow

## Architecture

```mermaid
flowchart LR
    U[User] --> FE[Frontend<br/>React + Vite]
    FE --> API[Axios API Calls]
    API --> BE[Backend<br/>Express.js]
    BE --> DB[(MongoDB)]
    BE --> AUTH[JWT Authentication]
```

## Product Flow

```mermaid
flowchart TD
    L[Landing Page] --> A[Auth]
    A --> S1[Sign Up]
    A --> S2[Sign In]
    S1 --> D[Dashboard]
    S2 --> D
    D --> AN[Analytics]
    D --> TR[Transactions]
    D --> PR[Profile]
    D --> FU[Funds]
    D --> RD[Read]
    RD --> AR[Article View]
```

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Radix UI
- MUI X Charts
- Axios

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Zod
- JWT authentication

## Project Structure

```text
LevelUp.Money/
|-- Backend/
|   |-- routes/
|   |-- db.js
|   |-- index.js
|   |-- package.json
|   `-- .env.example
|-- FrontEnd/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   `-- App.jsx
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Main Pages

- `/` - Landing page
- `/signup` - Create account
- `/signin` - Sign in
- `/home` - Dashboard
- `/analytics` - Analytics workspace
- `/transactions` - Deposits, expenses, and ledger
- `/profile` - Account, planning, settings, and limits
- `/funds` - Mutual funds explorer
- `/read` - Finance learning library

## Backend Route Groups

The backend is mounted at:

```text
/pennypilot
```

Primary route groups:

- `/user`
- `/transaction`
- `/priority`
- `/budget`
- `/goal`

## Feature Map

```mermaid
mindmap
  root((PennyPilot))
    Dashboard
      Balance
      Monthly usage
      Guardrails
      Recent activity
    Analytics
      Category focus
      Portfolio split
      Focus meter
      Momentum
    Transactions
      Expense entry
      Deposit entry
      Ledger
    Profile
      Account
      Planning
      Limits
      Settings
    Funds
      Search
      Filters
      Sorting
    Read
      Articles
      Learning
```

## Environment Variables

Create `Backend/.env` using `Backend/.env.example` as a guide:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/PennyPilot?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
```

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd LevelUp.Money
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../FrontEnd
npm install
```

### 4. Configure the backend

- Copy `Backend/.env.example` to `Backend/.env`
- Add your MongoDB connection string
- Add your JWT secret

### 5. Run the backend

```bash
cd Backend
npm start
```

Backend:

```text
http://localhost:3002
```

### 6. Run the frontend

```bash
cd FrontEnd
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Frontend Build

From `FrontEnd/`:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Notes

- The frontend expects the backend at `http://localhost:3002`
- CORS is currently configured for `http://localhost:5173` and `http://localhost:5174`
- MongoDB must be available before starting the backend
- Some UI preferences are currently stored in `localStorage`

## Future Improvements

- Persist more profile and settings data to the backend
- Add tests for key flows
- Improve API documentation
- Strengthen mobile responsiveness in some sections
- Add deeper investment comparison tools

## Author

Built as the PennyPilot personal finance project.

