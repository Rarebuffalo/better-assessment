# SubTrack Architecture Rules (AI Agent Guardrails)

These architectural guardrails constrain AI generation to ensure high structural integrity. The application must maintain clear boundaries to remain understandable as it evolves.

## 1. Structure

**Clear boundaries and logical organization**
We enforce a strict 3-tier layered architecture dividing HTTP concerns from Business Processing and Data Access:

- **Routes Layer (`backend/app/routes.py`):**
  - **Responsibility:** HTTP translation only. Extracting request bodies via Pydantic, calling pure services, and formatting JSON responses.
  - **Constraint:** ZERO business logic. ZERO database queries. AI must never inject `if/else` domain logic here.
- **Services Layer (`backend/app/services.py`):**
  - **Responsibility:** Core business rules (e.g., calculating next billing dates, calculating aggregate monthly spend).
  - **Constraint:** ZERO knowledge of HTTP concepts. It must never import `flask.request`. It receives native Python types/schemas and returns native Python types/schemas.
- **Data Layer (`backend/app/models.py` / SQLAlchemy):**
  - **Responsibility:** Interfacing with the relational SQLite database.
  - **Constraint:** Models represent strictly structure. Try not to embed complex domain processing inside model methods.

## 2. Change Resilience

**New features don’t cause widespread impact**

- **Backend Mutation Guidelines:** A new feature (e.g., exporting CSVs) must not breach established boundaries. Adding a feature means creating a new route -> calling a new service method -> calling a new database query. The route must NEVER query the database directly to "save time."
- **Frontend Separation of Concerns:**
  - **Network State vs UI State:** Data fetching state must be separated from local ephemeral UI state (`useState`).
  - **Dumb Components:** Presentational visual components (like `SubscriptionCard`) should be isolated, accepting only primitive props, allowing them to be swapped or redesigned without impacting underlying data orchestration.
  - **Smart Containers:** Only top-level root configurations or explicit form submission handlers should coordinate API mutations.
