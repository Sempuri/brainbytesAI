# Monitoring Simulation for BrainBytes AI

This directory contains a simulation script (`simulate.js`) used to test Prometheus metrics collection.

## Scenarios

- **Scenario A: Peak Load**
  - Simulates a high volume of successful AI responses.
- **Scenario B: Error Spike**
  - Simulates failed AI responses.
- **Scenario C: Slow Responses**
  - Simulates delayed response times.

## How to Run

1. Make sure your backend server (`server.js`) is running and listening on `http://localhost:3000`.
2. Ensure `/simulate?type=...` endpoint exists.
3. In this directory, run:

```bash
node simulate.js
