# PennyPilot

PennyPilot is a full-stack personal finance workspace built with React, Vite, Express, and MongoDB. It helps users track transactions, set budget guardrails, manage savings goals, explore mutual funds, and review spending analytics in one place.

## Features

- Authentication flow with landing page, sign up, and sign in
- Dashboard with:
  - spending overview
  - daily budget pace
  - guardrails and limit alerts
  - goals and recent activity
- Analytics page with:
  - category focus
  - portfolio split
  - focus meter
  - momentum trends
- Transactions page for:
  - adding expenses
  - adding deposits
  - viewing a running ledger
- Profile page for:
  - account overview
  - planning setup
  - spending priorities
  - budget limits
  - settings
- Funds explorer with:
  - search
  - multi-select filters
  - sorting
  - shortlist browsing
- Reading/library section for finance learning content

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Radix UI
- MUI X Charts
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Zod
- JWT authentication

## Project Structure

```text
LevelUp.Money/
├─ Backend/
│  ├─ routes/
│  ├─ db.js
│  ├─ index.js
│  └─ .env.example
├─ FrontEnd/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ App.jsx
│  ├─ public/
│  └─ package.json
└─ README.md
```

## Available Pages

- `/` - landing page
- `/signup` - create account
- `/signin` - sign in
- `/home` - dashboard
- `/analytics` - analytics workspace
- `/transactions` - transactions and ledger
- `/profile` - account, settings, and planning setup
- `/funds` - mutual funds explorer
- `/read` - learning library

## Backend API Areas

The backend is mounted at:

```text
/pennypilot
```

Main route groups:

- `/user`
- `/transaction`
- `/priority`
- `/budget`
- `/goal`

## Environment Variables

Create a `.env` file inside `Backend/`.

Example:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/PennyPilot?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd LevelUp.Money
```

### 2. Install dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd ../FrontEnd
npm install
```

### 3. Configure the backend

- Copy `Backend/.env.example` to `Backend/.env`
- Add your MongoDB connection string
- Add a JWT secret

### 4. Run the backend

From `Backend/`:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3002
```

### 5. Run the frontend

From `FrontEnd/`:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Build the Frontend

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
- CORS is currently configured for:
  - `http://localhost:5173`
  - `http://localhost:5174`
- MongoDB must be available before starting the backend
- Some app settings are currently stored in `localStorage`

## Future Improvements

- editable account settings persisted to backend
- test coverage
- API documentation
- better mobile optimization in some sections
- more advanced investment comparison tools

## Author

Built as the PennyPilot personal finance project.
