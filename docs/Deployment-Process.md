# Deployment Process Documentation

## Prerequisites

- Access to the GitHub repository with appropriate permissions
- GitHub Actions enabled
- Docker and Docker Compose (for local/manual deployment)
- Required secrets set in GitHub repository settings:
  - `GEMINI_API_KEY`
  - `JWT_SECRET`
  - `API_URL`
- Access to Render.com account with appropriate permissions

## Deployment Environments

### Production

- **URL**: https://brainbytes-frontend.onrender.com/login
- **Configuration**: Uses `master` branch, production secrets, and environment variables configured in Render dashboard
- **Deployment Trigger**: Push to `master` branch (auto-deploy via Render Git integration) or manual deploy from Render dashboard

### Development

- _Not currently used. All deployments target production._

## Deployment Procedure

1. Push code to the `master` branch on GitHub.
2. Render detects the change and automatically builds and deploys the latest code.
3. Render workflow steps:
   - Pulls code from GitHub
   - Installs dependencies and builds Docker images (if using Docker)
   - Sets environment variables and secrets from Render dashboard
   - Starts services and exposes the production URL
4. (Optional) Trigger a manual deploy from the Render dashboard if needed.

## Verification Steps

1. Check the Render dashboard for build and deploy logs
2. Access the deployed application at the Render production URL
3. Verify application health endpoints or homepage loads
4. Check logs for errors or failed services in the Render dashboard

## Rollback Procedure

1. In the Render dashboard, navigate to the service and select the "Events" tab
2. Find the last successful deploy and click "Redeploy" to roll back
3. Alternatively, revert to a previous commit in GitHub and push to `master` to trigger a new deploy

## Troubleshooting

### Common Issue 1: Environment Variable Not Set

- **Symptoms**: Application fails to start, errors like `Missing MONGODB_URI` or other secrets
- **Cause**: Required environment variable or secret is missing in Render service settings
- **Resolution**: Add the missing secret in Render > Service > Environment and redeploy

### Common Issue 2: Docker Build Fails

- **Symptoms**: Build fails in Render dashboard, error messages in logs
- **Cause**: Dockerfile misconfiguration, missing dependencies, or incompatible Node version
- **Resolution**: Review Dockerfile, ensure all dependencies are installed, and Node version matches project requirements

### Common Issue 3: Application Not Accessible After Deploy

- **Symptoms**: Deploy succeeds but app URL does not load
- **Cause**: Service failed to start, port misconfiguration, or Render health check fails
- **Resolution**: Check service logs in Render, verify exposed ports (should be 10000 for Docker), and ensure health checks are configured correctly

---

> For more details, refer to the Render documentation: https://render.com/docs/deploy
