# Alert Reference Guide

| Alert Name             | Severity | What it Means                           | Possible Causes             | Troubleshooting Steps              | Resolution Procedures       |
| ---------------------- | -------- | --------------------------------------- | --------------------------- | ---------------------------------- | --------------------------- |
| HighErrorRateWarning   | Warning  | Error rate is higher than normal        | Bug, overload, bad deploy   | Check logs, recent changes         | Fix bug, rollback, scale up |
| HighErrorRateCritical  | Critical | Error rate is much higher than normal   | Major outage, crash         | Check logs, restart service        | Hotfix, scale up, rollback  |
| AIResponseTimeDegraded | Warning  | AI response time is slow for many users | Backend slowness, overload  | Check backend, resource usage      | Optimize code, scale up     |
| UnusualSessionDrop     | Warning  | Active sessions dropped unexpectedly    | Crash, network, user exodus | Check logs, network, user feedback | Fix root cause, communicate |
| HighCPUUsage           | Warning  | High CPU usage                          | Load spike, memory leak     | Check running processes            | Optimize code, scale        |
