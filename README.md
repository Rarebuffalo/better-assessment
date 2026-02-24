# SubTrack - Simple Subscription Tracker

SubTrack is a minimal, beautifully engineered subscription tracking application designed to demonstrate robust software engineering practices.

## Design Philosophy

This project prioritizes **Simplicity**, **Correctness**, and **Interface Safety** over a bloated feature set. We avoid "magic" frameworks where possible, preferring clear layer separation and deterministic boundaries.

### Architectural Boundaries

The application is strictly divided to ensure that changes remain localized and predictable:

**Backend (Python + Flask)**

1. **HTTP Layer (`routes.py`)**: Responsible _only_ for HTTP translation, request parsing, and error serialization.
2. **Business Logic Layer (`services.py`)**: Pure Python classes/functions. They have zero knowledge of HTTP or Flask `request` contexts.
3. **Data Layer (`models.py` & SQLAlchemy)**: Manages SQLite persistence.
4. **Validation Boundary (`schemas.py` & Pydantic)**: Every request and response crosses a strict Pydantic parsing barrier. Invalid states (like negative costs or malformed dates) are rejected proactively before business logic executes.

**Frontend (React + TypeScript)**

1. **Strict Typing (`types.ts`)**: Interfaces map 1:1 with backend entities.
2. **Client-Side Validation (Zod + React Hook Form)**: State mutations are caught at the UI level ensuring only valid data structures reach the network.
3. **Component Separation**: Presentational components (`SubscriptionList`, `SummaryCards`) are decoupled from stateful orchestration (`App.tsx`).

## Setup and Running Locally

### 1. Start the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

_The backend runs on `http://localhost:5000`. SQLite DB is created automatically._

### 2. Start the Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

_The frontend runs on `http://localhost:5173`._

## Verification and Testing

**Automated Backend Verification:**
The pure business logic and HTTP endpoints are tested comprehensively to ensure correct behavior.

```bash
cd backend
pytest tests/
```

## AI Guidance and Guardrails

This project utilized AI assistance governed by explicit constraints. To review the strict rules provided to the agent, inspect the files in the `.ai/` directory:

- `.ai/coding-standards.md`
- `.ai/architecture-rules.md`
