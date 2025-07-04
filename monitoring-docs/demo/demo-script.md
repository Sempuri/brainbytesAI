# Monitoring System Demo Script

## 1. Introduction (1 min)
- Briefly introduce the monitoring stack: Prometheus, Grafana, Node Exporter, custom metrics.

## 2. Error Analysis Dashboard (3 min)
- Show error distribution by endpoint and status code.
- Demonstrate heatmap of error patterns by time of day.
- Show recent errors table and correlation with system resource usage.
- Trigger an error (e.g., visit `/test-error`) and show it appear in the dashboard.

## 3. Resource Optimization Dashboard (3 min)
- Show resource efficiency metrics and usage vs. request volume.
- Demonstrate container-specific resource tracking and bar gauge for resource comparison.
- Show heatmap of AI request latency and state timeline for service status.
- Simulate high load using the data generator and show impact on dashboards.

## 4. Alerting (2 min)
- Explain layered alerting (warning/critical) and business-level alerts.
- Trigger an alert (e.g., generate many errors or high response time) and show alert in Prometheus or Grafana.
- Show alert documentation and explain troubleshooting steps.

## 5. Dashboard Features (2 min)
- Demonstrate dashboard templating: variables (service, endpoint, instance), time range selector, dropdowns.
- Show how to add/view annotations for deployments or changes.

## 6. Q&A (2 min)
- Open the floor for questions and further exploration. 