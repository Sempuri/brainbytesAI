# CI/CD Pipeline Configuration

## Workflow Files

### 1. ci.yml

- **Purpose**: Main continuous integration and delivery workflow for building, testing, linting, and preparing artifacts for deployment of the BrainBytes AI Tutoring Platform.
- **Triggers**: Runs on push and pull request events to the `master` and `development` branches.
- **Jobs**:
  - **build-test**: Builds Docker images, installs dependencies, runs code quality checks (ESLint, Prettier), audits dependencies, runs unit and E2E tests, uploads coverage and build artifacts, and checks for large files/secrets.
    - **Steps**:
      - Checkout code
      - Set up Node.js (16.x, 18.x)
      - Cache and install dependencies (frontend/backend)
      - Build Docker images with caching
      - Run ESLint and Prettier checks (root, frontend, backend)
      - Audit dependencies
      - Run backend and frontend unit tests with coverage
      - Run frontend E2E tests with Cypress
      - Upload coverage and build artifacts
      - Check for large files and secrets
      - Run Lighthouse performance tests
    - **Dependencies**: None (single job, all steps sequential)

### 2. test.yml

- **Purpose**: Additional CI workflow for code quality and separate frontend/backend tests.
- **Triggers**: Runs on push, pull request, and manual dispatch (`workflow_dispatch`) to `main` and `development` branches.
- **Jobs**:
  - **lint**: Installs dependencies and runs lint checks for both frontend and backend.
    - **Steps**: Checkout, set up Node, install dependencies, run lint for frontend and backend.
  - **frontend-test**: Runs frontend tests (details in file).
  - **backend-test**: Runs backend tests (details in file).
    - **Dependencies**: Jobs are independent.

### 3. deploy.yml

- **Purpose**: Handles deployment to test or staging environments, supports manual and branch-based deploys.
- **Triggers**: Runs on push to `master` and `development`, and on manual dispatch (`workflow_dispatch`) with environment selection.
- **Jobs**:
  - **deploy**: Deploys to the selected environment (test/staging), sets up environment variables, secrets, and builds/starts services with Docker Compose.
    - **Steps**: Checkout, set up Node, configure environment, set up Docker, install Docker Compose, build and deploy services.
    - **Dependencies**: None (single job).

## Environment Variables

- **GITHUB_TOKEN**: Used by actions for authentication with the GitHub API (e.g., for annotating ESLint results, uploading artifacts, and running security checks).
- **DEPLOY_URL, DEPLOY_ENV, DEPLOY_TIME, DEPLOY_SHA, DEPLOY_BRANCH**: Used in `deploy.yml` for deployment context (placeholders, set in job `env:` block).

## Secrets Configuration

- **GITHUB_TOKEN**: Grants workflow access to repository resources for CI/CD operations (auto-injected by GitHub Actions).
- **GEMINI_API_KEY, JWT_SECRET, API_URL**: Used in `deploy.yml` for secure environment configuration during deployment.

## Pipeline Behavior

- **On Push to Main**: Runs the full pipeline, including build, lint, test, artifact upload, and deployment (if configured).
- **On Pull Request**: Runs the same checks as on push, ensuring code quality and test coverage before merging.
- **On Manual Trigger**: Can be triggered via GitHub Actions UI for test or deploy workflows, with environment selection for deploy.

---

> This configuration ensures robust code quality, security, and test coverage for every change to the codebase, supporting both automated and manual review processes.
