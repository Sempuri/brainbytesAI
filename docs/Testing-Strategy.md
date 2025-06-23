# CI/CD Testing Documentation

## Test Categories

### Unit Tests

- **Location**:
  - Backend: `backend/__tests__/`
  - Frontend: `frontend/__tests__/`
- **Coverage**:
  - Backend: Covers core business logic, services (e.g., `aiService.js`, `messageService.js`), and API endpoints in isolation.
  - Frontend: Covers React components, utility functions, and UI logic.
- **Execution**:
  - Run with `npm test` in either `backend/` or `frontend/` directory.
  - CI runs: `npm test -- --coverage` in both frontend and backend during workflow.

### Integration Tests

- **Location**:
  - Backend: `backend/__tests__/api.test.js`, `backend/__tests__/messageService.test.js`
  - Frontend: (If present) `frontend/__tests__/` or Cypress tests in `frontend/cypress/integration/`
- **Coverage**:
  - Backend: Tests API endpoints, database interactions, and service integration.
  - Frontend: (If present) Tests user flows and component integration.
- **Execution**:
  - Backend: Run with `npm test` in `backend/` (integration tests are included in Jest suite).
  - Frontend: Run Cypress tests with `npm run cy:run` in `frontend/`.
  - CI runs both Jest and Cypress tests automatically.

### Security Tests

- **Tools**:
  - `npm audit` (dependency vulnerability scanning)
  - `gitleaks` (secret scanning)
- **Coverage**:
  - Checks for known vulnerabilities in dependencies and for accidental secret leaks in codebase.
- **Execution**:
  - `npm audit --audit-level=moderate` in both frontend and backend (run in CI).
  - `gitleaks` runs as a GitHub Action in the workflow.

## Test Results

- **Reporting**:
  - Test results and coverage are output in the CI logs.
  - JUnit XML reports are generated and uploaded as artifacts (`reports/junit.xml`).
  - Coverage reports are uploaded as artifacts (`coverage/`).
  - ESLint and Prettier results are annotated in PRs via GitHub Actions.
- **Success Criteria**:
  - All unit, integration, and security tests must pass.
  - Coverage thresholds are not strictly enforced but high coverage is expected.
  - No high/critical vulnerabilities or secret leaks.

## Test Automation

- **Integration with CI/CD**:
  - All tests are run automatically on every push and pull request via GitHub Actions workflows (`ci.yml`, `test.yml`).
  - Artifacts and annotations are uploaded for review.
- **Frequency**:
  - Tests run on every push and pull request to `master` and `development` branches.
  - Can also be triggered manually via GitHub Actions UI.

---
