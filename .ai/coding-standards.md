# SubTrack Coding Standards (AI Agent Guardrails)

These rules exist to constrain AI behavior and protect system integrity. Any code generated for the SubTrack application MUST rigidly adhere to the following principles, which align directly with Better Software's engineering values.

## 1. Simplicity

**Readable, predictable code (simple > clever)**

- **No "magic" frameworks:** Avoid deep metaprogramming, obscure language features, or overly tersed one-liners. If a multi-line loop is more readable than a complex map/reduce chain, use the loop.
- **Explicit over Implicit:** Do not rely on implicit side effects. State mutations must be painstakingly obvious from variable naming and function signatures.

## 2. Correctness

**Prevents invalid states and enforces rules**

- **Fail Fast:** Do not silently catch and ignore errors (`try/except pass`).
- **Proactive Constraint Checking:** If a domain rule mandates a cost cannot be negative, that constraint must be enforced at the earliest possible entry point of the system (e.g., in validation schemas) before it ever touches business logic execution or database persistence.

## 3. Interface Safety

**Guards against misuse (types, schemas, validations)**

- **Backend Constraints (Python + Flask):** Use type hints (`->`, `str`, `int`) on every function. You MUST use Pydantic schemas unequivocally to validate _all_ incoming API payloads and _all_ outgoing JSON responses. Never trust raw `request.json` dictionaries.
- **Frontend Constraints (React + TypeScript):** The use of `any` is strictly prohibited. Define strong generic interfaces for all API endpoints. Use structural typing to ensure UI components only receive the strict subset of data they need to render.

## 4. Verification

**Automated tests or checks proving behavior remains correct after changes**

- **Automated Verification Required:** All core services and data transformation logic must have automated tests (via `pytest`). AI commits will be rejected if logic changes without corresponding test updates.
- **Behavioral Focus:** Test the _behavior_ and outputs of the boundary, not internal private methods. Mock external boundaries (like network calls) but ensure integration tests execute against a real (in-memory) database.

## 5. Observability

**Failures are visible and diagnosable**

- **Predictable Error Serialization:** API endpoints must return structured, machine-and-human-readable `400 Bad Request` responses specifically detailing which validation constraint failed, making UI rendering of errors trivial.
- **Exception Logging:** Unexpected 500s must yield console stack traces in development, never swallowed locally to hide issues.
