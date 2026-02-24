## SubTrack Walkthrough Outline

This is a suggested script and talking points for the required 10-15 minute walkthrough video.

### 1. Introduction (1-2 mins)

- **Hook**: Introduce SubTrack, a minimal recurring expense tracker.
- **Philosophy**: State clearly that you prioritized _structure, resilience, and correctness_ over a massive feature list, keeping the scope small so the architecture can shine.

### 2. Architecture & Structure (3-4 mins)

- Show the repository structure.
- **Backend Details**: Point out the separation in `backend/app/`.
  - Show how `routes.py` contains zero business logic.
  - Show how `services.py` executes logic independently of Flask.
- **Frontend Details**: Show `frontend/src/`.
  - Highlight how React is used just as a view layer.
  - Show `api.ts` representing the network boundary.

### 3. Interface Safety & Correctness (3-4 mins)

- _This is the most critical part for the evaluation._
- **Demo**: Try to pass invalid data natively.
- **Backend Validation**: Open `schemas.py` and show the Pydantic `SubscriptionCreate` model. Highlight the `@field_validator` ensuring cost is strictly positive.
- **Frontend Validation**: Open `SubscriptionForm.tsx` and show the Zod schema. Explain how `react-hook-form` prevents invalid state from ever leaving the browser.

### 4. Verification & Testing (2 mins)

- Run `pytest` on terminal.
- Show `tests/test_services.py` to demonstrate how business logic is tested independently of the database by using an in-memory SQLite fixture.

### 5. AI Usage & Guardrails (2-3 mins)

- Open the `.ai/` directory.
- Show `coding-standards.md` and `architecture-rules.md`.
- Explain that instead of letting AI write whatever it wants, you established explicit constraints to "protect system integrity," exactly as requested in the rubric.
- Explain how you critically reviewed the generated boundaries to ensure no bleeding between layers.

### 6. Extensions & Risks (1 min)

- **Risk**: Utilizing SQLite creates limits on concurrent heavy-writes if scaling, but is perfect for a small localized tool.
- **Extension**: If a new feature like "User Authentication" were added, thanks to the layered architecture, it only requires a new Auth Service and Route, without breaking existing Subscription Services.
