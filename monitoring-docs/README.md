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