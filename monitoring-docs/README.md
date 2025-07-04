# Monitoring System Overview

This directory contains all configuration, documentation, and assets for the monitoring and visualization system used in this project.

## Components
- **Prometheus**: Collects and stores metrics from the application and infrastructure.
- **Grafana**: Visualizes metrics and provides dashboards and alerting.
- **Node Exporter**: Exposes system-level metrics for Prometheus.

## Directory Structure
- `prometheus.yml`, `recording_rules.yml`, `alert_rules.yml`: Prometheus configuration and rules.
- `grafana/`
  - `provisioning/`: Auto-provisioning configs for Grafana (data sources, dashboards)
  - `dashboards/`: JSON exports of Grafana dashboards
- `screenshots/`: Dashboard screenshots (to be added)
- `docs/`: Markdown documentation (to be added)
- `demo/`: Demo script and data generator (to be added)

## Quick Start
- All services (Prometheus, Grafana, Node Exporter, app) are started via `docker-compose up` from the project root.
- Grafana is available at [http://localhost:3002](http://localhost:3002) (default admin password: `admin`).
- Prometheus is available at [http://localhost:9090](http://localhost:9090).

# BrainBytes Monitoring Setup

This documentation describes how Prometheus monitors the BrainBytes AI tutoring platform.

## Directory Structure
```
monitoring-docs/
├── alert_rules.yml
├── prometheus.yml
├── recording_rules.yml
├── metrics-catalog.md
├── query-reference-guide.md
├── filipino-context.md
├── simulation/
│   ├── simulate.js
│   └── README.md
```

## Usage
1. Make sure Docker and Prometheus services are running.
2. Place `prometheus.yml` in your Prometheus container path.
3. Add simulation tools from `simulation/` to generate sample metrics.
4. Use `.md` files as reference for evaluation and configuration.