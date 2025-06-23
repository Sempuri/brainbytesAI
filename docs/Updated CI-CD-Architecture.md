# BrainBytes CI/CD System Architecture

## Overview

The BrainBytes AI Tutoring Platform uses a containerized architecture with separate frontend and backend services, continuous integration via GitHub Actions, and cloud hosting on Render. Deployments are triggered manually from the Render dashboard to ensure control over production releases.

---

## Architecture Diagram

![BrainBytes Architecture](architecture.png)

_For full view, access the image above in the docs folder._

---

## Components

### 1. Source Control

- **Repository:** [https://github.com/Sempuri/brainbytesAI.git](https://github.com/Sempuri/brainbytesAI.git)
- **Branch Structure:**
  - `development`: Production-ready code, protected.
  - Feature branches: For development and new features.
- **Protection Rules:**
  - Require pull request reviews before merging to main.
  - Require status checks to pass (lint, test).
  - Restrict force pushes and deletions on main.

---

### 2. CI/CD Pipeline

- **Platform:** GitHub Actions
- **Workflow Files:**
  - `test.yml` (main CI pipeline)
- **Pipeline Stages:**
  1. **Lint:** Runs ESLint on frontend and backend code.
  2. **Test:** Runs Jest unit/integration tests for both frontend and backend.
  3. **Build:** (Optional) Builds Docker images for deployment.
  4. **Deploy:** Manually triggered from the Render dashboard after verifying CI success.

---

### 3. Cloud Infrastructure

- **Cloud Provider:** Render
- **Resources:**
  - **Web Service:** Frontend (Next.js) deployed as a web service.
  - **Web Service:** Backend (Node.js/Express) deployed as a web service.
  - **Database:** Managed MongoDB instance (provided by Render or external).
- **Networking:**
  - Frontend and backend are exposed via HTTPS endpoints.
  - Backend connects securely to the managed MongoDB.
  - Environment variables are used for all secrets and connection strings.

---

## Component Interactions

- Developers push code to GitHub.
- GitHub Actions runs CI (lint, test) on every push and pull request.
- After merging to main, a team member manually triggers a deployment from the Render dashboard.
- The frontend communicates with the backend via REST API calls.
- The backend interacts with MongoDB for data persistence.
- All secrets and sensitive configs are managed via environment variables.

---

## Security Considerations

- Branch protection ensures only reviewed and tested code is deployed.
- Environment variables are used for all secrets (never hardcoded).
- CI/CD runs all tests and lint checks before deployment.
- HTTPS is enforced for all public endpoints.
- Database access is restricted to backend service only.
- Dependencies are kept up to date and scanned for vulnerabilities.
